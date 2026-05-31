import { defineField, defineType } from "sanity";
import { ColorSwatchInput } from "../studio/components/ColorSwatchInput";
import { FriendlyImageInput } from "../studio/components/FriendlyImageInput";

const required = (message: string) => (Rule: any) => Rule.required().error(message);

export const link = defineType({
  name: "link",
  title: "Lien",
  type: "object",
  validation: (Rule) =>
    Rule.custom((value: any) => {
      if (!value) return true;
      if (!value.type) return "Choisissez le type de lien.";

      if (value.type === "internal" && !value.internalPage?._ref) {
        return "Choisissez une page existante dans la liste.";
      }

      if (value.type === "external" && !value.externalUrl) {
        return "Ajoutez l'adresse du site externe.";
      }

      if (value.type === "file" && !value.file?.asset?._ref) {
        return "Ajoutez ou choisissez un fichier.";
      }

      if (value.type === "email" && !value.email) {
        return "Ajoutez l'adresse email.";
      }

      if (value.type === "phone" && !value.phone) {
        return "Ajoutez le numero de telephone.";
      }

      return true;
    }),
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
      description: "Choisissez une page existante dans la liste. Ne tapez pas l'adresse.",
      hidden: ({ parent }) => parent?.type !== "internal"
    }),
    defineField({
      name: "externalUrl",
      title: "Adresse web externe",
      type: "url",
      description: "Collez l'adresse complete, par exemple https://www.ocso.org.",
      hidden: ({ parent }) => parent?.type !== "external"
    }),
    defineField({
      name: "file",
      title: "Fichier ou PDF",
      type: "file",
      description: "Deposez un fichier ou choisissez un fichier deja envoye.",
      hidden: ({ parent }) => parent?.type !== "file"
    }),
    defineField({
      name: "email",
      title: "Adresse email",
      type: "string",
      description: "Exemple : anandamatha@gmail.com",
      hidden: ({ parent }) => parent?.type !== "email",
      validation: (Rule) => Rule.email().warning("Verifiez l'adresse email.")
    }),
    defineField({
      name: "phone",
      title: "Numero de telephone",
      type: "string",
      description: "Exemple : +91 96560 61997",
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
        pageTitle ||
        externalUrl ||
        fileName ||
        email ||
        phone ||
        (type === "internal" ? "Page manquante ou supprimee" : "Lien a completer");
      return {
        title: label || "Lien",
        subtitle: `${type || "type"} - ${destination}`
      };
    }
  }
});

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Photo",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      components: { field: FriendlyImageInput },
      validation: required("Ajoutez une photo.")
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
      hidden: true
    }),
    defineField({
      name: "image",
      title: "Ancienne photo",
      type: "image",
      readOnly: true,
      hidden: true
    }),
    defineField({
      name: "linkLabel",
      title: "Ancien texte du lien",
      type: "string",
      readOnly: true,
      hidden: true
    }),
    defineField({
      name: "link",
      title: "Ancien lien",
      type: "string",
      readOnly: true,
      hidden: true
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
  title: "Element du menu",
  type: "object",
  validation: (Rule) =>
    Rule.custom((value: any) => {
      if (!value) return true;
      if (!value.label) return "Ajoutez le nom visible dans le menu.";
      if (!value.link && !value.children?.length) {
        return "Ajoutez un lien ou au moins une sous-page.";
      }
      return true;
    }),
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
      description: "Ancien champ conserve comme fallback.",
      readOnly: true,
      hidden: true
    }),
    defineField({
      name: "link",
      title: "Lien de cette entree",
      type: "link",
      description:
        "Optionnel si cette entree sert seulement a ouvrir un sous-menu. Pour une page du site, choisissez une page dans la liste."
    }),
    defineField({
      name: "isMenuOnly",
      title: "Cette entree ouvre seulement le sous-menu",
      type: "boolean",
      initialValue: false,
      description:
        "Activez ceci si le titre ne doit pas etre cliquable et sert seulement a afficher les sous-pages.",
      hidden: ({ parent }) => !parent?.children?.length
    }),
    defineField({
      name: "children",
      title: "Sous-pages",
      type: "array",
      description: "Ajoutez ici les pages qui apparaitront sous ce menu.",
      of: [{ type: "navSubLink" }]
    })
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "url",
      linkLabel: "link.label",
      linkType: "link.type",
      pageTitle: "link.internalPage.title"
    },
    prepare: ({ title, subtitle, linkLabel, linkType, pageTitle }) => ({
      title: title || "Lien du menu",
      subtitle:
        linkType === "internal" && !pageTitle
          ? "Attention : page manquante ou supprimee"
          : linkLabel || pageTitle || subtitle || "Page de destination"
    })
  }
});

