"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { NavigationItem, SiteSettings } from "@/lib/types";

export function Header({
  settings,
  navigation
}: {
  settings: SiteSettings;
  navigation: NavigationItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-saffron/20 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative grid size-12 place-items-center overflow-hidden rounded-full border border-saffron/40 bg-white shadow-sm">
            {settings.logo ? (
              <Image
                src={settings.logo}
                alt={settings.siteTitle}
                fill
                className="object-cover"
              />
            ) : (
              <span className="font-serif text-2xl font-semibold text-saffron">
                A
              </span>
            )}
          </div>
          <div>
            <p className="font-serif text-xl font-semibold leading-none text-forest">
              {settings.siteTitle}
            </p>
            <p className="mt-1 hidden text-xs uppercase tracking-[0.22em] text-stone-500 sm:block">
              Cistercian Monastery
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-700 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="transition hover:text-saffron"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="icon-button lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          type="button"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-saffron/20 bg-cream px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {navigation.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-stone-700 hover:bg-white hover:text-forest"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
