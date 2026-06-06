export type SiteSettings = {
  siteTitle: string;
  subtitle: string;
  logo?: string;
  theme?: {
    cream?: string;
    saffron?: string;
    forest?: string;
    ashoka?: string;
    headerBackgroundColor?: string;
    menuTextColor?: string;
    menuHoverColor?: string;
    menuActiveColor?: string;
    menuButtonBackgroundColor?: string;
    menuButtonTextColor?: string;
  };
  contactEmail: string;
  phone: string;
  address: string;
  socialLinks: { label: string; url?: string; link?: SmartLink }[];
  footerText: string;
};

export type SmartLink = {
  label?: string;
  type?: "internal" | "external" | "file" | "email" | "phone";
  internalPage?: {
    title?: string;
    slug?: string;
  };
  externalUrl?: string;
  fileUrl?: string;
  email?: string;
  phone?: string;
  openInNewTab?: boolean;
};

export type ActionButton = {
  enabled?: boolean;
  link?: SmartLink;
  backgroundColor?: string;
  textColor?: string;
  style?: "primary" | "secondary";
};

export type HeroOverlayStrength = "none" | "light" | "medium" | "strong";

export type NavigationItem = {
  label: string;
  url?: string;
  link?: SmartLink;
  isMenuOnly?: boolean;
  children?: NavigationItem[];
  order: number;
  parent?: string;
};

export type ValueItem = {
  icon?: string;
  title: string;
  text: string;
};

export type HomeCard = {
  title: string;
  text?: string;
  frontText?: string;
  frontBackgroundColor?: string;
  frontTextColor?: string;
  image?: string;
  frontImage?: string;
  backImage?: string;
  backText?: string;
  backBackgroundColor?: string;
  backTextColor?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  audioUrl?: string;
  linkLabel: string;
  link: string;
  button?: SmartLink;
  buttons?: ActionButton[];
};

export type HeroSlide = {
  _key?: string;
  image?: string;
  assetRef?: string;
  alt?: string;
  caption?: string;
};

export type HomeStory = {
  title?: string;
  subtitle?: string;
  text?: PortableTextBlock[] | string;
  button?: SmartLink;
  buttons?: ActionButton[];
  image?: string;
  backgroundColor?: string;
  textColor?: string;
};

export type HomePhotoBand = {
  image?: string;
  alt?: string;
  height?: "medium" | "large" | "xlarge";
  overlay?: boolean;
  caption?: string;
};

export type HomePage = {
  heroTitle: string;
  heroSubtitle: string;
  heroOverlayStrength?: HeroOverlayStrength;
  heroImage?: string;
  heroSlides?: HeroSlide[];
  heroButtonLabel: string;
  heroButtonLink: string;
  heroButton?: SmartLink;
  heroButtons?: ActionButton[];
  values: ValueItem[];
  cards: HomeCard[];
  story?: HomeStory;
  photoBands?: HomePhotoBand[];
  visitingHoursTitle: string;
  visitingHoursContent: string;
  visitingHoursImage?: string;
  invitationText: string;
  invitationButtonLabel: string;
  invitationButtonLink: string;
  invitationButton?: SmartLink;
  invitationButtons?: ActionButton[];
};

export type PageGalleryImage = {
  image?: string;
  alt?: string;
  caption?: string;
};

export type PageBlock = {
  _key?: string;
  _type:
    | "pageTextBlock"
    | "pageImageBlock"
    | "pageGalleryBlock"
    | "pageButtonBlock"
    | "pagePdfBlock"
    | "pageAudioBlock"
    | "pageQuoteBlock"
    | "pageInfoBlock"
    | "pageCtaBlock"
    | "pageDividerBlock";
  content?: PortableTextBlock[];
  image?: string;
  alt?: string;
  caption?: string;
  images?: PageGalleryImage[];
  link?: SmartLink;
  buttons?: ActionButton[];
  button?: SmartLink;
  style?: "primary" | "secondary";
  title?: string;
  text?: string;
  fileUrl?: string;
  buttonLabel?: string;
  quote?: string;
  attribution?: string;
  spacing?: "normal" | "large";
};

export type PageContent = {
  title: string;
  slug: string;
  heroImage?: string;
  excerpt: string;
  blocks?: PageBlock[];
  body: string | PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
};

export type GalleryItem = {
  title: string;
  image?: string;
  alt?: string;
  caption?: string;
};
import type { PortableTextBlock } from "@portabletext/types";
