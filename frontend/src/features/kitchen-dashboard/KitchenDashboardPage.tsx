import { useEffect, useState } from "react";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { mapOrder, toBackendStatus } from "../../shared/lib/apiMappers";
import { ORDER_STATUS_LABELS, PICKUP_TIME_LABELS } from "../../shared/labels";
import { useAuth } from "../../shared/state/AuthContext";
import type { Order, OrderStatus } from "../../shared/types/order";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  confirmed: "preparing",
  preparing: "ready",
  ready: "picked_up",
  picked_up: null,
};

export function KitchenDashboardPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  const loadOrders = () => {
    apiFetch<unknown[]>("/orders", { token })
      .then((raw) => setOrders(raw.map((order) => mapOrder(order as never))))
      .catch(() => setOrders([]));
  };

  useEffect(loadOrders, [token]);

  const advanceStatus = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await apiFetch(`/orders/${order.id}/status`, {
      method: "PATCH",
      token,
      body: { status: toBackendStatus(next) },
    });
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
              return (
                <tr key={order.id} className="border-b border-[var(--color-dark-charcoal)]/10">
                  <td className="py-2 font-medium">{order.orderNumber}</td>
                  <td className="py-2">
                    {order.items
                      .map((line) => `${line.quantity}x ${line.menuItem.name}`)
                      .join(", ")}
                  </td>
                  <td className="py-2">{PICKUP_TIME_LABELS[order.pickupTime]}</td>
                  <td className="py-2">{ORDER_STATUS_LABELS[order.status]}</td>
                  <td className="py-2">
                    {next && (
                      <button
                        type="button"
                        onClick={() => advanceStatus(order)}
                        className="rounded-full border border-[var(--color-dark-charcoal)]/20 px-3 py-1 text-xs"
                      >
                        Mark {ORDER_STATUS_LABELS[next]}
                      </button>
                    )}
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
