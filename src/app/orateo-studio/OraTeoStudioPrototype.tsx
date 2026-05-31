"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  FileText,
  GripVertical,
  Home,
  Image as ImageIcon,
  Mail,
  Menu,
  Monitor,
  Palette,
  Pencil,
  Phone,
  Plus,
  Quote,
  Settings,
  Trash2,
  Type,
  UploadCloud
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fallbackSettings } from "@/lib/fallbacks";
import type { HeroOverlayStrength } from "@/lib/types";
import styles from "./orateo-studio.module.css";
import {
  editablePages,
  menuItems,
  type StudioButton,
  type StudioCard,
  type StudioPhoto
} from "./studioData";
import type { OraTeoHomeDraft, OraTeoStudioData } from "./services/sanity/types";

type BlockKey = "hero" | "slideshow" | "cards" | "story" | "quote" | "contact";
type PreviewMode = "preview" | "edit";
type ViewMode = "editor" | "split" | "preview";

const sections = [
  { label: "Accueil", icon: Home },
  { label: "Pages du site", icon: FileText },
  { label: "Menu principal", icon: Menu },
  { label: "Galerie photos", icon: ImageIcon },
  { label: "Documents PDF", icon: FileText },
  { label: "Apparence", icon: Palette },
  { label: "Contact", icon: Mail },
  { label: "Paramètres", icon: Settings }
];

const blockMeta: Array<{
  key: BlockKey;
  title: string;
  summary: string;
  icon: LucideIcon;
}> = [
  {
    key: "hero",
    title: "Hero",
    summary: "Titre, texte d'accueil et boutons principaux",
    icon: Type
  },
  {
    key: "slideshow",
    title: "Diaporama",
    summary: "Photos principales affichées en haut de la page",
    icon: ImageIcon
  },
  {
    key: "cards",
    title: "Cartes rapides",
    summary: "Accès directs vers les pages importantes",
    icon: Home
  },
  {
    key: "story",
    title: "Our Story",
    summary: "Présentation de l'histoire et de la mission",
    icon: Pencil
  },
  {
    key: "quote",
    title: "Citation",
    summary: "Phrase spirituelle ou message d'accueil",
    icon: Quote
  },
  {
    key: "contact",
    title: "Contact",
    summary: "Invitation finale et coordonnées utiles",
    icon: Phone
  }
];

const draftStorageKey = "orateo-studio-home-draft-v1";

const overlayOptions: Array<{ label: string; value: HeroOverlayStrength }> = [
  { label: "Aucun", value: "none" },
  { label: "Leger", value: "light" },
  { label: "Moyen", value: "medium" },
  { label: "Fort", value: "strong" }
];

const previewOverlayBackgrounds: Record<HeroOverlayStrength, string | null> = {
  none: null,
  light: "linear-gradient(90deg, rgb(0 0 0 / 24%), rgb(0 0 0 / 6%))",
  medium: "linear-gradient(90deg, rgb(0 0 0 / 48%), rgb(0 0 0 / 14%))",
  strong: "linear-gradient(90deg, rgb(0 0 0 / 72%), rgb(0 0 0 / 22%))"
};

function getHeroPreviewBackground(image: string, overlayStrength: HeroOverlayStrength) {
  const overlay = previewOverlayBackgrounds[overlayStrength] ?? previewOverlayBackgrounds.light;
  return overlay ? `${overlay}, url(${image})` : `url(${image})`;
}

function readStoredDraft(baseDraft: OraTeoHomeDraft): OraTeoHomeDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(draftStorageKey);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Partial<OraTeoHomeDraft>;

    return {
      ...baseDraft,
      ...parsed,
      hero: { ...baseDraft.hero, ...parsed.hero },
      slideshow: { ...baseDraft.slideshow, ...parsed.slideshow },
      story: { ...baseDraft.story, ...parsed.story },
      quote: { ...baseDraft.quote, ...parsed.quote },
      contact: { ...baseDraft.contact, ...parsed.contact },
      cards: parsed.cards ?? baseDraft.cards
    };
  } catch {
    return null;
  }
}

function draftsMatch(first: OraTeoHomeDraft, second: OraTeoHomeDraft) {
  return JSON.stringify(first) === JSON.stringify(second);
}

function valuesMatch(first: unknown, second: unknown) {
  return JSON.stringify(first) === JSON.stringify(second);
}

function createLocalButton(index: number): StudioButton {
  return {
    id: createLocalId("local-button", index),
    label: "Nouveau bouton",
    destination: editablePages[0] ?? "Accueil",
    color: fallbackSettings.theme?.forest ?? "#173f2d",
    enabled: true
  };
}

