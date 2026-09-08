"use client";

import { useActionState } from "react";
import { createLandingPageAction } from "@/app/actions/landing-pages";
import { AdminAlert, AdminButton, AdminCard, AdminInput, AdminLabel } from "@/components/admin/ui/admin-ui";

export function NewLandingPageForm() {
  const [state, action, pending] = useActionState(createLandingPageAction, {});

  return (
    <AdminCard className="max-w-2xl">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <h3 className="text-sm font-semibold text-slate-900">Page Details</h3>
        <p className="mt-0.5 text-xs text-slate-500">Create a new landing page and open the visual builder</p>
      </div>

      {state.error && (
        <div className="mb-4">
          <AdminAlert tone="error">{state.error}</AdminAlert>
        </div>
      )}

      <form action={action} className="space-y-4">
        <div>
          <AdminLabel required>Page Title</AdminLabel>
          <AdminInput name="title" placeholder="Summer Sale 2026" required />
        </div>
        <div>
          <AdminLabel>URL Slug</AdminLabel>
          <AdminInput name="slug" placeholder="summer-sale-2026" />
          <p className="mt-1 text-xs text-slate-400">Public URL: /page/your-slug</p>
        </div>
        <AdminButton type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create & Open Builder"}
        </AdminButton>
      </form>
    </AdminCard>
  );
}
