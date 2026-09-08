import { OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/db-enums";
import { prisma } from "@/lib/prisma";
import { calcCartSubtotal, getOrCreateCart } from "@/lib/cart";
import { getSiteSettings } from "@/lib/settings";
import { getProductPrice } from "@/lib/utils";

export function generateOrderNumber() {
  const now = new Date();
  const ymd =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PAKI-${ymd}-${rand}`;
}

export type PlaceOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  deliveryArea: "inside" | "outside";
  paymentMethod: "cod" | "online";
  notes?: string;
  userId: string;
};

export async function placeOrder(input: PlaceOrderInput) {
  const cart = await getOrCreateCart(input.userId);
  if (cart.items.length === 0) throw new Error("Your cart is empty");

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new Error(`${item.product.name} does not have enough stock`);
    }
  }

  const subtotal = calcCartSubtotal(cart.items);
  const settings = await getSiteSettings();
  const shippingFee =
    input.deliveryArea === "inside" ? settings.shippingDhakaInside : settings.shippingDhakaOutside;
  const total = subtotal + shippingFee;
  const orderNumber = generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: input.userId,
        status: OrderStatus.PLACED,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: input.paymentMethod === "online" ? PaymentMethod.ONLINE : PaymentMethod.COD,
        subtotal,
        shippingFee,
        total,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail || null,
        shippingAddress: input.shippingAddress,
        notes: input.notes || null,
        items: {
          create: cart.items.map((item) => {
            const price = getProductPrice(item.product);
            return {
              productId: item.productId,
              name: item.product.name,
              sku: item.product.sku,
              price,
              quantity: item.quantity,
              total: price * item.quantity,
            };
          }),
        },
        statusHistory: {
          create: { status: OrderStatus.PLACED, note: "Order placed" },
        },
        payment: {
          create: {
            method: input.paymentMethod === "online" ? PaymentMethod.ONLINE : PaymentMethod.COD,
            amount: total,
            status: PaymentStatus.PENDING,
          },
        },
      },
      include: { items: true },
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return created;
  });

  return order;
}
