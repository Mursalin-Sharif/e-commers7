"use client";

import { useMemo, useState } from "react";

type SafeImageProps = {
  candidates: string[];
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback?: React.ReactNode;
  loading?: "lazy" | "eager";
};

export function SafeImage({
  candidates,
  alt,
  className = "",
  imgClassName = "",
  fallback,
  loading = "lazy",
}: SafeImageProps) {
  const sources = useMemo(() => [...new Set(candidates.filter(Boolean))], [candidates]);
  const [index, setIndex] = useState(0);

  const src = sources[index];
  const failed = !src || index >= sources.length;

  if (failed) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className={imgClassName}
        onError={() => setIndex((prev) => prev + 1)}
      />
    </div>
  );
}
