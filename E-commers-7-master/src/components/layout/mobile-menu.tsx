"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { CategoryImage } from "@/components/product/category-image";
import type { SessionPayload } from "@/lib/auth";
import type { SiteSettings } from "@/lib/settings";
import type { NavItem } from "@/components/layout/site-chrome";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  session?: SessionPayload | null;
  categories?: NavItem[];
  settings: SiteSettings;
};

export function MobileMenu({ open, onClose, categories = [], settings }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  const handleClose = () => {
    setExpanded(new Set());
    onClose();
  };

  const toggleCategory = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="mobile-menu__overlay md:hidden"
        onClick={handleClose}
        aria-label="Close menu"
      />

      <div className="mobile-menu active">
        <div className="mobile-menu__header">
          <Link href="/" onClick={handleClose} className="mobile-menu__logo">
            {settings.siteName}
          </Link>
          <button type="button" onClick={handleClose} className="mobile-menu__close" aria-label="Close menu">
            <X className="h-6 w-6" strokeWidth={2} />
          </button>
        </div>

        <nav className="mobile-menu__nav">
          <ul className="mobile-menu__list">
            {categories.map((category) => {
              const isOpen = expanded.has(category.slug);
              const hasChildren = (category.children?.length ?? 0) > 0;

              return (
                <li
                  key={category.slug}
                  className={`mobile-menu__item${isOpen ? " mobile-menu__item--open" : ""}`}
                >
                  {hasChildren ? (
                    <button
                      type="button"
                      className={`mobile-menu__trigger${isOpen ? " mobile-menu__trigger--open" : ""}`}
                      onClick={() => toggleCategory(category.slug)}
                      aria-expanded={isOpen}
                    >
                      <span className="mobile-menu__thumb">
                        <CategoryImage
                          slug={category.slug}
                          name={category.name}
                          image={category.image}
                          variant="square"
                          className="h-full w-full"
                        />
                      </span>
                      <span className="mobile-menu__label">{category.name}</span>
                      <ChevronDown className={`mobile-menu__chevron${isOpen ? " mobile-menu__chevron--open" : ""}`} />
                    </button>
                  ) : (
                    <Link href={category.href} onClick={handleClose} className="mobile-menu__trigger mobile-menu__trigger--link">
                      <span className="mobile-menu__thumb">
                        <CategoryImage
                          slug={category.slug}
                          name={category.name}
                          image={category.image}
                          variant="square"
                          className="h-full w-full"
                        />
                      </span>
                      <span className="mobile-menu__label">{category.name}</span>
                    </Link>
                  )}

                  {hasChildren && isOpen && (
                    <ul className="mobile-menu__sublist">
                      {category.children!.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} onClick={handleClose} className="mobile-menu__sublink">
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>,
    document.body,
  );
}

type MoreMenuProps = {
  open: boolean;
  onClose: () => void;
  session?: SessionPayload | null;
};

function buildQuickLinks(session: SessionPayload | null) {
  return [
    { name: "Track Order", href: "/track-order" },
    { name: session ? "My Account" : "Login / Sign Up", href: session ? "/account" : "/login" },
    { name: "My Cart", href: "/cart" },
    { name: "Contact Us", href: "/contact" },
    { name: "Admin Area", href: "/admin" },
  ];
}

export function MoreMenu({ open, onClose, session = null }: MoreMenuProps) {
  const quickLinks = buildQuickLinks(session);
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[55] md:hidden"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className="absolute right-0 top-full z-[56] mt-1 w-48 overflow-hidden rounded-md border border-[#e5e5e5] bg-white shadow-lg md:hidden">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="block border-b border-[#f0f0f0] px-4 py-3 text-sm text-[#333] last:border-b-0 hover:bg-[#f8f8f8]"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </>
  );
}
