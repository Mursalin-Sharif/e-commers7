import { PrismaClient } from "@prisma/client";
import { UserRole } from "../src/lib/db-enums";
import bcrypt from "bcryptjs";
import { getProductImagePath, getProductSeeds } from "./seed-products-data";
import { subcategorySeeds } from "./seed-subcategories";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin@12345",
    12,
  );

  await prisma.user.upsert({
    where: { phone: process.env.ADMIN_PHONE || "01700000000" },
    update: {
      name: "Paki Admin",
      email: process.env.ADMIN_EMAIL || "admin@paki.com",
      passwordHash,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
    create: {
      name: "Paki Admin",
      email: process.env.ADMIN_EMAIL || "admin@paki.com",
      phone: process.env.ADMIN_PHONE || "01700000000",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const categories = [
    { name: "Gadget", slug: "gadget", image: "/images/categories/gadget.jpg" },
    { name: "Men's Fashion", slug: "mens-fashion", image: "/images/categories/mens-fashion.jpg" },
    { name: "Women's Fashion", slug: "womens-fashion", image: "/images/categories/womens-fashion.jpg" },
    { name: "Kids", slug: "kids", image: "/images/categories/kids.jpg" },
    { name: "Grocery", slug: "grocery", image: "/images/categories/grocery.jpg" },
    { name: "Beauty & Health", slug: "beauty-health", image: "/images/categories/beauty-health.jpg" },
    { name: "Home Decor", slug: "home-decor", image: "/images/categories/home-decor.jpg" },
  ];

  const categoryMap: Record<string, string> = {};

  for (const [index, cat] of categories.entries()) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { image: cat.image, name: cat.name, parentId: null },
      create: {
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        sortOrder: index,
        parentId: null,
      },
    });
    categoryMap[cat.slug] = created.id;
  }

  for (const [parentSlug, children] of Object.entries(subcategorySeeds)) {
    const parentId = categoryMap[parentSlug];
    if (!parentId) continue;

    for (const [index, child] of children.entries()) {
      await prisma.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name, parentId, sortOrder: index, isActive: true },
        create: {
          name: child.name,
          slug: child.slug,
          parentId,
          sortOrder: index,
          isActive: true,
        },
      });
    }
  }

  const brands = [
    { name: "Oraimo", slug: "oraimo" },
    { name: "Arctic Hunter", slug: "arctic-hunter" },
    { name: "PRAN", slug: "pran" },
    { name: "Igloo", slug: "igloo" },
    { name: "Paki Select", slug: "paki-select" },
  ];

  const brandMap: Record<string, string> = {};

  for (const brand of brands) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
    brandMap[brand.slug] = created.id;
  }

  const productSeeds = getProductSeeds();
  const seedSlugs = productSeeds.map((p) => p.slug);

  await prisma.cartItem.deleteMany({
    where: { product: { slug: { notIn: seedSlugs } } },
  });
  await prisma.wishlistItem.deleteMany({
    where: { product: { slug: { notIn: seedSlugs } } },
  });
  await prisma.review.deleteMany({
    where: { product: { slug: { notIn: seedSlugs } } },
  });
  await prisma.product.deleteMany({
    where: { slug: { notIn: seedSlugs } },
  });

  for (const product of productSeeds) {
    const { slug, categorySlug, brandSlug, sku, ...data } = product;
    const record = {
      ...data,
      sku,
      categoryId: categoryMap[categorySlug],
      brandId: brandSlug ? brandMap[brandSlug] : null,
      images: JSON.stringify([getProductImagePath(slug)]),
    };
    const existing = await prisma.product.findFirst({
      where: { OR: [{ slug }, { sku }] },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { slug, ...record },
      });
    } else {
      await prisma.product.create({
        data: { slug, ...record },
      });
    }
  }

  console.log(`✅ Seeded ${productSeeds.length} products`);

  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: [
      {
        title: "Summer Sale",
        image: "/images/banners/banner-1.jpg",
        link: "/shop",
        sortOrder: 0,
      },
      {
        title: "New Arrivals",
        image: "/images/banners/banner-2.jpg",
        link: "/shop?sort=newest",
        sortOrder: 1,
      },
      {
        title: "Gadget Collection",
        image: "/images/banners/banner-3.jpg",
        link: "/category/gadget",
        sortOrder: 2,
      },
      {
        title: "Grocery Deals",
        image: "/images/banners/banner-4.jpg",
        link: "/category/grocery",
        sortOrder: 3,
      },
      {
        title: "Fashion Sale",
        image: "/images/banners/banner-5.jpg",
        link: "/category/womens-fashion",
        sortOrder: 4,
      },
    ],
  });

  const settings = [
    { group: "general", key: "site_name", value: JSON.stringify("Paki") },
    { group: "general", key: "tagline", value: JSON.stringify("Bangladesh's Premium Marketplace") },
    { group: "general", key: "phone", value: JSON.stringify("01700000000") },
    { group: "general", key: "email", value: JSON.stringify("hello@paki.com") },
    { group: "general", key: "address", value: JSON.stringify("Dhaka, Bangladesh") },
    { group: "theme", key: "primary_color", value: JSON.stringify("#E85D04") },
    { group: "theme", key: "secondary_color", value: JSON.stringify("#1A1A2E") },
    { group: "shipping", key: "dhaka_inside", value: JSON.stringify(70) },
    { group: "shipping", key: "dhaka_outside", value: JSON.stringify(130) },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { group_key: { group: setting.group, key: setting.key } },
      update: { value: setting.value },
      create: setting,
    });
  }

  const homepageSections = JSON.stringify([
    {
      id: "seed-banners",
      type: "banner_carousel",
      isVisible: true,
      content: {},
    },
    {
      id: "seed-categories",
      type: "category_grid",
      isVisible: true,
      content: { title: "Top Categories", limit: 7 },
    },
    {
      id: "seed-featured",
      type: "featured_products",
      isVisible: true,
      content: { title: "Featured Products", limit: 8, viewMoreHref: "/shop" },
    },
    {
      id: "seed-gadget",
      type: "product_slider",
      isVisible: true,
      content: { title: "Gadget", limit: 6, categorySlug: "gadget", viewMoreHref: "/category/gadget" },
    },
    {
      id: "seed-fashion",
      type: "product_slider",
      isVisible: true,
      content: {
        title: "Women's Fashion",
        limit: 6,
        categorySlug: "womens-fashion",
        viewMoreHref: "/category/womens-fashion",
      },
    },
  ]);

  await prisma.landingPage.upsert({
    where: { slug: "home" },
    update: {
      title: "Homepage",
      status: "published",
      isHomepage: true,
      sections: homepageSections,
      publishedAt: new Date(),
    },
    create: {
      title: "Homepage",
      slug: "home",
      status: "published",
      isHomepage: true,
      sections: homepageSections,
      publishedAt: new Date(),
      seoTitle: "Paki — Bangladesh's Premium Marketplace",
      seoDescription: "Shop gadgets, fashion, grocery and more at great prices.",
    },
  });

  await prisma.landingPage.upsert({
    where: { slug: "summer-sale" },
    update: {},
    create: {
      title: "Summer Sale",
      slug: "summer-sale",
      status: "published",
      sections: JSON.stringify([
        {
          id: "sale-hero",
          type: "hero",
          isVisible: true,
          content: {
            title: "Summer Sale",
            subtitle: "Up to 50% off on selected items",
            ctaText: "Shop Sale",
            ctaLink: "/shop",
            backgroundImage: "/images/banners/banner-2.jpg",
          },
        },
        {
          id: "sale-cta",
          type: "cta",
          isVisible: true,
          content: {
            title: "Limited Time Offer",
            subtitle: "Don't miss out on amazing deals",
            buttonText: "Browse Deals",
            buttonLink: "/shop",
            backgroundColor: "#E85D04",
          },
        },
        {
          id: "sale-products",
          type: "featured_products",
          isVisible: true,
          content: { title: "Sale Products", limit: 8, viewMoreHref: "/shop" },
        },
      ]),
      publishedAt: new Date(),
      seoTitle: "Summer Sale — Paki",
    },
  });

  const policyPages = [
    {
      slug: "delivery-rules",
      title: "Delivery Rules",
      body: "We deliver across Bangladesh. Dhaka city inside delivery takes 1-2 days. Outside Dhaka takes 3-5 business days. Shipping fees are shown at checkout.",
    },
    {
      slug: "return-policy",
      title: "Return Policy",
      body: "You may return eligible products within 7 days if unused and in original packaging. Contact support with your order number to start a return.",
    },
    {
      slug: "terms-conditions",
      title: "Terms & Conditions",
      body: "By using Paki.com you agree to our marketplace terms. Prices and availability may change. Orders are confirmed after verification call/SMS.",
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      body: "We collect name, phone, and address only to process orders. We do not sell your personal data to third parties.",
    },
  ];

  for (const page of policyPages) {
    const sections = JSON.stringify([
      {
        id: `${page.slug}-text`,
        type: "text",
        isVisible: true,
        content: { heading: page.title, body: page.body, alignment: "left" },
      },
    ]);
    await prisma.landingPage.upsert({
      where: { slug: page.slug },
      update: { title: page.title, sections, status: "published", publishedAt: new Date() },
      create: {
        title: page.title,
        slug: page.slug,
        status: "published",
        sections,
        publishedAt: new Date(),
        seoTitle: `${page.title} — Paki`,
      },
    });
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
