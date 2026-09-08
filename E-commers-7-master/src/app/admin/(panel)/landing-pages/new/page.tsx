import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { NewLandingPageForm } from "@/components/admin/new-landing-page-form";

export const metadata = { title: "New Landing Page" };

export default async function NewLandingPagePage() {
  const session = await requireAdmin();

  return (
    <AdminShell
      session={session}
      title="New Landing Page"
      description="Create a custom page with the visual builder"
      breadcrumbs={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Landing Pages", href: "/admin/landing-pages" },
        { label: "New" },
      ]}
    >
      <NewLandingPageForm />
    </AdminShell>
  );
}
