import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { mapOrder, toBackendStatus } from "../../shared/lib/apiMappers";
import { formatPickupTime, ORDER_STATUS_LABELS } from "../../shared/labels";
import { useAuth } from "../../shared/state/AuthContext";
import type { Order, OrderStatus } from "../../shared/types/order";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  confirmed: "preparing",
  preparing: "ready",
  ready: "picked_up",
  picked_up: null,
  cancelled: null,
};

const CANCELLABLE_STATUSES: OrderStatus[] = ["confirmed", "preparing"];

export function KitchenDashboardPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const loadOrders = () => {
    apiFetch<unknown[]>("/orders", { token })
      .then((raw) => setOrders(raw.map((order) => mapOrder(order as never))))
      .catch(() => setOrders([]));
  };

  useEffect(loadOrders, [token]);

  const advanceStatus = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setPendingId(order.id);
    await apiFetch(`/orders/${order.id}/status`, {
      method: "PATCH",
      token,
      body: { status: toBackendStatus(next) },
    });
    setPendingId(null);
    loadOrders();
  };

  const cancelOrder = async (order: Order) => {
    setPendingId(order.id);
    await apiFetch(`/orders/${order.id}/cancel`, {
      method: "POST",
      token,
    });
    setPendingId(null);
    loadOrders();
  };

  if (!orders) {
    return (
      <PageShell title="Kitchen Dashboard">
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">Loading...</p>
      </PageShell>
    );
  }

  return (
    <PageShell title="Kitchen Dashboard">
      {orders.length === 0 ? (
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
          No orders right now.
        </p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-dark-charcoal)]/20">
              <th className="py-2">Order</th>
              <th className="py-2">Items</th>
              <th className="py-2">Pickup</th>
              <th className="py-2">Status</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const next = NEXT_STATUS[order.status];
              const canCancel = CANCELLABLE_STATUSES.includes(order.status);
              const isPending = pendingId === order.id;
              return (
                <tr key={order.id} className="border-b border-[var(--color-dark-charcoal)]/10">
                  <td className="py-2 font-medium">{order.orderNumber}</td>
                  <td className="py-2">
                    {order.items
                      .map((line) => `${line.quantity}x ${line.menuItem.name}`)
                      .join(", ")}
                  </td>
                  <td className="py-2">{formatPickupTime(order)}</td>
                  <td className="py-2">{ORDER_STATUS_LABELS[order.status]}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      {next && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          disabled={isPending}
                          onClick={() => advanceStatus(order)}
                          className="flex items-center gap-1.5 rounded-full bg-[var(--color-blush-pink)] px-4 py-2 text-xs font-bold text-[var(--color-warm-cream)] shadow-[0_4px_10px_rgba(34,34,34,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M5 12h14M13 6l6 6-6 6"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Mark {ORDER_STATUS_LABELS[next]}
                        </motion.button>
                      )}
                      {canCancel && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          disabled={isPending}
                          onClick={() => cancelOrder(order)}
                          className="rounded-full border border-red-400 px-4 py-2 text-xs font-bold text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancel
                        </motion.button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </PageShell>
  );
}
