import type { Cart, CartItem, Product } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getProductPrice } from "@/lib/utils";

export type CartWithItems = Cart & {
  items: (CartItem & { product: Product })[];
};

export function calcCartSubtotal(items: CartWithItems["items"]) {
  return items.reduce((sum, item) => sum + getProductPrice(item.product) * item.quantity, 0);
}

export function calcCartCount(items: { quantity: number }[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function emptyCart(): CartWithItems {
  return {
    id: "",
    userId: null,
    sessionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
  };
}

export async function getCartSummary() {
  const session = await getSession();
  if (!session) return 0;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.userId },
    include: { items: true },
  });
  return calcCartCount(cart?.items || []);
}

export async function getCartForUser(userId: string): Promise<CartWithItems> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
  return cart ?? emptyCart();
}

/** Read cart for the signed-in user only. */
export async function getCart(): Promise<CartWithItems> {
  const session = await getSession();
  if (!session) return emptyCart();
  return getCartForUser(session.userId);
}

export async function getOrCreateCart(userId: string): Promise<CartWithItems> {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  return cart;
}

export async function addProductToCart(userId: string, productId: string, quantity = 1) {
  const product = await prisma.product.findFirst({
    where: { id: productId, isPublished: true },
  });
  if (!product) throw new Error("Product not found");
  if (product.stock < 1) throw new Error("Product is out of stock");

  const cart = await getOrCreateCart(userId);
  const qty = Math.max(1, Math.min(quantity, product.stock));

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: { increment: qty } },
    create: { cartId: cart.id, productId, quantity: qty },
  });

  return getOrCreateCart(userId);
}

export async function updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.id === cartItemId);
  if (!item) throw new Error("Cart item not found");

  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return getOrCreateCart(userId);
  }

  const qty = Math.min(quantity, item.product.stock);
  await prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity: qty } });
  return getOrCreateCart(userId);
}

export async function removeCartItem(userId: string, cartItemId: string) {
  const cart = await getOrCreateCart(userId);
  if (!cart.items.some((item) => item.id === cartItemId)) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({ where: { id: cartItemId } });
  return getOrCreateCart(userId);
}

export async function clearCart(cartId: string) {
  if (!cartId) return;
  await prisma.cartItem.deleteMany({ where: { cartId } });
}
