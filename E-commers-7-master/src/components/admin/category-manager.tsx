"use client";

import { useActionState, useState } from "react";
import { saveCategoryAction, deleteCategoryAction, toggleCategoryActiveAction, type AdminState } from "@/app/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  AdminAlert,
  AdminBadge,
  AdminButton,
  AdminInput,
  AdminLabel,
  AdminSection,
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTextarea,
  AdminTh,
  AdminTr,
} from "@/components/admin/ui/admin-ui";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<Category | null>(null);

  async function handleSave(prev: AdminState, formData: FormData) {
    const result = await saveCategoryAction(prev, formData);
    if (result.success) setEditing(null);
    return result;
  }

  const [state, action, pending] = useActionState<AdminState, FormData>(handleSave, {});

  return (
    <div className="space-y-6">
      <AdminSection
        title={editing ? "Edit Category" : "Add Category"}
        description={editing ? `Updating ${editing.name}` : "Create a new product category"}
      >
        {state.success && <div className="mb-4"><AdminAlert tone="success">{state.success}</AdminAlert></div>}
        {state.error && <div className="mb-4"><AdminAlert tone="error">{state.error}</AdminAlert></div>}
        <form action={action} className="grid gap-4 sm:grid-cols-2">
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div>
            <AdminLabel required>Name</AdminLabel>
            <AdminInput name="name" required placeholder="Category name" defaultValue={editing?.name} key={editing?.id || "new-name"} />
          </div>
          <div>
            <AdminLabel>Slug</AdminLabel>
            <AdminInput name="slug" placeholder="auto-generated" defaultValue={editing?.slug} key={editing?.id || "new-slug"} />
          </div>
          <div>
            <ImageUploader
              name="image"
              folder="categories"
              label="Category Image"
              hint="Shown in homepage category carousel"
              defaultValue={editing?.image || ""}
              key={editing?.id || "new-image"}
            />
          </div>
          <div>
            <AdminLabel>Sort Order</AdminLabel>
            <AdminInput name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} key={editing?.id || "new-sort"} />
          </div>
          <div className="sm:col-span-2">
            <AdminLabel>Description</AdminLabel>
            <AdminTextarea
              name="description"
              rows={3}
              placeholder="Shown on category page"
              defaultValue={editing?.description || ""}
              key={editing?.id || "new-desc"}
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <AdminButton type="submit" disabled={pending}>
              {pending ? "Saving..." : editing ? "Update Category" : "Add Category"}
            </AdminButton>
            {editing && (
              <AdminButton type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel Edit
              </AdminButton>
            )}
          </div>
        </form>
      </AdminSection>

      <AdminTable>
        <table className="w-full text-left text-sm">
          <AdminTableHead>
            <tr>
              <AdminTh>Name</AdminTh>
              <AdminTh>Slug</AdminTh>
              <AdminTh>Products</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh className="text-right">Actions</AdminTh>
            </tr>
          </AdminTableHead>
          <tbody>
            {categories.map((c) => (
              <AdminTr key={c.id}>
                <AdminTd className="font-medium text-slate-900">{c.name}</AdminTd>
                <AdminTd className="text-slate-500">{c.slug}</AdminTd>
                <AdminTd className="text-slate-600">{c._count.products}</AdminTd>
                <AdminTd>
                  <AdminBadge tone={c.isActive ? "success" : "default"}>{c.isActive ? "Active" : "Inactive"}</AdminBadge>
                </AdminTd>
                <AdminTd className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(c)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <form action={toggleCategoryActiveAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="text-xs text-blue-600 hover:text-blue-800">
                        {c.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                    {c._count.products === 0 && (
                      <form action={deleteCategoryAction} className="inline">
                        <input type="hidden" name="id" value={c.id} />
                        <DeleteButton />
                      </form>
                    )}
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}
