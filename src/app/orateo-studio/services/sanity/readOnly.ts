import { fallbackHome } from "@/lib/fallbacks";
import { getHomePage, getNavigation, getSiteSettings } from "@/sanity/queries";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlForImage } from "@/sanity/image";
import {
  createDemoStudioData,
  mapColors,
  mapGallery,
  mapHomeToDraft,
  mapMenuItems,
  mapPagesToSummaries,
  mapPdfs
} from "./adapters";
import type { OraTeoStudioData } from "./types";

async function fetchOrEmpty<T>(query: string) {
  if (!isSanityConfigured) return [];

  try {
    return await client.fetch<T[]>(query, {}, { cache: "no-store" });
  } catch {
    return [];
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

export async function getOraTeoStudioData(): Promise<OraTeoStudioData> {
  if (!isSanityConfigured) {
    return createDemoStudioData();
  }

  const [home, navigation, settings, pages, galleryItems, pdfItems] = await Promise.all([
    getHomePage(),
    getNavigation(),
    getSiteSettings(),
    fetchOrEmpty<Record<string, any>>(`*[_type == "page"] | order(title asc){
      _id,
      _updatedAt,
      title,
      "slug": slug.current,
      heroImage,
      body,
      blocks[]{
        _type,
        content,
        _type == "pageButtonBlock" => {
          buttons[]{
            enabled,
            backgroundColor,
            textColor,
            style,
            "link": link{
              label,
              type,
              "internalPage": internalPage->{title},
              externalUrl,
              email,
              phone
            }
          }
        }
      },
      "buttons": blocks[_type == "pageButtonBlock"].buttons[],
      "pdfs": blocks[_type == "pagePdfBlock"]{
        _key,
        title,
        "fileName": file.asset->originalFilename,
        "url": file.asset->url
      }
    }`),
    fetchOrEmpty<Record<string, any>>(`*[_type == "galleryItem"] | order(_updatedAt desc){
      _id,
      title,
      alt,
      caption,
      image
    }`),
    fetchOrEmpty<Record<string, any>>(`*[_type == "page" && defined(blocks)]{
      title,
      _updatedAt,
      blocks[_type == "pagePdfBlock"]{
        _key,
        title,
        "fileName": file.asset->originalFilename,
        "url": file.asset->url
      }
    }`)
  ]);

  const gallery = mapGallery(
    galleryItems.map((item) => ({
      ...item,
      image: imageUrl(item.image, fallbackHome.heroImage)
    }))
  );

  const pdfs = mapPdfs(
    pdfItems.flatMap((page) =>
      (page.blocks || []).map((block: Record<string, any>) => ({
        ...block,
        pageTitle: page.title,
        updatedAt: page._updatedAt
      }))
    )
  );

  return {
    source: "sanity",
    home: mapHomeToDraft(home),
    pages: mapPagesToSummaries(
      pages.map((page) => ({
        ...page,
        heroImage: imageUrl(page.heroImage, fallbackHome.heroImage)
      }))
    ),
    menu: mapMenuItems(navigation),
    gallery,
    pdfs,
    colors: mapColors(settings),
    contact: {
      email: settings.contactEmail,
      phone: settings.phone,
      address: settings.address
    },
    documentsUsed: [
      "Page d'accueil",
      "Pages du site",
      "Menu principal",
      "Coordonnées, logo et couleurs",
      "Photos de la galerie",
      "Blocs PDF des pages"
    ]
  };
}
