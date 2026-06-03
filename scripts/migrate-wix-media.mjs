import { createClient } from "next-sanity";

const env = Object.fromEntries(
  (await import("node:fs"))
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    })
);

const token = process.env.SANITY_API_WRITE_TOKEN || env.SANITY_API_WRITE_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-18";

if (!token) {
  console.error("SANITY_API_WRITE_TOKEN manquant. Aucun upload effectue.");
  process.exit(1);
}

if (!projectId) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID manquant. Aucun upload effectue.");
  process.exit(1);
}

const images = {
  logo: "https://static.wixstatic.com/media/8c2976_580fb33a6a0a4ac99c998c5c2ba4f1a0~mv2.png",
  common: "https://static.wixstatic.com/media/8c2976_ccba1135799f401fb12a4f981a6e8682~mv2.jpg",
  homeHero1: "https://static.wixstatic.com/media/8c2976_79948276549846e5ac58a067e1630230~mv2.jpg",
  homeHero2: "https://static.wixstatic.com/media/8c2976_9b3f0e0fa58747c2915b650f5c6da292~mv2.jpg",
  homeHero3: "https://static.wixstatic.com/media/8c2976_f2fa4dd1d5cf49359816834fd9400358~mv2.jpg",
  whoAreWe: "https://static.wixstatic.com/media/8c2976_56d5b433d7d44a6f80d7e41fde204892~mv2.jpg",
  accessShared: "https://static.wixstatic.com/media/8c2976_6711dcb0c67a436e8b9d4ed9f6dbb42b~mv2.jpg",
  cistercian1: "https://static.wixstatic.com/media/8c2976_83ea2aeb5e1849979df72424ce396077~mv2.jpg",
  cistercian2: "https://static.wixstatic.com/media/8c2976_b41e5b1538f64c7d814363dd195269b1~mv2.jpg",
  cistercian3: "https://static.wixstatic.com/media/8c2976_e1e826027fa8405b9f2498d455e2c103~mv2.jpg",
  ourStory: "https://static.wixstatic.com/media/8c2976_1c2cacd23fa84268a58f1e48f088862c~mv2.jpg",
  monastic1: "https://static.wixstatic.com/media/8c2976_26be481979004f25b3f281c1737dbd17~mv2.jpg",
  monastic2: "https://static.wixstatic.com/media/8c2976_3d05354647a2446992a005d6adedf48b~mv2.jpg",
  monastic3: "https://static.wixstatic.com/media/8c2976_5383762d9f634ea799068c32a07a34b9~mv2.jpg",
  monastic4: "https://static.wixstatic.com/media/8c2976_575016970e2f4538a85834dca1c1830b~mv2.jpg",
  monastic5: "https://static.wixstatic.com/media/8c2976_a6fe13c66003489392410616c3f62b0c~mv2.jpg",
  become1: "https://static.wixstatic.com/media/8c2976_12be3e2d08a74ed08b044eadd5fca264~mv2.jpg",
  become2: "https://static.wixstatic.com/media/8c2976_418c4115b4c048c4aae911607c7deddc~mv2.jpg",
  hospitality1: "https://static.wixstatic.com/media/8c2976_31926dd0e8ce4939b7e41b5580f7eabd~mv2.jpg",
  hospitality2: "https://static.wixstatic.com/media/8c2976_7b26df17c01346b288e74dd76935dd4e~mv2.jpg",
  hospitality3: "https://static.wixstatic.com/media/8c2976_84977c0987d941cb85d6d756dcd4e104~mv2.jpg",
  hospitality4: "https://static.wixstatic.com/media/8c2976_b1867a0e3be44c9fad2f31fb07debc15~mv2.jpg",
  access1: "https://static.wixstatic.com/media/8c2976_3f15846524b54f37848a0641e11db39b~mv2.jpg",
  access2: "https://static.wixstatic.com/media/8c2976_5935a29b776047ab9f11fc20a86de08a~mv2.jpg",
  picture1: "https://static.wixstatic.com/media/8c2976_09aa16f4646e449085ec70645c03d6b8~mv2.jpg",
  picture2: "https://static.wixstatic.com/media/8c2976_133df7c6f7e2493c89d9451bf295fd49~mv2.jpg",
  picture3: "https://static.wixstatic.com/media/8c2976_19e52313fd4f46fca0c2452a6a67bc52~mv2.jpg",
  picture4: "https://static.wixstatic.com/media/8c2976_274d39505188445aa068779b864348e2~mv2.jpg",
  picture5: "https://static.wixstatic.com/media/8c2976_7db5ada82af749af93a1feba2c7d491a~mv2.jpg",
  picture6: "https://static.wixstatic.com/media/8c2976_a090020a8f184329a5db67fff78ae5eb~mv2.jpg",
  picture7: "https://static.wixstatic.com/media/8c2976_a160c13512a246b3ab7376ab07d4fb6c~mv2.jpg",
  picture8: "https://static.wixstatic.com/media/8c2976_b57f68256d064a46964ea2dccb41ea2f~mv2.jpg",
  picture9: "https://static.wixstatic.com/media/8c2976_c08b4a747efb44f6a11f53452f8b5ac3~mv2.jpg",
  picture10: "https://static.wixstatic.com/media/8c2976_c84ef8eb95a640428540fbcdfe140be0~mv2.jpg"
};

