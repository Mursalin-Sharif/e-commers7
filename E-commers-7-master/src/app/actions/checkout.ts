"use server";

import { redirect } from "next/navigation";
import { placeOrder } from "@/lib/orders";
import { addProductToCart, clearCart, getOrCreateCart } from "@/lib/cart";
import { requireSession } from "@/lib/require-session";
import { revalidatePath } from "next/cache";

export type CheckoutState = { error?: string };

export async function buyNowAction(formData: FormData) {
  const returnTo = String(formData.get("returnTo") || "/checkout");
  const session = await requireSession(returnTo);

  const productId = String(formData.get("productId") || "");
  const quantity = Number(formData.get("quantity") || 1);
  const cart = await getOrCreateCart(session.userId);
  await clearCart(cart.id);
  await addProductToCart(session.userId, productId, quantity);
  revalidatePath("/", "layout");
  revalidatePath("/checkout");
  revalidatePath("/cart");
  redirect("/checkout");
}

export async function placeOrderAction(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const session = await requireSession("/checkout");
  const paymentMethod = String(formData.get("paymentMethod") || "cod");

  if (paymentMethod === "online") {
    return { error: "Online payment is coming soon. Please use Cash on Delivery." };
  }

  try {
    const order = await placeOrder({
      customerName: String(formData.get("customerName") || "").trim(),
      customerPhone: String(formData.get("customerPhone") || "").trim(),
      customerEmail: String(formData.get("customerEmail") || "").trim() || undefined,
      shippingAddress: String(formData.get("shippingAddress") || "").trim(),
      deliveryArea: String(formData.get("deliveryArea") || "inside") as "inside" | "outside",
      paymentMethod: String(formData.get("paymentMethod") || "cod") as "cod" | "online",
      notes: String(formData.get("notes") || "").trim() || undefined,
      userId: session.userId,
    });

    revalidatePath("/", "layout");
    redirect(`/order-success?order=${order.orderNumber}`);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not place order" };
  }
}
