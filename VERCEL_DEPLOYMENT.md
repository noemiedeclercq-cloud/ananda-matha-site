# Deploiement temporaire Vercel

Important : ne pas toucher au domaine actuel `anandamathamonastery.in`.

Le site Wix actuel doit rester en ligne pendant toute la phase de developpement
et de test. Le nouveau site doit etre deploye uniquement sur une URL temporaire
Vercel, par exemple :

```text
https://ananda-matha-monastery.vercel.app
```

## Configuration Vercel standard

Dans Vercel :

- Framework Preset : `Next.js`
- Root Directory : `.`
- Install Command : `npm install`
- Build Command : `npm run build`
- Output Directory : laisser vide
- Domains : ne rien ajouter pour l'instant

Le fichier `vercel.json` force seulement le preset `nextjs`. Il ne configure
aucun domaine personnalise.

## Variables d'environnement a ajouter dans Vercel

Production, Preview et Development :

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=zslch3x7
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-18
NEXT_PUBLIC_SITE_URL=https://ananda-matha-monastery.vercel.app
```

## Sanity CORS

L'URL temporaire Vercel doit etre autorisee dans Sanity :

```bash
npx sanity cors add https://ananda-matha-monastery.vercel.app --credentials
```

Cette configuration ne modifie pas le DNS et ne touche pas au domaine Wix
actuel.

## Checklist avant test

- Le site Wix reste disponible sur `anandamathamonastery.in`.
- Le nouveau site est teste sur `ananda-matha-monastery.vercel.app`.
- Aucun domaine personnalise n'est ajoute dans Vercel.
- Les variables Sanity sont presentes dans Vercel.
- Le Studio `/studio` est teste sur l'URL temporaire.