const pageHeroMap = {
  "who-are-we": "whoAreWe",
  "cistercian-order": "cistercian1",
  "our-story": "ourStory",
  "monastic-life": "monastic2",
  "how-to-become": "become1",
  pictures: "picture1",
  hospitality: "hospitality1",
  access: "access1",
  contact: "common"
};

const galleryPlan = [
  ["Prayer and community", "picture1"],
  ["Monastery life", "picture2"],
  ["Kerala landscape", "picture3"],
  ["Monastic work", "picture4"],
  ["Cistercian simplicity", "picture5"],
  ["Community gathering", "picture6"],
  ["Prayerful silence", "picture7"],
  ["Hospitality", "picture8"],
  ["Garden and work", "picture9"],
  ["Ananda Matha", "picture10"],
  ["Our Story", "ourStory"],
  ["Monastic Life", "monastic2"],
  ["Hospitality house", "hospitality2"],
  ["Access road", "access2"]
];

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false
});

function filenameFromUrl(url) {
  return decodeURIComponent(url.split("/").pop() || "wix-image");
}

function imageRef(assetId) {
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: assetId
    }
  };
}

function keyFromTitle(title, index) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${index + 1}`;
}

async function uploadImage(name, url) {
  const filename = filenameFromUrl(url);
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}`,
    { filename }
  );

  if (existing?._id) {
    return { name, url, filename, assetId: existing._id, reused: true };
  }

  let response;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(url);
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 800));
      }
    }
  }

  if (!response?.ok) {
    throw lastError || new Error("Image fetch failed");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, { filename });

  return { name, url, filename, assetId: asset._id, reused: false };
}

const uploaded = {};
const failed = [];

for (const [name, url] of Object.entries(images)) {
  try {
    uploaded[name] = await uploadImage(name, url);
  } catch (error) {
    failed.push({
      name,
      url,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

function requireAsset(name) {
  const item = uploaded[name];
  if (!item?.assetId) {
    throw new Error(`Asset manquant pour ${name}`);
  }
  return imageRef(item.assetId);
}

const updatedPages = [];

{
  const currentHome = await client.fetch(`*[_id == "homePage"][0]{cards}`);
  const cardImageKeys = ["ourStory", "monastic2", "hospitality1", "access1"];
  const cards = Array.isArray(currentHome?.cards)
    ? currentHome.cards.map((card, index) => ({
        ...card,
        frontImage: requireAsset(cardImageKeys[index % cardImageKeys.length]),
        backImage: requireAsset(cardImageKeys[index % cardImageKeys.length])
      }))
    : undefined;

  await client.patch("siteSettings").set({ logo: requireAsset("logo") }).commit();

  await client
    .patch("homePage")
    .set({
      heroImage: requireAsset("homeHero1"),
      heroSlides: [
        {
          _key: "wix-hero-1",
          _type: "heroSlide",
          image: requireAsset("homeHero1"),
          alt: "Ananda Matha Monastery"
        },
        {
          _key: "wix-hero-2",
          _type: "heroSlide",
          image: requireAsset("homeHero3"),
          alt: "The monastery in Kerala"
        },
        {
          _key: "wix-hero-3",
          _type: "heroSlide",
          image: requireAsset("common"),
          alt: "Monastic life at Ananda Matha"
        }
      ],
      "story.image": requireAsset("ourStory"),
      photoBands: [
        {
          _key: "wix-band-1",
          _type: "homePhotoBand",
          image: requireAsset("monastic2"),
          alt: "Life and landscape around Ananda Matha",
          height: "large",
          overlay: false,
          caption: "Ananda Matha Monastery"
        },
        {
          _key: "wix-band-2",
          _type: "homePhotoBand",
          image: requireAsset("hospitality3"),
          alt: "Hospitality at Ananda Matha",
          height: "medium",
          overlay: false,
          caption: "Hospitality"
        }
      ],
      ...(cards ? { cards } : {})
    })
    .commit();

  for (const [slug, assetKey] of Object.entries(pageHeroMap)) {
    const pageId = await client.fetch(`*[_type == "page" && slug.current == $slug][0]._id`, {
      slug
    });
    if (pageId) {
      await client.patch(pageId).set({ heroImage: requireAsset(assetKey) }).commit();
      updatedPages.push(slug);
    }
  }

  for (const [index, [title, assetKey]] of galleryPlan.entries()) {
    if (!uploaded[assetKey]?.assetId) continue;

    const id = `gallery-wix-${keyFromTitle(title, index)}`;
    await client.createOrReplace({
      _id: id,
      _type: "galleryItem",
      title,
      image: requireAsset(assetKey),
      alt: title,
      caption: "Ananda Matha Monastery"
    });
  }
}

const uploadedItems = Object.values(uploaded);

console.log(
  JSON.stringify(
    {
      importedImages: uploadedItems.length,
      uploadedNew: uploadedItems.filter((item) => !item.reused).length,
      reusedExisting: uploadedItems.filter((item) => item.reused).length,
      failedImages: failed,
      updatedPages,
      galleryItemsCreatedOrReplaced: galleryPlan.filter(([, assetKey]) => uploaded[assetKey]?.assetId).length,
      homePageUpdated: true,
      siteSettingsLogoUpdated: true
    },
    null,
    2
  )
);
