import type { Metadata } from "next";
import { OraTeoStudioPrototype } from "./OraTeoStudioPrototype";

export const metadata: Metadata = {
  title: "Studio OraTeo",
  robots: {
    index: false,
    follow: false
  }
};

export default function OraTeoStudioPage() {
  return <OraTeoStudioPrototype />;
}
