import {
  fallbackHome,
  fallbackNavigation,
  fallbackPages,
  fallbackSettings
} from "@/lib/fallbacks";

export type StudioButton = {
  id: string;
  label: string;
  destination: string;
  color: string;
  enabled: boolean;
};

export type StudioCard = {
  id: string;
  title: string;
  image: string;
};

export type StudioPhoto = {
  id: string;
  image: string;
  label: string;
};

export const studioPhotos: StudioPhoto[] = [
  {
    id: "hero-1",
    image: fallbackHome.heroSlides?.[0]?.image ?? fallbackHome.heroImage ?? "",
    label: "Monastere"
  },
  {
    id: "hero-2",
    image: fallbackHome.heroSlides?.[1]?.image ?? "/images/garden-work.svg",
    label: "Jardin"
  },
  {
    id: "hero-3",
    image: fallbackHome.heroSlides?.[2]?.image ?? "/images/prayer-hills.svg",
    label: "Collines"
  }
];

export const studioButtons: StudioButton[] = [
  {
    id: "read",
    label: fallbackHome.heroButtons?.[0]?.link?.label ?? "Read more",
    destination: "Who are we ?",
    color: fallbackSettings.theme?.saffron ?? "#c8741d",
    enabled: true
  },
  {
    id: "contact",
    label: "Contact us",
    destination: "Contact",
    color: fallbackSettings.theme?.forest ?? "#173f2d",
    enabled: true
  },
  {
    id: "visit",
    label: "Visiting the Monastery",
    destination: "Hospitality",
    color: "#d3ad73",
    enabled: true
  }
];

export const studioCards: StudioCard[] = [
  {
    id: "who",
    title: "Who are we ?",
    image: fallbackPages[0]?.heroImage ?? "/images/monastery-hero.svg"
  },
  {
    id: "hospitality",
    title: "Hospitality",
    image: fallbackPages.find((page) => page.title === "Hospitality")?.heroImage ?? "/images/garden-work.svg"
  },
  {
    id: "pictures",
    title: "Pictures",
    image: "/images/prayer-hills.svg"
  },
  {
    id: "support",
    title: "Support Us",
    image: "/images/garden-work.svg"
  }
];

export const editablePages = fallbackPages.slice(0, 8).map((page) => page.title);
export const menuItems = fallbackNavigation.slice(0, 6).map((item) => item.label);
