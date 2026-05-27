import Link from "next/link";

export function CTASection({
  text,
  buttonLabel,
  buttonLink
}: {
  text: string;
  buttonLabel: string;
  buttonLink: string;
}) {
  return (
    <section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mx-auto mb-8 h-px w-24 bg-ashoka" />
        <blockquote className="font-serif text-4xl font-semibold leading-tight text-forest md:text-6xl">
          “{text}”
        </blockquote>
        <Link href={buttonLink} className="button-secondary mt-10 inline-flex">
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
