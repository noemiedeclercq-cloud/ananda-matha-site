"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ButtonList, legacyButton } from "@/components/ButtonList";
import type { ActionButton, HeroSlide, SmartLink } from "@/lib/types";

export function Hero({
  title,
  subtitle,
  image,
  slides,
  buttonLabel,
  buttonLink,
  button,
  buttons
}: {
  title: string;
  subtitle: string;
  image?: string;
  slides?: HeroSlide[];
  buttonLabel: string;
  buttonLink: string;
  button?: SmartLink;
  buttons?: ActionButton[];
}) {
  const visibleSlides = useMemo(() => {
    const cmsSlides = (slides || []).filter((slide) => slide.image);
    return cmsSlides.length ? cmsSlides : image ? [{ image, alt: "" }] : [];
  }, [image, slides]);
  const [activeIndex, setActiveIndex] = useState(0);
  const heroButtons = buttons?.length ? buttons : legacyButton(button);

  useEffect(() => {
    setActiveIndex(0);
  }, [visibleSlides.length]);

  useEffect(() => {
    if (visibleSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % visibleSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [visibleSlides.length]);

  return (
    <section className="relative min-h-[calc(100vh-81px)] overflow-hidden bg-forest text-white">
      {visibleSlides.map((slide, index) => (
        <Image
          key={`${slide.image}-${index}`}
          src={slide.image || ""}
          alt={slide.alt || ""}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,53,37,0.88),rgba(13,53,37,0.48),rgba(13,53,37,0.22))]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow text-cream/80">In the heart of Kerala</p>
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.98] md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/88 md:text-xl">
            {subtitle}
          </p>
          <ButtonList buttons={heroButtons} className="mt-9" />
        </div>
      </div>
      {visibleSlides.length > 1 ? (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {visibleSlides.map((slide, index) => (
            <button
              key={`${slide.image}-dot-${index}`}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/55"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
