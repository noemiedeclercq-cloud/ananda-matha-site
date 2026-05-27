import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";
import { FriendlyDocumentInput } from "../studio/components/FriendlyDocumentInput";
import { FriendlyImageInput } from "../studio/components/FriendlyImageInput";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Photo de la galerie",
  type: "document",
  icon: ImagesIcon,
  components: { input: FriendlyDocumentInput },
  groups: [
    {
      name: "photo",
      title: "Photo",
      default: true
    },
    {
      name: "text",
      title: "Texte"
    }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nom de la photo",
      type: "string",
      group: "text",
      validation: (Rule) =>
        Rule.required().error("Donnez un nom simple à cette photo.")
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      group: "photo",
      components: { field: FriendlyImageInput },
      validation: (Rule) =>
        Rule.required().error("Ajoutez une image pour cette entrée de galerie.")
    }),
    defineField({
      name: "alt",
      title: "Description pour l’accessibilité",
      type: "string",
      group: "text",
      description:
        "Décrivez simplement la photo pour les personnes qui utilisent un lecteur d’écran."
    }),
    defineField({
      name: "caption",
      title: "Légende visible",
      type: "text",
      rows: 3,
      group: "text"
    })
  ],
  preview: {
    select: { title: "title", subtitle: "caption", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Photo",
      subtitle: subtitle || "Galerie du monastère",
      media
    })
  }
});
