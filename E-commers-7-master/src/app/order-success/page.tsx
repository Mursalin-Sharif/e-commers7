import Link from "next/link";

export const metadata = { title: "Order Placed" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-4 py-12 text-center">
      <div className="rounded-2xl border border-green-100 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
        <h1 className="mb-2 text-2xl font-bold text-[#1A1A2E]">Order Placed Successfully!</h1>
        <p className="mb-4 text-gray-600">Thank you for shopping with Paki.</p>
        {order && (
          <p className="mb-6 rounded-lg bg-gray-50 px-4 py-3 font-mono text-sm">
            Order Number: <strong>{order}</strong>
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={order ? `/track-order?order=${encodeURIComponent(order)}` : "/track-order"} className="rounded-xl bg-[#E85D04] px-6 py-3 font-semibold text-white hover:bg-[#d45103]">
            Track Order
          </Link>
          <Link href="/shop" className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:border-[#4caf50]">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
