"use client";

import { getProductImageCandidates } from "@/lib/product-images";
import { SafeImage } from "@/components/product/safe-image";

type ProductImageProps = {
  slug: string;
  name: string;
  images?: string;
  className?: string;
  variant?: "card" | "detail";
};

export function ProductImage({
  slug,
  name,
  images,
  className = "",
  variant = "card",
}: ProductImageProps) {
  const candidates = getProductImageCandidates(slug, images);
  const padding = variant === "detail" ? "p-4" : "p-2";

  return (
    <SafeImage
      candidates={candidates}
      alt={name}
      className={`h-full w-full ${className}`}
      imgClassName={`h-full w-full object-contain ${padding}`}
      fallback={
        <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5] text-xl font-bold text-[#bdbdbd]">
          {name.slice(0, 2).toUpperCase()}
        </div>
      }
    />
  );
}
