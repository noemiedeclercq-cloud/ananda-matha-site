import Link from "next/link";

export default function SiteLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-cream/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-forest text-sm font-black text-white">
              R
            </span>
            <span>
              <strong className="block text-lg leading-none text-forest">
                Retreato
              </strong>
              <small className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Retraites en abbaye
              </small>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-bold text-stone-700 md:flex">
            <Link href="/#lieux" className="hover:text-rust">
              Lieux
            </Link>
            <Link href="/#fonctionnement" className="hover:text-rust">
              Fonctionnement
            </Link>
            <Link href="/admin" className="hover:text-rust">
              Back-office
            </Link>
          </nav>

          <Link
            href="/admin"
            className="rounded-full bg-rust px-4 py-2 text-sm font-black text-white"
          >
            Espace communauté
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-stone-200 bg-forest px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-2xl font-black">Retreato</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              Plateforme de réservation simple pour hôtelleries monastiques en
              Belgique et en France.
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Pas WordPress. Un outil métier.
          </p>
        </div>
      </footer>
    </>
  );
}
