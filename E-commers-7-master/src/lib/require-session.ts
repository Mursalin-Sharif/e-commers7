import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import type { SessionPayload } from "@/lib/auth";

export async function requireSession(returnPath = "/"): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect(`/login?redirect=${encodeURIComponent(returnPath)}`);
  }
  return session;
}
