import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `৳ ${amount.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}

export function calcDiscount(price: number, salePrice?: number | null): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

import { resolveImageUrl } from "@/lib/product-images";

export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    if (!Array.isArray(parsed)) {
      const single = resolveImageUrl(typeof parsed === "string" ? parsed : null);
      return single ? [single] : [];
    }
    return parsed
      .map((item) => resolveImageUrl(typeof item === "string" ? item : null))
      .filter((item): item is string => Boolean(item));
  } catch {
    const single = resolveImageUrl(images);
    return single ? [single] : [];
  }
}

export function getProductPrice(product: { price: number; salePrice?: number | null }) {
  return product.salePrice != null && product.salePrice < product.price
    ? product.salePrice
    : product.price;
}
