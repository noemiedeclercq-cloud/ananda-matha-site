# Ananda Matha Monastery - index du projet

Ce depot contient uniquement le nouveau site public Ananda Matha Monastery avec
Sanity Studio integre.

## Application

- Next.js App Router
- TypeScript
- Tailwind CSS
- Sanity CMS
- Studio integre sur `/studio`
- Deploiement prevu sur une URL temporaire Vercel

## Structure principale

```text
C:\Users\noemi\Documents\New project
|-- public/images
|-- scripts/sanity-seed.json
|-- src/app
|   |-- (site)
|   `-- studio
|-- src/components
|-- src/lib
|-- src/sanity
|-- src/styles
|-- sanity.cli.ts
|-- sanity.config.ts
|-- next.config.ts
`-- vercel.json
```

## Contenus modifies dans Sanity

Le site public lit les documents publies suivants :

- `siteSettings` : titre, sous-titre, logo, couleurs, coordonnees et footer
- `homePage` : hero, sections, cartes, horaires et invitation
- `navigation` : menu principal visible dans le header et le footer
- `page` : pages publiques dynamiques
- `galleryItem` : galerie photos

## Comportement attendu

Apres publication dans Sanity et rechargement du site :

- le header affiche le titre, le sous-titre et le logo du document
  `siteSettings`
- les couleurs du site viennent du bloc `theme` de `siteSettings`
- le menu public vient du document `navigation`
- la page d'accueil vient du document `homePage`
- si Sanity est vide ou indisponible, le site utilise des fallbacks Ananda Matha

## Deploiement

Le deploiement de test doit rester sur une URL temporaire Vercel, par exemple :

```text
https://ananda-matha-monastery.vercel.app
```

Ne pas configurer de domaine personnalise pendant la phase de test.
