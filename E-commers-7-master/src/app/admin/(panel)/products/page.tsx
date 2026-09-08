import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBadge, AdminLinkButton, AdminTable } from "@/components/admin/ui/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatPrice } from "@/lib/utils";
import { deleteProductAction, toggleProductPublishAction } from "@/app/actions/admin";

export const metadata = { title: "Admin Products" };

export default async function AdminProductsPage() {
  const session = await requireAdmin();
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <AdminShell
      session={session}
      title="Products"
      description={`${products.length} products in catalog`}
      action={
        <AdminLinkButton href="/admin/products/new">
          <Plus className="h-4 w-4" />
          Add Product
        </AdminLinkButton>
      }
    >
      <AdminTable>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 transition hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.sku}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{p.category.name}</td>
                <td className="px-4 py-3">
                  {p.salePrice ? (
                    <span className="font-medium text-slate-900">{formatPrice(p.salePrice)}</span>
                  ) : (
                    <span className="font-medium text-slate-900">{formatPrice(p.price)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{p.stock}</td>
                <td className="px-4 py-3">
                  <AdminBadge tone={p.isPublished ? "success" : "default"}>
                    {p.isPublished ? "Published" : "Draft"}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-xs font-medium text-slate-600 hover:text-slate-900">Edit</Link>
                    <form action={toggleProductPublishAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                        {p.isPublished ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-10 text-center text-sm text-slate-500">No products yet. Add your first product.</p>
        )}
      </AdminTable>
    </AdminShell>
  );
}
