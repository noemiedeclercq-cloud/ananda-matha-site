"use client";

import { Box, Card, Container, Grid, Heading, Stack, Text } from "@sanity/ui";

const helpCards = [
  {
    title: "Modifier la page d’accueil",
    text: "Ouvrez “Modifier la page d’accueil”. Les onglets séparent la grande image, les trois phrases, les cartes et les horaires."
  },
  {
    title: "Changer une photo",
    text: "Cliquez sur le champ image, choisissez une photo, puis utilisez le recadrage pour garder le sujet bien centré."
  },
  {
    title: "Changer le menu",
    text: "Ouvrez “Menu principal”. Déplacez les lignes par glisser-déposer pour changer l’ordre visible sur le site."
  },
  {
    title: "Changer les couleurs",
    text: "Ouvrez “Coordonnées, logo et couleurs”. Choisissez les couleurs proposées ou entrez un code hexadécimal."
  }
];

// A small built-in guide so editors are not left alone in a blank CMS.
export function StudioHelp() {
  return (
    <Box padding={5}>
      <Container width={2}>
        <Stack space={5}>
          <Card padding={5} radius={4} tone="primary" border>
            <Stack space={3}>
              <Heading size={3}>Aide simple pour modifier le site</Heading>
              <Text size={2} muted>
                Le Studio est organisé comme le site : accueil, pages,
                coordonnées, menu et galerie. Vous pouvez prendre votre temps.
              </Text>
            </Stack>
          </Card>
          <Grid columns={[1, 2]} gap={4}>
            {helpCards.map((card) => (
              <Card key={card.title} padding={5} radius={4} border>
                <Stack space={3}>
                  <Heading size={2}>{card.title}</Heading>
                  <Text size={1} muted>
                    {card.text}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
