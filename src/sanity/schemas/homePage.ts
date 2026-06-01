import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";
import { FriendlyDocumentInput } from "../studio/components/FriendlyDocumentInput";
import { VisualArrayInput } from "../studio/components/VisualArrayInput";

export const homePage = defineType({
  name: "homePage",
  title: "Page d'accueil",
  type: "document",
  icon: HomeIcon,
  components: { input: FriendlyDocumentInput },
  groups: [
    { name: "hero", title: "Haut de page", default: true },
    { name: "values", title: "Trois phrases" },
    { name: "cards", title: "Cartes Prayer / Work / Community / Hospitality" },
    { name: "story", title: "Our Story" },
    { name: "bands", title: "Bandes photos" },
    { name: "cta", title: "CTA final" }
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Titre principal",
      description: "C'est le grand titre visible en premier sur la page d'accueil.",
      type: "string",
      group: "hero",
      validation: (Rule) =>
        Rule.required().error("Ajoutez le titre principal de la page d'accueil.")
    }),
    defineField({
      name: "heroSubtitle",
      title: "Texte sous le titre",
      type: "text",
      rows: 3,
      group: "hero"
    }),
    defineField({
      name: "heroSlides",
      title: "Grande photo d'accueil",
      description:
        "Ajoutez une ou plusieurs photos. Une seule photo reste fixe. Plusieurs photos defilent automatiquement. Vous pouvez reordonner ou supprimer chaque photo.",
      type: "array",
      group: "hero",
      of: [{ type: "heroSlide" }],
      components: { input: VisualArrayInput },
      validation: (Rule) =>
        Rule.min(1).warning("Ajoutez au moins une photo pour eviter un haut de page vide.")
    }),
    defineField({
      name: "heroButtons",
      title: "Boutons",
      type: "array",
      group: "hero",
      description:
        "Ajoutez, supprimez ou reordonnez les boutons affiches dans la grande photo d'accueil.",
      of: [{ type: "actionButton" }],
      components: { input: VisualArrayInput }
    }),
    defineField({
      name: "values",
      title: "Les trois phrases de la vie monastique",
      description:
        "Ces trois phrases apparaissent sous la grande image. Vous pouvez les reordonner.",
      type: "array",
      group: "values",
      of: [{ type: "valueStatement" }],
      components: { input: VisualArrayInput },
      validation: (Rule) =>
        Rule.length(3).warning("Idealement, gardez exactement trois phrases.")
    }),
    defineField({
      name: "cards",
      title: "Cartes retournables",
      description:
        "Chaque carte contient un titre, une photo, un court texte et un bouton. Si une image est ajoutee, sa couleur reste naturelle ; les couleurs de fond servent seulement quand il n'y a pas d'image.",
      type: "array",
      group: "cards",
      of: [{ type: "homeCard" }],
      components: { input: VisualArrayInput },
      validation: (Rule) =>
        Rule.min(1).error("Ajoutez au moins une carte sur la page d'accueil.")
    }),
    defineField({
      name: "story",
      title: "Section Our Story",
      type: "homeStorySection",
      group: "story",
      description:
        "Grand bloc visuel avec titre, texte, bouton et photo optionnelle."
    }),
    defineField({
      name: "photoBands",
      title: "Bandes photos pleine largeur",
      type: "array",
      group: "bands",
      description:
        "Ajoutez des paysages ou photos horizontales entre les sections de la page d'accueil.",
      of: [{ type: "homePhotoBand" }],
      components: { input: VisualArrayInput }
    }),
    defineField({
      name: "invitationText",
      title: "Phrase d'invitation",
      type: "text",
      rows: 3,
      group: "cta"
    }),
    defineField({
      name: "invitationButtons",
      title: "Boutons d'invitation",
      type: "array",
      group: "cta",
      description:
        "Ajoutez, supprimez ou reordonnez les boutons du CTA final. Si aucun bouton n'est ajoute, aucun bouton ne s'affiche.",
      of: [{ type: "actionButton" }],
      components: { input: VisualArrayInput }
    })
  ],
  preview: {
    select: { title: "heroTitle", subtitle: "heroSubtitle", media: "heroSlides.0.image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Page d'accueil",
      subtitle: subtitle || "Diaporama, phrases, cartes, Our Story et CTA",
      media
    })
  }
});
