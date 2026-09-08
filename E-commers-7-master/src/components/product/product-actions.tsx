"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { addToCartAction, type CartActionState } from "@/app/actions/cart";
import { buyNowAction } from "@/app/actions/checkout";
import { useAuth } from "@/components/auth/auth-context";

type ProductActionsProps = {
  productId: string;
  stock: number;
  minOrderQty?: number;
  layout?: "stack" | "row";
  size?: "sm" | "md";
  variant?: "default" | "card";
  className?: string;
};

function BuyNowButton({ className, disabled }: { className: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || disabled} className={className}>
      {pending ? "..." : "অর্ডার করুন"}
    </button>
  );
}

function AddToCartButton({ className, disabled }: { className: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || disabled} className={className}>
      {pending ? "যোগ হচ্ছে..." : "কার্টে যোগ করুন"}
    </button>
  );
}

export function ProductActions({
  productId,
  stock,
  minOrderQty = 1,
  layout = "stack",
  size = "sm",
  variant = "default",
  className = "",
}: ProductActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const [quantity, setQuantity] = useState(minOrderQty);
  const [state, action] = useActionState<CartActionState, FormData>(addToCartAction, {});
  const feedback = state.success || state.error;
  const outOfStock = stock < 1;
  const maxQty = Math.max(stock, 0);
  const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;
  const registerHref = `/register?redirect=${encodeURIComponent(pathname)}`;

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state.success, router]);

  const isCard = variant === "card";
  const py = size === "md" ? "py-3" : isCard ? "py-1.5" : "py-2";
  const text = size === "md" ? "text-sm" : isCard ? "text-[12px]" : "text-[13px]";
  const layoutClass = layout === "stack" ? `flex flex-col ${isCard ? "gap-1" : "gap-1.5"}` : "grid grid-cols-2 gap-1.5";
  const buttonClass = isCard
    ? "product_item__btn"
    : `block w-full rounded-[5px] bg-[var(--accent)] ${py} text-center ${text} font-semibold text-white transition hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60`;
  const disabledClass = isCard
    ? "product_item__btn"
    : "block w-full rounded-[5px] bg-gray-300 py-2 text-center text-[13px] font-semibold text-gray-600";
  const loginButtonClass = `block w-full rounded-[5px] border border-[var(--accent)] bg-white ${py} text-center ${text} font-semibold text-[var(--accent)] transition hover:bg-green-50`;
  const wrapperClass = isCard ? `product_item__actions ${className}` : `${layoutClass} ${className}`;

  if (outOfStock) {
    return (
      <div className={wrapperClass}>
        <button type="button" disabled className={disabledClass}>
          স্টক শেষ
        </button>
      </div>
    );
  }

  if (!isLoggedIn) {
    if (isCard) {
      return (
        <div className={wrapperClass}>
          <Link href={loginHref} className={buttonClass}>
            অর্ডার করুন
          </Link>
          <Link href={loginHref} className={buttonClass}>
            কার্টে যোগ করুন
          </Link>
        </div>
      );
    }

    return (
      <div className={wrapperClass}>
        <Link href={loginHref} className={buttonClass}>
          লগইন করে অর্ডার করুন
        </Link>
        <Link href={loginHref} className={loginButtonClass}>
          কার্টে যোগ করতে লগইন করুন
        </Link>
        <p className="text-center text-[11px] text-gray-500">
          নতুন?{" "}
          <Link href={registerHref} className="font-medium text-[#E85D04] hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {size === "md" && (
        <div className="mb-1 flex items-center justify-center gap-2">
          <label className="text-sm text-gray-600">Qty</label>
          <input
            type="number"
            min={minOrderQty}
            max={maxQty}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(maxQty, Math.max(minOrderQty, Number(e.target.value) || minOrderQty)))}
            className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-sm"
          />
        </div>
      )}

      <form action={buyNowAction}>
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="quantity" value={size === "md" ? quantity : 1} />
        <input type="hidden" name="returnTo" value={pathname} />
        <BuyNowButton className={buttonClass} />
      </form>

      <form action={action}>
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="quantity" value={size === "md" ? quantity : 1} />
        <input type="hidden" name="returnTo" value={pathname} />
        <AddToCartButton className={buttonClass} />
      </form>

      {feedback && !isCard && (
        <p className={`text-center text-xs ${state.error ? "text-red-600" : "text-[#2e7d32]"}`}>{feedback}</p>
      )}
    </div>
  );
}
