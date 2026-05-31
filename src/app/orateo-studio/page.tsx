import type { Metadata } from "next";
import { OraTeoStudioPrototype } from "./OraTeoStudioPrototype";
import { getOraTeoStudioData } from "./services/sanity/readOnly";

export const metadata: Metadata = {
  title: "Studio OraTeo",
  robots: {
    index: false,
    follow: false
  }
};

export default async function OraTeoStudioPage() {
  const studioData = await getOraTeoStudioData();

  return <OraTeoStudioPrototype initialData={studioData} />;
}
