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

export type NavigationItem = {
  label: string;
  url: string;
  link?: SmartLink;
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
  image?: string;
  frontImage?: string;
  backImage?: string;
  backText?: string;
  audioUrl?: string;
  linkLabel: string;
  link: string;
  button?: SmartLink;
};

export type HeroSlide = {
  image?: string;
  alt?: string;
  caption?: string;
};

export type HomePage = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  heroSlides?: HeroSlide[];
  heroButtonLabel: string;
  heroButtonLink: string;
  heroButton?: SmartLink;
  values: ValueItem[];
  cards: HomeCard[];
  visitingHoursTitle: string;
  visitingHoursContent: string;
  visitingHoursImage?: string;
  invitationText: string;
  invitationButtonLabel: string;
  invitationButtonLink: string;
  invitationButton?: SmartLink;
};

export type PageContent = {
  title: string;
  slug: string;
  heroImage?: string;
  excerpt: string;
  body: string | PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
};
import type { PortableTextBlock } from "@portabletext/types";
