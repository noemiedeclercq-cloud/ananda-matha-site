import Image from "next/image";
import Link from "next/link";
import type { HomeCard } from "@/lib/types";

export function CardGrid({ cards }: { cards: HomeCard[] }) {
  return (
    <section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Discover more</p>
        <div className="mt-8 grid gap-7 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                {card.image && (
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-7">
                <h2 className="font-serif text-3xl font-semibold text-forest">
                  {card.title}
                </h2>
                <p className="mt-4 leading-7 text-stone-700">{card.text}</p>
                <Link
                  href={card.link}
                  className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-saffron hover:text-forest"
                >
                  {card.linkLabel}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
