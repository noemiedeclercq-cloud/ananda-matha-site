# Studio simplifié

Ce Studio Sanity est organisé pour des éditrices non techniques. L’objectif est de remplacer l’impression de “base de données” par une petite administration calme et visuelle.

## Structure

```text
src/sanity/
  config.ts
  studio/
    structure.ts
    components/
      ColorSwatchInput.tsx
      FriendlyDocumentInput.tsx
      FriendlyImageInput.tsx
      ScheduleTextInput.tsx
      StudioHelp.tsx
      StudioNote.tsx
      VisualArrayInput.tsx
  schemas/
    galleryItem.ts
    homePage.ts
    navigation.ts
    navigationItem.ts
    objects.ts
    page.ts
    siteSettings.ts
```

## Expérience éditoriale

- **Modifier la page d’accueil** : grande image, titre, trois phrases, cartes et horaires.
- **Coordonnées, logo et couleurs** : identité, contact, palette et footer.
- **Menu principal** : liens visibles dans le header, réordonnables par glisser-déposer.
- **Pages du site** : contenu riche avec barre d’outils réduite.
- **Galerie photos** : une fiche simple par photo avec légende et texte alternatif.
- **Aide** : rappels courts directement dans le Studio.

## Exemples inclus

- Homepage editor : `homePage.ts`
- Hero section editor : groupe “Grande image d’accueil” dans `homePage.ts`
- Gallery manager : `galleryItem.ts`
- Contact information editor : groupe “Coordonnées” dans `siteSettings.ts`
- Schedule/opening hours editor : `ScheduleTextInput.tsx`
- Navigation editor : singleton `navigation.ts`

## Accessibilité

- Libellés français explicites.
- Descriptions courtes sur les champs sensibles.
- Messages de validation compréhensibles.
- Espacement plus généreux grâce aux composants `@sanity/ui`.
- Éditeur riche limité aux styles nécessaires.
- Champ image accompagné d’aide pour le recadrage et le choix des formats.
- Champ couleur avec grands échantillons cliquables.

## Notes techniques

Les documents singletons sont :

- `homePage`
- `siteSettings`
- `navigation`

Ils sont ouverts directement depuis la structure du Studio et retirés du menu “nouveau document” pour éviter les doublons.

Les anciens documents `navigationItem` sont conservés et masqués pour compatibilité. Le site lit d’abord le nouveau singleton `navigation`, puis retombe sur les anciens liens si nécessaire.