export const navSubLink = defineType({
  name: "navSubLink",
  title: "Sous-page du menu",
  type: "object",
  validation: (Rule) =>
    Rule.custom((value: any) => {
      if (!value) return true;
      if (!value.label) return "Ajoutez le nom visible dans le sous-menu.";
      if (!value.link) return "Choisissez le lien de cette sous-page.";
      return true;
    }),
  fields: [
    defineField({
      name: "label",
      title: "Nom visible dans le sous-menu",
      type: "string",
      validation: required("Ecrivez le nom visible dans le sous-menu.")
    }),
    defineField({
      name: "url",
      title: "Ancien lien",
      type: "string",
      readOnly: true,
      hidden: true
    }),
    defineField({
      name: "link",
      title: "Lien de cette sous-page",
      type: "link",
      description:
        "Choisissez une page interne dans la liste, une URL externe, un PDF, un email ou un telephone.",
      validation: required("Choisissez le lien de cette sous-page.")
    })
  ],
  preview: {
    select: {
      title: "label",
      linkLabel: "link.label",
      pageTitle: "link.internalPage.title",
      linkType: "link.type"
    },
    prepare: ({ title, linkLabel, pageTitle, linkType }) => ({
      title: title || "Sous-page",
      subtitle:
        linkType === "internal" && !pageTitle
          ? "Attention : page manquante ou supprimee"
          : linkLabel || pageTitle || "Destination"
    })
  }
});

export const homeStorySection = defineType({
  name: "homeStorySection",
  title: "Our Story",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      initialValue: "Our Story",
      validation: required("Ajoutez le titre de cette section.")
    }),
    defineField({
      name: "subtitle",
      title: "Petit titre",
      type: "string",
      description: "Optionnel."
    }),
    defineField({
      name: "text",
      title: "Texte",
      type: "array",
      description: "Texte principal de la section Our Story.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraphe", value: "normal" },
            { title: "Petit titre", value: "h3" }
          ],
          lists: [{ title: "Liste simple", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" }
            ],
            annotations: []
          }
        }
      ]
    }),
    defineField({
      name: "button",
      title: "Bouton",
      type: "link",
      description: "Exemple : Read more vers la page Our Story."
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      components: { field: FriendlyImageInput },
      description: "Optionnel."
    }),
    defineField({
      name: "backgroundColor",
      title: "Couleur de fond",
      type: "string",
      components: { input: ColorSwatchInput },
      description: "Optionnel. Si vide, le site utilise le vert profond."
    }),
    defineField({
      name: "textColor",
      title: "Couleur du texte",
      type: "string",
      components: { input: ColorSwatchInput },
      description: "Optionnel. Gardez un bon contraste avec le fond."
    })
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Our Story",
      subtitle: subtitle || "Titre, texte, image et bouton",
      media
    })
  }
});

