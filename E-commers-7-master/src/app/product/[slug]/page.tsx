import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductImage } from "@/components/product/product-image";
import { ProductActions } from "@/components/product/product-actions";
import { WishlistButton } from "@/components/product/wishlist-button";
import { getSession } from "@/lib/session";
import { isInWishlist } from "@/app/actions/wishlist";
import { ProductPrice } from "@/components/product/product-price";
import { calcDiscount } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name || "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, brand: true },
  });

  if (!product || !product.isPublished) notFound();

  const session = await getSession();
  const wishlisted = session ? await isInWishlist(session.userId, product.id) : false;
  const discount = calcDiscount(product.price, product.salePrice);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <p className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#E85D04]">Home</Link>
        {" / "}
        <Link href={`/category/${product.category.slug}`} className="hover:text-[#E85D04]">
          {product.category.name}
        </Link>
        {" / "}
        <span>{product.name}</span>
      </p>

      <div className="grid gap-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
          <ProductImage
            slug={product.slug}
            name={product.name}
            images={product.images}
            variant="detail"
            className="absolute inset-0"
          />
        </div>

        <div>
          {discount > 0 && (
            <span className="mb-3 inline-flex h-11 w-11 flex-col items-center justify-center rounded-full bg-[#e53935] text-center text-[10px] font-bold leading-tight text-white">
              <span>{discount}%</span>
              <span>ছাড়</span>
            </span>
          )}
          <h1 className="mb-2 text-xl font-bold text-[#222] lg:text-2xl">{product.name}</h1>
          {product.brand && (
            <p className="mb-3 text-sm text-gray-500">Brand: {product.brand.name}</p>
          )}
          <p className="mb-3 text-sm text-gray-500">SKU: {product.sku}</p>

          <div className="mb-4 justify-start">
            <ProductPrice price={product.price} salePrice={product.salePrice} size="md" />
          </div>

          <p className="mb-4 text-sm text-gray-600">{product.shortDescription}</p>

          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className={`rounded-full px-3 py-1 font-medium ${product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </span>
          </div>

          <ProductActions
            productId={product.id}
            stock={product.stock}
            minOrderQty={product.minOrderQty}
            size="md"
            className="max-w-md"
          />
          {session && (
            <div className="mt-3 max-w-md">
              <WishlistButton productId={product.id} slug={product.slug} initialActive={wishlisted} />
            </div>
          )}

          {product.description && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="mb-3 font-semibold text-[#1A1A2E]">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
