import { client } from "./client";
import { isSanityConfigured } from "./env";
import { urlForImage } from "./image";
import {
  fallbackHome,
  fallbackNavigation,
  fallbackPages,
  fallbackSettings
} from "@/lib/fallbacks";
import type {
  HeroOverlayStrength,
  HomePage,
  NavigationItem,
  PageContent,
  SiteSettings
} from "@/lib/types";

const linkProjection = `{
  label,
  type,
  "internalPage": internalPage->{title, "slug": slug.current},
  externalUrl,
  "fileUrl": file.asset->url,
  email,
  phone,
  openInNewTab
}`;

const buttonProjection = `{
  enabled,
  backgroundColor,
  textColor,
  style,
  "link": link${linkProjection}
}`;

const portableTextProjection = `[]{
  ...,
  markDefs[]{
    ...,
    _type == "smartLink" => ${linkProjection}
  }
}`;

async function fetchOrNull<T>(query: string, params?: Record<string, string>) {
  if (!isSanityConfigured) return null;

  try {
    return await client.fetch<T | null>(query, params || {}, {
      cache: "no-store"
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

function mapPageBlock(block: Record<string, any>) {
  if (!block) return block;

  if (block._type === "pageImageBlock") {
    return {
      ...block,
      image: imageUrl(block.image)
    };
  }

  if (block._type === "pageGalleryBlock") {
    return {
      ...block,
      images: block.images?.map((item: Record<string, any>) => ({
        ...item,
        image: imageUrl(item.image)
      }))
    };
  }

  return block;
}

function mapHeroSlides(home: Record<string, any>) {
  const publishedSlides = (home.heroSlides || [])
    .map((slide: any) => ({
      ...slide,
      image: imageUrl(slide.image)
    }))
    .filter((slide: any) => slide.image);

  if (publishedSlides.length) return publishedSlides;

  const legacyHeroImage = imageUrl(home.heroImage);
  if (legacyHeroImage) {
    return [
      {
        image: legacyHeroImage,
        alt: home.heroTitle || fallbackHome.heroTitle
      }
    ];
  }

  return fallbackHome.heroSlides;
}

function mapButtons(buttons: any[] | undefined, legacyLink?: any) {
  if (Array.isArray(buttons)) return buttons;
  return legacyLink ? [{ enabled: true, link: legacyLink }] : [];
}

function normalizeOverlayStrength(value: unknown): HeroOverlayStrength {
  return value === "none" || value === "medium" || value === "strong" ? value : "light";
}

function normalizeLegacyMenuUrl(url: string | undefined) {
  if (!url) return "#";
  if (url === "/") return "/";
  if (/^(https?:|mailto:|tel:)/.test(url)) return url;

  const slug = url.replace(/^\/+/, "").trim();
  if (!slug) return "/";

  return `/${slug}`;
}

function mapNavigationItems(items: NavigationItem[]): NavigationItem[] {
  return items.map((item, index) => ({
    ...item,
    order: index,
    url: item.link ? item.url : normalizeLegacyMenuUrl(item.url),
    children: item.children?.length ? mapNavigationItems(item.children) : []
  }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await fetchOrNull<Record<string, unknown>>(`*[_id == "siteSettings" && _type == "siteSettings"][0]{
    siteTitle, subtitle, logo, theme, contactEmail, phone, address,
    socialLinks[]{label, url, "link": link${linkProjection}},
    footerText
  }`);

  if (!settings) return fallbackSettings;

  return {
    ...fallbackSettings,
    ...settings,
    logo: imageUrl(settings.logo)
  } as SiteSettings;
}

export async function getNavigation(): Promise<NavigationItem[]> {
  const navigation = await fetchOrNull<{ items?: NavigationItem[] }>(`*[_id == "navigation" && _type == "navigation"][0]{
    items[]{
      label, url, isMenuOnly, "order": _key, "link": link${linkProjection},
      children[]{label, url, "order": _key, "link": link${linkProjection}}
    }
  }`);

  if (navigation?.items?.length) {
    return mapNavigationItems(navigation.items);
  }

  const items = await fetchOrNull<NavigationItem[]>(`*[_type == "navigationItem"] | order(order asc){
    label, url, order, "parent": parent->label
  }`);

  return items?.length ? mapNavigationItems(items) : fallbackNavigation;
}

export async function getHomePage(): Promise<HomePage> {
  const home = await fetchOrNull<Record<string, any>>(`*[_id == "homePage" && _type == "homePage"][0]{
    heroTitle, heroSubtitle, heroOverlayStrength, heroImage, heroSlides[]{image, alt, caption},
    heroButtons[]${buttonProjection},
    heroButtonLabel, heroButtonLink, "heroButton": heroButton${linkProjection},
    values[]{icon, title, text},
    cards[]{
      title, text, image, frontText, frontBackgroundColor, frontTextColor,
      frontImage, backImage, backText, backBackgroundColor, backTextColor,
      buttonBackgroundColor, buttonTextColor,
      "audioUrl": audio.asset->url,
      linkLabel, link, "button": button${linkProjection},
      buttons[]${buttonProjection}
    },
    story{
      title, subtitle, text${portableTextProjection}, button${linkProjection},
      buttons[]${buttonProjection},
      image, backgroundColor, textColor
    },
    photoBands[]{image, alt, height, overlay, caption},
    visitingHoursTitle, visitingHoursContent, visitingHoursImage,
    invitationText, invitationButtonLabel, invitationButtonLink,
    "invitationButton": invitationButton${linkProjection},
    invitationButtons[]${buttonProjection}
  }`);

  if (!home) return fallbackHome;

  return {
    ...fallbackHome,
    ...home,
    heroImage: imageUrl(home.heroImage),
    heroOverlayStrength: normalizeOverlayStrength(home.heroOverlayStrength),
    heroSlides: mapHeroSlides(home),
    heroButtons: mapButtons(home.heroButtons, home.heroButton),
    visitingHoursImage: imageUrl(
      home.visitingHoursImage,
      fallbackHome.visitingHoursImage
    ),
    story: {
      ...fallbackHome.story,
      ...home.story,
      image: imageUrl(home.story?.image, fallbackHome.story?.image),
      buttons: mapButtons(home.story?.buttons, home.story?.button)
    },
    photoBands: (home.photoBands?.length
      ? home.photoBands
      : fallbackHome.photoBands
    )?.map((band: any, index: number) => ({
      ...band,
      image: imageUrl(band.image, fallbackHome.photoBands?.[index]?.image)
    })),
    cards: (home.cards?.length ? home.cards : fallbackHome.cards).map(
      (card: any, index: number) => ({
        ...fallbackHome.cards[index % fallbackHome.cards.length],
        ...card,
        buttons: mapButtons(card.buttons, card.button),
        image: imageUrl(card.image, fallbackHome.cards[index]?.image),
        frontImage: imageUrl(
          card.frontImage,
          imageUrl(card.image, fallbackHome.cards[index]?.frontImage)
        ),
        backImage: imageUrl(
          card.backImage,
          imageUrl(card.image, fallbackHome.cards[index]?.backImage)
        )
      })
    ),
    invitationButtons: mapButtons(home.invitationButtons, home.invitationButton)
  };
}

export async function getPageBySlug(slug: string): Promise<PageContent | null> {
  const page = await fetchOrNull<Record<string, any>>(`*[_type == "page" && slug.current == $slug][0]{
    title, "slug": slug.current, heroImage, excerpt,
    blocks[]{
      ...,
      _type == "pageTextBlock" => {
        ...,
        content${portableTextProjection}
      },
      _type == "pageImageBlock" => {
        ...,
        image
      },
      _type == "pageGalleryBlock" => {
        ...,
        images[]{..., image}
      },
      _type == "pageButtonBlock" => {
        ...,
        "link": link${linkProjection},
        buttons[]${buttonProjection}
      },
      _type == "pagePdfBlock" => {
        ...,
        "fileUrl": file.asset->url
      },
      _type == "pageAudioBlock" => {
        ...,
        "fileUrl": file.asset->url
      },
      _type == "pageCtaBlock" => {
        ...,
        "button": button${linkProjection},
        buttons[]${buttonProjection}
      }
    },
    body${portableTextProjection},
    seoTitle, seoDescription
  }`, { slug });

  if (!page) return fallbackPages.find((item) => item.slug === slug) || null;

  return {
    ...page,
    heroImage: imageUrl(page.heroImage),
    blocks: page.blocks?.map(mapPageBlock)
  } as PageContent;
}

export async function getAllPageSlugs(): Promise<string[]> {
  const slugs = await fetchOrNull<string[]>(`*[_type == "page" && defined(slug.current)][].slug.current`);
  const fallbackSlugs = fallbackPages.map((page) => page.slug);
  return Array.from(new Set([...(slugs || []), ...fallbackSlugs]));
}
