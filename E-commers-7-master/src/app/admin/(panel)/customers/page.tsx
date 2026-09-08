import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBadge, AdminTable } from "@/components/admin/ui/admin-ui";
import { updateCustomerStatusAction } from "@/app/actions/admin";

export const metadata = { title: "Admin Customers" };

export default async function AdminCustomersPage() {
  const session = await requireAdmin();
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <AdminShell session={session} title="Customers" description="Registered customer accounts">
      <AdminTable>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                <td className="px-4 py-3 text-slate-600">{c.phone}</td>
                <td className="px-4 py-3 text-slate-500">{c.email || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{c._count.orders}</td>
                <td className="px-4 py-3">
                  <AdminBadge tone={c.status === "ACTIVE" ? "success" : "danger"}>{c.status}</AdminBadge>
                </td>
                <td className="px-4 py-3 text-slate-500">{c.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <form action={updateCustomerStatusAction}>
                    <input type="hidden" name="id" value={c.id} />
                    {c.status === "ACTIVE" ? (
                      <button type="submit" name="status" value="SUSPENDED" className="text-xs font-medium text-amber-600 hover:text-amber-800">Suspend</button>
                    ) : (
                      <button type="submit" name="status" value="ACTIVE" className="text-xs font-medium text-emerald-600 hover:text-emerald-800">Activate</button>
                    )}
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No customers yet</p>}
      </AdminTable>
    </AdminShell>
  );
}
