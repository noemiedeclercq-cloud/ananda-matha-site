import { CardGrid } from "@/components/CardGrid";
import { CTASection } from "@/components/CTASection";
import { Hero } from "@/components/Hero";
import { HomeStory } from "@/components/HomeStory";
import { PhotoBands } from "@/components/PhotoBands";
import { ValueStrip } from "@/components/ValueStrip";
import { getHomePage } from "@/sanity/queries";

export default async function Home() {
  const home = await getHomePage();

  return (
    <>
      <Hero
        title={home.heroTitle}
        subtitle={home.heroSubtitle}
        image={home.heroImage}
        slides={home.heroSlides}
        buttonLabel={home.heroButtonLabel}
        buttonLink={home.heroButtonLink}
        button={home.heroButton}
        buttons={home.heroButtons}
      />
      <ValueStrip values={home.values} />
      <CardGrid cards={home.cards} />
      <PhotoBands bands={home.photoBands} />
      <HomeStory story={home.story} />
      <CTASection
        text={home.invitationText}
        buttonLabel={home.invitationButtonLabel}
        buttonLink={home.invitationButtonLink}
        button={home.invitationButton}
        buttons={home.invitationButtons}
      />
    </>
  );
}
