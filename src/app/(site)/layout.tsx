import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeVars } from "@/components/ThemeVars";
import { getNavigation, getSiteSettings } from "@/sanity/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteTitle}`
    },
    description: settings.subtitle || settings.footerText
  };
}

export default async function SiteLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, navigation] = await Promise.all([
    getSiteSettings(),
    getNavigation()
  ]);

  return (
    <>
      <ThemeVars settings={settings} />
      <Header settings={settings} navigation={navigation} />
      <main>{children}</main>
      <Footer settings={settings} navigation={navigation} />
    </>
  );
}
