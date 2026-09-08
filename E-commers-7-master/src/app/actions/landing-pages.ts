"use server";

import { revalidateLandingPage, revalidateStorefrontPages } from "@/lib/revalidate-storefront";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";
import { parseSections, serializeSections } from "@/lib/landing-pages";
import type { AdminState } from "@/app/actions/admin";

async function guard() {
  await requireAdmin();
}

function revalidateLanding(slug: string, isHomepage?: boolean) {
  revalidatePath("/admin/landing-pages");
  revalidateLandingPage(slug, isHomepage);
  if (isHomepage) revalidateStorefrontPages();
}

export async function createLandingPageAction(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await guard();

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || slugify(title)).trim();

  if (!title || !slug) return { error: "Title and slug are required" };

  const existing = await prisma.landingPage.findUnique({ where: { slug } });
  if (existing) return { error: "Slug already exists" };

  const page = await prisma.landingPage.create({
    data: { title, slug, status: "draft", sections: "[]" },
  });

  redirect(`/admin/landing-pages/${page.id}/builder`);
}

export async function saveLandingPageMetaAction(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await guard();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const seoTitle = String(formData.get("seoTitle") || "").trim();
  const seoDescription = String(formData.get("seoDescription") || "").trim();
  const featuredImage = String(formData.get("featuredImage") || "").trim();

  if (!id || !title || !slug) return { error: "Title and slug are required" };

  const page = await prisma.landingPage.findUnique({ where: { id } });
  if (!page) return { error: "Page not found" };

  if (slug !== page.slug) {
    const taken = await prisma.landingPage.findUnique({ where: { slug } });
    if (taken) return { error: "Slug already in use" };
  }

  await prisma.landingPage.update({
    where: { id },
    data: {
      title,
      slug,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      featuredImage: featuredImage || null,
    },
  });

  revalidateLanding(slug, page.isHomepage);
  if (slug !== page.slug) revalidateLanding(page.slug, page.isHomepage);
  return { success: "Page details saved" };
}

export async function saveLandingPageSectionsAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await guard();

  const id = String(formData.get("id") || "");
  const sectionsJson = String(formData.get("sections") || "[]");

  const page = await prisma.landingPage.findUnique({ where: { id } });
  if (!page) return { error: "Page not found" };

  const sections = parseSections(sectionsJson);
  await prisma.landingPage.update({
    where: { id },
    data: { sections: serializeSections(sections) },
  });

  revalidateLanding(page.slug, page.isHomepage);
  return { success: "Sections saved" };
}

export async function publishLandingPageAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const sectionsJson = String(formData.get("sections") || "");

  const page = await prisma.landingPage.findUnique({ where: { id } });
  if (!page) return;

  if (sectionsJson) {
    const sections = parseSections(sectionsJson);
    await prisma.landingPage.update({
      where: { id },
      data: { sections: serializeSections(sections), status: "published", publishedAt: new Date() },
    });
  } else {
    await prisma.landingPage.update({
      where: { id },
      data: { status: "published", publishedAt: new Date() },
    });
  }

  revalidateLanding(page.slug, page.isHomepage);
}

export async function unpublishLandingPageAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const page = await prisma.landingPage.findUnique({ where: { id } });
  if (!page) return;

  await prisma.landingPage.update({
    where: { id },
    data: { status: "draft" },
  });

  revalidateLanding(page.slug, page.isHomepage);
}

export async function setHomepageAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");

  await prisma.landingPage.updateMany({ data: { isHomepage: false } });
  const page = await prisma.landingPage.update({
    where: { id },
    data: { isHomepage: true, status: "published", publishedAt: new Date() },
  });

  revalidateLanding(page.slug, true);
}

export async function unsetHomepageAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const page = await prisma.landingPage.findUnique({ where: { id } });
  if (!page) return;

  await prisma.landingPage.update({
    where: { id },
    data: { isHomepage: false },
  });

  revalidateLanding(page.slug, true);
  revalidatePath("/admin/landing-pages");
}

export async function deleteLandingPageAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const page = await prisma.landingPage.findUnique({ where: { id } });
  if (!page) return;

  await prisma.landingPage.delete({ where: { id } });
  revalidateLanding(page.slug, page.isHomepage);
}

export async function duplicateLandingPageAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const page = await prisma.landingPage.findUnique({ where: { id } });
  if (!page) return;

  let slug = `${page.slug}-copy`;
  let i = 1;
  while (await prisma.landingPage.findUnique({ where: { slug } })) {
    slug = `${page.slug}-copy-${i++}`;
  }

  await prisma.landingPage.create({
    data: {
      title: `${page.title} (Copy)`,
      slug,
      status: "draft",
      sections: page.sections,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      featuredImage: page.featuredImage,
    },
  });

  revalidatePath("/admin/landing-pages");
}
