import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminBadge,
  AdminFilterPills,
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTh,
  AdminTr,
  orderStatusTone,
} from "@/components/admin/ui/admin-ui";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Admin Orders" };

const statuses = ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireAdmin();
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <AdminShell
      session={session}
      title="Orders"
      description="Manage and fulfill customer orders"
      breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Orders" }]}
    >
      <div className="mb-5">
        <AdminFilterPills
          items={[
            { href: "/admin/orders", label: "All", active: !status },
            ...statuses.map((s) => ({
              href: `/admin/orders?status=${s}`,
              label: s,
              active: status === s,
            })),
          ]}
        />
      </div>

      <AdminTable>
        <table className="w-full text-left text-sm">
          <AdminTableHead>
            <tr>
              <AdminTh>Order</AdminTh>
              <AdminTh>Customer</AdminTh>
              <AdminTh>Phone</AdminTh>
              <AdminTh>Items</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Total</AdminTh>
              <AdminTh>Date</AdminTh>
            </tr>
          </AdminTableHead>
          <tbody>
            {orders.map((o) => (
              <AdminTr key={o.id}>
                <AdminTd className="font-medium text-slate-900">
                  <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                    {o.orderNumber}
                  </Link>
                </AdminTd>
                <AdminTd className="text-slate-600">{o.customerName}</AdminTd>
                <AdminTd className="text-slate-600">{o.customerPhone}</AdminTd>
                <AdminTd className="text-slate-600">{o.items.length}</AdminTd>
                <AdminTd>
                  <AdminBadge tone={orderStatusTone(o.status)}>{o.status}</AdminBadge>
                </AdminTd>
                <AdminTd className="font-medium text-slate-900">{formatPrice(o.total)}</AdminTd>
                <AdminTd className="text-slate-500">{o.createdAt.toLocaleDateString()}</AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No orders found</p>}
      </AdminTable>
    </AdminShell>
  );
}
