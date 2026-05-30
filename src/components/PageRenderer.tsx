import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";
import { resolveLink } from "@/lib/links";
import type { PageContent } from "@/lib/types";

const portableTextComponents = {
  marks: {
    smartLink: ({ children, value }: { children: ReactNode; value?: any }) => {
      const resolved = resolveLink(value, { href: "#" });

      return (
        <Link href={resolved.href} target={resolved.target} rel={resolved.rel}>
          {children}
        </Link>
      );
    }
  }
};

export function PageRenderer({ page }: { page: PageContent }) {
  return (
    <article>
      <section className="relative bg-forest px-6 py-24 text-white lg:px-8">
        {page.heroImage && (
          <Image src={page.heroImage} alt="" fill sizes="100vw" className="object-cover opacity-35" />
        )}
        <div className="absolute inset-0 bg-forest/65" />
        <div className="relative mx-auto max-w-5xl">
          <p className="eyebrow text-cream/80">Ananda Matha Monastery</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold md:text-7xl">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-cream/85">
              {page.excerpt}
            </p>
          )}
        </div>
      </section>

      <section className="bg-cream px-6 py-16 lg:px-8">
        <div className="prose-like mx-auto max-w-4xl rounded-lg bg-white px-6 py-10 shadow-sm md:px-12">
          {Array.isArray(page.body) ? (
            <PortableText
              value={page.body as PortableTextBlock[]}
              components={portableTextComponents}
            />
          ) : (
            page.body.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))
          )}
        </div>
      </section>
    </article>
  );
}
