import Link from "next/link";

export const metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-[#1A1A2E]">Forgot Password</h1>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          Password reset via SMS/email is not enabled yet. Please contact our support team with your registered phone number.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/contact" className="rounded-xl bg-[#E85D04] py-3 text-center font-semibold text-white hover:bg-[#d45103]">
            Contact Support
          </Link>
          <Link href="/login" className="rounded-xl border border-gray-200 py-3 text-center font-semibold text-gray-700 hover:border-[#4caf50]">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
