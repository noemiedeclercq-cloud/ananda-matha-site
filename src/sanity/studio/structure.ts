import {
  BlockElementIcon,
  CogIcon,
  ControlsIcon,
  HomeIcon,
  ImagesIcon,
  MasterDetailIcon
} from "@sanity/icons";
import type React from "react";
import type { StructureResolver } from "sanity/structure";
import { StudioHelp } from "./components/StudioHelp";

const singletonTypes = new Set(["siteSettings", "homePage", "navigation"]);

function singletonItem(
  S: Parameters<StructureResolver>[0],
  type: string,
  id: string,
  title: string,
  icon: React.ComponentType
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(id).title(title));
}

export const monasteryStructure: StructureResolver = (S) =>
  S.list()
    .title("Administration du site")
    .items([
      singletonItem(S, "homePage", "homePage", "Modifier la page d'accueil", HomeIcon),
      singletonItem(S, "siteSettings", "siteSettings", "Coordonnees, logo et couleurs", CogIcon),
      singletonItem(S, "navigation", "navigation", "Menu principal", ControlsIcon),
      S.divider(),
      S.listItem()
        .title("Pages du site : creer, publier, dupliquer")
        .icon(BlockElementIcon)
        .child(
          S.documentTypeList("page")
            .title("Pages du site")
            .filter('_type == "page"')
        ),
      S.listItem()
        .title("Galerie photos")
        .icon(ImagesIcon)
        .child(
          S.documentTypeList("galleryItem")
            .title("Galerie photos")
            .filter('_type == "galleryItem"')
        ),
      S.divider(),
      S.listItem()
        .title("Aide : comment modifier le site")
        .icon(MasterDetailIcon)
        .child(S.component(StudioHelp).title("Aide"))
    ]);

export const singletonTemplateFilter = (prev: any[]) =>
  prev.filter((template) => !singletonTypes.has(template.templateId));

export const singletonActionFilter = (prev: any[], context: any) => {
  if (singletonTypes.has(context.schemaType)) {
    return prev.filter(
      (action) => !["delete", "duplicate", "unpublish"].includes(action.action)
    );
  }

  return prev;
};
