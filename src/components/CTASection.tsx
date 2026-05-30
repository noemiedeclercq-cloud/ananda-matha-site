import Link from "next/link";
import { resolveLink } from "@/lib/links";
import type { SmartLink } from "@/lib/types";

export function CTASection({
  text,
  buttonLabel,
  buttonLink,
  button
}: {
  text: string;
  buttonLabel: string;
  buttonLink: string;
  button?: SmartLink;
}) {
  const resolved = resolveLink(button, { href: buttonLink, label: buttonLabel });

  return (
    <section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mx-auto mb-8 h-px w-24 bg-ashoka" />
        <blockquote className="font-serif text-4xl font-semibold leading-tight text-forest md:text-6xl">
          “{text}”
        </blockquote>
        <Link
          href={resolved.href}
          target={resolved.target}
          rel={resolved.rel}
          className="button-secondary mt-10 inline-flex"
        >
          {resolved.label || buttonLabel}
        </Link>
      </div>
    </section>
  );
}
