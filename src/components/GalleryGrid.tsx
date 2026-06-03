import Image from "next/image";
import type { GalleryItem } from "@/lib/types";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const visibleItems = items.filter((item) => item.image);

  if (!visibleItems.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <figure key={`${item.title}-${item.image}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white shadow-sm">
              <Image
                src={item.image || ""}
                alt={item.alt || item.title}
                fill
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <figcaption className="mt-3">
              <p className="font-serif text-2xl font-semibold text-forest">
                {item.title}
              </p>
              {item.caption ? (
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  {item.caption}
                </p>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
