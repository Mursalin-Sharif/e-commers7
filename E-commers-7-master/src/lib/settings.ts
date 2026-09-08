import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  shippingDhakaInside: number;
  shippingDhakaOutside: number;
};

const defaults: SiteSettings = {
  siteName: "Paki",
  tagline: "Bangladesh's Premium Marketplace",
  phone: "01700000000",
  email: "hello@paki.com",
  address: "Dhaka, Bangladesh",
  primaryColor: "#E85D04",
  secondaryColor: "#1A1A2E",
  shippingDhakaInside: 70,
  shippingDhakaOutside: 130,
};

function parseValue(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : String(parsed);
  } catch {
    return raw;
  }
}

function parseNumber(raw: string, fallback: number) {
  const n = Number(parseValue(raw));
  return Number.isFinite(n) ? n : fallback;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany({
    where: {
      OR: [
        { group: "general" },
        { group: "theme" },
        { group: "shipping" },
      ],
    },
  });

  const map = Object.fromEntries(rows.map((r) => [`${r.group}.${r.key}`, r.value]));

  return {
    siteName: parseValue(map["general.site_name"] || "") || defaults.siteName,
    tagline: parseValue(map["general.tagline"] || "") || defaults.tagline,
    phone: parseValue(map["general.phone"] || "") || defaults.phone,
    email: parseValue(map["general.email"] || "") || defaults.email,
    address: parseValue(map["general.address"] || "") || defaults.address,
    primaryColor: parseValue(map["theme.primary_color"] || "") || defaults.primaryColor,
    secondaryColor: parseValue(map["theme.secondary_color"] || "") || defaults.secondaryColor,
    shippingDhakaInside: parseNumber(map["shipping.dhaka_inside"] || "", defaults.shippingDhakaInside),
    shippingDhakaOutside: parseNumber(map["shipping.dhaka_outside"] || "", defaults.shippingDhakaOutside),
  };
}
