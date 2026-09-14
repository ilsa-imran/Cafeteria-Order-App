import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { mapOrder } from "../../shared/lib/apiMappers";
import { ORDER_STATUS_LABELS, PICKUP_TIME_LABELS } from "../../shared/labels";
import { useAuth } from "../../shared/state/AuthContext";
import type { Order } from "../../shared/types/order";

export function OrderHistoryPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<unknown[]>("/orders", { token })
      .then((raw) => setOrders(raw.map((order) => mapOrder(order as never))))
      .catch(() => setError("Could not load your orders. Please try again."));
  }, [token]);

  if (error) {
    return (
      <PageShell title="Order History">
        <p className="text-sm text-red-500">{error}</p>
      </PageShell>
    );
  }

  if (!orders) {
    return (
      <PageShell title="Order History">
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">Loading...</p>
      </PageShell>
    );
  }

  if (orders.length === 0) {
    return (
      <PageShell title="Order History">
        <div className="rounded-2xl border border-[var(--color-blush-pink)] bg-white p-8 text-center">
          <p className="font-body text-[var(--color-dark-charcoal)]/70">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/menu"
            className="font-heading mt-4 inline-block rounded-full bg-[var(--color-blush-pink)] px-5 py-2 text-sm font-medium"
          >
            Browse the menu
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Order History">
      <div className="flex flex-col gap-3">
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
          >
            <Link
              to={`/tracking/${order.id}`}
              className="flex items-center justify-between rounded-xl border border-[var(--color-blush-pink)] bg-white p-4"
            >
              <div>
                <p className="font-heading font-semibold">{order.orderNumber}</p>
                <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
                  {order.items
                    .map((line) => `${line.quantity}x ${line.menuItem.name}`)
                    .join(", ")}
                </p>
                <p className="font-body text-xs text-[var(--color-dark-charcoal)]/50">
                  {PICKUP_TIME_LABELS[order.pickupTime]}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{ORDER_STATUS_LABELS[order.status]}</p>
                <p className="text-sm text-[var(--color-dark-charcoal)]/70">
                  Rs. {order.total}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
