# New project - index de travail

Ce dossier est actuellement un dossier parent en cours de stabilisation.

Regle importante : **Retreato et AnandaMatha sont deux projets differents**.

- Retreato = plateforme type "Airbnb des monasteres" pour des sejours en monasteres.
- AnandaMatha = site/projet specifique pour le monastere Ananda Matha.

La separation complete de Retreato et AnandaMatha n'est pas encore faite. Pour
l'instant, la racine reste une application hybride qui contient des fichiers des
deux projets.

## Structure actuelle

```text
C:\Users\noemi\Documents\New project
|-- _active
|   |-- Monastik5
|   `-- PastoPlus
|-- _archives
|   |-- old-builds
|   |-- old-hospitia-vite
|   |-- old-logs
|   `-- old-root-vue-pastoplus-copy
|-- _notes
|-- _shared-assets
`-- racine hybride actuelle : Retreato + AnandaMatha
```

## Projets actifs

### _active/Monastik5

Projet autonome Flask / Python / PostgreSQL.

Role probable : application SaaS multi-abbayes pour reservations, chambres,
salles, refectoire, cuisine, agenda et administration plateforme.

Commande locale probable :

```powershell
cd "C:\Users\noemi\Documents\New project\_active\Monastik5"
python app.py
```

Commande production indiquee par le projet :

```text
gunicorn app:app
```

### _active/PastoPlus

Projet autonome Vue 3 / Vite.

Role probable : application pastorale mobile avec parcours, prieres, quiz,
agenda et studio local.

Commande locale probable :

```powershell
cd "C:\Users\noemi\Documents\New project\_active\PastoPlus"
npm run dev
```

### Racine hybride actuelle : Retreato + AnandaMatha

La racine contient encore deux projets differents dans la meme app Next.js.

Retreato, cote plateforme :

- `package.json`
- `payload.config.ts`
- `retreato.db`
- `src/app/(site)`
- `src/app/(payload)`
- `src/lib/retreato-data.ts`
- `src/payload`
- `scripts/seed-payload.ts`
- `scripts/check-payload.ts`

AnandaMatha, cote site monastique :

- `README.md`
- `STUDIO_GUIDE.md`
- `VERCEL_DEPLOYMENT.md`
- `sanity.config.ts`
- `sanity.cli.ts`
- `src/app/studio`
- `src/sanity`
- `src/lib/fallbacks.ts`
- `src/lib/types.ts`
- `scripts/sanity-seed.json`
- `public/images`
- composants TSX Ananda dans `src/components`

Commande locale actuelle de la racine hybride :

```powershell
cd "C:\Users\noemi\Documents\New project"
npm run dev
```

Note d'etat : quelques elements legacy ou generes sont encore presents a la
racine et n'ont pas encore ete deplaces, notamment `src/components/*.vue`,
`dist`, `.next`, `tsconfig.tsbuildinfo` et plusieurs fichiers `*.log`. Ils
seront traites seulement dans une etape de nettoyage ulterieure.

## Archives

### _archives/old-hospitia-vite

Ancien prototype Vue / Vite Hospitia. Archive uniquement.

### _archives/old-root-vue-pastoplus-copy

Ancienne copie Vue/PastoPlus qui se trouvait dans la racine. Archive uniquement.
Le projet actif PastoPlus est dans `_active/PastoPlus`.

### _archives/old-builds

Reserve pour les builds generes et caches de build. Ne pas considerer comme
source projet.

### _archives/old-logs

Reserve pour les logs de serveurs/dev. Ne pas considerer comme source projet.

## Dossiers de support

### _notes

Reserve pour les notes d'audit, plans de separation et decisions de rangement.

### _shared-assets

Reserve pour des ressources partagees eventuelles. A ne pas utiliser tant que
la separation Retreato / AnandaMatha n'est pas clarifiee.

## Plan technique futur, non execute

Objectif futur : obtenir deux projets autonomes distincts.

### _active/Retreato

Contenu cible :

- `package.json` adapte a Retreato
- `package-lock.json`
- `next.config.ts` avec Payload
- `postcss.config.mjs`
- `tsconfig.json`
- `next-env.d.ts`
- `payload.config.ts`
- `retreato.db`
- `src/app/layout.tsx`
- `src/app/(site)`
- `src/app/(payload)`
- `src/lib/retreato-data.ts`
- `src/payload`
- `src/payload-types.ts`
- `src/styles/globals.css`
- `scripts/seed-payload.ts`
- `scripts/check-payload.ts`
- variables d'environnement Payload/Retreato separees

Etapes prudentes :

1. Copier ou deplacer le bloc Retreato dans `_active/Retreato`.
2. Adapter uniquement les chemins si necessaire.
3. Retirer Sanity seulement apres verification.
4. Lancer `npm install` si necessaire.
5. Verifier `npm run dev`, puis `npm run build`.

### _active/AnandaMatha

Contenu cible :

- `package.json` adapte a AnandaMatha
- `next.config.ts` sans Payload si Payload n'est pas utilise
- `postcss.config.mjs`
- `tsconfig.json`
- `next-env.d.ts`
- `sanity.config.ts`
- `sanity.cli.ts`
- `src/app/studio`
- routes publiques AnandaMatha a restaurer ou reconstruire
- `src/sanity`
- `src/lib/fallbacks.ts`
- `src/lib/types.ts`
- composants TSX Ananda
- `public/images`
- `scripts/sanity-seed.json`
- variables d'environnement Sanity/AnandaMatha separees

Etapes prudentes :

1. Creer `_active/AnandaMatha` comme projet Next/Sanity autonome.
2. Y placer le bloc Sanity, les fallbacks, les composants et les images.
3. Reconstituer les routes publiques AnandaMatha sans melanger Retreato.
4. Configurer `.env.local` avec seulement les variables Sanity.
5. Verifier `/` puis `/studio`.
6. Deployer uniquement sur une URL temporaire tant que le site Wix existant doit
   rester en ligne.

Rappel : ne pas fusionner Retreato et AnandaMatha. Ce sont deux produits
distincts et leur separation complete reste a faire dans une etape ulterieure.
