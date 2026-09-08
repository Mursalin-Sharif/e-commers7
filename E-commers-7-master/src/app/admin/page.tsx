import Link from "next/link";
import { redirect } from "next/navigation";
import { Shield, Store, Sparkles } from "lucide-react";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { getSession } from "@/lib/session";

export const metadata = { title: "Admin Login" };

export default async function AdminPage() {
  const session = await getSession();
  if (session && session.role === "ADMIN") redirect("/admin/dashboard");

  return (
    <div className="fixed inset-0 z-50 grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0b1220] p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.18),transparent_40%)]" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white shadow-lg shadow-indigo-500/30">
            P
          </div>
          <span className="text-lg font-semibold">Paki Commerce</span>
        </div>
        <div className="relative">
          <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
            <Shield className="h-8 w-8 text-indigo-200" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Control Center</h1>
          <p className="mt-3 max-w-md leading-relaxed text-slate-400">
            Manage products, orders, landing pages, customers, and store settings from one unified dashboard.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            {["Visual landing page builder", "Order & inventory management", "Storefront content control"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-slate-600">© {new Date().getFullYear()} Paki.com</p>
      </div>

      <div className="flex flex-col justify-center bg-[#eef2f7] px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
              P
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Sign In</h1>
          </div>
          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500">Sign in to your admin account</p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
            <AdminLoginForm />
          </div>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
          >
            <Store className="h-4 w-4" />
            Back to storefront
          </Link>

          <p className="mt-4 text-center text-xs text-slate-400">Demo: admin@paki.com · Admin@12345</p>
        </div>
      </div>
    </div>
  );
}
