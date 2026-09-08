import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";
import { getUserWishlist } from "@/app/actions/wishlist";
import { formatPrice } from "@/lib/utils";

function StatusBadge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{children}</span>;
}

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/account");

  const [orders, wishlistItems] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    getUserWishlist(session.userId),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-[#1A1A2E]">My Account</h1>
        <p className="mb-6 text-sm text-gray-500">Welcome back, {session.name}</p>
        <div className="space-y-3 text-sm">
          <p><span className="text-gray-500">Phone:</span> {session.phone}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/cart" className="rounded-xl border border-gray-200 px-4 py-3 text-center hover:border-[#4caf50]">My Cart</Link>
          <Link href="/track-order" className="rounded-xl border border-gray-200 px-4 py-3 text-center hover:border-[#4caf50]">Track Order</Link>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet. <Link href="/shop" className="text-[#4caf50] hover:underline">Start shopping</Link></p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 p-4">
                <div>
                  <p className="font-medium text-[#1A1A2E]">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.createdAt.toLocaleDateString("en-BD")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge>{order.status}</StatusBadge>
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                  <Link href={`/track-order?order=${order.orderNumber}&phone=${order.customerPhone}`} className="text-sm text-[#4caf50] hover:underline">
                    Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Wishlist ({wishlistItems.length})</h2>
        {wishlistItems.length === 0 ? (
          <p className="text-sm text-gray-500">No saved products yet.</p>
        ) : (
          <div className="space-y-3">
            {wishlistItems.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.product.slug}`}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:border-[#4caf50]"
              >
                <span className="font-medium text-[#1A1A2E]">{item.product.name}</span>
                <span className="text-sm text-[#E85D04]">{formatPrice(item.product.salePrice ?? item.product.price)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <form action={logoutAction} className="mt-8">
        <button type="submit" className="w-full rounded-xl bg-[#E85D04] py-3 font-semibold text-white hover:bg-[#d45103]">
          Logout
        </button>
      </form>
    </div>
  );
}
