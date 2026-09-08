import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter, SiteHeader, MobileBottomNav } from "@/components/layout/site-chrome";
import { StorefrontChromeGate } from "@/components/layout/storefront-chrome-gate";
import { AuthProvider } from "@/components/auth/auth-context";
import { getCartSummary } from "@/lib/cart";
import { getSession } from "@/lib/session";
import { getSiteSettings } from "@/lib/settings";
import { themeStyle } from "@/lib/theme";
import { rootCategoryWhere } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: `${settings.siteName} — ${settings.tagline}`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.tagline,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [cartCount, session, settings, categories] = await Promise.all([
    getCartSummary(),
    getSession(),
    getSiteSettings(),
    prisma.category.findMany({
      where: rootCategoryWhere,
      orderBy: { sortOrder: "asc" },
      select: {
        name: true,
        slug: true,
        image: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: { name: true, slug: true },
        },
      },
    }),
  ]);

  const navCategories = categories.map((c) => ({
    name: c.name,
    href: `/category/${c.slug}`,
    slug: c.slug,
    image: c.image,
    children: c.children.map((child) => ({
      name: child.name,
      href: `/category/${child.slug}`,
    })),
  }));

  return (
    <html lang="en" className={`${inter.variable} h-full`} style={themeStyle(settings)}>
      <body className="min-h-full flex flex-col bg-[#f5f5f5] font-sans antialiased pb-20 md:pb-0">
        <AuthProvider isLoggedIn={!!session}>
          <StorefrontChromeGate>
            <SiteHeader cartCount={cartCount} session={session} settings={settings} categories={navCategories} />
          </StorefrontChromeGate>
          <main className="flex-1">{children}</main>
          <StorefrontChromeGate>
            <SiteFooter settings={settings} />
            <MobileBottomNav cartCount={cartCount} session={session} settings={settings} />
          </StorefrontChromeGate>
        </AuthProvider>
      </body>
    </html>
  );
}
