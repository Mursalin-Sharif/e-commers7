"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: string;
  stock: number;
};

type ProductCarouselProps = {
  title: string;
  products: Product[];
  viewMoreHref?: string;
};

export function ProductCarousel({ title, products, viewMoreHref }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="homeproduct mt-4 bg-white py-3">
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-semibold text-[#333]">{title}</h2>
            <div className="mt-2 border-b border-[#e0e0e0]" />
          </div>
          <div className="flex items-center gap-2">
            {viewMoreHref && (
              <Link href={viewMoreHref} className="text-xs font-medium text-[#4caf50] hover:underline">
                View More →
              </Link>
            )}
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-[#666] md:hidden"
              aria-label="Scroll products left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-[#666] md:hidden"
              aria-label="Scroll products right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="category-product main_product_inner flex gap-2 overflow-x-auto scroll-smooth pb-1 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-4 xl:grid-cols-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[172px] shrink-0 sm:w-[calc(33.333%-6px)] md:w-auto">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
