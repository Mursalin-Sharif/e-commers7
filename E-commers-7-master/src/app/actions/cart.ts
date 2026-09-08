"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addProductToCart,
  calcCartCount,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/cart";
import { requireSession } from "@/lib/require-session";

export type CartActionState = { error?: string; success?: string; count?: number };

function revalidateCartPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/checkout");
  revalidatePath("/cart");
  revalidatePath("/shop");
}

export async function addToCartAction(
  _prev: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const returnTo = String(formData.get("returnTo") || "/");
  const session = await requireSession(returnTo);

  const productId = String(formData.get("productId") || "");
  const quantity = Number(formData.get("quantity") || 1);
  const redirectTo = formData.get("redirect") ? String(formData.get("redirect")) : null;

  try {
    const cart = await addProductToCart(session.userId, productId, quantity);
    revalidateCartPaths();
    if (redirectTo) redirect(redirectTo);
    return { success: "কার্টে যোগ করা হয়েছে", count: calcCartCount(cart.items) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not add to cart" };
  }
}

export async function updateCartItemAction(formData: FormData) {
  const session = await requireSession("/cart");
  const cartItemId = String(formData.get("cartItemId") || "");
  const quantity = Number(formData.get("quantity") || 1);
  await updateCartItemQuantity(session.userId, cartItemId, quantity);
  revalidateCartPaths();
}

export async function removeCartItemAction(formData: FormData) {
  const session = await requireSession("/cart");
  const cartItemId = String(formData.get("cartItemId") || "");
  await removeCartItem(session.userId, cartItemId);
  revalidateCartPaths();
}
