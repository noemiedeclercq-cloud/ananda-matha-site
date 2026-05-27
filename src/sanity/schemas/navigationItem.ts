import { defineField, defineType } from "sanity";

export const navigationItem = defineType({
  name: "navigationItem",
  title: "Ancien lien de menu",
  type: "document",
  hidden: true,
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "url", title: "URL", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 0 }),
    defineField({
      name: "parent",
      title: "Parent",
      type: "reference",
      to: [{ type: "navigationItem" }]
    })
  ],
  preview: {
    select: { title: "label", subtitle: "url" }
  }
});
