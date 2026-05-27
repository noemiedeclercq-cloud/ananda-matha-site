import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl font-semibold text-forest">
        Page not found
      </h1>
      <p className="mt-5 text-lg text-stone-700">
        This page is not available. Return to the monastery home page.
      </p>
      <Link className="button-primary mt-8 inline-flex" href="/">
        Back home
      </Link>
    </section>
  );
}
