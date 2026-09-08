"use client";

import Link from "next/link";
import { ProductImage } from "@/components/product/product-image";
import type { CartWithItems } from "@/lib/cart";
import { removeCartItemAction, updateCartItemAction } from "@/app/actions/cart";
import { formatPrice, getProductPrice } from "@/lib/utils";

type CartItemsProps = {
  cart: CartWithItems;
};

export function CartItems({ cart }: CartItemsProps) {
  if (cart.items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">Your cart is empty</p>
        <Link href="/shop" className="mt-4 inline-block text-[#4caf50] hover:underline">
          Continue Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cart.items.map((item) => {
        const price = getProductPrice(item.product);
        return (
          <div key={item.id} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#fafafa]">
              <ProductImage
                slug={item.product.slug}
                name={item.product.name}
                images={item.product.images}
                className="absolute inset-0"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link href={`/product/${item.product.slug}`} className="text-sm font-medium text-[#333] hover:text-[#4caf50]">
                  {item.product.name}
                </Link>
                <p className="text-sm font-semibold text-[#1b5e20]">{formatPrice(price)}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <form action={updateCartItemAction} className="flex items-center gap-2">
                  <input type="hidden" name="cartItemId" value={item.id} />
                  <button type="submit" name="quantity" value={item.quantity - 1} className="h-8 w-8 rounded border border-gray-200">−</button>
                  <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                  <button type="submit" name="quantity" value={item.quantity + 1} className="h-8 w-8 rounded border border-gray-200">+</button>
                </form>
                <form action={removeCartItemAction}>
                  <input type="hidden" name="cartItemId" value={item.id} />
                  <button type="submit" className="text-xs text-red-500 hover:underline">Remove</button>
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
