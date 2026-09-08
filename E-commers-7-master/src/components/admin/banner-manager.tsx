"use client";

import { useActionState, useState } from "react";
import { saveBannerAction, deleteBannerAction, toggleBannerActiveAction, type AdminState } from "@/app/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  AdminAlert,
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminCheckbox,
  AdminInput,
  AdminLabel,
  AdminSection,
} from "@/components/admin/ui/admin-ui";

type Banner = {
  id: string;
  title: string | null;
  image: string;
  link: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function BannerManager({ banners }: { banners: Banner[] }) {
  const [editing, setEditing] = useState<Banner | null>(null);

  async function handleSave(prev: AdminState, formData: FormData) {
    const result = await saveBannerAction(prev, formData);
    if (result.success) setEditing(null);
    return result;
  }

  const [state, action, pending] = useActionState<AdminState, FormData>(handleSave, {});

  return (
    <div className="space-y-6">
      <AdminSection
        title={editing ? "Edit Banner" : "Add Banner"}
        description="Banners appear on the homepage when a landing page uses the Admin Banners section"
      >
        {state.success && (
          <div className="mb-4">
            <AdminAlert tone="success">{state.success}</AdminAlert>
          </div>
        )}
        {state.error && (
          <div className="mb-4">
            <AdminAlert tone="error">{state.error}</AdminAlert>
          </div>
        )}
        <form action={action} className="grid gap-4 sm:grid-cols-2">
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div>
            <AdminLabel>Title</AdminLabel>
            <AdminInput name="title" placeholder="Summer Sale" defaultValue={editing?.title || ""} key={editing?.id || "new-title"} />
          </div>
          <div className="sm:col-span-2">
            <ImageUploader
              name="image"
              folder="banners"
              label="Banner Image"
              required={!editing}
              defaultValue={editing?.image || ""}
              key={editing?.id || "new-image"}
            />
          </div>
          <div>
            <AdminLabel>Link URL</AdminLabel>
            <AdminInput name="link" defaultValue={editing?.link || "/shop"} key={editing?.id || "new-link"} />
          </div>
          <div>
            <AdminLabel>Sort Order</AdminLabel>
            <AdminInput name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} key={editing?.id || "new-sort"} />
          </div>
          <div className="sm:col-span-2">
            <AdminCheckbox
              name="isActive"
              id="banner-active"
              defaultChecked={editing ? editing.isActive : true}
              label="Active on homepage"
              key={editing?.id || "new-active"}
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <AdminButton type="submit" disabled={pending}>
              {pending ? "Saving..." : editing ? "Update Banner" : "Add Banner"}
            </AdminButton>
            {editing && (
              <AdminButton type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel Edit
              </AdminButton>
            )}
          </div>
        </form>
      </AdminSection>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {banners.map((b) => (
          <AdminCard key={b.id} padding={false} className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.image} alt={b.title || "Banner"} className="h-36 w-full object-cover" />
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="font-medium text-slate-900">{b.title || "Untitled"}</p>
                <AdminBadge tone={b.isActive ? "success" : "default"}>{b.isActive ? "Active" : "Off"}</AdminBadge>
              </div>
              <p className="mb-3 truncate text-xs text-slate-400">{b.link}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(b)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <form action={toggleBannerActiveAction} className="inline">
                  <input type="hidden" name="id" value={b.id} />
                  <button type="submit" className="text-xs text-blue-600 hover:text-blue-800">
                    {b.isActive ? "Deactivate" : "Activate"}
                  </button>
                </form>
                <form action={deleteBannerAction} className="inline">
                  <input type="hidden" name="id" value={b.id} />
                  <DeleteButton label="Remove" />
                </form>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
