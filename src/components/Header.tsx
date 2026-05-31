"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { resolveLink } from "@/lib/links";
import type { NavigationItem, SiteSettings } from "@/lib/types";

type MenuEntry = {
  item: NavigationItem;
  resolved: ReturnType<typeof resolveLink>;
  children: MenuEntry[];
};

function resolveMenuItem(item: NavigationItem): MenuEntry {
  const resolved = resolveLink(item.link, {
    href: item.url,
    label: item.label
  });
  const children = (item.children || []).map(resolveMenuItem);

  return { item, resolved, children };
}

function itemIsActive(pathname: string, entry: MenuEntry) {
  return (
    pathname === entry.resolved.href ||
    entry.children.some((child) => pathname === child.resolved.href)
  );
}

function DesktopMenuItem({ entry, pathname }: { entry: MenuEntry; pathname: string }) {
  const active = itemIsActive(pathname, entry);
  const hasChildren = entry.children.length > 0;
  const canClick = entry.resolved.href && entry.resolved.href !== "#" && !entry.item.isMenuOnly;
  const label = entry.resolved.label || entry.item.label;

  return (
    <div className="group/menu relative">
      {canClick ? (
        <Link
          href={entry.resolved.href}
          target={entry.resolved.target}
          rel={entry.resolved.rel}
          className="inline-flex items-center gap-1 py-3 transition"
          style={{ color: active ? "var(--menu-active)" : undefined }}
          onMouseEnter={(event) => {
            event.currentTarget.style.color = "var(--menu-hover)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.color = active ? "var(--menu-active)" : "";
          }}
        >
          {label}
          {hasChildren ? <ChevronDown size={15} aria-hidden="true" /> : null}
        </Link>
      ) : (
        <button
          type="button"
          className="inline-flex items-center gap-1 py-3 font-medium transition"
          style={{ color: active ? "var(--menu-active)" : undefined }}
        >
          {label}
          {hasChildren ? <ChevronDown size={15} aria-hidden="true" /> : null}
        </button>
      )}

      {hasChildren ? (
        <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-2 rounded-md border border-saffron/20 bg-white p-2 text-sm text-forest opacity-0 shadow-xl transition group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100">
          {entry.children.map((child) => (
            <Link
              key={`${child.item.label}-${child.resolved.href}`}
              href={child.resolved.href}
              target={child.resolved.target}
              rel={child.resolved.rel}
              className="block rounded px-3 py-2 transition hover:bg-cream hover:text-saffron focus:bg-cream focus:text-saffron"
            >
              {child.resolved.label || child.item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileMenuItem({
  entry,
  pathname,
  onNavigate
}: {
  entry: MenuEntry;
  pathname: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(itemIsActive(pathname, entry));
  const hasChildren = entry.children.length > 0;
  const canClick = entry.resolved.href && entry.resolved.href !== "#" && !entry.item.isMenuOnly;
  const active = itemIsActive(pathname, entry);
  const label = entry.resolved.label || entry.item.label;

  return (
    <div>
      <div className="flex items-center gap-2">
        {canClick ? (
          <Link
            href={entry.resolved.href}
            target={entry.resolved.target}
            rel={entry.resolved.rel}
            onClick={onNavigate}
            className="min-h-11 flex-1 rounded-md px-3 py-3 text-sm font-medium"
            style={{ color: active ? "var(--menu-active)" : "var(--menu-text)" }}
          >
            {label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="min-h-11 flex-1 rounded-md px-3 py-3 text-left text-sm font-medium"
            style={{ color: active ? "var(--menu-active)" : "var(--menu-text)" }}
          >
            {label}
          </button>
        )}

        {hasChildren ? (
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={`Afficher les sous-pages de ${label}`}
            onClick={() => setExpanded((value) => !value)}
            className="icon-button"
            style={{
              backgroundColor: "var(--menu-button-background)",
              color: "var(--menu-button-text)"
            }}
          >
            <ChevronDown
              size={18}
              className={`transition ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>

      {hasChildren && expanded ? (
        <div className="ml-4 mt-1 grid gap-1 border-l border-saffron/25 pl-3">
          {entry.children.map((child) => (
            <Link
              key={`${child.item.label}-${child.resolved.href}`}
              href={child.resolved.href}
              target={child.resolved.target}
              rel={child.resolved.rel}
              onClick={onNavigate}
              className="rounded-md px-3 py-2 text-sm font-medium"
              style={{
                color:
                  pathname === child.resolved.href
                    ? "var(--menu-active)"
                    : "var(--menu-text)"
              }}
            >
              {child.resolved.label || child.item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Header({
  settings,
  navigation
}: {
  settings: SiteSettings;
  navigation: NavigationItem[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuItems = navigation.map(resolveMenuItem);

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
          aria-label="Menu principal"
        >
          {menuItems.map((entry) => (
            <DesktopMenuItem
              key={`${entry.item.label}-${entry.resolved.href}`}
              entry={entry}
              pathname={pathname}
            />
          ))}
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
          aria-label="Menu mobile"
        >
          <div className="grid gap-2">
            {menuItems.map((entry) => (
              <MobileMenuItem
                key={`${entry.item.label}-${entry.resolved.href}`}
                entry={entry}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
