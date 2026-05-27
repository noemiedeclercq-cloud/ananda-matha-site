import Image from "next/image";

export function VisitingHours({
  title,
  content,
  image
}: {
  title: string;
  content: string;
  image?: string;
}) {
  return (
    <section className="bg-cream px-6 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-white shadow-sm">
          {image && (
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div>
          <p className="eyebrow">Welcome</p>
          <h2 className="mt-4 font-serif text-5xl font-semibold text-forest">
            {title}
          </h2>
          <div className="prose-like mt-7 whitespace-pre-line text-lg leading-9">
            {content}
          </div>
        </div>
      </div>
    </section>
  );
}
