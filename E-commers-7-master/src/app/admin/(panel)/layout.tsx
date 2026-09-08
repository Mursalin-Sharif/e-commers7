import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#eef2f7]">
      {children}
    </div>
  );
}
