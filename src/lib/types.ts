export type SiteSettings = {
  siteTitle: string;
  subtitle: string;
  logo?: string;
  theme?: {
    cream?: string;
    saffron?: string;
    forest?: string;
    ashoka?: string;
  };
  contactEmail: string;
  phone: string;
  address: string;
  socialLinks: { label: string; url: string }[];
  footerText: string;
};

export type NavigationItem = {
  label: string;
  url: string;
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
  text: string;
  image?: string;
  linkLabel: string;
  link: string;
};

export type HomePage = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  heroButtonLabel: string;
  heroButtonLink: string;
  values: ValueItem[];
  cards: HomeCard[];
  visitingHoursTitle: string;
  visitingHoursContent: string;
  visitingHoursImage?: string;
  invitationText: string;
  invitationButtonLabel: string;
  invitationButtonLink: string;
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
