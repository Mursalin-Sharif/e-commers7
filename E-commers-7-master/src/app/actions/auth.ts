"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  createSessionToken,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { isValidEmail, normalizeEmail } from "@/lib/email";

export type ActionState = { error?: string; success?: string };

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const identifier = String(formData.get("phone") || formData.get("identifier") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirect") || "/");

  if (!identifier || !password) return { error: "Phone/email and password are required" };

  const email = identifier.includes("@") ? normalizeEmail(identifier) : null;
  const user = await prisma.user.findFirst({
    where: email ? { email } : { phone: identifier },
  });
  if (!user || user.status !== "ACTIVE") return { error: "Invalid phone/email or password" };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { error: "Invalid phone/email or password" };

  const token = await createSessionToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    phone: user.phone,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect(redirectTo);
}

export async function adminLoginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const identifier = String(formData.get("identifier") || "").trim();
  const password = String(formData.get("password") || "");

  if (!identifier || !password) return { error: "Email/phone and password are required" };

  const email = identifier.includes("@") ? normalizeEmail(identifier) : null;
  const user = await prisma.user.findFirst({
    where: email
      ? { email }
      : { OR: [{ phone: identifier }, { email: identifier }] },
  });

  if (!user || user.status !== "ACTIVE" || user.role !== "ADMIN") {
    return { error: "Invalid admin credentials" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { error: "Invalid admin credentials" };

  const token = await createSessionToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    phone: user.phone,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = normalizeEmail(String(formData.get("email") || ""));
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirect") || "/");

  if (!name || !email || !phone || !password) return { error: "All fields are required" };
  if (!isValidEmail(email)) return { error: "Enter a valid email address" };
  if (password.length < 6) return { error: "Password must be at least 6 characters" };

  const [existingPhone, existingEmail] = await Promise.all([
    prisma.user.findUnique({ where: { phone } }),
    prisma.user.findUnique({ where: { email } }),
  ]);
  if (existingPhone) return { error: "Phone number already registered" };
  if (existingEmail) return { error: "An account already exists with this email" };

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, phone, passwordHash, role: "CUSTOMER" },
  });

  const token = await createSessionToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    phone: user.phone,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect(redirectTo);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}
