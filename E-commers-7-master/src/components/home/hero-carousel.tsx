"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBannerImageCandidates } from "@/lib/product-images";
import { SafeImage } from "@/components/product/safe-image";

type BannerSlide = {
  id?: string;
  title: string | null;
  image: string;
  link: string | null;
};

type HeroCarouselProps = {
  banners: BannerSlide[];
};

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const slides =
    banners.length > 0
      ? banners
      : [
          {
            title: "Welcome to Paki",
            image: "/images/banners/banner-1.jpg",
            link: "/shop",
          },
        ];

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next, slides.length]);

  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="relative h-44 overflow-hidden sm:h-52 md:h-64 lg:h-72">
          {slides.map((banner, index) => (
            <Link
              key={banner.id || index}
              href={banner.link || "/shop"}
              className={`absolute inset-0 block transition-all duration-700 ease-in-out ${
                index === active
                  ? "z-10 translate-x-0 opacity-100"
                  : index < active
                    ? "z-0 -translate-x-full opacity-0"
                    : "z-0 translate-x-full opacity-0"
              }`}
              aria-hidden={index !== active}
            >
              <SafeImage
                candidates={getBannerImageCandidates(banner.image, index)}
                alt={banner.title || "Banner"}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
                loading={index === active ? "eager" : "lazy"}
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm text-slate-500">
                    Banner image
                  </div>
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-6">
                <p className="text-xs text-white/80 sm:text-sm">Paki Marketplace</p>
                <h2 className="text-lg font-bold sm:text-2xl md:text-3xl">
                  {banner.title || "Premium Shopping Experience"}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#333] shadow-md transition hover:bg-white sm:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#333] shadow-md transition hover:bg-white sm:flex"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === active ? "w-5 bg-[#4caf50]" : "w-2 bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
