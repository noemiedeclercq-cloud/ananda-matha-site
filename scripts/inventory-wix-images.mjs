const pages = [
  { label: "Home", url: "https://www.anandamathamonastery.in/" },
  { label: "Who are we ?", url: "https://www.anandamathamonastery.in/who-are-we" },
  { label: "Cistercian order", url: "https://www.anandamathamonastery.in/cistercian-order" },
  { label: "Our story", url: "https://www.anandamathamonastery.in/our-story" },
  { label: "Monastic life", url: "https://www.anandamathamonastery.in/monastic-life" },
  { label: "How to become", url: "https://www.anandamathamonastery.in/who-are-we/howtobecome" },
  { label: "Pictures", url: "https://www.anandamathamonastery.in/pictures" },
  { label: "Hospitality", url: "https://www.anandamathamonastery.in/copie-de-acces" },
  { label: "Access", url: "https://www.anandamathamonastery.in/acces" },
  { label: "Contact", url: "https://www.anandamathamonastery.in/contact-1" }
];

function decodeHtml(value) {
  return value
    .replace(/\\u002F/g, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeWixImageUrl(rawUrl) {
  const decoded = decodeHtml(rawUrl);
  const withoutQuery = decoded.split(/[?#]/)[0];
  const match = withoutQuery.match(
    /^https:\/\/static\.wixstatic\.com\/media\/([^/"')\s]+)/
  );

  if (!match) return null;

  return `https://static.wixstatic.com/media/${match[1].replace(/%7E/gi, "~")}`;
}

function fileNameFromUrl(url) {
  const encoded = url.split("/").pop() || "wix-image";
  try {
    return decodeURIComponent(encoded);
  } catch {
    return encoded;
  }
}

function extractImages(html) {
  const decoded = decodeHtml(html);
  const candidates = new Set();
  const patterns = [
    /https:\/\/static\.wixstatic\.com\/media\/[^"'\\)\]\s]+/g,
    /https:\\\/\\\/static\.wixstatic\.com\\\/media\\\/[^"'\\)\]\s]+/g
  ];

  for (const pattern of patterns) {
    for (const match of decoded.matchAll(pattern)) {
      const normalized = normalizeWixImageUrl(match[0]);
      if (normalized) candidates.add(normalized);
    }
  }

  return [...candidates].sort();
}

async function fetchPage(page) {
  const response = await fetch(page.url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AnandaMathaMediaInventory/1.0; +https://www.anandamathamonastery.in/)"
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
}

const globalImages = new Map();
const pageResults = [];

for (const page of pages) {
  try {
    const html = await fetchPage(page);
    const images = extractImages(html).map((url) => ({
      url,
      fileName: fileNameFromUrl(url)
    }));

    pageResults.push({ ...page, ok: true, images });

    for (const image of images) {
      const existing = globalImages.get(image.url) || {
        ...image,
        pages: []
      };
      existing.pages.push(page.label);
      globalImages.set(image.url, existing);
    }
  } catch (error) {
    pageResults.push({
      ...page,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      images: []
    });
  }
}

const uniqueImages = [...globalImages.values()].sort((a, b) =>
  a.fileName.localeCompare(b.fileName)
);

console.log(
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: "https://www.anandamathamonastery.in/",
      pages: pageResults,
      uniqueImages
    },
    null,
    2
  )
);
