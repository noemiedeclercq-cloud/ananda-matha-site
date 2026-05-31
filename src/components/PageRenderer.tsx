import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";
import { ButtonList, legacyButton } from "@/components/ButtonList";
import { resolveLink } from "@/lib/links";
import type { PageBlock, PageContent, SmartLink } from "@/lib/types";

const portableTextComponents = {
  marks: {
    smartLink: ({ children, value }: { children: ReactNode; value?: SmartLink }) => {
      const resolved = resolveLink(value, { href: "#" });

      return (
        <Link href={resolved.href} target={resolved.target} rel={resolved.rel}>
          {children}
        </Link>
      );
    }
  }
};

function LegacyBody({ body }: { body: string | PortableTextBlock[] }) {
  return (
    <div className="prose-like mx-auto max-w-4xl rounded-lg bg-white px-6 py-10 shadow-sm md:px-12">
      {Array.isArray(body) ? (
        <PortableText value={body} components={portableTextComponents} />
      ) : (
        body.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)
      )}
    </div>
  );
}

function PageBlockRenderer({ block }: { block: PageBlock }) {
  switch (block._type) {
    case "pageTextBlock":
      return (
        <section className="prose-like mx-auto max-w-4xl">
          {block.content?.length ? (
            <PortableText value={block.content} components={portableTextComponents} />
          ) : null}
        </section>
      );

    case "pageImageBlock":
      if (!block.image) return null;
      return (
        <figure className="mx-auto max-w-5xl">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-white shadow-sm">
            <Image
              src={block.image}
              alt={block.alt || ""}
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-stone-600">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "pageGalleryBlock":
      if (!block.images?.length) return null;
      return (
        <section className="mx-auto max-w-6xl">
          {block.title && (
            <h2 className="mb-8 font-serif text-3xl font-semibold text-forest md:text-4xl">
              {block.title}
            </h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {block.images.map((item) =>
              item.image ? (
                <figure key={`${item.image}-${item.caption || item.alt}`} className="min-w-0">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white shadow-sm">
                    <Image
                      src={item.image}
                      alt={item.alt || ""}
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  {item.caption && (
                    <figcaption className="mt-2 text-sm leading-6 text-stone-600">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              ) : null
            )}
          </div>
        </section>
      );

    case "pageButtonBlock":
      return (
        <section className="mx-auto flex max-w-4xl justify-center">
          <ButtonList
            buttons={block.buttons?.length ? block.buttons : legacyButton(block.link, block.style)}
            className="justify-center"
          />
        </section>
      );

    case "pagePdfBlock":
      if (!block.fileUrl) return null;
      return (
        <section className="quiet-panel mx-auto max-w-4xl p-7 md:p-9">
          <p className="eyebrow">Document</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-forest">
            {block.title || "PDF"}
          </h2>
          {block.text && <p className="mt-4 text-lg leading-8 text-stone-700">{block.text}</p>}
          <a className="button-primary mt-6 inline-flex" href={block.fileUrl} download>
            {block.buttonLabel || "Download PDF"}
          </a>
        </section>
      );

    case "pageAudioBlock":
      if (!block.fileUrl) return null;
      return (
        <section className="mx-auto max-w-4xl rounded-lg bg-white p-7 shadow-sm md:p-9">
          <p className="eyebrow">Audio</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-forest">
            {block.title || "Audio"}
          </h2>
          {block.text && <p className="mt-4 text-lg leading-8 text-stone-700">{block.text}</p>}
          <audio className="mt-6 w-full" controls src={block.fileUrl}>
            Your browser does not support the audio element.
          </audio>
        </section>
      );

    case "pageQuoteBlock":
      return (
        <figure className="mx-auto max-w-4xl border-l-4 border-saffron py-3 pl-6">
          <p className="whitespace-pre-line font-serif text-3xl leading-snug text-forest md:text-4xl">
            {block.quote}
          </p>
          {block.attribution && (
            <figcaption className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-saffron">
              {block.attribution}
            </figcaption>
          )}
        </figure>
      );

    case "pageInfoBlock":
      return (
        <section className="quiet-panel mx-auto max-w-4xl p-7 md:p-9">
          <h2 className="font-serif text-3xl font-semibold text-forest">{block.title}</h2>
          {block.text && (
            <p className="mt-4 whitespace-pre-line text-lg leading-8 text-stone-700">
              {block.text}
            </p>
          )}
        </section>
      );

    case "pageCtaBlock":
      return (
        <section className="mx-auto max-w-5xl rounded-lg bg-forest px-7 py-10 text-center text-white shadow-sm md:px-12">
          <h2 className="font-serif text-4xl font-semibold md:text-5xl">{block.title}</h2>
          {block.text && (
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-cream/85">
              {block.text}
            </p>
          )}
          <div className="mt-7">
            <ButtonList
              buttons={block.buttons?.length ? block.buttons : legacyButton(block.button)}
              className="justify-center"
            />
          </div>
        </section>
      );

    case "pageDividerBlock":
      return (
        <div className={block.spacing === "large" ? "mx-auto max-w-4xl py-8" : "mx-auto max-w-4xl py-3"}>
          <hr className="border-t border-saffron/30" />
        </div>
      );

    default:
      return null;
  }
}

function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12">
      {blocks.map((block) => (
        <PageBlockRenderer key={block._key || `${block._type}-${block.title}`} block={block} />
      ))}
    </div>
  );
}

export function PageRenderer({ page }: { page: PageContent }) {
  const hasBlocks = Boolean(page.blocks?.length);

  return (
    <article>
      <section className="relative bg-forest px-6 py-24 text-white lg:px-8">
        {page.heroImage && (
          <Image
            src={page.heroImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
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
        {hasBlocks ? <PageBlocks blocks={page.blocks || []} /> : <LegacyBody body={page.body} />}
      </section>
    </article>
  );
}
