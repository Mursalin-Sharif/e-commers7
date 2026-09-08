import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Admin Settings" };

function parseSetting(value: string) {
  try { return JSON.parse(value) as string; } catch { return value; }
}

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  const rows = await prisma.setting.findMany();

  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = parseSetting(row.value);
  }

  return (
    <AdminShell session={session} title="Settings" description="Store configuration and preferences">
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
