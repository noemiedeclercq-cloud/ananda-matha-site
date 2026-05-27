import type { SiteSettings } from "@/lib/types";

const hexPattern = /^#[0-9a-fA-F]{6}$/;

function safeColor(value: string | undefined, fallback: string) {
  return value && hexPattern.test(value) ? value : fallback;
}

export function ThemeVars({ settings }: { settings: SiteSettings }) {
  const theme = settings.theme || {};
  const cream = safeColor(theme.cream, "#faf5ea");
  const saffron = safeColor(theme.saffron, "#c8741d");
  const forest = safeColor(theme.forest, "#173f2d");
  const ashoka = safeColor(theme.ashoka, "#1d4f91");

  return (
    <style>{`:root{--color-cream:${cream};--color-saffron:${saffron};--color-forest:${forest};--color-ashoka:${ashoka};}`}</style>
  );
}
