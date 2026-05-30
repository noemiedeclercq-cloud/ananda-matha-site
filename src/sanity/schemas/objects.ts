import { defineField, defineType } from "sanity";
import { ColorSwatchInput } from "../studio/components/ColorSwatchInput";
import { FriendlyImageInput } from "../studio/components/FriendlyImageInput";

const required = (message: string) => (Rule: any) => Rule.required().error(message);

export const link = defineType({
  name: "link",
  title: "Lien",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Texte du bouton ou du lien",
      type: "string",
      description: "Exemple : Read more, Contact us, Download PDF"
    }),
    defineField({
      name: "type",
      title: "Type de lien",
      type: "string",
      initialValue: "internal",
      options: {
        layout: "radio",
        list: [
          { title: "Page interne du site", value: "internal" },
          { title: "URL externe", value: "external" },
          { title: "Fichier ou PDF", value: "file" },
          { title: "Adresse email", value: "email" },
          { title: "Telephone", value: "phone" }
        ]
      },
      validation: required("Choisissez le type de lien.")
    }),
    defineField({
      name: "internalPage",
      title: "Page du site",
      type: "reference",
      to: [{ type: "page" }],
      description: "Choisissez une page existante, sans taper l'adresse.",
      hidden: ({ parent }) => parent?.type !== "internal"
    }),
    defineField({
      name: "externalUrl",
      title: "Adresse web externe",
      type: "url",
      hidden: ({ parent }) => parent?.type !== "external"
    }),
    defineField({
      name: "file",
      title: "Fichier ou PDF",
      type: "file",
      hidden: ({ parent }) => parent?.type !== "file"
    }),
    defineField({
      name: "email",
      title: "Adresse email",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "email",
      validation: (Rule) => Rule.email().warning("Verifiez l'adresse email.")
    }),
    defineField({
      name: "phone",
      title: "Numero de telephone",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "phone"
    }),
    defineField({
      name: "openInNewTab",
      title: "Ouvrir dans un nouvel onglet",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => !["internal", "external"].includes(parent?.type)
    })
  ],
  preview: {
    select: {
      label: "label",
      type: "type",
      pageTitle: "internalPage.title",
      externalUrl: "externalUrl",
      fileName: "file.asset.originalFilename",
      email: "email",
      phone: "phone"
    },
    prepare: ({ label, type, pageTitle, externalUrl, fileName, email, phone }) => {
      const destination =
        pageTitle || externalUrl || fileName || email || phone || "Lien a completer";
      return {
        title: label || "Lien",
        subtitle: `${type || "type"} - ${destination}`
      };
    }
  }
});

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Image du diaporama",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      components: { field: FriendlyImageInput },
      validation: required("Ajoutez une image pour cette diapositive.")
    }),
    defineField({
      name: "alt",
      title: "Texte alternatif",
      type: "string",
      description: "Courte description pour les lecteurs d'ecran.",
      validation: (Rule) =>
        Rule.required().warning("Ajoutez une description courte de l'image.")
    }),
    defineField({
      name: "caption",
      title: "Legende",
      type: "string",
      description: "Optionnel. Peut rester vide."
    })
  ],
  preview: {
    select: { title: "alt", subtitle: "caption", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Image du diaporama",
      subtitle: subtitle || "Photo d'accueil",
      media
    })
  }
});

export const heroSection = defineType({
  name: "heroSection",
  title: "Grande introduction de la page",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Grand titre",
      type: "string",
      validation: required("Ajoutez le grand titre affiche en haut de la page.")
    }),
    defineField({
      name: "subtitle",
      title: "Petit texte sous le titre",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "image",
      title: "Grande photo",
      type: "image",
      options: { hotspot: true },
      components: { field: FriendlyImageInput }
    }),
    defineField({
      name: "button",
      title: "Bouton",
      type: "link"
    })
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Grande introduction",
      subtitle: subtitle || "Titre, texte, image et bouton",
      media
    })
  }
});

export const valueStatement = defineType({
  name: "valueStatement",
  title: "Phrase spirituelle",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Petit symbole",
      type: "string",
      options: {
        list: [
          { title: "Etoile / lumiere", value: "sparkles" },
          { title: "Feuille / travail", value: "leaf" },
          { title: "Coeur / priere", value: "heart" }
        ],
        layout: "radio"
      }
    }),
    defineField({
      name: "title",
      title: "Phrase courte",
      type: "string",
      validation: required("Ajoutez une phrase courte.")
    }),
    defineField({
      name: "text",
      title: "Explication",
      type: "text",
      rows: 3
    })
  ],
  preview: {
    select: { title: "title", subtitle: "text" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Phrase spirituelle",
      subtitle: subtitle || "Petit texte explicatif"
    })
  }
});

