"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, Store } from "lucide-react";
import type { SessionPayload } from "@/lib/auth";
import { adminNavItems } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";

export type AdminBreadcrumb = {
  label: string;
  href?: string;
};

export function AdminTopbar({
  session,
  breadcrumbs,
  onMenuOpen,
}: {
  session: SessionPayload;
  breadcrumbs?: AdminBreadcrumb[];
  onMenuOpen: () => void;
}) {
  const pathname = usePathname();
  const current = adminNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  const trail =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : [{ label: "Admin", href: "/admin/dashboard" }, { label: current?.label || "Panel" }];

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200/90 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenuOpen}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <nav className="hidden min-w-0 flex-1 items-center gap-1.5 text-sm sm:flex">
        {trail.map((crumb, index) => (
          <div key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && <span className="text-slate-300">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="truncate text-slate-500 transition hover:text-slate-900">
                {crumb.label}
              </Link>
            ) : (
              <span className="truncate font-medium text-slate-900">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search admin..."
            className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 xl:w-72"
          />
        </div>

        <button
          type="button"
          className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 sm:inline-flex"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <Link
          href="/"
          className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:inline-flex"
        >
          <Store className="h-3.5 w-3.5" />
          Store
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
            {session.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden max-w-[120px] truncate text-xs font-medium text-slate-700 sm:block">
            {session.name}
          </span>
        </div>
      </div>
    </header>
  );
}

export function AdminMobileOverlay({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[1px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(88vw,280px)] shadow-2xl transition-transform duration-200 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {children}
      </div>
    </>
  );
}
