"use client";

import { useActionState } from "react";
import { trackOrderAction, type TrackOrderState } from "@/app/actions/track-order";
import { formatPrice } from "@/lib/utils";

export function TrackOrderForm({
  defaultOrder = "",
  defaultPhone = "",
}: {
  defaultOrder?: string;
  defaultPhone?: string;
}) {
  const [state, action, pending] = useActionState<TrackOrderState, FormData>(trackOrderAction, {});

  return (
    <div>
      <form action={action} className="space-y-4">
        {state.error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium">Order Number</label>
          <input
            name="orderNumber"
            required
            defaultValue={defaultOrder}
            placeholder="PAKI-XXXXXXXX"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mobile Number</label>
          <input
            name="phone"
            type="tel"
            required
            defaultValue={defaultPhone}
            placeholder="01XXXXXXXXX"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]"
          />
        </div>
        <button type="submit" disabled={pending} className="w-full rounded-xl bg-[#E85D04] py-3 font-semibold text-white hover:bg-[#d45103] disabled:opacity-60">
          {pending ? "Searching..." : "Track Order"}
        </button>
      </form>

      {state.order && (
        <div className="mt-8 rounded-xl border border-green-100 bg-green-50 p-5">
          <h2 className="text-lg font-bold text-[#1A1A2E]">{state.order.orderNumber}</h2>
          <p className="mt-1 text-sm text-gray-600">Status: <strong>{state.order.status}</strong></p>
          <p className="text-sm text-gray-600">Payment: <strong>{state.order.paymentStatus}</strong></p>
          <p className="text-sm text-gray-600">Total: <strong>{formatPrice(state.order.total)}</strong></p>

          <div className="mt-4 space-y-2">
            {state.order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-green-200 pt-4">
            <p className="mb-2 text-sm font-semibold">Order Timeline</p>
            {state.order.history.map((h, i) => (
              <div key={i} className="mb-2 text-sm text-gray-700">
                <span className="font-medium">{h.status}</span>
                {h.note && <span className="text-gray-500"> — {h.note}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