export const homeCard = defineType({
  name: "homeCard",
  title: "Carte retournable",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre de la carte",
      type: "string",
      validation: required("Ajoutez le titre de la carte.")
    }),
    defineField({
      name: "frontText",
      title: "Texte du recto",
      type: "text",
      rows: 2,
      description: "Optionnel. Court texte sous le titre."
    }),
    defineField({
      name: "frontBackgroundColor",
      title: "Couleur du fond du recto",
      type: "string",
      description: "Optionnel. Si vide, le site utilise la couleur creme.",
      components: { input: ColorSwatchInput }
    }),
    defineField({
      name: "frontTextColor",
      title: "Couleur du texte du recto",
      type: "string",
      description: "Optionnel. Gardez un bon contraste avec le fond.",
      components: { input: ColorSwatchInput }
    }),
    defineField({
      name: "frontImage",
      title: "Photo du recto",
      type: "image",
      options: { hotspot: true },
      components: { field: FriendlyImageInput }
    }),
    defineField({
      name: "backImage",
      title: "Photo du verso",
      type: "image",
      options: { hotspot: true },
      components: { field: FriendlyImageInput },
      validation: required("Ajoutez la photo du verso.")
    }),
    defineField({
      name: "backText",
      title: "Texte du verso",
      type: "text",
      rows: 3,
      description: "Optionnel. Gardez un texte court."
    }),
    defineField({
      name: "backBackgroundColor",
      title: "Couleur du fond du verso",
      type: "string",
      description: "Optionnel. Visible surtout si la photo ne remplit pas tout.",
      components: { input: ColorSwatchInput }
    }),
    defineField({
      name: "backTextColor",
      title: "Couleur du texte du verso",
      type: "string",
      description: "Optionnel. Choisissez une couleur lisible sur la photo.",
      components: { input: ColorSwatchInput }
    }),
    defineField({
      name: "buttonBackgroundColor",
      title: "Couleur du fond du bouton",
      type: "string",
      description: "Optionnel. Si vide, le bouton reste safran.",
      components: { input: ColorSwatchInput }
    }),
    defineField({
      name: "buttonTextColor",
      title: "Couleur du texte du bouton",
      type: "string",
      description: "Optionnel. Choisissez une couleur lisible.",
      components: { input: ColorSwatchInput }
    }),
    defineField({
      name: "audio",
      title: "Audio",
      type: "file",
      description: "Optionnel. Ajoutez un fichier audio si necessaire."
    }),
    defineField({
      name: "button",
      title: "Bouton",
      type: "link"
    }),
    defineField({
      name: "text",
      title: "Ancien texte",
      type: "text",
      rows: 3,
      readOnly: true,
      hidden: ({ value }) => !value
    }),
    defineField({
      name: "image",
      title: "Ancienne photo",
      type: "image",
      readOnly: true,
      hidden: ({ value }) => !value
    }),
    defineField({
      name: "linkLabel",
      title: "Ancien texte du lien",
      type: "string",
      readOnly: true,
      hidden: ({ value }) => !value
    }),
    defineField({
      name: "link",
      title: "Ancien lien",
      type: "string",
      readOnly: true,
      hidden: ({ value }) => !value
    })
  ],
  preview: {
    select: { title: "title", subtitle: "backText", media: "backImage" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Carte",
      subtitle: subtitle || "Photo, texte et bouton",
      media
    })
  }
});

export const navLink = defineType({
  name: "navLink",
  title: "Lien du menu",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Nom visible dans le menu",
      type: "string",
      validation: required("Ecrivez le nom qui apparait dans le menu.")
    }),
    defineField({
      name: "url",
      title: "Ancien lien",
      type: "string",
      description: "Ancien champ conserve comme fallback."
    }),
    defineField({
      name: "link",
      title: "Destination",
      type: "link",
      description: "Choisissez une page, une URL, un fichier, un email ou un telephone."
    })
  ],
  preview: {
    select: { title: "label", subtitle: "url", linkLabel: "link.label" },
    prepare: ({ title, subtitle, linkLabel }) => ({
      title: title || "Lien du menu",
      subtitle: linkLabel || subtitle || "Page de destination"
    })
  }
});
