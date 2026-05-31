import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { resolveLink } from "@/lib/links";
import type { NavigationItem, SiteSettings } from "@/lib/types";

export function Footer({
  settings,
  navigation
}: {
  settings: SiteSettings;
  navigation: NavigationItem[];
}) {
  const year = new Date().getFullYear();
  const menuItems = navigation
    .map((item) => ({
      item,
      resolved: resolveLink(item.link, {
        href: item.url,
        label: item.label
      })
    }));

  return (
    <footer className="border-t border-saffron/20 bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-3xl font-semibold">
            {settings.siteTitle}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-cream/75">
            {settings.footerText || settings.subtitle}
          </p>
        </div>

        <div>
          <p className="footer-title">Explore</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-cream/75">
            {menuItems.map(({ item, resolved }) => {
              return (
                <Link
                  key={`${item.label}-${resolved.href}`}
                  href={resolved.href}
                  target={resolved.target}
                  rel={resolved.rel}
                  className="hover:text-white"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="footer-title">Contact</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-cream/75">
            <p className="flex gap-3">
              <MapPin size={18} className="mt-1 shrink-0 text-saffron" />
              <span>{settings.address}</span>
            </p>
            <p className="flex gap-3">
              <Mail size={18} className="mt-1 shrink-0 text-saffron" />
              <a href={`mailto:${settings.contactEmail}`}>
                {settings.contactEmail}
              </a>
            </p>
            <p className="flex gap-3">
              <Phone size={18} className="mt-1 shrink-0 text-saffron" />
              <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            </p>
          </div>
          {settings.socialLinks?.length ? (
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-cream/75">
              {settings.socialLinks.map((item) => {
                const resolved = resolveLink(item.link, {
                  href: item.url,
                  label: item.label
                });

                if (!resolved.href || resolved.href === "#") return null;

                return (
                  <Link
                    key={`${item.label}-${resolved.href}`}
                    href={resolved.href}
                    target={resolved.target}
                    rel={resolved.rel}
                    className="hover:text-white"
                  >
                    {resolved.label || item.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-cream/60">
        ©{year} by Ananda Matha Ashram Monastery
      </div>
    </footer>
  );
}
