"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderStatus } from "@/lib/db-enums";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  revalidateCategoryPages,
  revalidateProductPages,
  revalidateStorefrontPages,
} from "@/lib/revalidate-storefront";
import { slugify } from "@/lib/utils";

export type AdminState = { error?: string; success?: string };

async function guard() {
  await requireAdmin();
}

// ─── Products ───────────────────────────────────────────────

export async function saveProductAction(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await guard();

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || slugify(name)).trim();
  const sku = String(formData.get("sku") || "").trim();
  const categoryId = String(formData.get("categoryId") || "");
  const price = Number(formData.get("price") || 0);
  const salePriceRaw = String(formData.get("salePrice") || "");
  const salePrice = salePriceRaw ? Number(salePriceRaw) : null;
  const stock = Number(formData.get("stock") || 0);
  const shortDescription = String(formData.get("shortDescription") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const image = String(formData.get("image") || "").trim();
  const imagesJson = String(formData.get("images") || "").trim();
  const isFeatured = formData.get("isFeatured") === "on";
  const isPublished = formData.get("isPublished") === "on";

  if (!name || !sku || !categoryId) return { error: "Name, SKU and category are required" };

  const slugTaken = await prisma.product.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
  });
  if (slugTaken) return { error: "Slug already exists" };

  const skuTaken = await prisma.product.findFirst({
    where: { sku, ...(id ? { NOT: { id } } : {}) },
  });
  if (skuTaken) return { error: "SKU already exists" };

  let images = JSON.stringify(image ? [image] : [`/images/products/${slug}.jpg`]);
  if (imagesJson) {
    try {
      const parsed = JSON.parse(imagesJson);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.every((v) => typeof v === "string")) {
        images = imagesJson;
      }
    } catch {
      /* keep fallback */
    }
  }
  const data = {
    name, slug, sku, categoryId, price, salePrice, stock,
    shortDescription: shortDescription || null,
    description: description || null,
    images, isFeatured, isPublished,
  };

  if (id) {
    const existing = await prisma.product.findUnique({ where: { id } });
    await prisma.product.update({ where: { id }, data });
    revalidatePath("/admin/products");
    revalidateProductPages(slug, existing?.slug);
    return { success: "Product updated" };
  }

  await prisma.product.create({ data });
  revalidatePath("/admin/products");
  revalidateProductPages(slug);
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const existing = await prisma.product.findUnique({ where: { id } });
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    await prisma.product.update({ where: { id }, data: { isPublished: false } });
  }
  revalidatePath("/admin/products");
  if (existing) revalidateProductPages(existing.slug);
}

export async function toggleCategoryActiveAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return;
  await prisma.category.update({ where: { id }, data: { isActive: !category.isActive } });
  revalidatePath("/admin/categories");
  revalidateCategoryPages(category.slug);
}

export async function toggleBannerActiveAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) return;
  await prisma.banner.update({ where: { id }, data: { isActive: !banner.isActive } });
  revalidatePath("/admin/banners");
  revalidateStorefrontPages();
}

export async function toggleProductPublishAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;
  await prisma.product.update({ where: { id }, data: { isPublished: !product.isPublished } });
  revalidatePath("/admin/products");
  revalidateProductPages(product.slug);
}

// ─── Orders ─────────────────────────────────────────────────

export async function updateOrderStatusAction(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await guard();

  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "") as OrderStatus;
  const note = String(formData.get("note") || "").trim();

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      statusHistory: { create: { status, note: note || `Status changed to ${status}` } },
    },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { success: "Order status updated" };
}

// ─── Categories ─────────────────────────────────────────────

export async function saveCategoryAction(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await guard();

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || slugify(name)).trim();
  const image = String(formData.get("image") || `/images/categories/${slug}.jpg`).trim();
  const description = String(formData.get("description") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.has("isActive") ? formData.get("isActive") === "on" : true;

  if (!name) return { error: "Name is required" };

  const existing = id ? await prisma.category.findUnique({ where: { id } }) : null;

  if (id) {
    await prisma.category.update({
      where: { id },
      data: { name, slug, image, description: description || null, sortOrder, isActive },
    });
  } else {
    await prisma.category.create({
      data: { name, slug, image, description: description || null, sortOrder, isActive },
    });
  }

  revalidatePath("/admin/categories");
  revalidateCategoryPages(slug, existing?.slug);
  return { success: id ? "Category updated" : "Category created" };
}

export async function deleteCategoryAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const category = await prisma.category.findUnique({ where: { id } });
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0 || !category) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidateCategoryPages(category.slug);
}

// ─── Banners ────────────────────────────────────────────────

export async function saveBannerAction(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await guard();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const image = String(formData.get("image") || "").trim();
  const link = String(formData.get("link") || "/shop").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on";

  if (!image) return { error: "Please upload a banner image" };

  if (id) {
    await prisma.banner.update({ where: { id }, data: { title: title || null, image, link, sortOrder, isActive } });
  } else {
    await prisma.banner.create({ data: { title: title || null, image, link, sortOrder, isActive } });
  }

  revalidatePath("/admin/banners");
  revalidateStorefrontPages();
  return { success: id ? "Banner updated" : "Banner created" };
}

export async function deleteBannerAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/banners");
  revalidateStorefrontPages();
}

// ─── Settings ───────────────────────────────────────────────

export async function saveSettingsAction(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await guard();

  const settings = [
    { group: "general", key: "site_name", value: formData.get("site_name") },
    { group: "general", key: "tagline", value: formData.get("tagline") },
    { group: "general", key: "phone", value: formData.get("phone") },
    { group: "general", key: "email", value: formData.get("email") },
    { group: "general", key: "address", value: formData.get("address") },
    { group: "theme", key: "primary_color", value: formData.get("primary_color") },
    { group: "theme", key: "secondary_color", value: formData.get("secondary_color") },
    { group: "shipping", key: "dhaka_inside", value: formData.get("dhaka_inside") },
    { group: "shipping", key: "dhaka_outside", value: formData.get("dhaka_outside") },
  ];

  try {
    for (const s of settings) {
      const val = String(s.value || "");
      await prisma.setting.upsert({
        where: { group_key: { group: s.group, key: s.key } },
        update: { value: JSON.stringify(val) },
        create: { group: s.group, key: s.key, value: JSON.stringify(val) },
      });
    }
    revalidatePath("/admin/settings");
    revalidateStorefrontPages();
    return { success: "Settings saved" };
  } catch {
    return { error: "Could not save settings" };
  }
}

// ─── Customers ──────────────────────────────────────────────

export async function updateCustomerStatusAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "ACTIVE") as "ACTIVE" | "SUSPENDED" | "BANNED";
  await prisma.user.update({ where: { id }, data: { status } });
  revalidatePath("/admin/customers");
}
