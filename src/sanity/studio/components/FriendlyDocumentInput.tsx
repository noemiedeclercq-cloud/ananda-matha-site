"use client";

import { Card, Stack, Text } from "@sanity/ui";
import type { ObjectInputProps } from "sanity";

// A document-level wrapper that increases breathing room and adds a calm intro.
// It is intentionally generic so all editors get the same reassuring rhythm.
export function FriendlyDocumentInput(props: ObjectInputProps) {
  const title = props.schemaType.title || "Cette page";

  return (
    <Stack space={5}>
      <Card padding={5} radius={4} tone="primary" border>
        <Stack space={3}>
          <Text size={3} weight="semibold">
            {title}
          </Text>
          <Text size={1} muted>
            Modifiez tranquillement les informations. Les changements peuvent
            être sauvegardés en brouillon avant publication.
          </Text>
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}
