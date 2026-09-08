import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { BannerManager } from "@/components/admin/banner-manager";

export const metadata = { title: "Admin Banners" };

export default async function AdminBannersPage() {
  const session = await requireAdmin();
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell session={session} title="Banners" description="Manage homepage carousel slides">
      <BannerManager banners={banners} />
    </AdminShell>
  );
}
