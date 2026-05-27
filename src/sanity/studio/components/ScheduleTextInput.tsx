"use client";

import { Card, Grid, Stack, Text } from "@sanity/ui";
import type { TextInputProps } from "sanity";
import { StudioNote } from "./StudioNote";

const examples = [
  "Lundi - Vendredi : 8h - 19h",
  "Samedi : 9h - 19h",
  "Dimanche : 9h - 19h"
];

// Keeps the data model as editable text while making the expected format very
// obvious. This is less intimidating than a complex schedule table.
export function ScheduleTextInput(props: TextInputProps) {
  return (
    <Stack space={4}>
      <StudioNote title="Horaires simples">
        Écrivez une ligne par jour ou groupe de jours. Ces lignes seront
        affichées telles quelles sur la page d’accueil.
      </StudioNote>
      <Grid columns={[1, 3]} gap={3}>
        {examples.map((example) => (
          <Card key={example} padding={3} radius={3} border>
            <Text size={1}>{example}</Text>
          </Card>
        ))}
      </Grid>
      {props.renderDefault(props)}
    </Stack>
  );
}
