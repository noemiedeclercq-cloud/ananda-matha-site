import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ButtonList, legacyButton } from "@/components/ButtonList";
import type { HomeStory as HomeStoryType } from "@/lib/types";

const hexPattern = /^#[0-9a-fA-F]{6}$/;

function safeColor(value: string | undefined, fallback: string) {
  return value && hexPattern.test(value) ? value : fallback;
}

export function HomeStory({ story }: { story?: HomeStoryType }) {
  if (!story) return null;

  const backgroundColor = safeColor(story.backgroundColor, "var(--color-forest)");
  const textColor = safeColor(story.textColor, "#ffffff");
  const buttons = story.buttons?.length ? story.buttons : legacyButton(story.button, "secondary");

  return (
    <section className="bg-cream px-6 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-lg bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <div
          className="flex min-h-[24rem] flex-col justify-center px-7 py-12 md:px-12"
          style={{ backgroundColor, color: textColor }}
        >
          {story.subtitle ? (
            <p className="text-sm font-bold uppercase tracking-[0.22em] opacity-75">
              {story.subtitle}
            </p>
          ) : null}
          <h2 className="mt-4 font-serif text-5xl font-semibold md:text-6xl">
            {story.title || "Our Story"}
          </h2>
        </div>
        <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
          {story.image ? (
            <div className="relative min-h-72 lg:min-h-full">
              <Image
                src={story.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="prose-like flex flex-col justify-center px-7 py-12 md:px-12">
            {Array.isArray(story.text) ? (
              <PortableText value={story.text as PortableTextBlock[]} />
            ) : story.text ? (
              <p>{story.text}</p>
            ) : null}
            <ButtonList buttons={buttons} className="mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
