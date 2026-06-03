import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageRenderer } from "@/components/PageRenderer";
import { getAllPageSlugs, getGalleryItems, getPageBySlug } from "@/sanity/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) return {};

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.excerpt
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  if (slug === "pictures") {
    const galleryItems = await getGalleryItems();

    return (
      <>
        <PageRenderer page={page} />
        <GalleryGrid items={galleryItems} />
      </>
    );
  }

  return <PageRenderer page={page} />;
}
