import type { SmartLink } from "./types";

export type ResolvedLink = {
  href: string;
  label?: string;
  target?: "_blank";
  rel?: "noreferrer";
};

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export function resolveLink(
  link?: SmartLink,
  fallback?: { href?: string; label?: string }
): ResolvedLink {
  const label = link?.label || fallback?.label;

  if (!link?.type) {
    return { href: fallback?.href || "#", label };
  }

  if (link.type === "internal" && link.internalPage?.slug) {
    return {
      href: `/${link.internalPage.slug}`,
      label,
      target: link.openInNewTab ? "_blank" : undefined,
      rel: link.openInNewTab ? "noreferrer" : undefined
    };
  }

  if (link.type === "external" && link.externalUrl) {
    return {
      href: link.externalUrl,
      label,
      target: link.openInNewTab ? "_blank" : undefined,
      rel: link.openInNewTab ? "noreferrer" : undefined
    };
  }

  if (link.type === "file" && link.fileUrl) {
    return {
      href: link.fileUrl,
      label,
      target: "_blank",
      rel: "noreferrer"
    };
  }

  if (link.type === "email" && link.email) {
    return { href: `mailto:${link.email}`, label };
  }

  if (link.type === "phone" && link.phone) {
    return { href: `tel:${normalizePhone(link.phone)}`, label };
  }

  return { href: fallback?.href || "#", label };
}
