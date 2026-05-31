# Studio OraTeo prototype

Route locale : `/orateo-studio`

## Fonctionnel en phase 1

- Navigation visuelle en français pour Accueil, Pages, Menus, Photos, Documents, Apparence, Contact et Paramètres.
- Édition locale du titre de bienvenue, du texte d'introduction, des photos du diaporama et des boutons d'action.
- Aperçu de la page d'accueil mis à jour en direct dans le panneau de droite.
- Cartes rapides et section Our Story affichées sous forme modifiable pour valider l'ergonomie.
- Badges discrets "Prototype - non connecté" sur les zones qui ne modifient pas encore Sanity.

## Données utilisées

- Le prototype lit les contenus de repli existants depuis `src/lib/fallbacks.ts`.
- Aucune modification n'est encore envoyée à Sanity.
- Les boutons, cartes rapides, actions d'ajout/suppression et sélections de liens sont simulés en local dans le navigateur.

## Prochain branchement Sanity

1. Lire les documents Sanity réels de la page d'accueil au chargement de la route.
2. Remplacer l'état local par un brouillon persistant.
3. Connecter le bouton "Publier les changements" à une mutation Sanity avec validation.
4. Brancher la médiathèque sur les assets Sanity pour ajouter et supprimer de vraies images.
5. Brancher les liens intelligents sur les pages, documents PDF, emails et téléphones existants.
