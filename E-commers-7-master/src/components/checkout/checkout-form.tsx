"use client";

import { useActionState } from "react";
import { placeOrderAction, type CheckoutState } from "@/app/actions/checkout";
import { formatPrice } from "@/lib/utils";

type CheckoutFormProps = {
  subtotal: number;
  shippingInside: number;
  shippingOutside: number;
  defaultName?: string;
  defaultPhone?: string;
  defaultEmail?: string;
};

export function CheckoutForm({
  subtotal,
  shippingInside,
  shippingOutside,
  defaultName = "",
  defaultPhone = "",
  defaultEmail = "",
}: CheckoutFormProps) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrderAction, {});

  return (
    <form action={action} className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Order Information</h2>

      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Full Name *</label>
          <input name="customerName" required defaultValue={defaultName} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mobile Number *</label>
          <input name="customerPhone" required type="tel" defaultValue={defaultPhone} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email (optional)</label>
        <input name="customerEmail" type="email" defaultValue={defaultEmail} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Full Address *</label>
        <textarea name="shippingAddress" required rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Delivery Area *</label>
        <select name="deliveryArea" defaultValue="inside" className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]">
          <option value="inside">Dhaka City Inside — {formatPrice(shippingInside)}</option>
          <option value="outside">Outside Dhaka — {formatPrice(shippingOutside)}</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Payment Method *</label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#E85D04] bg-orange-50 p-4">
          <input type="radio" name="paymentMethod" value="cod" defaultChecked />
          <span className="font-medium">Cash on Delivery</span>
        </label>
        <p className="mt-2 text-xs text-gray-500">Online payment (bKash/Card) coming soon.</p>
      </div>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span>Delivery</span><span>from {formatPrice(shippingInside)}</span></div>
        <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-bold">
          <span>Estimated Total</span><span className="text-[#E85D04]">{formatPrice(subtotal + shippingInside)}+</span>
        </div>
      </div>

      <button type="submit" disabled={pending || subtotal === 0} className="w-full rounded-xl bg-[#E85D04] py-4 text-lg font-semibold text-white hover:bg-[#d45103] disabled:opacity-60">
        {pending ? "Placing Order..." : "Place Order (COD)"}
      </button>
    </form>
  );
}
