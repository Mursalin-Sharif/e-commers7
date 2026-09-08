import { revalidatePath } from "next/cache";

/** Revalidate shared chrome: header nav, footer, settings. */
export function revalidateStorefrontLayout() {
  revalidatePath("/", "layout");
}

/** Revalidate main storefront routes after broad catalog/settings changes. */
export function revalidateStorefrontPages() {
  revalidateStorefrontLayout();
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/search");
  revalidatePath("/contact");
  revalidatePath("/checkout");
  revalidatePath("/cart");
}

export function revalidateProductPages(slug: string, previousSlug?: string) {
  revalidatePath(`/product/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/product/${previousSlug}`);
  }
  revalidatePath("/shop");
  revalidatePath("/search");
  revalidatePath("/");
  revalidateStorefrontLayout();
}

export function revalidateCategoryPages(slug: string, previousSlug?: string) {
  revalidatePath(`/category/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/category/${previousSlug}`);
  }
  revalidatePath("/");
  revalidateStorefrontLayout();
}

export function revalidateLandingPage(slug: string, isHomepage?: boolean) {
  revalidatePath(`/page/${slug}`);
  if (isHomepage) {
    revalidatePath("/");
    revalidateStorefrontLayout();
  }
}
