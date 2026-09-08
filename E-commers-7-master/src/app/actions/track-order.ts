"use server";

import { prisma } from "@/lib/prisma";

export type TrackOrderState = {
  error?: string;
  order?: {
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: number;
    customerName: string;
    createdAt: string;
    items: { name: string; quantity: number; total: number }[];
    history: { status: string; note: string | null; createdAt: string }[];
  };
};

export async function trackOrderAction(_prev: TrackOrderState, formData: FormData): Promise<TrackOrderState> {
  const orderNumber = String(formData.get("orderNumber") || "").trim().toUpperCase();
  const phone = String(formData.get("phone") || "").trim();

  if (!orderNumber || !phone) return { error: "Order number and phone are required" };

  const order = await prisma.order.findFirst({
    where: { orderNumber, customerPhone: phone },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) return { error: "No order found with those details" };

  return {
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      customerName: order.customerName,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, total: i.total })),
      history: order.statusHistory.map((h) => ({
        status: h.status,
        note: h.note,
        createdAt: h.createdAt.toISOString(),
      })),
    },
  };
}
