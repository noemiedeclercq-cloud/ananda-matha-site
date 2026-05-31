import { ButtonList, legacyButton } from "@/components/ButtonList";
import type { ActionButton, SmartLink } from "@/lib/types";

export function CTASection({
  text,
  buttonLabel,
  buttonLink,
  button,
  buttons
}: {
  text: string;
  buttonLabel: string;
  buttonLink: string;
  button?: SmartLink;
  buttons?: ActionButton[];
}) {
  const ctaButtons = buttons?.length ? buttons : legacyButton(button, "secondary");

  return (
    <section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mx-auto mb-8 h-px w-24 bg-ashoka" />
        <blockquote className="font-serif text-4xl font-semibold leading-tight text-forest md:text-6xl">
          “{text}”
        </blockquote>
        <ButtonList buttons={ctaButtons} className="mt-10 justify-center" />
      </div>
    </section>
  );
}
