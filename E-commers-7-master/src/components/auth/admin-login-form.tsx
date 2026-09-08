"use client";

import { useActionState } from "react";
import { adminLoginAction, type ActionState } from "@/app/actions/auth";
import { AdminAlert, AdminButton, AdminInput, AdminLabel } from "@/components/admin/ui/admin-ui";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(adminLoginAction, {});

  return (
    <form action={action} className="space-y-5">
      {state.error && <AdminAlert tone="error">{state.error}</AdminAlert>}
      <div>
        <AdminLabel required>Email or Phone</AdminLabel>
        <AdminInput name="identifier" required placeholder="admin@paki.com" autoComplete="username" />
      </div>
      <div>
        <AdminLabel required>Password</AdminLabel>
        <AdminInput name="password" type="password" required autoComplete="current-password" />
      </div>
      <AdminButton type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in..." : "Sign In"}
      </AdminButton>
    </form>
  );
}
