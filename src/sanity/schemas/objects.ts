import { defineField, defineType } from "sanity";
import { FriendlyImageInput } from "../studio/components/FriendlyImageInput";

const required = (message: string) => (Rule: any) => Rule.required().error(message);

export const heroSection = defineType({
  name: "heroSection",
  title: "Grande introduction de la page",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Grand titre",
      type: "string",
      validation: required("Ajoutez le grand titre affiché en haut de la page.")
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
      name: "buttonLabel",
      title: "Texte du bouton",
      type: "string"
    }),
    defineField({
      name: "buttonLink",
      title: "Lien du bouton",
      type: "string",
      description: "Exemple : /about-us ou /contact"
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
          { title: "Étoile / lumière", value: "sparkles" },
          { title: "Feuille / travail", value: "leaf" },
          { title: "Cœur / prière", value: "heart" }
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
  title: "Carte de la page d’accueil",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre de la carte",
      type: "string",
      validation: required("Ajoutez le titre de la carte.")
    }),
    defineField({
      name: "text",
      title: "Texte de la carte",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "image",
      title: "Photo de la carte",
      type: "image",
      options: { hotspot: true },
      components: { field: FriendlyImageInput }
    }),
    defineField({
      name: "linkLabel",
      title: "Texte du lien",
      type: "string",
      initialValue: "Read more"
    }),
    defineField({
      name: "link",
      title: "Page de destination",
      type: "string",
      description: "Exemple : /hospitality"
    })
  ],
  preview: {
    select: { title: "title", subtitle: "text", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Carte",
      subtitle: subtitle || "Texte et lien",
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
      validation: required("Écrivez le nom qui apparaît dans le menu.")
    }),
    defineField({
      name: "url",
      title: "Lien",
      type: "string",
      description: "Exemple : /prayer ou /contact",
      validation: required("Ajoutez le lien de cette entrée du menu.")
    })
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Lien du menu",
      subtitle: subtitle || "Page de destination"
    })
  }
});
