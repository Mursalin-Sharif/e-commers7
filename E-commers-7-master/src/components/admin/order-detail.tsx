"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateOrderStatusAction, type AdminState } from "@/app/actions/admin";
import { formatPrice } from "@/lib/utils";
import {
  AdminAlert,
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLabel,
  AdminSelect,
  orderStatusTone,
} from "@/components/admin/ui/admin-ui";

const STATUSES = ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED"];

type OrderDetailProps = {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    shippingAddress: string;
    notes: string | null;
    subtotal: number;
    shippingFee: number;
    total: number;
    createdAt: string;
    items: { name: string; sku: string; price: number; quantity: number; total: number }[];
    history: { status: string; note: string | null; createdAt: string }[];
  };
};

export function OrderDetail({ order }: OrderDetailProps) {
  const [state, action, pending] = useActionState<AdminState, FormData>(updateOrderStatusAction, {});

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <AdminCard>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Order</p>
              <h2 className="text-lg font-semibold text-slate-900">{order.orderNumber}</h2>
            </div>
            <AdminBadge tone={orderStatusTone(order.status)}>{order.status}</AdminBadge>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Info label="Payment" value={`${order.paymentMethod} · ${order.paymentStatus}`} />
            <Info label="Date" value={new Date(order.createdAt).toLocaleString()} />
            <Info label="Customer" value={order.customerName} />
            <Info label="Phone" value={order.customerPhone} />
            {order.customerEmail && <Info label="Email" value={order.customerEmail} />}
            <Info label="Address" value={order.shippingAddress} className="sm:col-span-2" />
          </dl>
        </AdminCard>

        <AdminCard>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Order Items</h3>
          <div className="divide-y divide-slate-100">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.sku} · Qty {item.quantity}</p>
                </div>
                <p className="font-medium text-slate-900">{formatPrice(item.total)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            <Row label="Shipping" value={formatPrice(order.shippingFee)} />
            <Row label="Total" value={formatPrice(order.total)} bold />
          </div>
        </AdminCard>
      </div>

      <div className="space-y-6">
        <AdminCard>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Update Status</h3>
          <form action={action} className="space-y-4">
            <input type="hidden" name="orderId" value={order.id} />
            {state.error && <AdminAlert tone="error">{state.error}</AdminAlert>}
            {state.success && <AdminAlert tone="success">{state.success}</AdminAlert>}
            <div>
              <AdminLabel>Status</AdminLabel>
              <AdminSelect name="status" defaultValue={order.status}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </AdminSelect>
            </div>
            <div>
              <AdminLabel>Note</AdminLabel>
              <AdminInput name="note" placeholder="Optional note for timeline" />
            </div>
            <AdminButton type="submit" disabled={pending} className="w-full">
              {pending ? "Updating..." : "Update Order"}
            </AdminButton>
          </form>
        </AdminCard>

        <AdminCard>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Timeline</h3>
          <div className="space-y-4">
            {order.history.map((h, i) => (
              <div key={i} className="relative border-l-2 border-slate-200 pl-4">
                <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-slate-900" />
                <p className="text-sm font-medium text-slate-900">{h.status}</p>
                {h.note && <p className="text-xs text-slate-500">{h.note}</p>}
                <p className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </AdminCard>

        <Link href="/admin/orders" className="block text-center text-sm font-medium text-slate-500 hover:text-slate-900">
          ← Back to orders
        </Link>
      </div>
    </div>
  );
}

function Info({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold text-slate-900" : "text-slate-600"}`}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
