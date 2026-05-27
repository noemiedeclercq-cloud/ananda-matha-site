"use client";

import { Card, Stack, Text } from "@sanity/ui";
import type { FieldProps } from "sanity";
import { StudioNote } from "./StudioNote";

// IMPORTANT: this component is used as an image *field* wrapper, not an
// image input replacement. Sanity's native image input must stay in charge of
// upload, asset selection, drag-and-drop, crop, hotspot, patches and publish
// state. We only add friendly guidance around the default field renderer.
export function FriendlyImageField(props: FieldProps) {
  return (
    <Stack space={4}>
      <StudioNote title="Choisir une belle image">
        Utilisez une photo lumineuse et paisible. Après l’ajout, vous pouvez
        recadrer l’image pour garder le visage, le bâtiment ou le paysage bien
        centré.
      </StudioNote>
      <Card radius={3} border padding={3}>
        {props.renderDefault(props)}
      </Card>
      <Text size={1} muted>
        Conseil : les photos horizontales fonctionnent mieux pour les grandes
        bannières, les photos carrées pour les cartes et la galerie.
      </Text>
    </Stack>
  );
}

// Backwards-compatible export name for older imports. Use it only with
// `components.field`, never with `components.input`.
export const FriendlyImageInput = FriendlyImageField;
