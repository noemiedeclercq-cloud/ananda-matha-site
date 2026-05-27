import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";
import { FriendlyImageInput } from "../studio/components/FriendlyImageInput";
import { FriendlyDocumentInput } from "../studio/components/FriendlyDocumentInput";
import { ScheduleTextInput } from "../studio/components/ScheduleTextInput";
import { VisualArrayInput } from "../studio/components/VisualArrayInput";

export const homePage = defineType({
  name: "homePage",
  title: "Page d’accueil",
  type: "document",
  icon: HomeIcon,
  components: { input: FriendlyDocumentInput },
  groups: [
    {
      name: "hero",
      title: "Grande image d’accueil",
      default: true
    },
    {
      name: "values",
      title: "Trois phrases"
    },
    {
      name: "cards",
      title: "Cartes de navigation"
    },
    {
      name: "visit",
      title: "Horaires et invitation"
    }
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Titre principal",
      description:
        "C’est le grand titre visible en premier sur la page d’accueil.",
      type: "string",
      group: "hero",
      validation: (Rule) =>
        Rule.required().error("Ajoutez le titre principal de la page d’accueil.")
    }),
    defineField({
      name: "heroSubtitle",
      title: "Texte sous le titre",
      type: "text",
      rows: 3,
      group: "hero"
    }),
    defineField({
      name: "heroImage",
      title: "Grande photo d’accueil",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      components: { field: FriendlyImageInput }
    }),
    defineField({
      name: "heroButtonLabel",
      title: "Texte du bouton",
      type: "string",
      group: "hero",
      initialValue: "Read more"
    }),
    defineField({
      name: "heroButtonLink",
      title: "Lien du bouton",
      type: "string",
      group: "hero",
      description: "Exemple : /about-us"
    }),
    defineField({
      name: "values",
      title: "Les trois phrases de la vie monastique",
      description:
        "Ces trois phrases apparaissent sous la grande image. Vous pouvez les réordonner.",
      type: "array",
      group: "values",
      of: [{ type: "valueStatement" }],
      components: { input: VisualArrayInput },
      validation: (Rule) =>
        Rule.length(3).warning("Idéalement, gardez exactement trois phrases.")
    }),
    defineField({
      name: "cards",
      title: "Cartes vers les pages importantes",
      description:
        "Chaque carte contient un titre, un court texte, une image et un lien.",
      type: "array",
      group: "cards",
      of: [{ type: "homeCard" }],
      components: { input: VisualArrayInput },
      validation: (Rule) =>
        Rule.min(1).error("Ajoutez au moins une carte sur la page d’accueil.")
    }),
    defineField({
      name: "visitingHoursTitle",
      title: "Titre de la section horaires",
      type: "string",
      group: "visit",
      initialValue: "Visiting Hours"
    }),
    defineField({
      name: "visitingHoursContent",
      title: "Horaires d’ouverture",
      type: "text",
      rows: 6,
      group: "visit",
      components: { input: ScheduleTextInput }
    }),
    defineField({
      name: "visitingHoursImage",
      title: "Photo près des horaires",
      type: "image",
      options: { hotspot: true },
      group: "visit",
      components: { field: FriendlyImageInput }
    }),
    defineField({
      name: "invitationText",
      title: "Phrase d’invitation",
      type: "text",
      rows: 3,
      group: "visit"
    }),
    defineField({
      name: "invitationButtonLabel",
      title: "Texte du bouton d’invitation",
      type: "string",
      group: "visit"
    }),
    defineField({
      name: "invitationButtonLink",
      title: "Lien du bouton d’invitation",
      type: "string",
      group: "visit",
      description: "Exemple : /contact"
    })
  ],
  preview: {
    select: { title: "heroTitle", subtitle: "heroSubtitle", media: "heroImage" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Page d’accueil",
      subtitle: subtitle || "Grande image, phrases, cartes et horaires",
      media
    })
  }
});
