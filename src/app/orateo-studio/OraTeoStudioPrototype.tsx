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
  Maximize2,
  Menu,
  Minimize2,
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
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { fallbackSettings } from "@/lib/fallbacks";
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

export function OraTeoStudioPrototype({ initialData }: { initialData: OraTeoStudioData }) {
  const [activeSection, setActiveSection] = useState("Accueil");
  const [draft, setDraft] = useState<OraTeoHomeDraft>(initialData.home);
  const [savedDraft, setSavedDraft] = useState<OraTeoHomeDraft>(initialData.home);
  const [lastSavedLabel, setLastSavedLabel] = useState("Brouillon initial");
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const [previewWide, setPreviewWide] = useState(false);
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

  function toggleBlock(key: BlockKey) {
    setOpenBlocks((current) => ({ ...current, [key]: !current[key] }));
  }

  function updateButton(id: string, next: Partial<StudioButton>) {
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

  function removeButton(id: string) {
    setDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        buttons: current.hero.buttons.filter((button) => button.id !== id)
      }
    }));
  }

  function addButton() {
    setDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        buttons: [
          ...current.hero.buttons,
          {
            id: `button-${Date.now()}`,
            label: "Nouveau bouton",
            destination: editablePages[0] ?? "Accueil",
            color: fallbackSettings.theme?.forest ?? "#173f2d",
            enabled: true
          }
        ]
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
  }

  function addPhoto() {
    setDraft((current) => ({
      ...current,
      slideshow: {
        photos: [
          ...current.slideshow.photos,
          {
            id: `photo-${Date.now()}`,
            image:
              current.slideshow.photos.length % 2 === 0
                ? "/images/garden-work.svg"
                : "/images/prayer-hills.svg",
            label: `Nouvelle photo ${current.slideshow.photos.length + 1}`
          }
        ]
      }
    }));
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

  function saveDraft() {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    setSavedDraft(draft);
    setLastSavedLabel("Brouillon enregistré à l'instant");
  }

  function cancelChanges() {
    setDraft(savedDraft);
    setDraggedPhotoId(null);
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

        <div className={previewWide ? styles.mainGridWide : styles.mainGrid}>
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

            {activeSection === "Accueil" ? (
              <div className={styles.blockStack}>
                {blockMeta.map((block) => (
                  <StudioBlock
                    icon={block.icon}
                    isOpen={openBlocks[block.key]}
                    key={block.key}
                    onToggle={() => toggleBlock(block.key)}
                    summary={block.summary}
                    title={block.title}
                  >
                    {block.key === "hero" && (
                      <HeroEditor
                        buttons={draft.hero.buttons}
                        intro={draft.hero.intro}
                        onAddButton={addButton}
                        onRemoveButton={removeButton}
                        onSetIntro={(intro) => updateHero({ intro })}
                        onSetTitle={(title) => updateHero({ title })}
                        onUpdateButton={updateButton}
                        title={draft.hero.title}
                      />
                    )}

                    {block.key === "slideshow" && (
                      <PhotoManager
                        draggedPhotoId={draggedPhotoId}
                        onAddPhoto={addPhoto}
                        onDragEnd={() => setDraggedPhotoId(null)}
                        onDragStart={setDraggedPhotoId}
                        onMoveToStart={movePhotoToStart}
                        onRemovePhoto={removePhoto}
                        onReorderPhoto={reorderPhoto}
                        photos={draft.slideshow.photos}
                      />
                    )}

                    {block.key === "cards" && <QuickCardsEditor cards={draft.cards} />}
                    {block.key === "story" && (
                      <StoryEditor onUpdate={updateStory} story={draft.story} />
                    )}
                    {block.key === "quote" && (
                      <QuoteEditor onUpdate={updateQuote} quote={draft.quote} />
                    )}
                    {block.key === "contact" && (
                      <ContactEditor contact={draft.contact} onUpdate={updateContact} />
                    )}
                  </StudioBlock>
                ))}
              </div>
            ) : (
              <ReadOnlySection activeSection={activeSection} data={initialData} />
            )}
          </section>

          <aside className={styles.previewPanel} aria-label="Aperçu de l'accueil">
            <div className={styles.previewTitle}>
              <div>
                <span>
                  <Monitor aria-hidden="true" size={18} />
                  Aperçu du site
                </span>
                <p>Une vue immédiate de ce que verra le visiteur.</p>
              </div>
              <button
                className={styles.previewToggle}
                onClick={() => setPreviewWide((current) => !current)}
                type="button"
              >
                {previewWide ? (
                  <Minimize2 aria-hidden="true" size={16} />
                ) : (
                  <Maximize2 aria-hidden="true" size={16} />
                )}
                {previewWide ? "Réduire l'aperçu" : "Agrandir l'aperçu"}
              </button>
            </div>
            <HomepagePreview
              buttons={enabledButtons}
              cards={draft.cards}
              heroPhoto={heroPhoto}
              intro={draft.hero.intro}
              story={draft.story}
              title={draft.hero.title}
            />
          </aside>
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
  summary,
  title
}: {
  children: ReactNode;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  summary: string;
  title: string;
}) {
  return (
    <section className={styles.blockCard}>
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

function HeroEditor({
  buttons,
  intro,
  onAddButton,
  onRemoveButton,
  onSetIntro,
  onSetTitle,
  onUpdateButton,
  title
}: {
  buttons: StudioButton[];
  intro: string;
  onAddButton: () => void;
  onRemoveButton: (id: string) => void;
  onSetIntro: (value: string) => void;
  onSetTitle: (value: string) => void;
  onUpdateButton: (id: string, next: Partial<StudioButton>) => void;
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

      <div className={styles.managerCard}>
        <div className={styles.managerHeader}>
          <div>
            <h3>Boutons d'action</h3>
            <p>Choisissez le texte, la destination, la couleur et l'affichage.</p>
          </div>
          <button className={styles.addBigButton} onClick={onAddButton} type="button">
            <Plus aria-hidden="true" size={18} />
            Ajouter un bouton
          </button>
        </div>

        <div className={styles.buttonRows}>
          {buttons.map((button) => (
            <article className={styles.buttonRow} key={button.id}>
              <div className={styles.rowHandle}>
                <GripVertical aria-hidden="true" size={18} />
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
              <button
                aria-label="Supprimer ce bouton"
                className={styles.iconOnly}
                onClick={() => onRemoveButton(button.id)}
                type="button"
              >
                <Trash2 aria-hidden="true" size={16} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
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
  photos
}: {
  draggedPhotoId: string | null;
  onAddPhoto: () => void;
  onDragEnd: () => void;
  onDragStart: (id: string) => void;
  onMoveToStart: (photo: StudioPhoto) => void;
  onRemovePhoto: (id: string) => void;
  onReorderPhoto: (id: string) => void;
  photos: StudioPhoto[];
}) {
  return (
    <div className={styles.managerCard}>
      <div className={styles.managerHeader}>
        <div>
          <h3>Photos du diaporama</h3>
          <p>Glissez les photos pour changer leur ordre. La première devient l'image principale.</p>
        </div>
        <button className={styles.addBigButton} onClick={onAddPhoto} type="button">
          <Plus aria-hidden="true" size={18} />
          Ajouter une photo
        </button>
      </div>

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
            <div className={styles.photoOverlay}>
              <span>
                <GripVertical aria-hidden="true" size={17} />
                Position {index + 1}
              </span>
              <div>
                <button onClick={() => onMoveToStart(photo)} type="button">
                  En premier
                </button>
                <button
                  aria-label={`Supprimer ${photo.label}`}
                  onClick={() => onRemovePhoto(photo.id)}
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}

        <button className={styles.addPhotoCard} onClick={onAddPhoto} type="button">
          <Plus aria-hidden="true" size={28} />
          <strong>Ajouter une photo</strong>
          <span>Choisir une image pour le diaporama</span>
        </button>
      </div>
    </div>
  );
}

function QuickCardsEditor({ cards }: { cards: StudioCard[] }) {
  return (
    <div className={styles.quickEditorGrid}>
      {cards.map((card) => (
        <article key={card.id}>
          <img alt="" src={card.image} />
          <div>
            <input aria-label={`Titre ${card.title}`} defaultValue={card.title} />
            <button onClick={() => console.log("Modification simulée", card.title)} type="button">
              <Pencil aria-hidden="true" size={15} />
              Modifier
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function StoryEditor({
  onUpdate,
  story
}: {
  onUpdate: (next: Partial<OraTeoHomeDraft["story"]>) => void;
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
  onUpdate
}: {
  contact: OraTeoHomeDraft["contact"];
  onUpdate: (next: Partial<OraTeoHomeDraft["contact"]>) => void;
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
    return (
      <div className={styles.readOnlyPanel}>
        <SectionIntro
          title="Pages du site"
          text="Liste consultable des pages actuellement connues par OraTeo Studio."
        />
        <div className={styles.pageList}>
          {data.pages.map((page) => (
            <article key={page.id}>
              <div>
                <strong>{page.title}</strong>
                <span>{page.addressLabel}</span>
              </div>
              <div>
                <span className={page.status === "Publié" ? styles.statusPill : styles.draftPill}>
                  {page.status}
                </span>
                <small>Mis à jour : {page.updatedAt}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
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
  heroPhoto,
  intro,
  story,
  title
}: {
  buttons: StudioButton[];
  cards: StudioCard[];
  heroPhoto: string;
  intro: string;
  story: OraTeoHomeDraft["story"];
  title: string;
}) {
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

      <section className={styles.heroPreview} style={{ backgroundImage: `url(${heroPhoto})` }}>
        <div>
          <h2>{title}</h2>
          <p>{intro}</p>
          <div className={styles.previewButtons}>
            {buttons.map((button) => (
              <button key={button.id} style={{ backgroundColor: button.color }} type="button">
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.previewDots}>
        <span />
        <span />
        <span />
        <span />
      </div>

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

      <section className={styles.previewStory}>
        <div>
          <h3>Section "Our Story"</h3>
          <p>Présentez l'histoire et la mission du monastère.</p>
        </div>
        <div className={styles.storyPreviewRow}>
          <img alt="" src={story.image} />
          <p>{story.text}</p>
        </div>
      </section>
    </div>
  );
}
