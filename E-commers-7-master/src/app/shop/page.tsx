import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/product-grid";

export const metadata = { title: "Shop All Products" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = 12;

  const orderBy =
    params.sort === "price-low"
      ? { salePrice: "asc" as const }
      : params.sort === "price-high"
        ? { salePrice: "desc" as const }
        : params.sort === "oldest"
          ? { createdAt: "asc" as const }
          : { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where: { isPublished: true } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="px-2">
          <p className="text-sm text-gray-500">
            <Link href="/" className="hover:text-[#4caf50]">Home</Link> / Shop
          </p>
          <h1 className="text-base font-semibold text-[#333]">All Products</h1>
          <div className="mt-2 border-b border-[#e0e0e0]" />
          <p className="mt-2 text-sm text-gray-500">{total} products found</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600">Sort:</span>
          {[
            { label: "Latest", value: "newest" },
            { label: "Oldest", value: "oldest" },
            { label: "Price ↑", value: "price-low" },
            { label: "Price ↓", value: "price-high" },
          ].map((option) => (
            <Link
              key={option.value}
              href={`/shop?sort=${option.value}`}
              className={`rounded-lg px-3 py-1.5 transition ${
                (params.sort || "newest") === option.value
                  ? "bg-[#E85D04] text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-[#E85D04]"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      <ProductGrid products={products} showDivider={false} />

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/shop?page=${p}${params.sort ? `&sort=${params.sort}` : ""}`}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                p === page
                  ? "bg-[#E85D04] text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-[#E85D04]"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
