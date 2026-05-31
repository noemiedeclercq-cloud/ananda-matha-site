"use client";

import { Card, Stack, Text } from "@sanity/ui";
import type { ArrayOfObjectsInputProps } from "sanity";

// Sanity arrays already support adding, deleting, duplicating and drag-and-drop.
// This wrapper makes those native controls less mysterious for non-technical editors.
export function VisualArrayInput(props: ArrayOfObjectsInputProps) {
  return (
    <Stack space={4}>
      <Card padding={4} radius={3} tone="primary" border>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Cliquez sur Ajouter pour creer un element.
          </Text>
          <Text size={1} muted>
            Vous pouvez changer l'ordre par glisser-deposer. Le menu de chaque
            element permet aussi de le supprimer ou de le dupliquer.
          </Text>
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}
