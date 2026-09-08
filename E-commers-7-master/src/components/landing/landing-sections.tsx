import Link from "next/link";
import { rootCategoryWhere } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryCarousel } from "@/components/home/category-carousel";
import { ProductCarousel } from "@/components/home/product-carousel";
import { ProductCard } from "@/components/product/product-card";
import { getBannerImage } from "@/lib/product-images";
import {
  type LandingSection,
  num,
  stripUnsafeHtml,
  str,
} from "@/lib/landing-pages";

function sectionStyle(settings?: LandingSection["settings"]) {
  const style: React.CSSProperties = {};
  if (settings?.paddingTop != null) style.paddingTop = settings.paddingTop;
  if (settings?.paddingBottom != null) style.paddingBottom = settings.paddingBottom;
  if (settings?.backgroundColor) style.backgroundColor = settings.backgroundColor;
  return style;
}

async function fetchProducts(content: Record<string, unknown>, featured = false) {
  const limit = num(content.limit, 8);
  const categorySlug = str(content.categorySlug);

  const where: {
    isPublished: boolean;
    isFeatured?: boolean;
    category?: { slug: string };
  } = { isPublished: true };

  if (featured) where.isFeatured = true;
  if (categorySlug) where.category = { slug: categorySlug };

  return prisma.product.findMany({
    where,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

async function SectionBlock({ section }: { section: LandingSection }) {
  const { type, content, settings } = section;
  const wrap = (children: React.ReactNode) => (
    <div style={sectionStyle(settings)}>{children}</div>
  );

  switch (type) {
    case "hero": {
      const slides = [
        {
          title: str(content.title, "Welcome"),
          image: str(content.backgroundImage, "/images/banners/banner-1.jpg"),
          link: str(content.ctaLink, "/shop"),
        },
      ];
      return wrap(<HeroCarousel banners={slides} />);
    }

    case "banner_carousel": {
      const banners = await prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
      if (banners.length === 0) return null;
      return wrap(<HeroCarousel banners={banners} />);
    }

    case "banner":
      return wrap(
        <section className="bg-white py-2">
          <div className="mx-auto max-w-7xl px-2 sm:px-4">
            <Link href={str(content.link, "/shop")} className="block overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getBannerImage(str(content.image), 0)}
                alt={str(content.alt, str(content.title, "Banner"))}
                className="h-32 w-full object-cover sm:h-48 md:h-56"
              />
            </Link>
          </div>
        </section>,
      );

    case "text": {
      const align = str(content.alignment, "center");
      const alignClass =
        align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";
      return wrap(
        <section className="bg-white py-6">
          <div className={`mx-auto max-w-3xl px-4 ${alignClass}`}>
            {str(content.heading) && (
              <h2 className="text-xl font-bold text-[#222] sm:text-2xl">{str(content.heading)}</h2>
            )}
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#555] sm:text-base">
              {str(content.body)}
            </p>
          </div>
        </section>,
      );
    }

    case "cta":
      return wrap(
        <section
          className="py-10 text-white"
          style={{ backgroundColor: str(content.backgroundColor, "#4caf50") }}
        >
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold">{str(content.title)}</h2>
            {str(content.subtitle) && <p className="mt-2 text-white/90">{str(content.subtitle)}</p>}
            <Link
              href={str(content.buttonLink, "/shop")}
              className="mt-5 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-[#333] shadow transition hover:bg-white/90"
            >
              {str(content.buttonText, "Shop Now")}
            </Link>
          </div>
        </section>,
      );

    case "category_grid": {
      const limit = num(content.limit, 7);
      const categories = await prisma.category.findMany({
        where: rootCategoryWhere,
        orderBy: { sortOrder: "asc" },
        take: limit,
      });
      return wrap(<CategoryCarousel categories={categories} title={str(content.title, "Top Categories")} />);
    }

    case "product_slider":
    case "featured_products": {
      const products = await fetchProducts(content, type === "featured_products");
      return wrap(
        <ProductCarousel
          title={str(content.title, "Products")}
          products={products}
          viewMoreHref={str(content.viewMoreHref, "/shop") || undefined}
        />,
      );
    }

    case "product_grid": {
      const products = await fetchProducts(content);
      if (products.length === 0) return null;
      return wrap(
        <section className="homeproduct mt-4 bg-white py-3">
          <div className="mx-auto max-w-7xl px-2 sm:px-4">
            <h2 className="text-base font-semibold text-[#333]">{str(content.title, "Products")}</h2>
            <div className="mt-2 border-b border-[#e0e0e0]" />
            <div className="category-product main_product_inner mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>,
      );
    }

    case "faq": {
      const items = Array.isArray(content.items) ? content.items : [];
      return wrap(
        <section className="bg-white py-8">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-xl font-bold text-[#222]">{str(content.title, "FAQ")}</h2>
            <div className="mt-6 space-y-3">
              {items.map((item, i) => {
                const faq = item as { question?: string; answer?: string };
                return (
                  <details
                    key={i}
                    className="rounded-lg border border-[#e0e0e0] bg-[#fafafa] px-4 py-3"
                  >
                    <summary className="cursor-pointer font-medium text-[#333]">
                      {str(faq.question, `Question ${i + 1}`)}
                    </summary>
                    <p className="mt-2 text-sm text-[#666]">{str(faq.answer)}</p>
                  </details>
                );
              })}
            </div>
          </div>
        </section>,
      );
    }

    case "testimonials": {
      const items = Array.isArray(content.items) ? content.items : [];
      return wrap(
        <section className="bg-[#ebf4ff] py-8">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-xl font-bold text-[#222]">
              {str(content.title, "Testimonials")}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => {
                const t = item as { name?: string; text?: string; rating?: number };
                return (
                  <div key={i} className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-[#555]">&ldquo;{str(t.text)}&rdquo;</p>
                    <p className="mt-3 text-sm font-semibold text-[#222]">— {str(t.name)}</p>
                    {t.rating != null && (
                      <p className="mt-1 text-xs text-amber-500">{"★".repeat(Number(t.rating) || 5)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>,
      );
    }

    case "countdown":
      return wrap(
        <section className="bg-[#1a1a2e] py-8 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-xl font-bold">{str(content.title, "Sale Ends Soon")}</h2>
            <p className="mt-2 text-sm text-white/70">
              Ends: {new Date(str(content.endDate)).toLocaleString("en-BD")}
            </p>
            <Link
              href={str(content.ctaLink, "/shop")}
              className="mt-4 inline-block rounded-lg bg-[#4caf50] px-6 py-2.5 text-sm font-semibold text-white"
            >
              {str(content.ctaText, "Shop Now")}
            </Link>
          </div>
        </section>,
      );

    case "spacer":
      return <div style={{ height: num(content.height, 32) }} aria-hidden />;

    case "custom_html":
      return wrap(
        <section
          className="prose prose-sm mx-auto max-w-4xl px-4 py-4"
          dangerouslySetInnerHTML={{ __html: stripUnsafeHtml(str(content.html)) }}
        />,
      );

    default:
      return null;
  }
}

export async function LandingSections({ sections }: { sections: LandingSection[] }) {
  const visible = sections.filter((s) => s.isVisible);

  return (
    <div>
      {visible.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </div>
  );
}