function createLocalId(prefix: string, index = 0) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`;
}

function reorderItems<T extends { id: string }>(items: T[], id: string, direction: -1 | 1) {
  const currentIndex = items.findIndex((item) => item.id === id);
  const nextIndex = currentIndex + direction;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [item] = next.splice(currentIndex, 1);
  next.splice(nextIndex, 0, item);
  return next;
}

function getPendingChanges(draft: OraTeoHomeDraft, savedDraft: OraTeoHomeDraft) {
  const changes: string[] = [];

  if (!valuesMatch(draft.hero, savedDraft.hero)) changes.push("Hero modifié");
  if (!valuesMatch(draft.story, savedDraft.story)) changes.push("Our Story modifié");
  if (!valuesMatch(draft.cards, savedDraft.cards)) changes.push("Cartes modifiées");
  if (!valuesMatch(draft.contact, savedDraft.contact)) changes.push("Contact modifié");
  if (!valuesMatch(draft.quote, savedDraft.quote)) changes.push("Citation modifiée");

  const savedPhotoIds = new Set(savedDraft.slideshow.photos.map((photo) => photo.id));
  const addedPhotos = draft.slideshow.photos.filter((photo) => !savedPhotoIds.has(photo.id)).length;
  if (addedPhotos) changes.push(`${addedPhotos} photo${addedPhotos > 1 ? "s" : ""} ajoutée${addedPhotos > 1 ? "s" : ""}`);
  if (!addedPhotos && !valuesMatch(draft.slideshow, savedDraft.slideshow)) {
    changes.push("Diaporama modifié");
  }

  return changes;
}

export function OraTeoStudioPrototype({ initialData }: { initialData: OraTeoStudioData }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("Accueil");
  const [draft, setDraft] = useState<OraTeoHomeDraft>(initialData.home);
  const [savedDraft, setSavedDraft] = useState<OraTeoHomeDraft>(initialData.home);
  const [lastSavedLabel, setLastSavedLabel] = useState("Brouillon initial");
  const [isPublishingHero, setIsPublishingHero] = useState(false);
  const [heroPublishMessage, setHeroPublishMessage] = useState("");
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("edit");
  const [selectedBlock, setSelectedBlock] = useState<BlockKey>("hero");
  const [uploadNotice, setUploadNotice] = useState("");
  const [openBlocks, setOpenBlocks] = useState<Record<BlockKey, boolean>>({
    hero: true,
    slideshow: true,
    cards: true,
    story: false,
    quote: false,
    contact: false
  });

  useEffect(() => {
    const storedDraft = readStoredDraft(initialData.home);
    if (storedDraft) {
      setDraft(storedDraft);
      setSavedDraft(storedDraft);
      setLastSavedLabel("Brouillon restauré");
    }
  }, [initialData.home]);

  const hasUnsavedChanges = !draftsMatch(draft, savedDraft);
  const heroPhoto = draft.slideshow.photos[0]?.image ?? "/images/monastery-hero.svg";
  const enabledButtons = useMemo(
    () => draft.hero.buttons.filter((button) => button.enabled),
    [draft.hero.buttons]
  );
  const pendingChanges = useMemo(() => getPendingChanges(draft, savedDraft), [draft, savedDraft]);

  function toggleBlock(key: BlockKey) {
    setOpenBlocks((current) => ({ ...current, [key]: !current[key] }));
    setSelectedBlock(key);
  }

  function selectBlock(key: BlockKey) {
    setActiveSection("Accueil");
    setSelectedBlock(key);
    setOpenBlocks({
      hero: key === "hero",
      slideshow: key === "slideshow",
      cards: key === "cards",
      story: key === "story",
      quote: key === "quote",
      contact: key === "contact"
    });
  }

  function updateHeroButton(id: string, next: Partial<StudioButton>) {
    setDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        buttons: current.hero.buttons.map((button) =>
          button.id === id ? { ...button, ...next } : button
        )
      }
    }));
  }

  function removeHeroButton(id: string) {
    setDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        buttons: current.hero.buttons.filter((button) => button.id !== id)
      }
    }));
  }

  function addHeroButton() {
    setDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        buttons: [
          ...current.hero.buttons,
          {
            id: createLocalId("button", current.hero.buttons.length),
            label: "Nouveau bouton",
            destination: editablePages[0] ?? "Accueil",
            color: fallbackSettings.theme?.forest ?? "#173f2d",
            enabled: true
          }
        ]
      }
    }));
  }

  function reorderHeroButton(id: string, direction: -1 | 1) {
    setDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        buttons: reorderItems(current.hero.buttons, id, direction)
      }
    }));
  }

  function removePhoto(id: string) {
    setDraft((current) => ({
      ...current,
      slideshow: {
        photos: current.slideshow.photos.filter((photo) => photo.id !== id)
      }
    }));
    setDraggedPhotoId((current) => (current === id ? null : current));
    setUploadNotice("Photo supprimée du brouillon. Enregistrez pour conserver ce changement.");
  }

  function addPhotoFromFile(fileName: string, image: string) {
    setDraft((current) => ({
      ...current,
      slideshow: {
        photos: [
          ...current.slideshow.photos,
          {
            id: createLocalId("photo", current.slideshow.photos.length),
            image,
            label: fileName
          }
        ]
      }
    }));
    setUploadNotice("Image ajoutée au brouillon local. Non publiée.");
  }

  function movePhotoToStart(photo: StudioPhoto) {
    setDraft((current) => ({
      ...current,
      slideshow: {
        photos: [photo, ...current.slideshow.photos.filter((item) => item.id !== photo.id)]
      }
    }));
  }

  function reorderPhoto(targetId: string) {
    if (!draggedPhotoId || draggedPhotoId === targetId) {
      return;
    }

    setDraft((current) => {
      const dragged = current.slideshow.photos.find((photo) => photo.id === draggedPhotoId);
      const targetIndex = current.slideshow.photos.findIndex((photo) => photo.id === targetId);

      if (!dragged || targetIndex < 0) {
        return current;
      }

      const withoutDragged = current.slideshow.photos.filter((photo) => photo.id !== draggedPhotoId);
      const next = [...withoutDragged];
      next.splice(targetIndex, 0, dragged);
      return {
        ...current,
        slideshow: {
          photos: next
        }
      };
    });
  }

  function updateHero(next: Partial<OraTeoHomeDraft["hero"]>) {
    setDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        ...next
      }
    }));
  }

  function updateStory(next: Partial<OraTeoHomeDraft["story"]>) {
    setDraft((current) => ({
      ...current,
      story: {
        ...current.story,
        ...next
      }
    }));
  }

  function updateStoryButton(id: string, next: Partial<StudioButton>) {
    setDraft((current) => ({
      ...current,
      story: {
        ...current.story,
        buttons: current.story.buttons.map((button) =>
          button.id === id ? { ...button, ...next } : button
        )
      }
    }));
  }

  function addStoryButton() {
    setDraft((current) => ({
      ...current,
      story: {
        ...current.story,
        buttons: [...current.story.buttons, createLocalButton(current.story.buttons.length)]
      }
    }));
  }

  function removeStoryButton(id: string) {
    setDraft((current) => ({
      ...current,
      story: {
        ...current.story,
        buttons: current.story.buttons.filter((button) => button.id !== id)
      }
    }));
  }

  function reorderStoryButton(id: string, direction: -1 | 1) {
    setDraft((current) => ({
      ...current,
      story: {
        ...current.story,
        buttons: reorderItems(current.story.buttons, id, direction)
      }
    }));
  }

  function updateCard(cardId: string, next: Partial<StudioCard>) {
    setDraft((current) => ({
      ...current,
      cards: current.cards.map((card) => (card.id === cardId ? { ...card, ...next } : card))
    }));
  }

  function updateCardButton(cardId: string, buttonId: string, next: Partial<StudioButton>) {
    setDraft((current) => ({
      ...current,
      cards: current.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              buttons: (card.buttons || []).map((button) =>
                button.id === buttonId ? { ...button, ...next } : button
              )
            }
          : card
      )
    }));
  }

  function addCardButton(cardId: string) {
    setDraft((current) => ({
      ...current,
      cards: current.cards.map((card) =>
        card.id === cardId
          ? { ...card, buttons: [...(card.buttons || []), createLocalButton(card.buttons?.length || 0)] }
          : card
      )
    }));
  }

  function removeCardButton(cardId: string, buttonId: string) {
    setDraft((current) => ({
      ...current,
      cards: current.cards.map((card) =>
        card.id === cardId
          ? { ...card, buttons: (card.buttons || []).filter((button) => button.id !== buttonId) }
          : card
      )
    }));
  }

  function reorderCardButton(cardId: string, buttonId: string, direction: -1 | 1) {
    setDraft((current) => ({
      ...current,
      cards: current.cards.map((card) =>
        card.id === cardId
          ? { ...card, buttons: reorderItems(card.buttons || [], buttonId, direction) }
          : card
      )
    }));
  }

  function updateQuote(next: Partial<OraTeoHomeDraft["quote"]>) {
    setDraft((current) => ({
      ...current,
      quote: {
        ...current.quote,
        ...next
      }
    }));
  }

  function updateContact(next: Partial<OraTeoHomeDraft["contact"]>) {
    setDraft((current) => ({
      ...current,
      contact: {
        ...current.contact,
        ...next
      }
    }));
  }

  function updateContactButton(id: string, next: Partial<StudioButton>) {
    setDraft((current) => ({
      ...current,
      contact: {
        ...current.contact,
        buttons: current.contact.buttons.map((button) =>
          button.id === id ? { ...button, ...next } : button
        )
      }
    }));
  }

  function addContactButton() {
    setDraft((current) => ({
      ...current,
      contact: {
        ...current.contact,
        buttons: [...current.contact.buttons, createLocalButton(current.contact.buttons.length)]
      }
    }));
  }

  function removeContactButton(id: string) {
    setDraft((current) => ({
      ...current,
      contact: {
        ...current.contact,
        buttons: current.contact.buttons.filter((button) => button.id !== id)
      }
    }));
  }

  function reorderContactButton(id: string, direction: -1 | 1) {
    setDraft((current) => ({
      ...current,
      contact: {
        ...current.contact,
        buttons: reorderItems(current.contact.buttons, id, direction)
      }
    }));
  }

  function saveDraft() {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    setSavedDraft(draft);
    setLastSavedLabel("Brouillon enregistré à l'instant");
  }

  function cancelChanges() {
    setDraft(savedDraft);
    setDraggedPhotoId(null);
    setUploadNotice("");
    setHeroPublishMessage("");
  }

  async function publishHeroToSanity() {
    const confirmed = window.confirm(
      "Publier le bloc Hero dans Sanity ? Seuls le titre, le texte, les boutons et le voile seront envoyes."
    );

    if (!confirmed) return;

    const payload = {
      hero: {
        title: draft.hero.title,
        intro: draft.hero.intro,
        overlayStrength: draft.hero.overlayStrength,
        buttons: draft.hero.buttons
      }
    };

    setIsPublishingHero(true);
    setHeroPublishMessage("Publication du Hero en cours...");
    console.info("OraTeo Studio - Hero envoye a Sanity", payload);

    try {
      const response = await fetch("/orateo-studio/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "La publication du Hero a echoue.");
      }

      console.info("OraTeo Studio - Hero publie dans Sanity", result.sent);
      setSavedDraft((current) => {
        const next = {
          ...current,
          hero: draft.hero
        };
        window.localStorage.setItem(draftStorageKey, JSON.stringify(next));
        return next;
      });
      setLastSavedLabel("Hero publie avec succes");
      setHeroPublishMessage("Hero publie avec succes");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue pendant la publication.";
      console.error("OraTeo Studio - erreur de publication Hero", error);
      setHeroPublishMessage(message);
    } finally {
      setIsPublishingHero(false);
    }
  }

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Navigation OraTeo">
        <div className={styles.brand}>
          <div className={styles.brandMark}>OT</div>
          <div>
            <strong>OraTeo</strong>
            <span>Studio</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.label;

            return (
              <button
                className={isActive ? styles.navActive : styles.navButton}
                key={section.label}
                onClick={() => setActiveSection(section.label)}
                type="button"
              >
                <span className={styles.navIcon}>
                  <Icon aria-hidden="true" size={18} />
                </span>
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.helpBox}>
            <CircleHelp aria-hidden="true" size={22} />
            <strong>Besoin d'aide ?</strong>
            <span>Un guide pas à pas sera ajouté ici pour accompagner chaque modification.</span>
            <button type="button">Voir le guide</button>
          </div>

          <div className={styles.userBox}>
            <div className={styles.avatar}>SN</div>
            <div>
              <strong>Soeur Noemi</strong>
              <span>Administratrice</span>
            </div>
            <ChevronDown aria-hidden="true" size={17} />
          </div>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.headerTitle}>
            <span className={initialData.source === "sanity" ? styles.connectedBadge : styles.localBadge}>
              {initialData.source === "sanity" ? "🟢 Connecté à Sanity" : "🟡 Données de démonstration"}
            </span>
            <h1>Ananda Matha Monastery</h1>
            <p>Un espace simple pour préparer les changements du site.</p>
          </div>
          <div className={styles.headerActions}>
            <a className={styles.secondaryAction} href="/" target="_blank">
              Voir le site
              <ExternalLink aria-hidden="true" size={15} />
            </a>
            <button
              className={styles.secondaryAction}
              disabled={!hasUnsavedChanges}
              onClick={cancelChanges}
              type="button"
            >
              Annuler les modifications
            </button>
            <button
              className={styles.primaryAction}
              disabled={!hasUnsavedChanges}
              onClick={saveDraft}
              type="button"
            >
              <CheckCircle2 aria-hidden="true" size={17} />
              Enregistrer le brouillon
            </button>
            <button
              className={styles.publishAction}
              disabled
              type="button"
            >
              <UploadCloud aria-hidden="true" size={17} />
              Publication désactivée
            </button>
          </div>
        </header>

        <div className={styles.viewControls} aria-label="Disposition de travail">
          <button
            className={viewMode === "editor" ? styles.viewModeActive : styles.viewModeButton}
            onClick={() => setViewMode("editor")}
            type="button"
          >
            Édition seule
          </button>
          <button
            className={viewMode === "split" ? styles.viewModeActive : styles.viewModeButton}
            onClick={() => setViewMode("split")}
            type="button"
          >
            Édition + aperçu
          </button>
          <button
            className={viewMode === "preview" ? styles.viewModeActive : styles.viewModeButton}
            onClick={() => setViewMode("preview")}
            type="button"
          >
            Aperçu seul
          </button>
        </div>

        <div className={styles[viewMode === "editor" ? "mainGridEditor" : viewMode === "preview" ? "mainGridPreview" : "mainGrid"]}>
          {viewMode !== "preview" ? (
          <section className={styles.editorPanel} aria-label="Édition de l'accueil">
            <div className={styles.pageTitle}>
              <div className={styles.pageIcon}>
                <Home aria-hidden="true" size={30} />
              </div>
              <div>
                <p className={styles.eyebrow}>Page d'accueil</p>
                <h2>Composer l'accueil</h2>
                <p>Ouvrez un bloc, modifiez son contenu, puis regardez l'aperçu se mettre à jour.</p>
              </div>
            </div>
            <PendingChanges changes={pendingChanges} source={initialData.source} />

            {activeSection === "Accueil" ? (
              <div className={styles.blockStack}>
                {blockMeta.map((block) => (
                  <StudioBlock
                    icon={block.icon}
                    isOpen={openBlocks[block.key]}
                    key={block.key}
                    onToggle={() => toggleBlock(block.key)}
                    selected={selectedBlock === block.key}
                    summary={block.summary}
                    title={block.title}
                  >
                    {block.key === "hero" && (
                      <HeroEditor
                        buttons={draft.hero.buttons}
                        intro={draft.hero.intro}
                        isPublishing={isPublishingHero}
                        onAddButton={addHeroButton}
                        onRemoveButton={removeHeroButton}
                        onPublish={publishHeroToSanity}
                        onReorderButton={reorderHeroButton}
                        onSetIntro={(intro) => updateHero({ intro })}
                        onSetOverlayStrength={(overlayStrength) => updateHero({ overlayStrength })}
                        onSetTitle={(title) => updateHero({ title })}
                        onUpdateButton={updateHeroButton}
                        overlayStrength={draft.hero.overlayStrength}
                        publishMessage={heroPublishMessage}
                        title={draft.hero.title}
                      />
                    )}

                    {block.key === "slideshow" && (
                      <PhotoManager
                        draggedPhotoId={draggedPhotoId}
                        onAddPhoto={addPhotoFromFile}
                        onDragEnd={() => setDraggedPhotoId(null)}
                        onDragStart={setDraggedPhotoId}
                        onMoveToStart={movePhotoToStart}
                        onRemovePhoto={removePhoto}
                        onReorderPhoto={reorderPhoto}
                        photos={draft.slideshow.photos}
                        uploadNotice={uploadNotice}
                      />
                    )}

                    {block.key === "cards" && (
                      <QuickCardsEditor
                        cards={draft.cards}
                        onAddButton={addCardButton}
                        onRemoveButton={removeCardButton}
                        onReorderButton={reorderCardButton}
                        onUpdateButton={updateCardButton}
                        onUpdateCard={updateCard}
                      />
                    )}
                    {block.key === "story" && (
                      <StoryEditor
                        onAddButton={addStoryButton}
                        onRemoveButton={removeStoryButton}
                        onReorderButton={reorderStoryButton}
                        onUpdate={updateStory}
                        onUpdateButton={updateStoryButton}
                        story={draft.story}
                      />
                    )}
                    {block.key === "quote" && (
                      <QuoteEditor onUpdate={updateQuote} quote={draft.quote} />
                    )}
                    {block.key === "contact" && (
                      <ContactEditor
                        contact={draft.contact}
                        onAddButton={addContactButton}
                        onRemoveButton={removeContactButton}
                        onReorderButton={reorderContactButton}
                        onUpdate={updateContact}
                        onUpdateButton={updateContactButton}
                      />
                    )}
                  </StudioBlock>
                ))}
              </div>
            ) : (
              <ReadOnlySection activeSection={activeSection} data={initialData} />
            )}
          </section>
          ) : null}

          {viewMode !== "editor" ? (
          <aside className={styles.previewPanel} aria-label="Aperçu de l'accueil">
            <div className={styles.previewTitle}>
              <div>
                <span>
                  <Monitor aria-hidden="true" size={18} />
                  Aperçu du site
                </span>
                <p>Une vue immédiate de ce que verra le visiteur.</p>
              </div>
              <div className={styles.modeSwitch} aria-label="Mode de l'aperçu">
                <button
                  className={previewMode === "preview" ? styles.modeActive : styles.modeButton}
                  onClick={() => setPreviewMode("preview")}
                  type="button"
                >
                  👁 Aperçu
                </button>
                <button
                  className={previewMode === "edit" ? styles.modeActive : styles.modeButton}
                  onClick={() => setPreviewMode("edit")}
                  type="button"
                >
                  ✏️ Édition
                </button>
              </div>
            </div>
            <HomepagePreview
              buttons={enabledButtons}
              cards={draft.cards}
              heroPhoto={heroPhoto}
              overlayStrength={draft.hero.overlayStrength}
              intro={draft.hero.intro}
              mode={previewMode}
              onSelectBlock={selectBlock}
              selectedBlock={selectedBlock}
              story={draft.story}
              title={draft.hero.title}
              contact={draft.contact}
              quote={draft.quote}
            />
          </aside>
          ) : null}
        </div>

        <footer className={styles.statusBar}>
          <span>{lastSavedLabel}</span>
          <span className={hasUnsavedChanges ? styles.unsavedStatus : styles.savedStatus}>
            <CheckCircle2 aria-hidden="true" size={17} />
            {hasUnsavedChanges ? "Modifications non enregistrées" : "Tout est enregistré"}
          </span>
        </footer>
      </section>
    </main>
  );
}

function StudioBlock({
  children,
  icon: Icon,
  isOpen,
  onToggle,
  selected,
  summary,
  title
}: {
  children: ReactNode;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  selected: boolean;
  summary: string;
  title: string;
}) {
  return (
    <section className={selected ? styles.blockCardSelected : styles.blockCard}>
      <button className={styles.blockHeader} onClick={onToggle} type="button">
        <span className={styles.blockIcon}>
          <Icon aria-hidden="true" size={19} />
        </span>
        <span>
          <strong>{title}</strong>
          <small>{summary}</small>
        </span>
        {isOpen ? (
          <ChevronDown aria-hidden="true" size={19} />
        ) : (
          <ChevronRight aria-hidden="true" size={19} />
        )}
      </button>
      {isOpen && <div className={styles.blockBody}>{children}</div>}
    </section>
  );
}

function PendingChanges({
  changes,
  source
}: {
  changes: string[];
  source: OraTeoStudioData["source"];
}) {
  return (
    <aside className={changes.length ? styles.pendingPanelActive : styles.pendingPanel}>
      <div>
        <strong>{changes.length ? `${changes.length} modification${changes.length > 1 ? "s" : ""} non publiée${changes.length > 1 ? "s" : ""}` : "Synchronisé avec Sanity"}</strong>
        <span>{changes.length ? "Brouillon local" : source === "sanity" ? "Données lues depuis Sanity" : "Données de démonstration"}</span>
      </div>
      {changes.length ? (
        <ul>
          {changes.map((change) => (
            <li key={change}>{change}</li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}

function HeroEditor({
  buttons,
  intro,
  isPublishing,
  onAddButton,
  onRemoveButton,
  onPublish,
  onReorderButton,
  onSetOverlayStrength,
  onSetIntro,
  onSetTitle,
  onUpdateButton,
  overlayStrength,
  publishMessage,
  title
}: {
  buttons: StudioButton[];
  intro: string;
  isPublishing: boolean;
  onAddButton: () => void;
  onRemoveButton: (id: string) => void;
  onPublish: () => void;
  onReorderButton: (id: string, direction: -1 | 1) => void;
  onSetOverlayStrength: (value: HeroOverlayStrength) => void;
  onSetIntro: (value: string) => void;
  onSetTitle: (value: string) => void;
  onUpdateButton: (id: string, next: Partial<StudioButton>) => void;
  overlayStrength: HeroOverlayStrength;
  publishMessage: string;
  title: string;
}) {
  return (
    <div className={styles.editorGrid}>
      <label className={styles.fieldCard}>
        <span>Titre de bienvenue</span>
        <input value={title} onChange={(event) => onSetTitle(event.target.value)} />
      </label>

      <label className={styles.fieldCard}>
        <span>Texte d'introduction</span>
        <textarea value={intro} onChange={(event) => onSetIntro(event.target.value)} />
      </label>

      <label className={styles.fieldCard}>
        <span>Voile sur la photo</span>
        <select
          value={overlayStrength}
          onChange={(event) => onSetOverlayStrength(event.target.value as HeroOverlayStrength)}
        >
          {overlayOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.managerCard}>
        <ButtonManager
          buttons={buttons}
          onAddButton={onAddButton}
          onRemoveButton={onRemoveButton}
          onReorderButton={onReorderButton}
          onUpdateButton={onUpdateButton}
          title="Boutons d'action"
        />
      </div>

      <div className={styles.publishHeroCard}>
        <div>
          <strong>Publication du Hero</strong>
          <span>Titre, texte, boutons et voile uniquement. Les photos ne sont pas encore envoyees.</span>
        </div>
        <button className={styles.primaryAction} disabled={isPublishing} onClick={onPublish} type="button">
          <UploadCloud aria-hidden="true" size={17} />
          {isPublishing ? "Publication..." : "Publier dans Sanity"}
        </button>
        {publishMessage ? <p>{publishMessage}</p> : null}
      </div>
    </div>
  );
}

function ButtonManager({
  buttons,
  onAddButton,
  onRemoveButton,
  onReorderButton,
  onUpdateButton,
  title
}: {
  buttons: StudioButton[];
  onAddButton: () => void;
  onRemoveButton: (id: string) => void;
  onReorderButton: (id: string, direction: -1 | 1) => void;
  onUpdateButton: (id: string, next: Partial<StudioButton>) => void;
  title: string;
}) {
  return (
    <>
      <div className={styles.managerHeader}>
        <div>
          <h3>{title}</h3>
          <p>Texte, destination, couleur, ordre et visibilité.</p>
        </div>
        <button className={styles.addBigButton} onClick={onAddButton} type="button">
          <Plus aria-hidden="true" size={18} />
          Ajouter un bouton
        </button>
      </div>

      <div className={styles.buttonRows}>
        {buttons.map((button, index) => (
          <article className={styles.buttonRow} key={button.id}>
            <div className={styles.buttonCardHeader}>
              <span>
                <GripVertical aria-hidden="true" size={18} />
                Bouton {index + 1}
              </span>
              <button
                aria-label="Supprimer ce bouton"
                className={styles.iconOnly}
                onClick={() => onRemoveButton(button.id)}
                type="button"
              >
                <Trash2 aria-hidden="true" size={16} />
              </button>
            </div>
            <label>
              <span>Texte</span>
              <input
                value={button.label}
                onChange={(event) => onUpdateButton(button.id, { label: event.target.value })}
              />
            </label>
            <label>
              <span>Destination</span>
              <select
                value={button.destination}
                onChange={(event) => onUpdateButton(button.id, { destination: event.target.value })}
              >
                {[...new Set([...editablePages, ...menuItems])].map((page) => (
                  <option key={page}>{page}</option>
                ))}
              </select>
            </label>
            <label className={styles.colorField}>
              <span>Couleur</span>
              <input
                type="color"
                value={button.color}
                onChange={(event) => onUpdateButton(button.id, { color: event.target.value })}
              />
            </label>
            <label className={styles.switchField}>
              <span>{button.enabled ? "Visible" : "Masqué"}</span>
              <button
                aria-label={button.enabled ? "Masquer ce bouton" : "Afficher ce bouton"}
                className={button.enabled ? styles.switchOn : styles.switchOff}
                onClick={() => onUpdateButton(button.id, { enabled: !button.enabled })}
                type="button"
              />
            </label>
            <div className={styles.reorderButtons}>
              <button disabled={index === 0} onClick={() => onReorderButton(button.id, -1)} type="button">
                Monter
              </button>
              <button
                disabled={index === buttons.length - 1}
                onClick={() => onReorderButton(button.id, 1)}
                type="button"
              >
                Descendre
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function PhotoManager({
  draggedPhotoId,
  onAddPhoto,
  onDragEnd,
  onDragStart,
  onMoveToStart,
  onRemovePhoto,
  onReorderPhoto,
  photos,
  uploadNotice
}: {
  draggedPhotoId: string | null;
  onAddPhoto: (fileName: string, image: string) => void;
  onDragEnd: () => void;
  onDragStart: (id: string) => void;
  onMoveToStart: (photo: StudioPhoto) => void;
  onRemovePhoto: (id: string) => void;
  onReorderPhoto: (id: string) => void;
  photos: StudioPhoto[];
  uploadNotice: string;
}) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onAddPhoto(file.name, reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <div className={styles.managerCard}>
      <input
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className={styles.hiddenFileInput}
        id="orateo-photo-upload"
        onChange={handleFileChange}
        type="file"
      />
      <div className={styles.managerHeader}>
        <div>
          <h3>Photos du diaporama</h3>
          <p>Glissez les photos pour changer leur ordre. La première devient l'image principale.</p>
        </div>
        <label className={styles.addBigButton} htmlFor="orateo-photo-upload">
          <Plus aria-hidden="true" size={18} />
          Ajouter une photo
        </label>
      </div>
      {uploadNotice ? <p className={styles.localNotice}>{uploadNotice}</p> : null}

      <div className={styles.photoGrid}>
        {photos.map((photo, index) => (
          <article
            className={draggedPhotoId === photo.id ? styles.photoTileDragging : styles.photoTile}
            draggable
            key={photo.id}
            onDragEnd={onDragEnd}
            onDragOver={(event) => event.preventDefault()}
            onDragStart={() => onDragStart(photo.id)}
            onDrop={() => onReorderPhoto(photo.id)}
          >
            <img alt={photo.label} src={photo.image} />
            <button
              aria-label="Supprimer cette photo"
              className={styles.photoDeleteButton}
              draggable={false}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (window.confirm("Supprimer cette photo du brouillon ?")) {
                  onRemovePhoto(photo.id);
                }
              }}
              onMouseDown={(event) => event.stopPropagation()}
              type="button"
            >
              <Trash2 aria-hidden="true" size={16} />
            </button>
            <div className={styles.photoOverlay}>
              <span>
                <GripVertical aria-hidden="true" size={17} />
                Position {index + 1}
              </span>
              <div>
                <button
                  draggable={false}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onMoveToStart(photo);
                  }}
                  onMouseDown={(event) => event.stopPropagation()}
                  type="button"
                >
                  En premier
                </button>
              </div>
            </div>
          </article>
        ))}

        <label className={styles.addPhotoCard} htmlFor="orateo-photo-upload">
          <Plus aria-hidden="true" size={28} />
          <strong>Ajouter une photo</strong>
          <span>Choisir une image pour le diaporama</span>
        </label>
      </div>
    </div>
  );
}

function QuickCardsEditor({
  cards,
  onAddButton,
  onRemoveButton,
  onReorderButton,
  onUpdateButton,
  onUpdateCard
}: {
  cards: StudioCard[];
  onAddButton: (cardId: string) => void;
  onRemoveButton: (cardId: string, buttonId: string) => void;
  onReorderButton: (cardId: string, buttonId: string, direction: -1 | 1) => void;
  onUpdateButton: (cardId: string, buttonId: string, next: Partial<StudioButton>) => void;
  onUpdateCard: (cardId: string, next: Partial<StudioCard>) => void;
}) {
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id ?? "");
  const selectedCard = cards.find((card) => card.id === selectedCardId) || cards[0];

  useEffect(() => {
    if (!cards.some((card) => card.id === selectedCardId)) {
      setSelectedCardId(cards[0]?.id ?? "");
    }
  }, [cards, selectedCardId]);

  if (!selectedCard) {
    return <EmptyState text="Aucune carte disponible pour le moment." />;
  }

  return (
    <div className={styles.cardEditorLayout}>
      <div className={styles.cardPickerList}>
        {cards.map((card) => (
          <button
            className={card.id === selectedCard.id ? styles.cardPickerActive : styles.cardPickerButton}
            key={card.id}
            onClick={() => setSelectedCardId(card.id)}
            type="button"
          >
            <img alt="" src={card.image} />
            <span>{card.title}</span>
          </button>
        ))}
      </div>

      <section className={styles.cardEditPanel}>
        <div className={styles.cardEditHero}>
          <img alt="" src={selectedCard.image} />
          <div>
            <h3>Modifier la carte</h3>
            <p>Les changements restent dans le brouillon local.</p>
          </div>
        </div>
        <label className={styles.fieldCard}>
          <span>Titre</span>
          <input
            value={selectedCard.title}
            onChange={(event) => onUpdateCard(selectedCard.id, { title: event.target.value })}
          />
        </label>
        <label className={styles.fieldCard}>
          <span>Image</span>
          <input
            value={selectedCard.image}
            onChange={(event) => onUpdateCard(selectedCard.id, { image: event.target.value })}
          />
          <button className={styles.secondaryAction} type="button">
            <ImageIcon aria-hidden="true" size={16} />
            Choisir une image
          </button>
          <small className={styles.localImageNote}>Image locale uniquement, non publiée.</small>
        </label>
        <div className={styles.managerCard}>
          <ButtonManager
            buttons={selectedCard.buttons || []}
            onAddButton={() => onAddButton(selectedCard.id)}
            onRemoveButton={(buttonId) => onRemoveButton(selectedCard.id, buttonId)}
            onReorderButton={(buttonId, direction) => onReorderButton(selectedCard.id, buttonId, direction)}
            onUpdateButton={(buttonId, next) => onUpdateButton(selectedCard.id, buttonId, next)}
            title="Boutons de la carte"
          />
        </div>
      </section>
    </div>
  );
}

function StoryEditor({
  onAddButton,
  onRemoveButton,
  onReorderButton,
  onUpdate,
  onUpdateButton,
  story
}: {
  onAddButton: () => void;
  onRemoveButton: (id: string) => void;
  onReorderButton: (id: string, direction: -1 | 1) => void;
  onUpdate: (next: Partial<OraTeoHomeDraft["story"]>) => void;
  onUpdateButton: (id: string, next: Partial<StudioButton>) => void;
  story: OraTeoHomeDraft["story"];
}) {
  return (
    <div className={styles.storyEditor}>
      <img alt="" src={story.image} />
      <div>
        <label>
          <span>Titre</span>
          <input value={story.title} onChange={(event) => onUpdate({ title: event.target.value })} />
        </label>
        <label>
          <span>Texte</span>
          <textarea
            value={story.text}
            onChange={(event) => onUpdate({ text: event.target.value })}
          />
        </label>
        <button className={styles.secondaryAction} type="button">
          <Pencil aria-hidden="true" size={15} />
          Modifier l'image
        </button>
        <div className={styles.managerCard}>
          <ButtonManager
            buttons={story.buttons}
            onAddButton={onAddButton}
            onRemoveButton={onRemoveButton}
            onReorderButton={onReorderButton}
            onUpdateButton={onUpdateButton}
            title="Boutons Our Story"
          />
        </div>
      </div>
    </div>
  );
}

function QuoteEditor({
  onUpdate,
  quote
}: {
  onUpdate: (next: Partial<OraTeoHomeDraft["quote"]>) => void;
  quote: OraTeoHomeDraft["quote"];
}) {
  return (
    <div className={styles.simplePanel}>
      <label>
        <span>Citation</span>
        <textarea value={quote.text} onChange={(event) => onUpdate({ text: event.target.value })} />
      </label>
      <label>
        <span>Signature</span>
        <input
          value={quote.signature}
          onChange={(event) => onUpdate({ signature: event.target.value })}
        />
      </label>
    </div>
  );
}

function ContactEditor({
  contact,
  onAddButton,
  onRemoveButton,
  onReorderButton,
  onUpdate,
  onUpdateButton
}: {
  contact: OraTeoHomeDraft["contact"];
  onAddButton: () => void;
  onRemoveButton: (id: string) => void;
  onReorderButton: (id: string, direction: -1 | 1) => void;
  onUpdate: (next: Partial<OraTeoHomeDraft["contact"]>) => void;
  onUpdateButton: (id: string, next: Partial<StudioButton>) => void;
}) {
  return (
    <div className={styles.simplePanel}>
      <label>
        <span>Message d'invitation</span>
        <textarea
          value={contact.message}
          onChange={(event) => onUpdate({ message: event.target.value })}
        />
      </label>
      <label>
        <span>Bouton</span>
        <input
          value={contact.buttonLabel}
          onChange={(event) => onUpdate({ buttonLabel: event.target.value })}
        />
      </label>
      <div className={styles.managerCard}>
        <ButtonManager
          buttons={contact.buttons}
          onAddButton={onAddButton}
          onRemoveButton={onRemoveButton}
          onReorderButton={onReorderButton}
          onUpdateButton={onUpdateButton}
          title="Boutons CTA"
        />
      </div>
    </div>
  );
}

function ReadOnlySection({
  activeSection,
  data
}: {
  activeSection: string;
  data: OraTeoStudioData;
}) {
  if (activeSection === "Pages du site") {
    return <PageEditorPanel data={data} />;
  }

  if (activeSection === "Menu principal") {
    return (
      <div className={styles.readOnlyPanel}>
        <SectionIntro
          title="Menu principal"
          text="Structure actuelle du menu, dans l'ordre visible sur le site."
        />
        <div className={styles.menuTree}>
          {data.menu.map((item) => (
            <MenuTreeItem item={item} key={item.id} />
          ))}
        </div>
      </div>
    );
  }

  if (activeSection === "Galerie photos") {
    return (
      <div className={styles.readOnlyPanel}>
        <SectionIntro
          title="Galerie photos"
          text="Photos déjà disponibles. L'ajout d'images viendra dans une prochaine étape."
        />
        <div className={styles.galleryGrid}>
          {data.gallery.length ? (
            data.gallery.map((image) => (
              <article key={image.id}>
                <img alt="" src={image.image} />
                <strong>{image.title}</strong>
                {image.caption ? <span>{image.caption}</span> : null}
              </article>
            ))
          ) : (
            <EmptyState text="Aucune photo de galerie trouvée pour le moment." />
          )}
        </div>
      </div>
    );
  }

  if (activeSection === "Documents PDF") {
    return (
      <div className={styles.readOnlyPanel}>
        <SectionIntro
          title="Documents PDF"
          text="Documents repérés dans les pages du site. Modification et ajout viendront plus tard."
        />
        <div className={styles.documentList}>
          {data.pdfs.length ? (
            data.pdfs.map((pdf) => (
              <article key={pdf.id}>
                <FileText aria-hidden="true" size={20} />
                <div>
                  <strong>{pdf.title}</strong>
                  <span>{pdf.fileName}</span>
                </div>
                <small>{pdf.pageTitle ? `Page : ${pdf.pageTitle}` : "Page non indiquée"}</small>
              </article>
            ))
          ) : (
            <EmptyState text="Aucun PDF trouvé pour le moment." />
          )}
        </div>
      </div>
    );
  }

  if (activeSection === "Apparence") {
    return (
      <div className={styles.readOnlyPanel}>
        <SectionIntro
          title="Apparence"
          text="Couleurs actuellement utilisées par l'identité visuelle."
        />
        <div className={styles.colorGrid}>
          {data.colors.map((color) => (
            <article key={color.label}>
              <span style={{ backgroundColor: color.value }} />
              <div>
                <strong>{color.label}</strong>
                <small>{color.value}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (activeSection === "Contact") {
    return (
      <div className={styles.readOnlyPanel}>
        <SectionIntro
          title="Contact"
          text="Coordonnées actuellement affichées ou utilisées par le site."
        />
        <div className={styles.contactGrid}>
          <article>
            <strong>Email</strong>
            <span>{data.contact.email || "Non renseigné"}</span>
          </article>
          <article>
            <strong>Téléphone</strong>
            <span>{data.contact.phone || "Non renseigné"}</span>
          </article>
          <article>
            <strong>Adresse</strong>
            <span>{data.contact.address || "Non renseignée"}</span>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.readOnlyPanel}>
      <SectionIntro
        title="Paramètres"
        text="Résumé de la connexion et des contenus consultés par OraTeo Studio."
      />
      <div className={styles.documentList}>
        {data.documentsUsed.map((documentName) => (
          <article key={documentName}>
            <CheckCircle2 aria-hidden="true" size={20} />
            <div>
              <strong>{documentName}</strong>
              <span>Lecture seule</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

type LocalPageDraft = {
  buttons: StudioButton[];
  content: string;
  id: string;
  image: string;
  pdfs: OraTeoStudioData["pdfs"];
  status: string;
  title: string;
  updatedAt: string;
};

function PageEditorPanel({ data }: { data: OraTeoStudioData }) {
  const featuredPages = useMemo<LocalPageDraft[]>(() => {
    const wanted = ["Home", "Who are we ?", "Our Story", "Monastic Life", "How to become", "Hospitality", "Contact"];
    const byTitle = new Map(data.pages.map((page) => [page.title, page]));

    return wanted.map((title, index) => {
      const page = byTitle.get(title);
      return {
        id: page?.id || `featured-${index}`,
        title,
        status: page?.status || "Publié",
        updatedAt: page?.updatedAt || "Page prête à consulter",
        content: page?.content || "Contenu de la page disponible ici en brouillon local.",
        buttons: page?.buttons || [],
        pdfs: page?.pdfs || [],
        image:
          page?.image ||
          data.home.cards[index % Math.max(data.home.cards.length, 1)]?.image ||
          data.home.slideshow.photos[0]?.image ||
          "/images/monastery-hero.svg"
      };
    });
  }, [data]);
  const [pages, setPages] = useState(featuredPages);
  const [selectedPageTitle, setSelectedPageTitle] = useState(featuredPages[0]?.title || "Home");
  const selectedPage = pages.find((page) => page.title === selectedPageTitle) || pages[0];

  function updatePage(id: string, next: Partial<LocalPageDraft>) {
    setPages((current) => current.map((page) => (page.id === id ? { ...page, ...next } : page)));
  }

  if (!selectedPage) {
    return <EmptyState text="Aucune page disponible pour le moment." />;
  }

  return (
    <div className={styles.readOnlyPanel}>
      <SectionIntro
        title="Pages du site"
        text="Ouvrez une page et préparez des changements dans le brouillon local."
      />
      <div className={styles.visualPageGrid}>
        {pages.map((page) => (
          <button
            className={selectedPageTitle === page.title ? styles.visualPageActive : styles.visualPageCard}
            key={page.id}
            onClick={() => setSelectedPageTitle(page.title)}
            type="button"
          >
            <img alt="" src={page.image} />
            <strong>{page.title}</strong>
            <span>{page.status}</span>
          </button>
        ))}
      </div>
      <PageVisualPreview onUpdatePage={updatePage} page={selectedPage} />
    </div>
  );
}

function PageVisualPreview({
  onUpdatePage,
  page
}: {
  onUpdatePage: (id: string, next: Partial<LocalPageDraft>) => void;
  page: LocalPageDraft;
}) {
  return (
    <article className={styles.pageVisualPreview}>
      <img alt="" src={page.image} />
      <div>
        <span>{page.status}</span>
        <label>
          <small>Titre</small>
          <input value={page.title} onChange={(event) => onUpdatePage(page.id, { title: event.target.value })} />
        </label>
        <label>
          <small>Contenu</small>
          <textarea
            value={page.content}
            onChange={(event) => onUpdatePage(page.id, { content: event.target.value })}
          />
        </label>
        <div className={styles.pageLinkedItems}>
          <strong>Boutons</strong>
          {page.buttons.length ? (
            page.buttons.map((button) => <span key={button.id}>{button.label}</span>)
          ) : (
            <span>Aucun bouton repéré</span>
          )}
          <strong>PDF liés</strong>
          {page.pdfs.length ? (
            page.pdfs.map((pdf) => <span key={pdf.id}>{pdf.title}</span>)
          ) : (
            <span>Aucun PDF lié</span>
          )}
        </div>
        <small>Mis à jour : {page.updatedAt}</small>
      </div>
    </article>
  );
}

function SectionIntro({ text, title }: { text: string; title: string }) {
  return (
    <div className={styles.sectionIntro}>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className={styles.emptyState}>{text}</div>;
}

function MenuTreeItem({ item }: { item: OraTeoStudioData["menu"][number] }) {
  return (
    <article>
      <div>
        <strong>{item.order}. {item.label}</strong>
        {item.children.length ? <span>{item.children.length} sous-page(s)</span> : null}
      </div>
      {item.children.length ? (
        <div className={styles.menuChildren}>
          {item.children.map((child) => (
            <MenuTreeItem item={child} key={child.id} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function HomepagePreview({
  buttons,
  cards,
  contact,
  heroPhoto,
  intro,
  mode,
  onSelectBlock,
  overlayStrength,
  quote,
  selectedBlock,
  story,
  title
}: {
  buttons: StudioButton[];
  cards: StudioCard[];
  contact: OraTeoHomeDraft["contact"];
  heroPhoto: string;
  intro: string;
  mode: PreviewMode;
  onSelectBlock: (key: BlockKey) => void;
  overlayStrength: HeroOverlayStrength;
  quote: OraTeoHomeDraft["quote"];
  selectedBlock: BlockKey;
  story: OraTeoHomeDraft["story"];
  title: string;
}) {
  const isEditing = mode === "edit";
  const heroBackground = getHeroPreviewBackground(heroPhoto, overlayStrength);

  return (
    <div className={styles.previewFrame}>
      <header className={styles.siteMiniHeader}>
        <div className={styles.siteLogo}>AM</div>
        <nav>
          {["Home", "Who are we ?", "Pictures", "Hospitality", "Access", "Contact"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <Menu aria-hidden="true" size={20} />
      </header>

      <EditableZone
        active={selectedBlock === "hero"}
        isEditing={isEditing}
        label="Modifier"
        onSelect={() => onSelectBlock("hero")}
      >
        <section className={styles.heroPreview} style={{ backgroundImage: heroBackground }}>
          <div>
            <EditableZone
              active={selectedBlock === "hero"}
              compact
              isEditing={isEditing}
              label="Modifier le titre"
              onSelect={() => onSelectBlock("hero")}
            >
              <h2>{title}</h2>
            </EditableZone>
            <EditableZone
              active={selectedBlock === "hero"}
              compact
              isEditing={isEditing}
              label="Modifier le texte"
              onSelect={() => onSelectBlock("hero")}
            >
              <p>{intro}</p>
            </EditableZone>
            <EditableZone
              active={selectedBlock === "hero"}
              compact
              isEditing={isEditing}
              label="Modifier les boutons"
              onSelect={() => onSelectBlock("hero")}
            >
              <div className={styles.previewButtons}>
                {buttons.map((button) => (
                  <button key={button.id} style={{ backgroundColor: button.color }} type="button">
                    {button.label}
                  </button>
                ))}
              </div>
            </EditableZone>
          </div>
        </section>
      </EditableZone>

      <EditableZone
        active={selectedBlock === "slideshow"}
        isEditing={isEditing}
        label="Modifier le diaporama"
        onSelect={() => onSelectBlock("slideshow")}
      >
        <div className={styles.previewDots}>
          <span />
          <span />
          <span />
          <span />
        </div>
      </EditableZone>

      <EditableZone
        active={selectedBlock === "cards"}
        isEditing={isEditing}
        label="Modifier les cartes"
        onSelect={() => onSelectBlock("cards")}
      >
        <section className={styles.previewSection}>
          <div>
            <h3>Cartes rapides</h3>
            <p>Mettez en avant les pages importantes.</p>
          </div>
          <div className={styles.previewCards}>
            {cards.map((card) => (
              <article key={card.id}>
                <img alt="" src={card.image} />
                <strong>{card.title}</strong>
                <button type="button">Modifier</button>
              </article>
            ))}
          </div>
        </section>
      </EditableZone>

      <EditableZone
        active={selectedBlock === "story"}
        isEditing={isEditing}
        label="Modifier Our Story"
        onSelect={() => onSelectBlock("story")}
      >
        <section className={styles.previewStory}>
          <div>
            <h3>{story.title}</h3>
            <p>Présentez l'histoire et la mission du monastère.</p>
          </div>
          <div className={styles.storyPreviewRow}>
            <img alt="" src={story.image} />
            <p>{story.text}</p>
          </div>
        </section>
      </EditableZone>

      <EditableZone
        active={selectedBlock === "quote"}
        isEditing={isEditing}
        label="Modifier la citation"
        onSelect={() => onSelectBlock("quote")}
      >
        <section className={styles.previewQuote}>
          <blockquote>{quote.text}</blockquote>
          <cite>{quote.signature}</cite>
        </section>
      </EditableZone>

      <EditableZone
        active={selectedBlock === "contact"}
        isEditing={isEditing}
        label="Modifier le contact"
        onSelect={() => onSelectBlock("contact")}
      >
        <section className={styles.previewContact}>
          <div>
            <h3>Contact</h3>
            <p>{contact.message}</p>
          </div>
          <button type="button">{contact.buttonLabel}</button>
        </section>
      </EditableZone>
    </div>
  );
}

function EditableZone({
  active,
  children,
  compact = false,
  isEditing,
  label,
  onSelect
}: {
  active: boolean;
  children: ReactNode;
  compact?: boolean;
  isEditing: boolean;
  label: string;
  onSelect: () => void;
}) {
  if (!isEditing) {
    return <>{children}</>;
  }

  return (
    <div
      className={[
        compact ? styles.editableZoneCompact : styles.editableZone,
        active ? styles.editableZoneActive : ""
      ].join(" ")}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <span className={styles.editBadge}>{label}</span>
      {children}
    </div>
  );
}
