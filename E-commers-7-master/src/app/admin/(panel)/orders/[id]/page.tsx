import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrderDetail } from "@/components/admin/order-detail";

export const metadata = { title: "Order Detail" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, statusHistory: { orderBy: { createdAt: "asc" } } },
  });

  if (!order) notFound();

  return (
    <AdminShell session={session} title={order.orderNumber} description="Order details and fulfillment">
      <OrderDetail
        order={{
          ...order,
          createdAt: order.createdAt.toISOString(),
          history: order.statusHistory.map((h) => ({
            status: h.status,
            note: h.note,
            createdAt: h.createdAt.toISOString(),
          })),
        }}
      />
    </AdminShell>
  );
}
