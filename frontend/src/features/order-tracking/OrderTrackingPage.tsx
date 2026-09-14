import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { mapOrder } from "../../shared/lib/apiMappers";
import { ORDER_STATUS_LABELS } from "../../shared/labels";
import { useAuth } from "../../shared/state/AuthContext";
import { useCart } from "../../shared/state/CartContext";
import type { Order, OrderStatus } from "../../shared/types/order";

const STATUSES: OrderStatus[] = ["confirmed", "preparing", "ready", "picked_up"];

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId?: string }>();
  const { lastOrder } = useCart();
  const { token } = useAuth();
  const targetId = orderId ?? lastOrder?.id ?? null;

  const [order, setOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const refresh = () => {
    if (!targetId) return;
    setIsRefreshing(true);
    apiFetch<unknown>(`/orders/${targetId}`, { token })
      .then((raw) => setOrder(mapOrder(raw as never)))
      .catch(() => setNotFound(true))
      .finally(() => setIsRefreshing(false));
  };

  useEffect(refresh, [targetId, token]);

  if (!targetId || notFound) {
    return <Navigate to="/menu" replace />;
  }

  if (!order) {
    return (
      <PageShell title="Order Tracking">
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">Loading...</p>
      </PageShell>
    );
  }

  const activeIndex = STATUSES.indexOf(order.status);

  return (
    <PageShell title="Order Tracking">
      <div className="rounded-2xl border border-[var(--color-blush-pink)] bg-white p-6">
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
          Order #{order.orderNumber}
        </p>

        <div className="mt-6 flex items-center justify-between">
          {STATUSES.map((s, i) => {
            const isDone = i <= activeIndex;
            const isReady = s === "ready" && order.status === "ready";
            return (
              <div key={s} className="flex flex-1 flex-col items-center">
                <motion.div
                  animate={
                    isReady
                      ? { scale: [1, 1.15, 1], opacity: [1, 0.85, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    isReady
                      ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.2 }
                  }
                  className={`h-4 w-4 rounded-full ${
                    isDone ? "bg-[var(--color-blush-pink)]" : "bg-gray-200"
                  }`}
                />
                <span className="mt-2 text-center text-xs font-medium">
                  {ORDER_STATUS_LABELS[s]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={refresh}
        disabled={isRefreshing}
        className="mt-4 rounded-full border border-[var(--color-dark-charcoal)]/20 px-4 py-2 text-sm disabled:opacity-50"
      >
        {isRefreshing ? "Refreshing..." : "Refresh status"}
      </button>
    </PageShell>
  );
}
