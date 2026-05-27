"use client";

import { Box, Card, Flex, Grid, Stack, Text } from "@sanity/ui";
import { PatchEvent, set, unset, type StringInputProps } from "sanity";

const suggestedColors = [
  { label: "Crème doux", value: "#faf5ea" },
  { label: "Safran", value: "#c8741d" },
  { label: "Vert profond", value: "#173f2d" },
  { label: "Bleu Ashoka", value: "#1d4f91" },
  { label: "Blanc chaud", value: "#fffaf0" },
  { label: "Terre claire", value: "#e6dcc8" }
];

function isHex(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

// Simple color input for non-technical users: click a calm swatch or paste a
// hex value. Sanity still stores a plain string, so the public site stays simple.
export function ColorSwatchInput(props: StringInputProps) {
  const value = isHex(props.value) ? props.value : "";

  function update(nextValue: string) {
    props.onChange(PatchEvent.from(nextValue ? set(nextValue) : unset()));
  }

  return (
    <Stack space={4}>
      <Flex gap={4} align="center">
        <Card
          radius={3}
          border
          style={{
            width: 64,
            height: 64,
            background: value || "#ffffff"
          }}
          aria-label="Aperçu de la couleur choisie"
        />
        <Box flex={1}>{props.renderDefault(props)}</Box>
      </Flex>

      <Grid columns={[2, 3, 6]} gap={3}>
        {suggestedColors.map((color) => (
          <Card
            as="button"
            key={color.value}
            type="button"
            padding={3}
            radius={3}
            border
            tone={value === color.value ? "primary" : "default"}
            onClick={() => update(color.value)}
            style={{ cursor: "pointer", textAlign: "left" }}
          >
            <Stack space={3}>
              <Card
                radius={2}
                style={{ height: 34, background: color.value }}
                aria-hidden="true"
              />
              <Text size={1} weight="medium">
                {color.label}
              </Text>
            </Stack>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}
