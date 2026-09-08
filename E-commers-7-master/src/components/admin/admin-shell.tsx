import { AdminLayoutClient } from "@/components/admin/admin-layout-client";
import type { AdminBreadcrumb } from "@/components/admin/admin-topbar";
import type { SessionPayload } from "@/lib/auth";

export function AdminShell({
  session,
  title,
  description,
  children,
  action,
  breadcrumbs,
  fullWidth,
}: {
  session: SessionPayload;
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  breadcrumbs?: AdminBreadcrumb[];
  fullWidth?: boolean;
}) {
  return (
    <AdminLayoutClient
      session={session}
      title={title}
      description={description}
      action={action}
      breadcrumbs={breadcrumbs}
      fullWidth={fullWidth}
    >
      {children}
    </AdminLayoutClient>
  );
}
