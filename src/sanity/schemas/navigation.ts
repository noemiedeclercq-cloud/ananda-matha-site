import { defineField, defineType } from "sanity";
import { VisualArrayInput } from "../studio/components/VisualArrayInput";

export const navigation = defineType({
  name: "navigation",
  title: "Menu principal",
  type: "document",
  groups: [
    {
      name: "menu",
      title: "Liens du menu",
      default: true
    },
    {
      name: "help",
      title: "Aide"
    }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nom interne",
      type: "string",
      initialValue: "Menu principal",
      readOnly: true,
      group: "help",
      description:
        "Ce nom sert seulement à identifier ce document. Il n’apparaît pas sur le site."
    }),
    defineField({
      name: "items",
      title: "Liens affichés dans le menu",
      description:
        "Ajoutez, supprimez ou déplacez les pages. L’ordre ici est l’ordre visible sur le site.",
      type: "array",
      group: "menu",
      of: [{ type: "navLink" }],
      components: { input: VisualArrayInput },
      validation: (Rule) =>
        Rule.min(1).error("Le menu doit contenir au moins un lien.")
    })
  ],
  preview: {
    prepare: () => ({
      title: "Menu principal",
      subtitle: "Liens visibles en haut du site"
    })
  }
});
