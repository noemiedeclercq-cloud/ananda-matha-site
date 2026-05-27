import { Heart, Leaf, Sparkles } from "lucide-react";
import type { ValueItem } from "@/lib/types";

const icons = [Sparkles, Leaf, Heart];

export function ValueStrip({ values }: { values: ValueItem[] }) {
  return (
    <section className="bg-cream px-6 py-18 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {values.map((value, index) => {
          const Icon = icons[index] || Sparkles;
          return (
            <article key={value.title} className="quiet-panel p-7">
              <Icon className="text-saffron" size={28} />
              <h2 className="mt-6 font-serif text-3xl font-semibold text-forest">
                {value.title}
              </h2>
              <p className="mt-4 leading-7 text-stone-700">{value.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
