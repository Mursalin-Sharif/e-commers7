"use client";

import { getCategoryImageCandidates } from "@/lib/product-images";
import { SafeImage } from "@/components/product/safe-image";

type CategoryImageProps = {
  slug: string;
  name: string;
  image?: string | null;
  className?: string;
  variant?: "circle" | "square";
};

export function CategoryImage({ slug, name, image, className = "", variant = "circle" }: CategoryImageProps) {
  const candidates = getCategoryImageCandidates(slug, image);
  const isSquare = variant === "square";

  return (
    <SafeImage
      candidates={candidates}
      alt={name}
      className={`h-full w-full ${className}`}
      imgClassName={`h-full w-full object-cover ${isSquare ? "rounded-sm" : "rounded-full"}`}
      fallback={
        <div
          className={`flex h-full w-full items-center justify-center bg-[#e8f5e9] text-lg font-bold text-[var(--primary)] ${isSquare ? "rounded-sm" : "rounded-full"}`}
        >
          {name.charAt(0)}
        </div>
      }
    />
  );
}
