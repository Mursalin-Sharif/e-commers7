import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/product-grid";

export const metadata = { title: "Search Results" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const products = query
    ? await prisma.product.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query } },
            { sku: { contains: query } },
            { shortDescription: { contains: query } },
          ],
        },
        take: 24,
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4">
      <div className="mb-4 px-2">
        <h1 className="text-base font-semibold text-[#333]">Search Results</h1>
        <div className="mt-2 border-b border-[#e0e0e0]" />
      </div>
      {query ? (
        <p className="mb-4 px-2 text-sm text-gray-600">
          {products.length} results for &quot;{query}&quot;
        </p>
      ) : (
        <p className="mb-4 px-2 text-sm text-gray-600">Enter a search term to find products.</p>
      )}

      <ProductGrid products={products} showDivider={false} />

      {query && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <p className="text-gray-500">No products found.</p>
          <Link href="/shop" className="mt-4 inline-block text-[#E85D04] hover:underline">
            Browse all products →
          </Link>
        </div>
      )}
    </div>
  );
}
