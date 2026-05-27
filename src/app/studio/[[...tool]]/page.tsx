import { StudioClient } from "./StudioClient";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="min-h-screen bg-cream px-6 py-16 text-stone-900">
        <section className="mx-auto max-w-3xl rounded-lg border border-saffron/20 bg-white p-8 shadow-sm">
          <p className="eyebrow">Sanity Studio</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-forest">
            Studio à configurer
          </h1>
          <p className="mt-5 leading-7 text-stone-700">
            Le site public fonctionne déjà avec des contenus fallback, mais le
            Studio a besoin d’un vrai projet Sanity pour modifier les pages,
            les textes, les photos, la navigation, le footer et les couleurs.
          </p>

          <div className="mt-8 rounded-md bg-cream p-5">
            <p className="text-sm font-semibold text-forest">
              Crée ou renseigne le fichier <code>.env.local</code> :
            </p>
            <pre className="mt-4 overflow-x-auto rounded-md bg-forest p-4 text-sm leading-6 text-cream">
{`NEXT_PUBLIC_SANITY_PROJECT_ID=ton-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-18`}
            </pre>
          </div>

          <p className="mt-6 text-sm leading-6 text-stone-600">
            Après modification, redémarre le serveur local avec{" "}
            <code>npm run dev</code>. Dès que le project ID est réel, cette
            page chargera le Studio Sanity complet.
          </p>
        </section>
      </main>
    );
  }

  return <StudioClient />;
}
