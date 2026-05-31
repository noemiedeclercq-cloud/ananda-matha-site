"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { resolveLink } from "@/lib/links";
import type { HomeCard } from "@/lib/types";

const hexPattern = /^#[0-9a-fA-F]{6}$/;

function safeColor(value: string | undefined, fallback: string) {
  return value && hexPattern.test(value) ? value : fallback;
}

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
            const frontBackgroundColor = safeColor(
              card.frontBackgroundColor,
              "var(--color-cream)"
            );
            const frontTextColor = safeColor(card.frontTextColor, "var(--color-forest)");
            const backBackgroundColor = safeColor(
              card.backBackgroundColor,
              "var(--color-forest)"
            );
            const backTextColor = safeColor(card.backTextColor, "#ffffff");
            const buttonBackgroundColor = safeColor(
              card.buttonBackgroundColor,
              "var(--color-saffron)"
            );
            const buttonTextColor = safeColor(card.buttonTextColor, "#ffffff");

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
                    <span
                      className="absolute inset-0 overflow-hidden rounded-lg border border-stone-200 text-left shadow-sm [backface-visibility:hidden]"
                      style={{
                        backgroundColor: frontImage ? undefined : frontBackgroundColor,
                        color: frontTextColor
                      }}
                    >
                      {frontImage ? (
                        <Image
                          src={frontImage}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : null}
                      <span className="relative flex h-full flex-col justify-end p-7">
                        <span
                          className={
                            frontImage
                              ? "rounded-md bg-white/88 p-4 shadow-sm backdrop-blur-[2px]"
                              : ""
                          }
                        >
                          <span className="block font-serif text-4xl font-semibold leading-tight">
                            {card.title}
                          </span>
                          <span className="mt-4 block text-base leading-7">
                            {card.frontText || card.text}
                          </span>
                        </span>
                      </span>
                    </span>

                    <span
                      className="absolute inset-0 overflow-hidden rounded-lg text-left shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]"
                      style={{
                        backgroundColor: backImage ? undefined : backBackgroundColor,
                        color: backTextColor
                      }}
                    >
                      {backImage ? (
                        <Image
                          src={backImage}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : null}
                      <span className="relative flex h-full items-end p-7">
                        <span
                          className={
                            backImage
                              ? "rounded-md bg-black/55 p-4 text-base leading-7 shadow-sm backdrop-blur-[2px]"
                              : "text-base leading-7"
                          }
                        >
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
                  className="inline-flex rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] transition hover:opacity-85"
                  style={{
                    backgroundColor: buttonBackgroundColor,
                    color: buttonTextColor
                  }}
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
