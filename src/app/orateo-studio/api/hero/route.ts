import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

type HeroButtonPayload = {
  id?: string;
  label?: string;
  destination?: string;
  color?: string;
  enabled?: boolean;
};

type PageReference = {
  _id: string;
  title?: string;
  slug?: string;
};

const allowedOverlayStrengths = new Set(["none", "light", "medium", "strong"]);

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanKey(value: string, index: number) {
  const key = value.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").slice(0, 80);
  return key || `hero-button-${index + 1}`;
}

function normalizePath(value: string) {
  if (!value) return "/";
  if (/^(https?:|mailto:|tel:)/.test(value)) return value;
  return value.startsWith("/") ? value : `/${value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function mapButtonToSanity(button: HeroButtonPayload, index: number, pages: PageReference[]) {
  const label = cleanText(button.label) || `Bouton ${index + 1}`;
  const destination = cleanText(button.destination) || "Home";
  const matchingPage = pages.find((page) => {
    const normalizedDestination = destination.toLowerCase();
    return (
      page.title?.toLowerCase() === normalizedDestination ||
      page.slug?.toLowerCase() === normalizedDestination ||
      `/${page.slug}`.toLowerCase() === normalizedDestination
    );
  });

  return {
    _key: cleanKey(button.id || label, index),
    _type: "actionButton",
    enabled: button.enabled !== false,
    backgroundColor: cleanText(button.color) || "#173f2d",
    style: "primary",
    link: matchingPage
      ? {
          _type: "link",
          label,
          type: "internal",
          internalPage: {
            _type: "reference",
            _ref: matchingPage._id
          }
        }
      : {
          _type: "link",
          label,
          type: "external",
          externalUrl: normalizePath(destination)
        }
  };
}

export async function POST(request: Request) {
  if (!isSanityConfigured) {
    return NextResponse.json({ error: "Sanity n'est pas configure pour ce projet." }, { status: 400 });
  }

  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Ajoutez SANITY_API_WRITE_TOKEN pour publier le Hero depuis OraTeo Studio." },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => null);
  const hero = body?.hero;
  if (!hero || typeof hero !== "object") {
    return NextResponse.json({ error: "Contenu Hero invalide." }, { status: 400 });
  }

  const overlayStrength = allowedOverlayStrengths.has(hero.overlayStrength)
    ? hero.overlayStrength
    : "light";

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "published"
  });

  const pages = await writeClient.fetch<PageReference[]>(
    `*[_type == "page"]{_id, title, "slug": slug.current}`
  );
  const buttons = Array.isArray(hero.buttons)
    ? hero.buttons.map((button: HeroButtonPayload, index: number) =>
        mapButtonToSanity(button, index, pages)
      )
    : [];

  const patch = {
    heroTitle: cleanText(hero.title),
    heroSubtitle: cleanText(hero.intro),
    heroOverlayStrength: overlayStrength,
    heroButtons: buttons
  };

  try {
    const result = await writeClient.patch("homePage").set(patch).commit();
    return NextResponse.json({
      ok: true,
      documentId: result._id,
      sent: patch
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur Sanity inconnue.";
    return NextResponse.json({ error: message, sent: patch }, { status: 500 });
  }
}