export const homePhotoBand = defineType({
  name: "homePhotoBand",
  title: "Bande photo",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image pleine largeur",
      type: "image",
      options: { hotspot: true },
      components: { field: FriendlyImageInput },
      validation: required("Ajoutez une image pour cette bande photo.")
    }),
    defineField({
      name: "alt",
      title: "Description de l'image",
      type: "string",
      description: "Courte description pour les lecteurs d'ecran.",
      validation: (Rule) =>
        Rule.required().warning("Ajoutez une description courte de l'image.")
    }),
    defineField({
      name: "height",
      title: "Hauteur",
      type: "string",
      initialValue: "medium",
      options: {
        layout: "radio",
        list: [
          { title: "Normale", value: "medium" },
          { title: "Grande", value: "large" },
          { title: "Tres grande", value: "xlarge" }
        ]
      }
    }),
    defineField({
      name: "overlay",
      title: "Assombrir legerement l'image",
      type: "boolean",
      initialValue: false,
      description:
        "Optionnel. Utile seulement si une legende doit rester lisible sur l'image."
    }),
    defineField({
      name: "caption",
      title: "Legende",
      type: "string",
      description: "Optionnel."
    })
  ],
  preview: {
    select: { title: "caption", subtitle: "alt", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Bande photo",
      subtitle: subtitle || "Image pleine largeur",
      media
    })
  }
});

export const pageTextBlock = defineType({
  name: "pageTextBlock",
  title: "Texte",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Texte",
      type: "array",
      description:
        "Ecrivez ici un texte simple. Pour un bouton, une image, un PDF ou un audio, ajoutez plutot un bloc separe.",
      validation: required("Ajoutez le texte de ce bloc."),
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraphe", value: "normal" },
            { title: "Titre de section", value: "h2" },
            { title: "Petit titre", value: "h3" }
          ],
          lists: [{ title: "Liste simple", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" }
            ],
            annotations: [
              {
                name: "smartLink",
                title: "Lien discret dans le texte",
                type: "link"
              }
            ]
          }
        }
      ]
    })
  ],
  preview: {
    prepare: () => ({
      title: "Texte",
      subtitle: "Paragraphe ou titre de section"
    })
  }
});

export const pageImageBlock = defineType({
  name: "pageImageBlock",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      components: { field: FriendlyImageInput },
      validation: required("Ajoutez une image.")
    }),
    defineField({
      name: "alt",
      title: "Description de l'image",
      type: "string",
      description:
        "Texte court pour les personnes qui ne voient pas l'image. Exemple : Chapelle du monastere.",
      validation: (Rule) =>
        Rule.required().warning("Ajoutez une courte description de l'image.")
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
      title: title || "Image",
      subtitle: subtitle || "Photo de la page",
      media
    })
  }
});

export const pageGalleryImage = defineType({
  name: "pageGalleryImage",
  title: "Photo de galerie",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      components: { field: FriendlyImageInput },
      validation: required("Ajoutez une photo.")
    }),
    defineField({
      name: "alt",
      title: "Description de la photo",
      type: "string",
      validation: (Rule) =>
        Rule.required().warning("Ajoutez une description courte de la photo.")
    }),
    defineField({
      name: "caption",
      title: "Legende",
      type: "string"
    })
  ],
  preview: {
    select: { title: "alt", subtitle: "caption", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Photo",
      subtitle: subtitle || "Image de galerie",
      media
    })
  }
});

export const pageGalleryBlock = defineType({
  name: "pageGalleryBlock",
  title: "Galerie",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre de la galerie",
      type: "string",
      description: "Optionnel."
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      description:
        "Ajoutez les photos, puis changez leur ordre par glisser-deposer si besoin.",
      of: [{ type: "pageGalleryImage" }],
      validation: (Rule) =>
        Rule.min(1).error("Ajoutez au moins une photo dans la galerie.")
    })
  ],
  preview: {
    select: { title: "title", images: "images" },
    prepare: ({ title, images }) => ({
      title: title || "Galerie",
      subtitle: `${images?.length || 0} photo(s)`
    })
  }
});

export const pageButtonBlock = defineType({
  name: "pageButtonBlock",
  title: "Bouton",
  type: "object",
  fields: [
    defineField({
      name: "link",
      title: "Bouton",
      type: "link",
      description:
        "Choisissez la destination du bouton : page, site externe, PDF, email ou telephone.",
      validation: required("Configurez le bouton.")
    }),
    defineField({
      name: "style",
      title: "Style du bouton",
      type: "string",
      initialValue: "primary",
      options: {
        layout: "radio",
        list: [
          { title: "Bouton principal", value: "primary" },
          { title: "Bouton discret", value: "secondary" }
        ]
      }
    })
  ],
  preview: {
    select: { title: "link.label", type: "link.type" },
    prepare: ({ title, type }) => ({
      title: title || "Bouton",
      subtitle: type || "Destination a choisir"
    })
  }
});

