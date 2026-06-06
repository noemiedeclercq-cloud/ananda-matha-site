import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";
import { urlForImage } from "@/sanity/image";

type IncomingSlide = {
  assetRef?: string;
  fileKey?: string;
  id?: string;
  label?: string;
};

function cleanText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function cleanKey(value: string, index: number) {
  const key = value
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return key || `hero-photo-${index + 1}`;
}

function friendlyError() {
  return NextResponse.json({ error: "Impossible de publier" }, { status: 500 });
}

export async function POST(request: Request) {
  if (!isSanityConfigured) {
    return NextResponse.json({ error: "Impossible de publier" }, { status: 400 });
  }

  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Impossible de publier" }, { status: 400 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Impossible de publier" }, { status: 400 });
  }

  const rawSlides = formData.get("slides");
  let slides: IncomingSlide[] = [];
  try {
    slides = typeof rawSlides === "string" ? (JSON.parse(rawSlides) as IncomingSlide[]) : [];
  } catch {
    return NextResponse.json({ error: "Impossible de publier" }, { status: 400 });
  }
  if (!Array.isArray(slides) || !slides.length) {
    return NextResponse.json({ error: "Ajoutez une photo" }, { status: 400 });
  }

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "published"
  });

  try {
    const nextSlides = await Promise.all(
      slides.map(async (slide, index) => {
        let assetRef = slide.assetRef;

        if (slide.fileKey) {
          const file = formData.get(slide.fileKey);
          if (!(file instanceof File)) {
            throw new Error("missing-file");
          }

          const buffer = Buffer.from(await file.arrayBuffer());
          const asset = await writeClient.assets.upload("image", buffer, {
            filename: file.name || `hero-photo-${index + 1}`
          });
          assetRef = asset._id;
        }

        if (!assetRef) {
          throw new Error("missing-image");
        }

        const label = cleanText(slide.label, `Photo ${index + 1}`);

        return {
          _key: cleanKey(slide.id || label, index),
          _type: "heroSlide",
          alt: label,
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: assetRef
            }
          }
        };
      })
    );

    await writeClient
      .patch("homePage")
      .set({
        heroImage: nextSlides[0]?.image,
        heroSlides: nextSlides
      })
      .commit();

    return NextResponse.json({
      ok: true,
      slides: nextSlides.map((slide) => ({
        assetRef: slide.image.asset._ref,
        id: slide._key,
        image: urlForImage(slide.image),
        label: slide.alt
      }))
    });
  } catch {
    return friendlyError();
  }
}
