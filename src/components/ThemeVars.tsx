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
  const headerBackgroundColor = safeColor(theme.headerBackgroundColor, cream);
  const menuTextColor = safeColor(theme.menuTextColor, "#3f3a32");
  const menuHoverColor = safeColor(theme.menuHoverColor, saffron);
  const menuActiveColor = safeColor(theme.menuActiveColor, forest);
  const menuButtonBackgroundColor = safeColor(
    theme.menuButtonBackgroundColor,
    saffron
  );
  const menuButtonTextColor = safeColor(theme.menuButtonTextColor, "#ffffff");

  return (
    <style>{`:root{--color-cream:${cream};--color-saffron:${saffron};--color-forest:${forest};--color-ashoka:${ashoka};--header-background:${headerBackgroundColor};--menu-text:${menuTextColor};--menu-hover:${menuHoverColor};--menu-active:${menuActiveColor};--menu-button-background:${menuButtonBackgroundColor};--menu-button-text:${menuButtonTextColor};}`}</style>
  );
}
