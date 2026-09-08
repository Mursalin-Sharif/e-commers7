"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileOverlay, AdminTopbar, type AdminBreadcrumb } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/ui/admin-ui";
import type { SessionPayload } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function AdminLayoutClient({
  session,
  title,
  description,
  action,
  breadcrumbs,
  fullWidth = false,
  children,
}: {
  session: SessionPayload;
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: AdminBreadcrumb[];
  fullWidth?: boolean;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-panel flex h-full min-h-screen bg-[#eef2f7]">
      <div className="hidden lg:flex">
        <AdminSidebar session={session} />
      </div>

      <AdminMobileOverlay open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <AdminSidebar session={session} mobile onNavigate={() => setMobileOpen(false)} />
      </AdminMobileOverlay>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          session={session}
          breadcrumbs={breadcrumbs}
          onMenuOpen={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overscroll-contain">
          <div
            className={cn(
              "mx-auto px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-8",
              fullWidth ? "max-w-[1600px]" : "max-w-7xl",
            )}
          >
            <AdminPageHeader title={title} description={description} action={action} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
