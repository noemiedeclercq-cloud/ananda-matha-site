"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { resolveLink } from "@/lib/links";
import type { NavigationItem, SiteSettings } from "@/lib/types";

export function Header({
  settings,
  navigation
}: {
  settings: SiteSettings;
  navigation: NavigationItem[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuItems = navigation
    .map((item) => ({
      item,
      resolved: resolveLink(item.link, {
        href: item.url,
        label: item.label
      })
    }))
    .filter(({ resolved }) => resolved.href && resolved.href !== "#");

  return (
    <header
      className="sticky top-0 z-50 border-b border-saffron/20 backdrop-blur-xl"
      style={{ backgroundColor: "color-mix(in srgb, var(--header-background) 92%, transparent)" }}
    >
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
            {settings.subtitle ? (
              <p className="mt-1 hidden max-w-56 text-xs uppercase tracking-[0.22em] text-stone-500 sm:block">
                {settings.subtitle}
              </p>
            ) : null}
          </div>
        </Link>

        <nav
          className="hidden items-center gap-7 text-sm font-medium lg:flex"
          style={{ color: "var(--menu-text)" }}
        >
          {menuItems.map(({ item, resolved }) => {
            const active = pathname === resolved.href;

            return (
              <Link
                key={`${item.label}-${resolved.href}`}
                href={resolved.href}
                target={resolved.target}
                rel={resolved.rel}
                className="transition"
                style={{
                  color: active ? "var(--menu-active)" : undefined
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = "var(--menu-hover)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = active
                    ? "var(--menu-active)"
                    : "";
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="icon-button lg:hidden"
          style={{
            backgroundColor: "var(--menu-button-background)",
            color: "var(--menu-button-text)"
          }}
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          type="button"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-saffron/20 px-5 py-4 lg:hidden"
          style={{ backgroundColor: "var(--header-background)" }}
        >
          <div className="grid gap-2">
            {menuItems.map(({ item, resolved }) => {
              const active = pathname === resolved.href;

              return (
                <Link
                  key={`${item.label}-${resolved.href}`}
                  href={resolved.href}
                  target={resolved.target}
                  rel={resolved.rel}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-sm font-medium hover:bg-white"
                  style={{
                    color: active ? "var(--menu-active)" : "var(--menu-text)"
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
