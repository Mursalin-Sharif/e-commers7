import type { Metadata } from "next";
import { rootCategoryWhere } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import { parseSections } from "@/lib/landing-pages";
import { LandingSections } from "@/components/landing/landing-sections";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryCarousel } from "@/components/home/category-carousel";
import { ProductCarousel } from "@/components/home/product-carousel";
import { getSiteSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [homepage, settings] = await Promise.all([
    prisma.landingPage.findFirst({ where: { isHomepage: true, status: "published" } }),
    getSiteSettings(),
  ]);

  return {
    title: homepage?.seoTitle || `${settings.siteName} — ${settings.tagline}`,
    description: homepage?.seoDescription || settings.tagline,
  };
}

export default async function HomePage() {
  const homepage = await prisma.landingPage.findFirst({
    where: { isHomepage: true, status: "published" },
  });

  if (homepage) {
    const sections = parseSections(homepage.sections);
    if (sections.length > 0) {
      return <LandingSections sections={sections} />;
    }
  }

  const [featuredProducts, categories, banners] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: rootCategoryWhere,
      orderBy: { sortOrder: "asc" },
      take: 7,
    }),
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 5,
    }),
  ]);

  const productsByCategory = await Promise.all(
    categories.map(async (category) => ({
      category,
      products: await prisma.product.findMany({
        where: { categoryId: category.id, isPublished: true },
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
    })),
  );

  return (
    <div>
      <HeroCarousel banners={banners} />
      <CategoryCarousel categories={categories} />
      <ProductCarousel title="Featured Products" products={featuredProducts} viewMoreHref="/shop" />

      {productsByCategory.map(({ category, products }) =>
        products.length > 0 ? (
          <ProductCarousel
            key={category.id}
            title={category.name}
            products={products}
            viewMoreHref={`/category/${category.slug}`}
          />
        ) : null,
      )}
    </div>
  );
}
