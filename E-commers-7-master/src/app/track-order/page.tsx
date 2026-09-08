import Link from "next/link";
import { TrackOrderForm } from "@/components/track-order/track-order-form";

export const metadata = { title: "Track Order" };

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; phone?: string }>;
}) {
  const { order, phone } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-[#1A1A2E]">Track Your Order</h1>
        <p className="mb-6 text-sm text-gray-500">Enter your order number and phone to track</p>
        <TrackOrderForm defaultOrder={order || ""} defaultPhone={phone || ""} />
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/shop" className="text-[#4caf50] hover:underline">Continue Shopping</Link>
        </p>
      </div>
    </div>
  );
}
