"use client";

import { useFormStatus } from "react-dom";
import { Heart } from "lucide-react";
import { toggleWishlistAction } from "@/app/actions/wishlist";

function SubmitButton({ active }: { active: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-600"
      }`}
    >
      <Heart className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
      {pending ? "Updating..." : active ? "Remove from Wishlist" : "Add to Wishlist"}
    </button>
  );
}

export function WishlistButton({
  productId,
  slug,
  initialActive,
}: {
  productId: string;
  slug: string;
  initialActive: boolean;
}) {
  return (
    <form action={toggleWishlistAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <SubmitButton active={initialActive} />
    </form>
  );
}
