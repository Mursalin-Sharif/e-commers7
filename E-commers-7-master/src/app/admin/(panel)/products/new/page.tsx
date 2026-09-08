import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const session = await requireAdmin();
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <AdminShell session={session} title="Add Product" description="Create a new product for your storefront">
      <ProductForm categories={categories} />
    </AdminShell>
  );
}
