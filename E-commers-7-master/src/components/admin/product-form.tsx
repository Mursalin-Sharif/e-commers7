"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveProductAction, type AdminState } from "@/app/actions/admin";
import { parseImages } from "@/lib/utils";
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/ui/admin-ui";
import { MultiImageUploader } from "@/components/admin/image-uploader";

type Category = { id: string; name: string };

type ProductFormProps = {
  categories: Category[];
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    categoryId: string;
    price: number;
    salePrice: number | null;
    stock: number;
    shortDescription: string | null;
    description: string | null;
    images: string;
    isFeatured: boolean;
    isPublished: boolean;
  };
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const [state, action, pending] = useActionState<AdminState, FormData>(saveProductAction, {});
  const productImages = product ? parseImages(product.images) : [];

  return (
    <AdminCard className="max-w-3xl">
      <form action={action} className="space-y-6">
        {product && <input type="hidden" name="id" value={product.id} />}
        {state.error && <AdminAlert tone="error">{state.error}</AdminAlert>}
        {state.success && <AdminAlert tone="success">{state.success}</AdminAlert>}

        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Basic Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel required>Product Name</AdminLabel>
              <AdminInput name="name" defaultValue={product?.name} required />
            </div>
            <div>
              <AdminLabel>Slug</AdminLabel>
              <AdminInput name="slug" defaultValue={product?.slug} placeholder="auto-generated" />
            </div>
            <div>
              <AdminLabel required>SKU</AdminLabel>
              <AdminInput name="sku" defaultValue={product?.sku} required />
            </div>
            <div>
              <AdminLabel required>Category</AdminLabel>
              <AdminSelect name="categoryId" required defaultValue={product?.categoryId}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </AdminSelect>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Pricing & Inventory</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <AdminLabel required>Price (৳)</AdminLabel>
              <AdminInput name="price" type="number" defaultValue={product?.price} required />
            </div>
            <div>
              <AdminLabel>Sale Price (৳)</AdminLabel>
              <AdminInput name="salePrice" type="number" defaultValue={product?.salePrice ?? ""} />
            </div>
            <div>
              <AdminLabel required>Stock</AdminLabel>
              <AdminInput name="stock" type="number" defaultValue={product?.stock ?? 0} required />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Media & Description</h3>
          <div className="space-y-4">
            <MultiImageUploader
              name="images"
              folder="products"
              label="Product Images"
              defaultValue={productImages}
            />
            <div>
              <AdminLabel>Short Description</AdminLabel>
              <AdminInput name="shortDescription" defaultValue={product?.shortDescription ?? ""} />
            </div>
            <div>
              <AdminLabel>Full Description</AdminLabel>
              <AdminTextarea name="description" rows={4} defaultValue={product?.description ?? ""} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} className="rounded border-slate-300" />
            Featured product
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isPublished" defaultChecked={product?.isPublished ?? true} className="rounded border-slate-300" />
            Published on storefront
          </label>
        </div>

        <div className="flex gap-3 border-t border-slate-100 pt-4">
          <AdminButton type="submit" disabled={pending}>
            {pending ? "Saving..." : product ? "Update Product" : "Create Product"}
          </AdminButton>
          <Link href="/admin/products" className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Cancel
          </Link>
        </div>
      </form>
    </AdminCard>
  );
}
