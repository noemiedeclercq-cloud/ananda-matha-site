import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";
import { ColorSwatchInput } from "../studio/components/ColorSwatchInput";
import { FriendlyDocumentInput } from "../studio/components/FriendlyDocumentInput";
import { FriendlyImageInput } from "../studio/components/FriendlyImageInput";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Coordonnées, logo et couleurs",
  type: "document",
  icon: CogIcon,
  components: { input: FriendlyDocumentInput },
  groups: [
    {
      name: "identity",
      title: "Identité du site",
      default: true
    },
    {
      name: "contact",
      title: "Coordonnées"
    },
    {
      name: "colors",
      title: "Couleurs"
    },
    {
      name: "footer",
      title: "Bas de page"
    }
  ],
  fields: [
    defineField({
      name: "siteTitle",
      title: "Nom du monastère",
      type: "string",
      group: "identity",
      validation: (Rule) =>
        Rule.required().error("Ajoutez le nom du monastère.")
    }),
    defineField({
      name: "subtitle",
      title: "Petite description",
      type: "text",
      rows: 3,
      group: "identity"
    }),
    defineField({
      name: "logo",
      title: "Logo ou image du monastère",
      type: "image",
      options: { hotspot: true },
      group: "identity",
      components: { field: FriendlyImageInput }
    }),
    defineField({
      name: "contactEmail",
      title: "Adresse email",
      type: "string",
      group: "contact",
      validation: (Rule) =>
        Rule.email().warning("Vérifiez que l'adresse email est correcte.")
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
      group: "contact"
    }),
    defineField({
      name: "address",
      title: "Adresse postale",
      type: "text",
      rows: 4,
      group: "contact"
    }),
    defineField({
      name: "theme",
      title: "Couleurs du site",
      description:
        "Ces couleurs servent à garder l'identité visuelle : crème, safran, vert profond et bleu Ashoka.",
      type: "object",
      group: "colors",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "cream",
          title: "Fond crème",
          type: "string",
          components: { input: ColorSwatchInput }
        }),
        defineField({
          name: "saffron",
          title: "Accent safran",
          type: "string",
          components: { input: ColorSwatchInput }
        }),
        defineField({
          name: "forest",
          title: "Vert profond",
          type: "string",
          components: { input: ColorSwatchInput }
        }),
        defineField({
          name: "ashoka",
          title: "Bleu Ashoka",
          type: "string",
          components: { input: ColorSwatchInput }
        }),
        defineField({
          name: "headerBackgroundColor",
          title: "Fond du menu",
          type: "string",
          components: { input: ColorSwatchInput }
        }),
        defineField({
          name: "menuTextColor",
          title: "Texte du menu",
          type: "string",
          components: { input: ColorSwatchInput }
        }),
        defineField({
          name: "menuHoverColor",
          title: "Couleur au survol",
          type: "string",
          components: { input: ColorSwatchInput }
        }),
        defineField({
          name: "menuActiveColor",
          title: "Couleur active",
          type: "string",
          components: { input: ColorSwatchInput }
        }),
        defineField({
          name: "menuButtonBackgroundColor",
          title: "Fond du bouton du menu",
          type: "string",
          components: { input: ColorSwatchInput }
        }),
        defineField({
          name: "menuButtonTextColor",
          title: "Texte du bouton du menu",
          type: "string",
          components: { input: ColorSwatchInput }
        })
      ]
    }),
    defineField({
      name: "socialLinks",
      title: "Liens utiles ou réseaux",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          title: "Lien",
          fields: [
            defineField({
              name: "label",
              title: "Nom du lien",
              type: "string"
            }),
            defineField({
              name: "url",
              title: "Ancienne adresse web",
              type: "url",
              readOnly: true,
              hidden: true
            }),
            defineField({
              name: "link",
              title: "Destination",
              type: "link",
              description:
                "Choisissez la destination sans coder : page interne, URL externe, PDF, email ou téléphone.",
              validation: (Rule) =>
                Rule.required().error("Choisissez la destination de ce lien.")
            })
          ],
          preview: {
            select: { title: "label", subtitle: "link.label" }
          }
        }
      ]
    }),
    defineField({
      name: "footerText",
      title: "Texte du bas de page",
      type: "text",
      rows: 3,
      group: "footer"
    })
  ],
  preview: {
    select: { title: "siteTitle", subtitle: "subtitle", media: "logo" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Coordonnées, logo et couleurs",
      subtitle: subtitle || "Informations générales du site",
      media
    })
  }
});
