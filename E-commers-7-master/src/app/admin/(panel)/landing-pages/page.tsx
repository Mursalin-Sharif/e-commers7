import Link from "next/link";
import { Plus, ExternalLink, LayoutTemplate } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBadge, AdminEmptyState, AdminLinkButton, AdminTable, AdminTableHead, AdminTd, AdminTh, AdminTr } from "@/components/admin/ui/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  deleteLandingPageAction,
  duplicateLandingPageAction,
  publishLandingPageAction,
  setHomepageAction,
  unpublishLandingPageAction,
  unsetHomepageAction,
} from "@/app/actions/landing-pages";

export const metadata = { title: "Landing Pages" };

export default async function AdminLandingPagesPage() {
  const session = await requireAdmin();
  const pages = await prisma.landingPage.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <AdminShell
      session={session}
      title="Landing Pages"
      description="Create unlimited custom pages with the visual builder"
      breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Landing Pages" }]}
      action={
        <AdminLinkButton href="/admin/landing-pages/new">
          <Plus className="h-4 w-4" />
          New Page
        </AdminLinkButton>
      }
    >
      <AdminTable>
        <table className="w-full text-left text-sm">
          <AdminTableHead>
            <tr>
              <AdminTh>Page</AdminTh>
              <AdminTh>URL</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Updated</AdminTh>
              <AdminTh className="text-right">Actions</AdminTh>
            </tr>
          </AdminTableHead>
          <tbody>
            {pages.map((page) => (
              <AdminTr key={page.id}>
                <AdminTd>
                  <div className="flex items-center gap-2">
                    <LayoutTemplate className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">{page.title}</p>
                      {page.isHomepage && (
                        <AdminBadge tone="info">Homepage</AdminBadge>
                      )}
                    </div>
                  </div>
                </AdminTd>
                <AdminTd>
                  <code className="text-xs text-slate-500">/page/{page.slug}</code>
                </AdminTd>
                <AdminTd>
                  <AdminBadge tone={page.status === "published" ? "success" : "warning"}>
                    {page.status}
                  </AdminBadge>
                </AdminTd>
                <AdminTd className="text-slate-500">
                  {page.updatedAt.toLocaleDateString("en-BD")}
                </AdminTd>
                <AdminTd>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                      href={`/admin/landing-pages/${page.id}/builder`}
                      className="text-xs font-medium text-slate-700 hover:text-slate-900"
                    >
                      Builder
                    </Link>
                    {page.status === "published" && (
                      <a
                        href={`/page/${page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 text-xs text-blue-600 hover:text-blue-800"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <form action={duplicateLandingPageAction}>
                      <input type="hidden" name="id" value={page.id} />
                      <button type="submit" className="text-xs text-slate-500 hover:text-slate-800">
                        Duplicate
                      </button>
                    </form>
                    {page.status === "published" ? (
                      <form action={unpublishLandingPageAction}>
                        <input type="hidden" name="id" value={page.id} />
                        <button type="submit" className="text-xs text-amber-600 hover:text-amber-800">
                          Unpublish
                        </button>
                      </form>
                    ) : (
                      <form action={publishLandingPageAction}>
                        <input type="hidden" name="id" value={page.id} />
                        <button type="submit" className="text-xs text-emerald-600 hover:text-emerald-800">
                          Publish
                        </button>
                      </form>
                    )}
                    {page.isHomepage ? (
                      <form action={unsetHomepageAction}>
                        <input type="hidden" name="id" value={page.id} />
                        <button type="submit" className="text-xs text-slate-500 hover:text-slate-800">
                          Unset Home
                        </button>
                      </form>
                    ) : page.status === "published" ? (
                      <form action={setHomepageAction}>
                        <input type="hidden" name="id" value={page.id} />
                        <button type="submit" className="text-xs text-blue-600 hover:text-blue-800">
                          Set Homepage
                        </button>
                      </form>
                    ) : null}
                    <form action={deleteLandingPageAction}>
                      <input type="hidden" name="id" value={page.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </table>
        {pages.length === 0 && (
          <AdminEmptyState
            icon={LayoutTemplate}
            title="No landing pages yet"
            description="Build unlimited custom pages for campaigns, sales, and promotions"
            action={
              <AdminLinkButton href="/admin/landing-pages/new">
                <Plus className="h-4 w-4" />
                Create your first page
              </AdminLinkButton>
            }
          />
        )}
      </AdminTable>
    </AdminShell>
  );
}
