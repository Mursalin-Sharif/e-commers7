"use client";

import { useActionState } from "react";
import { contactAction, type ContactState } from "@/app/actions/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(contactAction, {});

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-[#1A1A2E]">Send a Message</h2>
      {state.error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state.success && <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{state.success}</div>}
      <input name="name" required placeholder="Your Name" className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]" />
      <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]" />
      <textarea name="message" required rows={5} placeholder="Message" className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E85D04]" />
      <button type="submit" disabled={pending} className="w-full rounded-xl bg-[#E85D04] py-3 font-semibold text-white hover:bg-[#d45103] disabled:opacity-60">
        {pending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
