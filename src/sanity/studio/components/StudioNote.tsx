"use client";

import { Card, Flex, Stack, Text } from "@sanity/ui";
import { InfoOutlineIcon } from "@sanity/icons";

type StudioNoteProps = {
  title: string;
  children: React.ReactNode;
  tone?: "primary" | "positive" | "caution" | "critical";
};

// A calm helper card used inside custom inputs. It keeps instructions visible
// without making the editor feel like a technical admin screen.
export function StudioNote({
  title,
  children,
  tone = "primary"
}: StudioNoteProps) {
  return (
    <Card padding={4} radius={3} tone={tone} border>
      <Flex gap={3} align="flex-start">
        <Text size={2}>
          <InfoOutlineIcon />
        </Text>
        <Stack space={3}>
          <Text size={2} weight="semibold">
            {title}
          </Text>
          <Text size={1} muted>
            {children}
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
}
