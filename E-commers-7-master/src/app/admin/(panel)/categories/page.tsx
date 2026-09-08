import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryManager } from "@/components/admin/category-manager";

export const metadata = { title: "Admin Categories" };

export default async function AdminCategoriesPage() {
  const session = await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <AdminShell session={session} title="Categories" description="Organize your product catalog">
      <CategoryManager categories={categories} />
    </AdminShell>
  );
}
