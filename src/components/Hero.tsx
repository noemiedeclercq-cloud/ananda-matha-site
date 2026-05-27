import Image from "next/image";
import Link from "next/link";

export function Hero({
  title,
  subtitle,
  image,
  buttonLabel,
  buttonLink
}: {
  title: string;
  subtitle: string;
  image?: string;
  buttonLabel: string;
  buttonLink: string;
}) {
  return (
    <section className="relative min-h-[calc(100vh-81px)] overflow-hidden bg-forest text-white">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
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
          <Link href={buttonLink} className="button-primary mt-9 inline-flex">
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
