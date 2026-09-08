"use client";

import { useActionState } from "react";
import { registerAction, type ActionState } from "@/app/actions/auth";

export function RegisterForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(registerAction, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">Full Name</label>
        <input id="name" name="name" required placeholder="Your name" className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]"
        />
        <p className="mt-1 text-xs text-gray-500">One email can only be used for one account.</p>
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">Mobile Number</label>
        <input id="phone" name="phone" type="tel" required placeholder="01XXXXXXXXX" className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" required minLength={6} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]" />
      </div>
      <button type="submit" disabled={pending} className="w-full rounded-xl bg-[#E85D04] py-3 font-semibold text-white hover:bg-[#d45103] disabled:opacity-60">
        {pending ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
