# Studio OraTeo prototype

Route locale : `/orateo-studio`

## Fonctionnel

- Navigation visuelle en francais pour Accueil, Pages du site, Menu principal, Galerie photos, Documents PDF, Apparence, Contact et Parametres.
- Page Accueil organisee en blocs repliables : Hero, Diaporama, Cartes rapides, Our Story, Citation et Contact.
- Edition locale du titre de bienvenue, du texte d'introduction, des photos du diaporama et des boutons d'action.
- Reglage du voile de la photo Hero : aucun, leger, moyen ou fort.
- Gestionnaire de photos avec ajout local, suppression locale, ordre visuel et glisser-deposer.
- Gestionnaire de boutons avec texte, destination, couleur et activation.
- Apercu de la page d'accueil mis a jour en direct avec un mode apercu large.
- Brouillon local conserve dans le navigateur : enregistrer, annuler les changements et restaurer au rechargement.
- Lecture Sanity quand le projet est configure : accueil, pages, menu, galerie, PDF, couleurs et contact.
- Publication Sanity limitee au bloc Hero : titre, texte, boutons et voile uniquement.

## Donnees utilisees

- Le prototype lit les contenus de repli existants depuis `src/lib/fallbacks.ts`.
- Quand Sanity est configure, le prototype lit les documents existants via `services/sanity/readOnly.ts`.
- Le bloc Hero peut publier dans Sanity via la route serveur `/orateo-studio/api/hero`.
- Les photos, cartes rapides, actions d'ajout/suppression, ordre des photos et selections de liens hors Hero restent locales dans le navigateur.
- Le brouillon local est sauvegarde temporairement dans `localStorage`, sans modifier le site public.
- L'upload des images vers Sanity n'est pas encore active.

## Prochain branchement Sanity

1. Ajouter une validation plus fine avant publication.
2. Brancher la mediatheque sur les assets Sanity pour ajouter et supprimer de vraies images.
3. Brancher les liens intelligents sur les pages, documents PDF, emails et telephones existants.
4. Etendre la publication aux autres blocs seulement apres validation du CRUD local.
