import { client } from "./client";
import { isSanityConfigured } from "./env";
import { urlForImage } from "./image";
import {
  fallbackHome,
  fallbackNavigation,
  fallbackPages,
  fallbackSettings
} from "@/lib/fallbacks";
import type { HomePage, NavigationItem, PageContent, SiteSettings } from "@/lib/types";

const imageProjection = "image.asset->";

async function fetchOrNull<T>(query: string, params?: Record<string, string>) {
  if (!isSanityConfigured) return null;

  try {
    return await client.fetch<T | null>(query, params || {}, {
      next: { revalidate: 60 }
    });
  } catch {
    return null;
  }
}

function imageUrl(value: unknown, fallback?: string) {
  if (!value) return fallback;
  try {
    return urlForImage(value);
  } catch {
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await fetchOrNull<Record<string, unknown>>(`*[_type == "siteSettings"][0]{
    siteTitle, subtitle, logo, theme, contactEmail, phone, address, socialLinks, footerText
  }`);

  if (!settings) return fallbackSettings;

  return {
    ...fallbackSettings,
    ...settings,
    logo: imageUrl(settings.logo)
  } as SiteSettings;
}

export async function getNavigation(): Promise<NavigationItem[]> {
  const navigation = await fetchOrNull<{ items?: NavigationItem[] }>(`*[_type == "navigation"][0]{
    items[]{label, url, "order": _key}
  }`);

  if (navigation?.items?.length) {
    return navigation.items.map((item, index) => ({
      ...item,
      order: index
    }));
  }

  const items = await fetchOrNull<NavigationItem[]>(`*[_type == "navigationItem"] | order(order asc){
    label, url, order, "parent": parent->label
  }`);

  return items?.length ? items : fallbackNavigation;
}

export async function getHomePage(): Promise<HomePage> {
  const home = await fetchOrNull<Record<string, any>>(`*[_type == "homePage"][0]{
    heroTitle, heroSubtitle, heroImage, heroButtonLabel, heroButtonLink,
    values[]{icon, title, text},
    cards[]{title, text, image, linkLabel, link},
    visitingHoursTitle, visitingHoursContent, visitingHoursImage,
    invitationText, invitationButtonLabel, invitationButtonLink
  }`);

  if (!home) return fallbackHome;

  return {
    ...fallbackHome,
    ...home,
    heroImage: imageUrl(home.heroImage, fallbackHome.heroImage),
    visitingHoursImage: imageUrl(
      home.visitingHoursImage,
      fallbackHome.visitingHoursImage
    ),
    cards: (home.cards?.length ? home.cards : fallbackHome.cards).map(
      (card: any, index: number) => ({
        ...fallbackHome.cards[index % fallbackHome.cards.length],
        ...card,
        image: imageUrl(card.image, fallbackHome.cards[index]?.image)
      })
    )
  };
}

export async function getPageBySlug(slug: string): Promise<PageContent | null> {
  const page = await fetchOrNull<Record<string, any>>(`*[_type == "page" && slug.current == $slug][0]{
    title, "slug": slug.current, heroImage, excerpt, body, seoTitle, seoDescription
  }`, { slug });

  if (!page) return fallbackPages.find((item) => item.slug === slug) || null;

  return {
    ...page,
    heroImage: imageUrl(page.heroImage)
  } as PageContent;
}

export async function getAllPageSlugs(): Promise<string[]> {
  const slugs = await fetchOrNull<string[]>(`*[_type == "page" && defined(slug.current)][].slug.current`);
  const fallbackSlugs = fallbackPages.map((page) => page.slug);
  return Array.from(new Set([...(slugs || []), ...fallbackSlugs]));
}
