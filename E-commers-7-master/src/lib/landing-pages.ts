export const SECTION_TYPES = [
  "hero",
  "banner_carousel",
  "banner",
  "text",
  "cta",
  "category_grid",
  "product_slider",
  "featured_products",
  "product_grid",
  "faq",
  "testimonials",
  "countdown",
  "spacer",
  "custom_html",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export type SectionSettings = {
  paddingTop?: number;
  paddingBottom?: number;
  fullWidth?: boolean;
  backgroundColor?: string;
};

export type LandingSection = {
  id: string;
  type: SectionType;
  isVisible: boolean;
  content: Record<string, unknown>;
  settings?: SectionSettings;
};

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero Banner",
  banner_carousel: "Admin Banners (Carousel)",
  banner: "Image Banner",
  text: "Text Block",
  cta: "Call to Action",
  category_grid: "Categories",
  product_slider: "Product Slider",
  featured_products: "Featured Products",
  product_grid: "Product Grid",
  faq: "FAQ",
  testimonials: "Testimonials",
  countdown: "Countdown",
  spacer: "Spacer",
  custom_html: "Custom HTML",
};

export function parseSections(raw: string): LandingSection[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLandingSection);
  } catch {
    return [];
  }
}

export function serializeSections(sections: LandingSection[]): string {
  return JSON.stringify(sections);
}

function isLandingSection(value: unknown): value is LandingSection {
  if (!value || typeof value !== "object") return false;
  const section = value as LandingSection;
  return (
    typeof section.id === "string" &&
    typeof section.type === "string" &&
    SECTION_TYPES.includes(section.type as SectionType) &&
    typeof section.isVisible === "boolean" &&
    typeof section.content === "object"
  );
}

export function createSection(type: SectionType): LandingSection {
  return {
    id: crypto.randomUUID(),
    type,
    isVisible: true,
    content: defaultContent(type),
    settings: { paddingTop: 0, paddingBottom: 0, fullWidth: true },
  };
}

function defaultContent(type: SectionType): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {
        title: "Welcome to Paki",
        subtitle: "Bangladesh's Premium Marketplace",
        ctaText: "Shop Now",
        ctaLink: "/shop",
        backgroundImage: "/images/banners/banner-1.jpg",
        overlayOpacity: 0.4,
        textAlign: "center",
      };
    case "banner_carousel":
      return { title: "Homepage Banners" };
    case "banner":
      return {
        title: "Special Offer",
        image: "/images/banners/banner-2.jpg",
        link: "/shop",
        alt: "Banner",
      };
    case "text":
      return {
        heading: "About Us",
        body: "Write your content here...",
        alignment: "center",
      };
    case "cta":
      return {
        title: "Ready to shop?",
        subtitle: "Browse thousands of products at great prices",
        buttonText: "Start Shopping",
        buttonLink: "/shop",
        backgroundColor: "#4caf50",
      };
    case "category_grid":
      return { title: "Top Categories", limit: 7 };
    case "product_slider":
      return { title: "New Arrivals", limit: 8, categorySlug: "", viewMoreHref: "/shop" };
    case "featured_products":
      return { title: "Featured Products", limit: 8, viewMoreHref: "/shop" };
    case "product_grid":
      return { title: "Best Sellers", limit: 8, categorySlug: "", viewMoreHref: "/shop" };
    case "faq":
      return {
        title: "Frequently Asked Questions",
        items: [
          { question: "How do I place an order?", answer: "Add products to cart and complete checkout." },
          { question: "What payment methods are available?", answer: "Cash on delivery is available." },
        ],
      };
    case "testimonials":
      return {
        title: "What Customers Say",
        items: [
          { name: "Rahim", text: "Great service and fast delivery!", rating: 5, avatar: "" },
          { name: "Karim", text: "Quality products at good prices.", rating: 5, avatar: "" },
        ],
      };
    case "countdown":
      return {
        title: "Flash Sale Ends In",
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        ctaText: "Shop Now",
        ctaLink: "/shop",
      };
    case "spacer":
      return { height: 32 };
    case "custom_html":
      return { html: "<p>Custom content</p>" };
    default:
      return {};
  }
}

export function stripUnsafeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function num(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
