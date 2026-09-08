import Link from "next/link";
import { calcDiscount, formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/product/product-image";
import { ProductActions } from "@/components/product/product-actions";

type ProductCardProps = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: string;
  stock: number;
};

export function ProductCard({ id, name, slug, price, salePrice, images, stock }: ProductCardProps) {
  const discount = calcDiscount(price, salePrice);
  const hasDiscount = salePrice != null && salePrice < price;
  const currentPrice = hasDiscount ? salePrice! : price;

  return (
    <article className="product_item wist_item">
      <Link href={`/product/${slug}`} className="product_item__image">
        {discount > 0 && (
          <span className="product_item__badge">
            <span>{discount}%</span>
            <span>ছাড়</span>
          </span>
        )}

        <div className="product_item__image-inner">
          <ProductImage slug={slug} name={name} images={images} className="absolute inset-0" />
        </div>
      </Link>

      <div className="product_item__body">
        <Link href={`/product/${slug}`}>
          <h3 className="product_item__title">{name}</h3>
        </Link>

        <div className="product_item__price">
          {hasDiscount && <span className="product_item__price-old">{formatPrice(price)}</span>}
          <span className="product_item__price-current">{formatPrice(currentPrice)}</span>
        </div>

        <ProductActions productId={id} stock={stock} variant="card" />
      </div>
    </article>
  );
}
