import { formatPrice } from "@/lib/utils";

type ProductPriceProps = {
  price: number;
  salePrice?: number | null;
  size?: "sm" | "md";
};

export function ProductPrice({ price, salePrice, size = "sm" }: ProductPriceProps) {
  const hasDiscount = salePrice != null && salePrice < price;
  const textSize = size === "md" ? "text-xl" : "text-[15px]";

  return (
    <div className={`flex items-center justify-center gap-2 font-semibold ${textSize}`}>
      {hasDiscount && (
        <span className="text-[#e53935] line-through">{formatPrice(price)}</span>
      )}
      <span className="text-[#1b5e20]">{formatPrice(hasDiscount ? salePrice! : price)}</span>
    </div>
  );
}
