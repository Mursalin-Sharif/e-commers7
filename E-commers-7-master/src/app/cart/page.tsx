import Link from "next/link";
import { calcCartSubtotal, getCartForUser } from "@/lib/cart";
import { CartItems } from "@/components/checkout/cart-items";
import { formatPrice } from "@/lib/utils";
import { requireSession } from "@/lib/require-session";

export const metadata = { title: "My Cart" };

export default async function CartPage() {
  const session = await requireSession("/cart");
  const cart = await getCartForUser(session.userId);
  const subtotal = calcCartSubtotal(cart.items);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">My Cart</h1>
        <span className="text-sm text-gray-500">{cart.items.length} item(s)</span>
      </div>

      {cart.items.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block rounded-xl bg-[#4caf50] px-6 py-3 font-semibold text-white hover:bg-[#43a047]">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <CartItems cart={cart} />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span className="text-[#E85D04]">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-4 block w-full rounded-xl bg-[#E85D04] py-4 text-center text-lg font-semibold text-white hover:bg-[#d45103]"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
