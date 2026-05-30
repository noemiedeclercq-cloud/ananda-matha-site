import { CardGrid } from "@/components/CardGrid";
import { CTASection } from "@/components/CTASection";
import { Hero } from "@/components/Hero";
import { ValueStrip } from "@/components/ValueStrip";
import { VisitingHours } from "@/components/VisitingHours";
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
      />
      <ValueStrip values={home.values} />
      <CardGrid cards={home.cards} />
      <VisitingHours
        title={home.visitingHoursTitle}
        content={home.visitingHoursContent}
        image={home.visitingHoursImage}
      />
      <CTASection
        text={home.invitationText}
        buttonLabel={home.invitationButtonLabel}
        buttonLink={home.invitationButtonLink}
        button={home.invitationButton}
      />
    </>
  );
}
