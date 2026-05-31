import { BlockElementIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
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
        "Ce champ cree l'adresse web. Exemple : prayer donne /prayer. En cas de doute, ne le modifiez pas.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) =>
        Rule.required().error("La page doit avoir une adresse web.")
    }),
    defineField({
      name: "excerpt",
      title: "Petit resume",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Ce texte court apparait en haut de la page et aide aussi les moteurs de recherche."
    }),
    defineField({
      name: "blocks",
      title: "Blocs de la page",
      type: "array",
      group: "content",
      description:
        "Cliquez sur Ajouter un bloc pour construire la page : texte, image, galerie, bouton, PDF, audio, citation, encadre, CTA ou separateur. Vous pouvez changer l'ordre par glisser-deposer, supprimer ou dupliquer un bloc.",
      of: [
        { type: "pageTextBlock" },
        { type: "pageImageBlock" },
        { type: "pageGalleryBlock" },
        { type: "pageButtonBlock" },
        { type: "pagePdfBlock" },
        { type: "pageAudioBlock" },
        { type: "pageQuoteBlock" },
        { type: "pageInfoBlock" },
        { type: "pageCtaBlock" },
        { type: "pageDividerBlock" }
      ]
    }),
    defineField({
      name: "body",
      title: "Ancien texte principal",
      type: "array",
      group: "content",
      description:
        "Ancien champ conserve pour les pages deja existantes. Pour les nouvelles pages, utilisez les blocs ci-dessus.",
      hidden: ({ parent }) => Array.isArray(parent?.blocks) && parent.blocks.length > 0,
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
                name: "smartLink",
                title: "Lien",
                type: "link"
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
