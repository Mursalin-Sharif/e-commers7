"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "@/app/actions/auth";

export function LoginForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">Mobile or Email</label>
        <input
          id="phone"
          name="phone"
          type="text"
          required
          autoComplete="username"
          placeholder="01XXXXXXXXX or you@example.com"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-orange-100"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-orange-100"
        />
      </div>
      <Link href="/forgot-password" className="block text-sm text-[#E85D04] hover:underline">
        Forgot password?
      </Link>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[#E85D04] py-3 font-semibold text-white transition hover:bg-[#d45103] disabled:opacity-60"
      >
        {pending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
