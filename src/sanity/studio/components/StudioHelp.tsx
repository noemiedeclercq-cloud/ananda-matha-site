"use client";

import { Box, Card, Container, Grid, Heading, Stack, Text } from "@sanity/ui";

const helpCards = [
  {
    title: "Page d'accueil",
    text: "Ouvrez Modifier la page d'accueil. Les photos du haut sont toutes dans Photos du haut de la page : une photo reste fixe, plusieurs photos forment un diaporama."
  },
  {
    title: "Pages du site",
    text: "Ouvrez Pages du site pour creer, dupliquer, supprimer, publier ou depublier une page. Les boutons se trouvent en haut a droite du document."
  },
  {
    title: "Menu principal",
    text: "Ouvrez Menu principal. Pour une page interne, choisissez une page dans la liste. Ne tapez pas l'adresse a la main."
  },
  {
    title: "Liens et boutons",
    text: "Tous les boutons utilisent le meme choix simple : page interne, URL externe, PDF, email ou telephone. Les champs inutiles disparaissent automatiquement."
  },
  {
    title: "Photos",
    text: "Cliquez sur une image pour envoyer une photo, en choisir une existante, recadrer ou regler le point important."
  },
  {
    title: "Couleurs",
    text: "Les couleurs personnalisent le site sans toucher aux photos. Sur les cartes, une couleur de fond est utilisee seulement quand aucune image n'est presente."
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
                Le Studio est organise comme le site : accueil, pages, menu,
                coordonnees, couleurs et galerie. En cas de doute, choisissez
                toujours une page ou un fichier dans la liste plutot que de
                taper une adresse.
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
