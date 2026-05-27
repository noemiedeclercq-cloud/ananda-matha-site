"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./env";
import { schemaTypes } from "./schemas";
import {
  monasteryStructure,
  singletonActionFilter,
  singletonTemplateFilter
} from "./studio/structure";

export default defineConfig({
  name: "ananda_matha_monastery",
  title: "Ananda Matha Monastery",
  projectId,
  dataset,
  basePath: "/studio",
  schema: {
    types: schemaTypes
  },
  document: {
    newDocumentOptions: singletonTemplateFilter,
    actions: singletonActionFilter
  },
  plugins: [
    structureTool({
      structure: monasteryStructure
    })
  ]
});
