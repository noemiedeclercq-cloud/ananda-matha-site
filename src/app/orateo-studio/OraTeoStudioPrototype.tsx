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
import { useMemo, useState } from "react";
import { fallbackHome, fallbackSettings } from "@/lib/fallbacks";
import styles from "./orateo-studio.module.css";
import {
  editablePages,
  menuItems,
  studioButtons,
  studioCards,
  studioPhotos,
  type StudioButton,
  type StudioPhoto
} from "./studioData";

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

const introduction =
  "A Cistercian monastery in Kerala, India.\nA place of prayer, silence and hospitality.\nAll are welcome.";

export function OraTeoStudioPrototype() {
  const [activeSection, setActiveSection] = useState("Accueil");
  const [title, setTitle] = useState(fallbackHome.heroTitle);
  const [intro, setIntro] = useState(introduction);
  const [photos, setPhotos] = useState(studioPhotos);
  const [buttons, setButtons] = useState(studioButtons);
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

  const heroPhoto = photos[0]?.image ?? fallbackHome.heroImage ?? "/images/monastery-hero.svg";
  const enabledButtons = useMemo(
    () => buttons.filter((button) => button.enabled),
    [buttons]
  );

  function toggleBlock(key: BlockKey) {
    setOpenBlocks((current) => ({ ...current, [key]: !current[key] }));
  }

  function updateButton(id: string, next: Partial<StudioButton>) {
    setButtons((current) =>
      current.map((button) => (button.id === id ? { ...button, ...next } : button))
    );
  }

  function removeButton(id: string) {
    setButtons((current) => current.filter((button) => button.id !== id));
  }

  function addButton() {
    setButtons((current) => [
      ...current,
      {
        id: `button-${current.length + 1}`,
        label: "Nouveau bouton",
        destination: editablePages[0] ?? "Accueil",
        color: fallbackSettings.theme?.forest ?? "#173f2d",
        enabled: true
      }
    ]);
  }

  function removePhoto(id: string) {
    setPhotos((current) => current.filter((photo) => photo.id !== id));
  }

  function addPhoto() {
    setPhotos((current) => [
      ...current,
      {
        id: `photo-${current.length + 1}`,
        image: current.length % 2 === 0 ? "/images/garden-work.svg" : "/images/prayer-hills.svg",
        label: `Nouvelle photo ${current.length + 1}`
      }
    ]);
  }

  function movePhotoToStart(photo: StudioPhoto) {
    setPhotos((current) => [photo, ...current.filter((item) => item.id !== photo.id)]);
  }

  function reorderPhoto(targetId: string) {
    if (!draggedPhotoId || draggedPhotoId === targetId) {
      return;
    }

    setPhotos((current) => {
      const dragged = current.find((photo) => photo.id === draggedPhotoId);
      const targetIndex = current.findIndex((photo) => photo.id === targetId);

      if (!dragged || targetIndex < 0) {
        return current;
      }

      const withoutDragged = current.filter((photo) => photo.id !== draggedPhotoId);
      const next = [...withoutDragged];
      next.splice(targetIndex, 0, dragged);
      return next;
    });
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
            <span className={styles.localBadge}>🟡 Prototype local</span>
            <h1>Ananda Matha Monastery</h1>
            <p>Un espace simple pour préparer les changements du site.</p>
          </div>
          <div className={styles.headerActions}>
            <a className={styles.secondaryAction} href="/" target="_blank">
              Voir le site
              <ExternalLink aria-hidden="true" size={15} />
            </a>
            <button
              className={styles.primaryAction}
              onClick={() => console.log("Publication simulée depuis OraTeo Studio")}
              type="button"
            >
              <UploadCloud aria-hidden="true" size={17} />
              Publier les changements
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
                      buttons={buttons}
                      intro={intro}
                      onAddButton={addButton}
                      onRemoveButton={removeButton}
                      onSetIntro={setIntro}
                      onSetTitle={setTitle}
                      onUpdateButton={updateButton}
                      title={title}
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
                      photos={photos}
                    />
                  )}

                  {block.key === "cards" && <QuickCardsEditor />}
                  {block.key === "story" && <StoryEditor />}
                  {block.key === "quote" && <QuoteEditor />}
                  {block.key === "contact" && <ContactEditor />}
                </StudioBlock>
              ))}
            </div>
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
              heroPhoto={heroPhoto}
              intro={intro}
              title={title}
            />
          </aside>
        </div>

        <footer className={styles.statusBar}>
          <span>Dernière sauvegarde locale : il y a 5 minutes</span>
          <span>
            <CheckCircle2 aria-hidden="true" size={17} />
            Tout est prêt dans ce prototype
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

function QuickCardsEditor() {
  return (
    <div className={styles.quickEditorGrid}>
      {studioCards.map((card) => (
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

function StoryEditor() {
  return (
    <div className={styles.storyEditor}>
      <img alt="" src={fallbackHome.story?.image ?? "/images/monastery-hero.svg"} />
      <div>
        <label>
          <span>Titre</span>
          <input defaultValue={fallbackHome.story?.title ?? "Our Story"} />
        </label>
        <label>
          <span>Texte</span>
          <textarea
            defaultValue={
              typeof fallbackHome.story?.text === "string"
                ? fallbackHome.story.text
                : "A place of prayer and peace, rooted in the Cistercian tradition."
            }
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

function QuoteEditor() {
  return (
    <div className={styles.simplePanel}>
      <label>
        <span>Citation</span>
        <textarea defaultValue="In silence, we listen. In prayer, we unite." />
      </label>
      <label>
        <span>Signature</span>
        <input defaultValue="Ananda Matha Monastery" />
      </label>
    </div>
  );
}

function ContactEditor() {
  return (
    <div className={styles.simplePanel}>
      <label>
        <span>Message d'invitation</span>
        <textarea defaultValue={fallbackHome.invitationText} />
      </label>
      <label>
        <span>Bouton</span>
        <input defaultValue={fallbackHome.invitationButtonLabel} />
      </label>
    </div>
  );
}

function HomepagePreview({
  buttons,
  heroPhoto,
  intro,
  title
}: {
  buttons: StudioButton[];
  heroPhoto: string;
  intro: string;
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
          {studioCards.map((card) => (
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
          <img alt="" src={fallbackHome.story?.image ?? "/images/monastery-hero.svg"} />
          <p>
            A place of prayer and peace, rooted in the Cistercian tradition, where we seek God
            in simplicity, community and service.
          </p>
        </div>
      </section>
    </div>
  );
}
