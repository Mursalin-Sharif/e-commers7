import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/product-grid";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return { title: category?.name || "Category" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category || !category.isActive) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4">
      <div className="mb-4 px-2">
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-[#4caf50]">Home</Link> / {category.name}
        </p>
        <h1 className="text-base font-semibold text-[#333]">{category.name}</h1>
        <div className="mt-2 border-b border-[#e0e0e0]" />
        {category.description && <p className="mt-2 text-sm text-gray-600">{category.description}</p>}
      </div>

      <ProductGrid products={products} showDivider={false} />

      {products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center text-gray-500">
          No products in this category yet.
        </div>
      )}
    </div>
  );
}
