# Ananda Matha Monastery

Modern rebuild of `https://www.anandamathamonastery.in/` outside Wix, using Next.js App Router, TypeScript, Tailwind CSS, and Sanity Studio at `/studio`.

## Installation

```bash
npm install
```

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-18
```

If Sanity is not configured yet, the public site still works with fallback content inspired by the current Wix structure and text.

## Local Development

```bash
npm run dev
```

Open `http://127.0.0.1:3000`.

## Studio

The Sanity Studio is integrated in the app:

```text
http://127.0.0.1:3000/studio
```

Editable content models:

- Site Settings
- Home Page
- Page
- Navigation Item
- Media / Gallery Item

The Studio has been simplified for non-technical editors. See `STUDIO_GUIDE.md`
for the custom Studio structure, French labels, singleton documents, image
helpers, color swatches, visual arrays, and accessibility notes.

## Content

The site uses Sanity for all editable texts, images, buttons, navigation, contact details, visiting hours, page bodies, and footer content. Fallbacks live in `src/lib/fallbacks.ts` so the site can render before the CMS is populated.

## Deployment on Vercel

Temporary deployment only. Do **not** configure `anandamathamonastery.in` yet.
The current Wix site must remain online during development and testing.

Target temporary URL:

```text
https://ananda-matha-monastery.vercel.app
```

1. Push the project to GitHub.
2. Import the repository in Vercel with the Next.js framework preset.
3. Add the Sanity environment variables from `.env.example`.
4. Do not add a custom domain.
5. Deploy and test on the temporary Vercel URL.

See `VERCEL_DEPLOYMENT.md` for the full temporary deployment checklist.

Sanity images are configured for `next/image`, along with temporary external fallback images. Once real monastery images are uploaded in Sanity, the site will use those automatically.
