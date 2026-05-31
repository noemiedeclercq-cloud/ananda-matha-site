# Studio OraTeo prototype

Route locale : `/orateo-studio`

## Fonctionnel en phase 1

- Navigation visuelle en français pour Accueil, Pages du site, Menu principal, Galerie photos, Documents PDF, Apparence, Contact et Paramètres.
- Page Accueil organisée en blocs repliables : Hero, Diaporama, Cartes rapides, Our Story, Citation et Contact.
- Édition locale du titre de bienvenue, du texte d'introduction, des photos du diaporama et des boutons d'action.
- Gestionnaire de photos avec ajout local, suppression locale, ordre visuel et glisser-déposer.
- Gestionnaire de boutons avec texte, destination, couleur et activation.
- Aperçu de la page d'accueil mis à jour en direct avec un mode aperçu large.
- Un seul indicateur "Prototype local" dans le header.
- Brouillon local conservé dans le navigateur : enregistrer, annuler les changements et restaurer au rechargement.
- Lecture seule Sanity quand le projet est configuré : accueil, pages, menu, galerie, PDF, couleurs et contact.
- Indicateur de source : "Connecté à Sanity" ou "Données de démonstration".

## Données utilisées

- Le prototype lit les contenus de repli existants depuis `src/lib/fallbacks.ts`.
- Quand Sanity est configuré, le prototype lit les documents existants via `services/sanity/readOnly.ts`.
- Aucune modification n'est encore envoyée à Sanity.
- Les boutons, cartes rapides, actions d'ajout/suppression, ordre des photos et sélections de liens sont simulés en local dans le navigateur.
- Le brouillon local est sauvegardé temporairement dans `localStorage`, sans modifier le site public.
- La publication est désactivée dans cette étape.

## Prochain branchement Sanity

1. Lire les documents Sanity réels de la page d'accueil au chargement de la route.
2. Remplacer l'état local par un brouillon persistant.
3. Connecter le bouton "Publier les changements" à une mutation Sanity avec validation.
4. Brancher la médiathèque sur les assets Sanity pour ajouter et supprimer de vraies images.
5. Brancher les liens intelligents sur les pages, documents PDF, emails et téléphones existants.
