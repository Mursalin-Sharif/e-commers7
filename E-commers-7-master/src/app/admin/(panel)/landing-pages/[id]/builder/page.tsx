import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { parseSections } from "@/lib/landing-pages";
import { LandingPageBuilder } from "@/components/admin/landing-page-builder";

export const metadata = { title: "Page Builder" };

export default async function LandingPageBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const page = await prisma.landingPage.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <LandingPageBuilder
      page={{
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        isHomepage: page.isHomepage,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        featuredImage: page.featuredImage,
        sections: parseSections(page.sections),
      }}
    />
  );
}
