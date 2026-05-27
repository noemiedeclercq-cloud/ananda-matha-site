import { defineField, defineType } from "sanity";
import { BlockElementIcon } from "@sanity/icons";
import { FriendlyDocumentInput } from "../studio/components/FriendlyDocumentInput";
import { FriendlyImageInput } from "../studio/components/FriendlyImageInput";

export const page = defineType({
  name: "page",
  title: "Page du site",
  type: "document",
  icon: BlockElementIcon,
  components: { input: FriendlyDocumentInput },
  groups: [
    {
      name: "content",
      title: "Contenu visible",
      default: true
    },
    {
      name: "photo",
      title: "Image"
    },
    {
      name: "seo",
      title: "Google",
      hidden: ({ currentUser }) =>
        !currentUser?.roles.some((role) => role.name === "administrator")
    }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titre de la page",
      type: "string",
      group: "content",
      validation: (Rule) =>
        Rule.required().error("Chaque page doit avoir un titre.")
    }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      type: "slug",
      group: "content",
      description:
        "Ce champ crée l’adresse web. Exemple : prayer donne /prayer. En cas de doute, ne le modifiez pas.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) =>
        Rule.required().error("La page doit avoir une adresse web.")
    }),
    defineField({
      name: "excerpt",
      title: "Petit résumé",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Ce texte court apparaît en haut de la page et aide aussi les moteurs de recherche."
    }),
    defineField({
      name: "body",
      title: "Texte principal",
      type: "array",
      group: "content",
      description:
        "Écrivez le texte de la page. La barre d’outils est volontairement simple.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraphe", value: "normal" },
            { title: "Titre de section", value: "h2" },
            { title: "Citation", value: "blockquote" }
          ],
          lists: [{ title: "Liste simple", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" }
            ],
            annotations: [
              {
                name: "link",
                title: "Lien",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "Adresse du lien",
                    type: "url"
                  })
                ]
              }
            ]
          }
        },
        {
          type: "image",
          title: "Image dans le texte",
          options: { hotspot: true },
          components: { field: FriendlyImageInput }
        }
      ]
    }),
    defineField({
      name: "heroImage",
      title: "Grande photo en haut de la page",
      type: "image",
      options: { hotspot: true },
      group: "photo",
      components: { field: FriendlyImageInput }
    }),
    defineField({
      name: "seoTitle",
      title: "Titre pour Google",
      type: "string",
      group: "seo"
    }),
    defineField({
      name: "seoDescription",
      title: "Description pour Google",
      type: "text",
      rows: 3,
      group: "seo"
    })
  ],
  preview: {
    select: { title: "title", subtitle: "excerpt", media: "heroImage" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Page sans titre",
      subtitle: subtitle || "Cliquez pour modifier le contenu",
      media
    })
  }
});
