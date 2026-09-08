import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseSections } from "@/lib/landing-pages";
import { LandingSections } from "@/components/landing/landing-sections";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.landingPage.findUnique({ where: { slug } });
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
  };
}

export default async function LandingPageRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;

  const page = await prisma.landingPage.findUnique({ where: { slug } });
  if (!page) notFound();

  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  const isPreview = preview === "1" && isAdmin;

  if (page.status !== "published" && !isPreview) {
    notFound();
  }

  const sections = parseSections(page.sections);

  return (
    <div>
      {isPreview && (
        <div className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white">
          Preview mode — this page is {page.status}
        </div>
      )}
      <LandingSections sections={sections} />
    </div>
  );
}
