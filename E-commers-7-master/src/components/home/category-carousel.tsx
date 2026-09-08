"use client";

import Link from "next/link";
import { useRef } from "react";
import { CategoryImage } from "@/components/product/category-image";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

type CategoryCarouselProps = {
  categories: CategoryItem[];
  title?: string;
};

export function CategoryCarousel({ categories, title = "Top Categories" }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="homeproduct mt-4 bg-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <h2 className="text-base font-bold text-[#222] sm:text-lg">{title}</h2>
        <div className="mt-2 border-b border-[#e0e0e0]" />
      </div>

      <div className="mt-3 bg-[#ebf4ff] py-4">
        <div
          ref={scrollRef}
          className="mx-auto flex max-w-7xl gap-4 overflow-x-auto scroll-smooth px-3 sm:gap-5 sm:px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex w-[72px] shrink-0 flex-col items-center sm:w-[88px]"
            >
              <div className="h-[72px] w-[72px] overflow-hidden rounded-full border-2 border-[#4caf50] bg-white p-0.5 sm:h-[88px] sm:w-[88px]">
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <CategoryImage slug={category.slug} name={category.name} image={category.image} className="absolute inset-0" />
                </div>
              </div>
              <span className="mt-2 line-clamp-2 text-center text-[11px] font-bold leading-tight text-[#222] sm:text-xs">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
