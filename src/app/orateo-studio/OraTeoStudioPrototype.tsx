"use client";

import {
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  FileText,
  Home,
  Image as ImageIcon,
  LayoutTemplate,
  Link2,
  Mail,
  Menu,
  Monitor,
  Palette,
  PanelLeft,
  Pencil,
  Plus,
  Save,
  Settings,
  Trash2,
  UploadCloud
} from "lucide-react";
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

const sections = [
  { label: "Accueil", icon: Home },
  { label: "Pages", icon: FileText },
  { label: "Menus", icon: Menu },
  { label: "Photos", icon: ImageIcon },
  { label: "Documents", icon: FileText },
  { label: "Apparence", icon: Palette },
  { label: "Contact", icon: Mail },
  { label: "Paramètres", icon: Settings }
];

const introduction =
  "A Cistercian monastery in Kerala, India.\nA place of prayer, silence and hospitality.\nAll are welcome.";

export function OraTeoStudioPrototype() {
  const [activeSection, setActiveSection] = useState("Accueil");
  const [title, setTitle] = useState(fallbackHome.heroTitle);
  const [intro, setIntro] = useState(introduction);
  const [photos, setPhotos] = useState(studioPhotos);
  const [buttons, setButtons] = useState(studioButtons);

  const heroPhoto = photos[0]?.image ?? fallbackHome.heroImage ?? "/images/monastery-hero.svg";
  const enabledButtons = useMemo(
    () => buttons.filter((button) => button.enabled),
    [buttons]
  );

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
        image: "/images/garden-work.svg",
        label: "Nouvelle photo"
      }
    ]);
  }

  function movePhoto(photo: StudioPhoto) {
    setPhotos((current) => [photo, ...current.filter((item) => item.id !== photo.id)]);
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
                <Icon aria-hidden="true" size={18} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.helpBox}>
            <CircleHelp aria-hidden="true" size={22} />
            <strong>Besoin d'aide ?</strong>
            <span>Consultez le guide ou contactez-nous.</span>
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
          <div>
            <h1>Ananda Matha Monastery</h1>
            <p>Bienvenue, Soeur Noemi</p>
          </div>
          <div className={styles.headerActions}>
            <a className={styles.secondaryAction} href="/" target="_blank">
              Voir le site
              <ExternalLink aria-hidden="true" size={15} />
            </a>
            <button className={styles.primaryAction} type="button">
              <UploadCloud aria-hidden="true" size={17} />
              Publier les changements
            </button>
          </div>
        </header>

        <div className={styles.mainGrid}>
          <section className={styles.editorPanel} aria-label="Edition de l'accueil">
            <div className={styles.pageTitle}>
              <div className={styles.pageIcon}>
                <Home aria-hidden="true" size={30} />
              </div>
              <div>
                <h2>Modifier l'accueil</h2>
                <p>Gérez le contenu de votre page d'accueil.</p>
              </div>
              <span className={styles.prototypeBadge}>Prototype - non connecté</span>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Photo principale (diaporama)</h3>
                <span className={styles.prototypeBadge}>Prototype - non connecté</span>
                <CircleHelp aria-label="Aide" size={17} />
              </div>
              <div className={styles.photoGrid}>
                {photos.map((photo, index) => (
                  <div className={styles.photoTile} key={photo.id}>
                    <img alt={photo.label} src={photo.image} />
                    <button
                      aria-label={`Mettre ${photo.label} en premier`}
                      className={styles.photoOrder}
                      onClick={() => movePhoto(photo)}
                      type="button"
                    >
                      {index + 1}
                    </button>
                    <button
                      aria-label={`Supprimer ${photo.label}`}
                      className={styles.photoDelete}
                      onClick={() => removePhoto(photo.id)}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" size={15} />
                    </button>
                  </div>
                ))}
                <button className={styles.addPhoto} onClick={addPhoto} type="button">
                  <Plus aria-hidden="true" size={25} />
                  <span>Ajouter une photo</span>
                </button>
              </div>
              <p className={styles.hint}>Vous pouvez ajouter plusieurs photos. Elles défileront automatiquement.</p>
            </div>

            <label className={styles.fieldCard}>
              <span>Titre de bienvenue</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>

            <label className={styles.fieldCard}>
              <span>Texte d'introduction</span>
              <div className={styles.formatBar}>
                <button type="button">Paragraphe</button>
                <button aria-label="Gras" type="button">B</button>
                <button aria-label="Italique" type="button">I</button>
                <button aria-label="Liste" type="button">☰</button>
                <button aria-label="Lien" type="button">
                  <Link2 aria-hidden="true" size={15} />
                </button>
              </div>
              <textarea value={intro} onChange={(event) => setIntro(event.target.value)} />
            </label>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Boutons d'action</h3>
                <span className={styles.prototypeBadge}>Prototype - non connecté</span>
                <button className={styles.smallButton} onClick={addButton} type="button">
                  <Plus aria-hidden="true" size={16} />
                  Ajouter un bouton
                </button>
              </div>
              <div className={styles.buttonRows}>
                {buttons.map((button) => (
                  <div className={styles.buttonRow} key={button.id}>
                    <ArrowUpDown aria-hidden="true" size={17} />
                    <input
                      aria-label="Texte du bouton"
                      value={button.label}
                      onChange={(event) => updateButton(button.id, { label: event.target.value })}
                    />
                    <select
                      aria-label="Lien du bouton"
                      value={button.destination}
                      onChange={(event) => updateButton(button.id, { destination: event.target.value })}
                    >
                      {[...new Set([...editablePages, ...menuItems])].map((page) => (
                        <option key={page}>{page}</option>
                      ))}
                    </select>
                    <input
                      aria-label="Couleur du bouton"
                      className={styles.colorInput}
                      type="color"
                      value={button.color}
                      onChange={(event) => updateButton(button.id, { color: event.target.value })}
                    />
                    <button
                      aria-label={button.enabled ? "Masquer ce bouton" : "Afficher ce bouton"}
                      className={button.enabled ? styles.switchOn : styles.switchOff}
                      onClick={() => updateButton(button.id, { enabled: !button.enabled })}
                      type="button"
                    />
                    <button
                      aria-label="Supprimer ce bouton"
                      className={styles.iconOnly}
                      onClick={() => removeButton(button.id)}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Cartes rapides</h3>
                <span className={styles.prototypeBadge}>Prototype - non connecté</span>
                <button className={styles.smallButton} type="button">
                  <LayoutTemplate aria-hidden="true" size={16} />
                  Modifier l'ordre
                </button>
              </div>
              <div className={styles.quickEditorGrid}>
                {studioCards.map((card) => (
                  <article key={card.id}>
                    <img alt="" src={card.image} />
                    <input aria-label={`Titre ${card.title}`} defaultValue={card.title} />
                    <button type="button">
                      <Pencil aria-hidden="true" size={15} />
                      Modifier
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Section Our Story</h3>
                <span className={styles.prototypeBadge}>Prototype - non connecté</span>
                <button className={styles.smallButton} type="button">
                  <Pencil aria-hidden="true" size={16} />
                  Modifier cette section
                </button>
              </div>
              <div className={styles.storyEditor}>
                <img alt="" src={fallbackHome.story?.image ?? "/images/monastery-hero.svg"} />
                <div>
                  <input aria-label="Titre de la section" defaultValue={fallbackHome.story?.title ?? "Our Story"} />
                  <textarea
                    aria-label="Texte de la section"
                    defaultValue={
                      typeof fallbackHome.story?.text === "string"
                        ? fallbackHome.story.text
                        : "A place of prayer and peace, rooted in the Cistercian tradition."
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className={styles.previewPanel} aria-label="Aperçu de l'accueil">
            <div className={styles.previewTitle}>
              <Monitor aria-hidden="true" size={18} />
              <span>Aperçu de votre accueil</span>
              <span className={styles.prototypeBadge}>Prototype - non connecté</span>
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
          <span>Dernière sauvegarde : il y a 5 minutes</span>
          <span>
            <CheckCircle2 aria-hidden="true" size={17} />
            Tout est enregistré
          </span>
        </footer>
      </section>
    </main>
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
        <PanelLeft aria-hidden="true" size={20} />
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
