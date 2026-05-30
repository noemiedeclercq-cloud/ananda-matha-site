"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { resolveLink } from "@/lib/links";
import type { HomeCard } from "@/lib/types";

export function CardGrid({ cards }: { cards: HomeCard[] }) {
  const [openCard, setOpenCard] = useState<string | null>(null);

  return (
    <section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Discover more</p>
        <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const resolved = resolveLink(card.button, {
              href: card.link,
              label: card.linkLabel
            });
            const flipped = openCard === card.title;
            const frontImage = card.frontImage || card.image;
            const backImage = card.backImage || card.image;

            return (
              <article key={card.title} className="space-y-5">
                <button
                  type="button"
                  className="group block h-80 w-full [perspective:1200px]"
                  aria-pressed={flipped}
                  onClick={() =>
                    setOpenCard((current) =>
                      current === card.title ? null : card.title
                    )
                  }
                  onFocus={() => setOpenCard(card.title)}
                  onBlur={() => setOpenCard(null)}
                >
                  <span
                    className={`relative block h-full rounded-lg transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)] ${
                      flipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-lg border border-stone-200 bg-cream p-7 text-left shadow-sm [backface-visibility:hidden]">
                      {frontImage ? (
                        <Image
                          src={frontImage}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover opacity-[0.22]"
                        />
                      ) : null}
                      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,245,234,0.82),rgba(255,255,255,0.96))]" />
                      <span className="relative flex h-full flex-col justify-end">
                        <span className="font-serif text-4xl font-semibold leading-tight text-forest">
                          {card.title}
                        </span>
                        <span className="mt-4 text-base leading-7 text-stone-700">
                          {card.frontText || card.text}
                        </span>
                      </span>
                    </span>

                    <span className="absolute inset-0 overflow-hidden rounded-lg bg-forest text-left text-white shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      {backImage ? (
                        <Image
                          src={backImage}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : null}
                      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,53,37,0.1),rgba(13,53,37,0.82))]" />
                      <span className="relative flex h-full items-end p-7">
                        <span className="text-base leading-7 text-white">
                          {card.backText || card.text}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>

                {card.audioUrl ? (
                  <audio controls className="w-full">
                    <source src={card.audioUrl} />
                  </audio>
                ) : null}

                <Link
                  href={resolved.href}
                  target={resolved.target}
                  rel={resolved.rel}
                  className="inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-saffron hover:text-forest"
                >
                  {resolved.label || card.linkLabel}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
