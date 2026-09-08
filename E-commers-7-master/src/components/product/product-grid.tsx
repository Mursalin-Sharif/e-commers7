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

type ProductGridProps = {
  products: Product[];
  title?: string;
  showDivider?: boolean;
  columns?: "home" | "shop";
};

export function ProductGrid({
  products,
  title,
  showDivider = true,
  columns = "shop",
}: ProductGridProps) {
  const gridClass =
    columns === "home"
      ? "category-product main_product_inner grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      : "category-product main_product_inner grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

  return (
    <section className="homeproduct mt-6">
      {title && (
        <div className="mb-3 px-2">
          <h2 className="text-base font-semibold text-[#333]">{title}</h2>
          {showDivider && <div className="mt-2 border-b border-[#e0e0e0]" />}
        </div>
      )}

      <div className={gridClass}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
