"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  Phone,
  Share2,
  Menu,
  MoreVertical,
} from "lucide-react";
import { MobileMenu, MoreMenu } from "@/components/layout/mobile-menu";
import type { SessionPayload } from "@/lib/auth";
import type { SiteSettings } from "@/lib/settings";

export type NavItem = {
  name: string;
  href: string;
  slug: string;
  image: string | null;
  children?: { name: string; href: string }[];
};

export function SiteHeader({
  cartCount = 0,
  session = null,
  settings,
  categories = [],
}: {
  cartCount?: number;
  session?: SessionPayload | null;
  settings: SiteSettings;
  categories?: NavItem[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e8e8e8] bg-white shadow-sm">
        {/* Desktop top bar */}
        <div className="hidden border-b border-[#f0f0f0] bg-[#fafafa] md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm text-[#555]">
            <p>{settings.tagline}</p>
            <div className="flex items-center gap-5">
              <Link href="/track-order" className="hover:text-[#4caf50]">
                Track Order
              </Link>
              <Link href={session ? "/account" : "/login"} className="hover:text-[#4caf50]">
                {session ? "My Account" : "Login / Sign Up"}
              </Link>
            </div>
          </div>
        </div>

        {/* Main header row */}
        <div className="mx-auto max-w-7xl px-3 py-2.5 md:px-4 md:py-3">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 md:flex md:gap-6">
            {/* Hamburger - mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-[#333] md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center justify-center md:justify-start">
              <span className="text-[22px] font-bold tracking-tight text-[var(--secondary)] md:text-2xl">
                {settings.siteName}
              </span>
            </Link>

            {/* Desktop search inline */}
            <form action="/search" className="hidden flex-1 md:block">
              <div className="flex overflow-hidden rounded-sm border-2 border-[var(--accent)]">
                <input
                  type="search"
                  name="q"
                  placeholder="Search Product ..."
                  className="msearch_keywordinput flex-1 px-4 py-2.5 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center bg-[var(--accent)] px-5 text-white transition hover:opacity-90"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center justify-end gap-1 md:gap-3">
              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center text-[#333]"
                aria-label="Cart"
              >
                <ShoppingCart className="h-6 w-6" strokeWidth={1.75} />
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              </Link>

              {/* More menu - mobile */}
              <div className="relative md:hidden">
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center text-[#333]"
                  aria-label="More options"
                >
                  <MoreVertical className="h-6 w-6" />
                </button>
                <MoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} session={session} />
              </div>

              {/* Desktop links */}
              <Link
                href={session ? "/account" : "/login"}
                className="hidden items-center gap-1.5 rounded-md border border-[#e0e0e0] px-3 py-2 text-sm text-[#555] hover:border-[#4caf50] hover:text-[#4caf50] md:flex"
              >
                <User className="h-4 w-4" />
                Account
              </Link>
            </div>
          </div>

          {/* Mobile search row */}
          <form action="/search" className="mt-2.5 md:hidden">
            <div className="flex overflow-hidden rounded-sm border-2 border-[#4caf50]">
              <input
                type="search"
                name="q"
                placeholder="Search Product ..."
                className="msearch_keywordinput flex-1 px-3 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                className="flex w-12 items-center justify-center bg-[var(--accent)] text-white"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Desktop category nav */}
        <nav className="hidden border-t border-[#f0f0f0] bg-white md:block">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 text-sm font-medium">
            {[{ name: "Shop All", href: "/shop" }, ...categories].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-md px-3 py-2 text-[#444] transition hover:bg-[#f1f8f1] hover:text-[#4caf50]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} session={session} categories={categories} settings={settings} />
    </>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto bg-[var(--secondary)] text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:gap-10 sm:py-12">
        <div className="space-y-5">
          <div>
            <span className="text-lg font-bold text-white sm:text-xl">{settings.siteName}</span>
            <p className="mt-2 text-xs leading-relaxed sm:text-sm">{settings.tagline}</p>
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4caf50]" /> {settings.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[#4caf50]" /> {settings.phone}
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 shrink-0 text-center text-xs text-[#4caf50]">@</span>
              {settings.email}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Follow Us</h4>
            <div className="flex gap-2 sm:gap-3">
              {[1, 2, 3].map((i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#4caf50] sm:h-10 sm:w-10"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-white sm:text-sm">We Accept</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-white/10 px-2 py-1">COD</span>
              <span className="rounded bg-white/10 px-2 py-1">bKash</span>
              <span className="rounded bg-white/10 px-2 py-1">Card</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Useful Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/login" className="hover:text-[#4caf50]">User Area</Link></li>
              <li><Link href="/track-order" className="hover:text-[#4caf50]">Order Tracking</Link></li>
              <li><Link href="/shop" className="hover:text-[#4caf50]">Shop</Link></li>
              <li><Link href="/contact" className="hover:text-[#4caf50]">Contact Us</Link></li>
              <li><Link href="/admin" className="hover:text-[#4caf50]">Admin Area</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Policies</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/page/delivery-rules" className="hover:text-[#4caf50]">Delivery Rules</Link></li>
              <li><Link href="/page/return-policy" className="hover:text-[#4caf50]">Return Policy</Link></li>
              <li><Link href="/page/terms-conditions" className="hover:text-[#4caf50]">Terms & Conditions</Link></li>
              <li><Link href="/page/privacy-policy" className="hover:text-[#4caf50]">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs sm:text-sm">
        Copyright © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </div>
    </footer>
  );
}

export function MobileBottomNav({
  cartCount = 0,
  session = null,
  settings,
}: {
  cartCount?: number;
  session?: SessionPayload | null;
  settings: SiteSettings;
}) {
  const whatsapp = settings.phone.replace(/^0/, "880");
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e0e0e0] bg-white md:hidden">
      <div className="relative grid grid-cols-5 items-end pb-1 pt-2 text-center text-[11px] text-[#666]">
        <Link href="/shop" className="flex flex-col items-center gap-1 px-1 py-1">
          <MenuIcon />
          <span>Category</span>
        </Link>

        <a
          href={`https://wa.me/${whatsapp}`}
          className="flex flex-col items-center gap-1 px-1 py-1"
        >
          <WhatsAppIcon />
          <span>Whatsapp</span>
        </a>

        <Link href="/" className="relative -top-4 flex flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4caf50] text-white shadow-lg ring-4 ring-white">
            <HomeIcon />
          </div>
          <span className="font-medium text-[#4caf50]">Home</span>
        </Link>

        <Link href="/cart" className="flex flex-col items-center gap-1 px-1 py-1">
          <ShoppingCart className="h-5 w-5" />
          <span>Cart ({cartCount})</span>
        </Link>

        <Link href={session ? "/account" : "/login"} className="flex flex-col items-center gap-1 px-1 py-1">
          <User className="h-5 w-5" />
          <span>{session ? "Account" : "Login"}</span>
        </Link>
      </div>
    </nav>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M12 3 3 10.5V21h6v-6h6v6h6V10.5L12 3z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.95-1.3A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182a8.18 8.18 0 0 1-4.174-1.146l-.3-.178-2.936.77.784-2.86-.196-.31A8.18 8.18 0 1 1 12 20.182z" />
    </svg>
  );
}
