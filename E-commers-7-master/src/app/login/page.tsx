import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-[#1A1A2E]">Customer Login</h1>
        <p className="mb-6 text-sm text-gray-500">Login to your Paki account</p>
        <LoginForm redirectTo={redirectTo || "/"} />
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href={redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"}
            className="font-medium text-[#E85D04] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
