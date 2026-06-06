import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";
import { urlForImage } from "@/sanity/image";

function simpleError(message = "Impossible de publier", status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!isSanityConfigured) {
    return simpleError("Impossible de publier", 400);
  }

  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
  if (!token) {
    return simpleError("Impossible de publier", 400);
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return simpleError("Impossible de publier", 400);
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
    let assetRef = formData.get("assetRef");
    const file = formData.get("image");

    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const asset = await writeClient.assets.upload("image", buffer, {
        filename: file.name || "our-story-image"
      });
      assetRef = asset._id;
    }

    if (typeof assetRef !== "string" || !assetRef) {
      return simpleError("Ajoutez une photo", 400);
    }

    const image = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: assetRef
      }
    };

    await writeClient.patch("homePage").set({ "story.image": image }).commit();

    return NextResponse.json({
      ok: true,
      assetRef,
      image: urlForImage(image)
    });
  } catch {
    return simpleError();
  }
}
