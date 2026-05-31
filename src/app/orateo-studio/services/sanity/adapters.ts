import { fallbackHome, fallbackNavigation, fallbackPages, fallbackSettings } from "@/lib/fallbacks";
import type { ActionButton, HomeCard, HomePage, NavigationItem, SiteSettings } from "@/lib/types";
import type {
  OraTeoAppearanceColor,
  OraTeoGalleryImage,
  OraTeoHomeDraft,
  OraTeoMenuItem,
  OraTeoPageSummary,
  OraTeoPdfDocument,
  OraTeoStudioData
} from "./types";

function plainText(value: unknown): string {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";

  return value
    .map((block) => {
      if (!block || typeof block !== "object" || !("children" in block)) return "";
      const children = Array.isArray(block.children) ? block.children : [];
      return children.map((child: { text?: string }) => child?.text ?? "").join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

function buttonLabel(button: ActionButton | undefined, fallback: string) {
  return button?.link?.label || button?.link?.internalPage?.title || fallback;
}

function buttonDestination(button: ActionButton | undefined, fallback: string) {
  return (
    button?.link?.internalPage?.title ||
    button?.link?.label ||
    button?.link?.externalUrl ||
    button?.link?.email ||
    button?.link?.phone ||
    fallback
  );
}

function mapButton(button: ActionButton, index: number) {
  return {
    id: `sanity-button-${index}`,
    label: buttonLabel(button, `Bouton ${index + 1}`),
    destination: buttonDestination(button, "Accueil"),
    color: button.backgroundColor || (button.style === "secondary" ? "#d3ad73" : "#173f2d"),
    enabled: button.enabled !== false
  };
}

function mapCard(card: HomeCard, index: number) {
  return {
    id: `sanity-card-${index}`,
    title: card.title,
    image: card.frontImage || card.image || card.backImage || "/images/monastery-hero.svg"
  };
}

export function mapHomeToDraft(home: HomePage): OraTeoHomeDraft {
  return {
    hero: {
      title: home.heroTitle,
      intro: home.heroSubtitle,
      buttons: (home.heroButtons?.length ? home.heroButtons : fallbackHome.heroButtons || []).map(mapButton)
    },
    slideshow: {
      photos: (home.heroSlides?.length ? home.heroSlides : fallbackHome.heroSlides || []).map(
        (slide, index) => ({
          id: `sanity-photo-${index}`,
          image: slide.image || "/images/monastery-hero.svg",
          label: slide.alt || slide.caption || `Photo ${index + 1}`
        })
      )
    },
    cards: (home.cards?.length ? home.cards : fallbackHome.cards).map(mapCard),
    story: {
      title: home.story?.title || "Our Story",
      text: plainText(home.story?.text) || fallbackHome.story?.text?.toString() || "",
      image: home.story?.image || fallbackHome.story?.image || "/images/monastery-hero.svg"
    },
    quote: {
      text: home.values?.[0]?.title || "In silence, we listen.",
      signature: home.values?.[0]?.text || "Ananda Matha Monastery"
    },
    contact: {
      message: home.invitationText,
      buttonLabel:
        home.invitationButtons?.[0]?.link?.label ||
        home.invitationButtonLabel ||
        "Contact us"
    }
  };
}

export function mapPagesToSummaries(pages: Array<Record<string, any>>): OraTeoPageSummary[] {
  return pages.map((page, index) => ({
    id: page._id || `page-${index}`,
    title: page.title || "Page sans titre",
    addressLabel: page.slug ? "Adresse masquée" : "Adresse à vérifier",
    status: page._id?.startsWith("drafts.") ? "Brouillon" : "Publié",
    updatedAt: page._updatedAt
      ? new Intl.DateTimeFormat("fr-BE", { dateStyle: "medium" }).format(new Date(page._updatedAt))
      : "Date inconnue"
  }));
}

export function mapMenuItems(items: NavigationItem[]): OraTeoMenuItem[] {
  return items.map((item, index) => ({
    id: `${item.label}-${index}`,
    label: item.label,
    order: index + 1,
    children: item.children?.length ? mapMenuItems(item.children) : []
  }));
}

export function mapGallery(items: Array<Record<string, any>>): OraTeoGalleryImage[] {
  return items.map((item, index) => ({
    id: item._id || `gallery-${index}`,
    title: item.title || item.alt || `Photo ${index + 1}`,
    image: item.image || "/images/monastery-hero.svg",
    caption: item.caption
  }));
}

export function mapPdfs(items: Array<Record<string, any>>): OraTeoPdfDocument[] {
  return items.map((item, index) => ({
    id: item._key || item._id || `pdf-${index}`,
    title: item.title || "Document PDF",
    fileName: item.fileName || "Fichier PDF",
    pageTitle: item.pageTitle,
    updatedAt: item.updatedAt
      ? new Intl.DateTimeFormat("fr-BE", { dateStyle: "medium" }).format(new Date(item.updatedAt))
      : undefined,
    url: item.url
  }));
}

export function mapColors(settings: SiteSettings): OraTeoAppearanceColor[] {
  const theme = settings.theme || {};
  return [
    { label: "Fond crème", value: theme.cream || fallbackSettings.theme?.cream || "#faf5ea" },
    { label: "Safran", value: theme.saffron || fallbackSettings.theme?.saffron || "#c8741d" },
    { label: "Vert profond", value: theme.forest || fallbackSettings.theme?.forest || "#173f2d" },
    { label: "Bleu Ashoka", value: theme.ashoka || fallbackSettings.theme?.ashoka || "#1d4f91" },
    {
      label: "Fond du menu",
      value: theme.headerBackgroundColor || fallbackSettings.theme?.headerBackgroundColor || "#faf5ea"
    },
    {
      label: "Texte du menu",
      value: theme.menuTextColor || fallbackSettings.theme?.menuTextColor || "#3f3a32"
    }
  ];
}

export function createDemoStudioData(): OraTeoStudioData {
  return {
    source: "demo",
    home: mapHomeToDraft(fallbackHome),
    pages: fallbackPages.map((page, index) => ({
      id: `demo-page-${index}`,
      title: page.title,
      addressLabel: "Adresse masquée",
      status: "Publié",
      updatedAt: "Données de démonstration"
    })),
    menu: mapMenuItems(fallbackNavigation),
    gallery: (fallbackHome.heroSlides || []).map((slide, index) => ({
      id: `demo-gallery-${index}`,
      title: slide.alt || `Photo ${index + 1}`,
      image: slide.image || "/images/monastery-hero.svg",
      caption: slide.caption
    })),
    pdfs: [],
    colors: mapColors(fallbackSettings),
    contact: {
      email: fallbackSettings.contactEmail,
      phone: fallbackSettings.phone,
      address: fallbackSettings.address
    },
    documentsUsed: [
      "Page d'accueil",
      "Pages du site",
      "Menu principal",
      "Coordonnées, logo et couleurs",
      "Photos de la galerie"
    ]
  };
}
