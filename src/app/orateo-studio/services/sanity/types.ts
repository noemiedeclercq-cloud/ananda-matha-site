import type { StudioButton, StudioCard, StudioPhoto } from "../../studioData";

export type OraTeoPageSummary = {
  id: string;
  title: string;
  addressLabel: string;
  status: "Publié" | "Brouillon";
  updatedAt: string;
};

export type OraTeoMenuItem = {
  id: string;
  label: string;
  order: number;
  children: OraTeoMenuItem[];
};

export type OraTeoGalleryImage = {
  id: string;
  title: string;
  image: string;
  caption?: string;
};

export type OraTeoPdfDocument = {
  id: string;
  title: string;
  fileName: string;
  pageTitle?: string;
  updatedAt?: string;
  url?: string;
};

export type OraTeoAppearanceColor = {
  label: string;
  value: string;
};

export type OraTeoHomeDraft = {
  hero: {
    title: string;
    intro: string;
    buttons: StudioButton[];
  };
  slideshow: {
    photos: StudioPhoto[];
  };
  cards: StudioCard[];
  story: {
    title: string;
    text: string;
    image: string;
  };
  quote: {
    text: string;
    signature: string;
  };
  contact: {
    message: string;
    buttonLabel: string;
  };
};

export type OraTeoStudioData = {
  source: "sanity" | "demo";
  home: OraTeoHomeDraft;
  pages: OraTeoPageSummary[];
  menu: OraTeoMenuItem[];
  gallery: OraTeoGalleryImage[];
  pdfs: OraTeoPdfDocument[];
  colors: OraTeoAppearanceColor[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  documentsUsed: string[];
};
