"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type WishlistState = { error?: string; success?: string };

export async function toggleWishlistAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/account");

  const productId = String(formData.get("productId") || "");
  if (!productId) return;

  let wishlist = await prisma.wishlist.findUnique({ where: { userId: session.userId } });
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { userId: session.userId } });
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
  }

  revalidatePath("/account");
  revalidatePath(`/product/${formData.get("slug") || ""}`);
}

export async function getUserWishlist(userId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: { include: { category: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return wishlist?.items ?? [];
}

export async function isInWishlist(userId: string, productId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: { where: { productId } } },
  });
  return (wishlist?.items.length ?? 0) > 0;
}
