import Link from "next/link";
import { calcCartSubtotal, getCartForUser } from "@/lib/cart";
import { getSiteSettings } from "@/lib/settings";
import { CartItems } from "@/components/checkout/cart-items";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { requireSession } from "@/lib/require-session";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await requireSession("/checkout");
  const [cart, settings] = await Promise.all([
    getCartForUser(session.userId),
    getSiteSettings(),
  ]);
  const subtotal = calcCartSubtotal(cart.items);

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-[#1A1A2E]">Checkout</h1>
        <p className="mb-6 text-gray-600">Your cart is empty.</p>
        <Link href="/shop" className="inline-block rounded-xl bg-[#4caf50] px-6 py-3 font-semibold text-white hover:bg-[#43a047]">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#1A1A2E]">Checkout</h1>

      <div className="mb-6 rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-800">
        Delivery: Dhaka inside {settings.shippingDhakaInside}৳, outside {settings.shippingDhakaOutside}৳. Cash on Delivery available.
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Your Cart</h2>
          <CartItems cart={cart} />
        </div>
        <CheckoutForm
          subtotal={subtotal}
          shippingInside={settings.shippingDhakaInside}
          shippingOutside={settings.shippingDhakaOutside}
          defaultName={session.name}
          defaultPhone={session.phone}
        />
      </div>
    </div>
  );
}
