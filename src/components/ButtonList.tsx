import Link from "next/link";
import { resolveLink } from "@/lib/links";
import type { ActionButton, SmartLink } from "@/lib/types";

const hexPattern = /^#[0-9a-fA-F]{6}$/;

function safeColor(value: string | undefined) {
  return value && hexPattern.test(value) ? value : undefined;
}

export function legacyButton(link?: SmartLink, style: "primary" | "secondary" = "primary") {
  return link ? [{ enabled: true, link, style }] : [];
}

export function ButtonList({
  buttons,
  className = "",
  fallbackClassName
}: {
  buttons?: ActionButton[];
  className?: string;
  fallbackClassName?: string;
}) {
  const visibleButtons = (buttons || []).filter((button) => button.enabled !== false);

  if (!visibleButtons.length) return null;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {visibleButtons.map((button, index) => {
        const resolved = resolveLink(button.link);
        if (!resolved.href || resolved.href === "#") return null;

        const styleClass =
          fallbackClassName ||
          (button.style === "secondary" ? "button-secondary" : "button-primary");

        return (
          <Link
            key={`${resolved.href}-${resolved.label || index}`}
            href={resolved.href}
            target={resolved.target}
            rel={resolved.rel}
            className={`inline-flex ${styleClass}`}
            style={{
              backgroundColor: safeColor(button.backgroundColor),
              color: safeColor(button.textColor)
            }}
          >
            {resolved.label || "Read more"}
          </Link>
        );
      })}
    </div>
  );
}