export const pagePdfBlock = defineType({
  name: "pagePdfBlock",
  title: "PDF a telecharger",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: required("Ajoutez un titre pour ce PDF.")
    }),
    defineField({
      name: "text",
      title: "Petit texte",
      type: "text",
      rows: 3,
      description: "Optionnel."
    }),
    defineField({
      name: "file",
      title: "Fichier PDF",
      type: "file",
      description: "Deposez un PDF ou choisissez un fichier deja ajoute.",
      options: { accept: ".pdf,application/pdf" },
      validation: required("Ajoutez le fichier PDF.")
    }),
    defineField({
      name: "buttonLabel",
      title: "Texte du bouton",
      type: "string",
      initialValue: "Download PDF"
    })
  ],
  preview: {
    select: { title: "title", fileName: "file.asset.originalFilename" },
    prepare: ({ title, fileName }) => ({
      title: title || "PDF a telecharger",
      subtitle: fileName || "Fichier PDF"
    })
  }
});

export const pageAudioBlock = defineType({
  name: "pageAudioBlock",
  title: "Audio",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre de l'audio",
      type: "string",
      validation: required("Ajoutez un titre pour cet audio.")
    }),
    defineField({
      name: "text",
      title: "Petit texte",
      type: "text",
      rows: 3,
      description: "Optionnel."
    }),
    defineField({
      name: "file",
      title: "Fichier audio",
      type: "file",
      description: "Deposez un fichier audio ou choisissez un fichier existant.",
      options: { accept: "audio/*" },
      validation: required("Ajoutez le fichier audio.")
    })
  ],
  preview: {
    select: { title: "title", fileName: "file.asset.originalFilename" },
    prepare: ({ title, fileName }) => ({
      title: title || "Audio",
      subtitle: fileName || "Fichier audio"
    })
  }
});

export const pageQuoteBlock = defineType({
  name: "pageQuoteBlock",
  title: "Citation",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Citation",
      type: "text",
      rows: 4,
      validation: required("Ajoutez le texte de la citation.")
    }),
    defineField({
      name: "attribution",
      title: "Auteur ou source",
      type: "string",
      description: "Optionnel."
    })
  ],
  preview: {
    select: { title: "quote", subtitle: "attribution" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Citation",
      subtitle: subtitle || "Texte mis en valeur"
    })
  }
});

export const pageInfoBlock = defineType({
  name: "pageInfoBlock",
  title: "Encadre d'information",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: required("Ajoutez un titre pour l'encadre.")
    }),
    defineField({
      name: "text",
      title: "Texte",
      type: "text",
      rows: 5,
      validation: required("Ajoutez le texte de l'encadre.")
    })
  ],
  preview: {
    select: { title: "title", subtitle: "text" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Encadre d'information",
      subtitle: subtitle || "Information importante"
    })
  }
});

export const pageCtaBlock = defineType({
  name: "pageCtaBlock",
  title: "CTA - appel a l'action",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: required("Ajoutez un titre.")
    }),
    defineField({
      name: "text",
      title: "Texte",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "button",
      title: "Bouton",
      type: "link",
      description: "Optionnel."
    })
  ],
  preview: {
    select: { title: "title", subtitle: "text" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Appel a l'action",
      subtitle: subtitle || "Titre, texte et bouton"
    })
  }
});

export const pageDividerBlock = defineType({
  name: "pageDividerBlock",
  title: "Separateur",
  type: "object",
  fields: [
    defineField({
      name: "spacing",
      title: "Espace autour du separateur",
      type: "string",
      initialValue: "normal",
      options: {
        layout: "radio",
        list: [
          { title: "Normal", value: "normal" },
          { title: "Grand", value: "large" }
        ]
      }
    })
  ],
  preview: {
    prepare: () => ({
      title: "Separateur",
      subtitle: "Ligne fine entre deux parties"
    })
  }
});
