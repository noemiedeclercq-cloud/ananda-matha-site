import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";
import { FriendlyImageInput } from "../studio/components/FriendlyImageInput";
import { FriendlyDocumentInput } from "../studio/components/FriendlyDocumentInput";
import { ScheduleTextInput } from "../studio/components/ScheduleTextInput";
import { VisualArrayInput } from "../studio/components/VisualArrayInput";

export const homePage = defineType({
  name: "homePage",
  title: "Page d'accueil",
  type: "document",
  icon: HomeIcon,
  components: { input: FriendlyDocumentInput },
  groups: [
    { name: "hero", title: "Diaporama d'accueil", default: true },
    { name: "values", title: "Trois phrases" },
    { name: "cards", title: "Cartes retournables" },
    { name: "visit", title: "Horaires et invitation" }
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
      title: "Images du diaporama",
      description:
        "Ajoutez plusieurs images pour faire defiler le haut de la page. Avec une seule image, elle reste fixe.",
      type: "array",
      group: "hero",
      of: [{ type: "heroSlide" }],
      components: { input: VisualArrayInput }
    }),
    defineField({
      name: "heroButton",
      title: "Bouton du diaporama",
      type: "link",
      group: "hero"
    }),
    defineField({
      name: "heroImage",
      title: "Ancienne grande photo d'accueil",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      readOnly: true,
      hidden: ({ value }) => !value,
      components: { field: FriendlyImageInput }
    }),
    defineField({
      name: "heroButtonLabel",
      title: "Ancien texte du bouton",
      type: "string",
      group: "hero",
      readOnly: true,
      hidden: ({ value }) => !value
    }),
    defineField({
      name: "heroButtonLink",
      title: "Ancien lien du bouton",
      type: "string",
      group: "hero",
      readOnly: true,
      hidden: ({ value }) => !value
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
        "Chaque carte contient un titre, une photo au verso, un court texte et un bouton.",
      type: "array",
      group: "cards",
      of: [{ type: "homeCard" }],
      components: { input: VisualArrayInput },
      validation: (Rule) =>
        Rule.min(1).error("Ajoutez au moins une carte sur la page d'accueil.")
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
      title: "Horaires d'ouverture",
      type: "text",
      rows: 6,
      group: "visit",
      components: { input: ScheduleTextInput }
    }),
    defineField({
      name: "visitingHoursImage",
      title: "Photo pres des horaires",
      type: "image",
      options: { hotspot: true },
      group: "visit",
      components: { field: FriendlyImageInput }
    }),
    defineField({
      name: "invitationText",
      title: "Phrase d'invitation",
      type: "text",
      rows: 3,
      group: "visit"
    }),
    defineField({
      name: "invitationButton",
      title: "Bouton d'invitation",
      type: "link",
      group: "visit"
    }),
    defineField({
      name: "invitationButtonLabel",
      title: "Ancien texte du bouton d'invitation",
      type: "string",
      group: "visit",
      readOnly: true,
      hidden: ({ value }) => !value
    }),
    defineField({
      name: "invitationButtonLink",
      title: "Ancien lien du bouton d'invitation",
      type: "string",
      group: "visit",
      readOnly: true,
      hidden: ({ value }) => !value
    })
  ],
  preview: {
    select: { title: "heroTitle", subtitle: "heroSubtitle", media: "heroSlides.0.image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Page d'accueil",
      subtitle: subtitle || "Diaporama, phrases, cartes et horaires",
      media
    })
  }
});
