"use client";

import { Card, Stack, Text } from "@sanity/ui";
import type { ArrayOfObjectsInputProps } from "sanity";

// Sanity arrays already support drag-and-drop ordering. This wrapper adds a
// friendlier frame and reminder so users understand that each item is a visual
// card they can reorder.
export function VisualArrayInput(props: ArrayOfObjectsInputProps) {
  return (
    <Stack space={4}>
      <Card padding={4} radius={3} tone="primary" border>
        <Text size={1} muted>
          Chaque élément ci-dessous est une carte du site. Vous pouvez les
          déplacer par glisser-déposer pour changer leur ordre.
        </Text>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}
