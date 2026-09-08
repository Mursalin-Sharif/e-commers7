import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/lib/settings";

export const metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[#1A1A2E]">Contact Us</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold">Phone</h3>
            <p className="text-[#E85D04]">{settings.phone}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold">Email</h3>
            <p className="text-[#E85D04]">{settings.email}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold">Address</h3>
            <p className="text-gray-600">{settings.address}</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
