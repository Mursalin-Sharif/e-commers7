import Link from "next/link";
import { Plus, LayoutTemplate, Package, ShoppingBag, TrendingUp, Users, Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminBadge,
  AdminCard,
  AdminLinkButton,
  AdminStatCard,
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTh,
  AdminTr,
  orderStatusTone,
} from "@/components/admin/ui/admin-ui";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  const [productCount, orderCount, customerCount, pageCount, recentOrders, revenue, pendingOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.landingPage.count(),
      prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count({ where: { status: "PLACED" } }),
    ]);

  return (
    <AdminShell session={session} title="Dashboard" description="Overview of your store performance">
      {pendingOrders > 0 && (
        <AdminCard className="mb-6 border-amber-200/80 bg-gradient-to-r from-amber-50 to-white">
          <p className="text-sm text-amber-900">
            <strong>{pendingOrders}</strong> new order(s) need attention.{" "}
            <Link href="/admin/orders?status=PLACED" className="font-semibold text-amber-950 underline">
              Review now
            </Link>
          </p>
        </AdminCard>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Products" value={String(productCount)} href="/admin/products" icon={Package} accent="bg-blue-600" />
        <AdminStatCard label="Orders" value={String(orderCount)} href="/admin/orders" icon={ShoppingBag} accent="bg-violet-600" />
        <AdminStatCard label="Customers" value={String(customerCount)} href="/admin/customers" icon={Users} accent="bg-emerald-600" />
        <AdminStatCard
          label="Revenue"
          value={formatPrice(revenue._sum.total || 0)}
          hint={`${pageCount} landing pages`}
          href="/admin/orders"
          icon={TrendingUp}
          accent="bg-amber-600"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium text-slate-500 hover:text-slate-900">
              View all
            </Link>
          </div>
          <AdminTable>
            <table className="w-full text-left text-sm">
              <AdminTableHead>
                <tr>
                  <AdminTh>Order</AdminTh>
                  <AdminTh>Customer</AdminTh>
                  <AdminTh>Status</AdminTh>
                  <AdminTh>Total</AdminTh>
                </tr>
              </AdminTableHead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <AdminTr key={o.id}>
                      <AdminTd className="font-medium text-slate-900">
                        <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                          {o.orderNumber}
                        </Link>
                      </AdminTd>
                      <AdminTd className="text-slate-600">{o.customerName}</AdminTd>
                      <AdminTd>
                        <AdminBadge tone={orderStatusTone(o.status)}>{o.status}</AdminBadge>
                      </AdminTd>
                      <AdminTd className="font-medium text-slate-900">{formatPrice(o.total)}</AdminTd>
                    </AdminTr>
                  ))
                )}
              </tbody>
            </table>
          </AdminTable>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Add Product", href: "/admin/products/new", desc: "Create a new listing", icon: Package },
              { label: "Landing Pages", href: "/admin/landing-pages", desc: "Build custom pages", icon: LayoutTemplate },
              { label: "Manage Orders", href: "/admin/orders", desc: "Fulfill customer orders", icon: ShoppingBag },
              { label: "Store Settings", href: "/admin/settings", desc: "Phone, shipping, theme", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start gap-3 rounded-xl border border-slate-200/90 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
