import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { mapOrder } from "../../shared/lib/apiMappers";
import { useAuth } from "../../shared/state/AuthContext";
import { useCart } from "../../shared/state/CartContext";
import type { Order, OrderStatus } from "../../shared/types/order";

const STATUSES: OrderStatus[] = ["confirmed", "preparing", "ready", "picked_up"];

const STATUS_CONTENT: Record<OrderStatus, { title: string; subtitle: string }> = {
  confirmed: {
    title: "Order confirmed",
    subtitle: "The kitchen has received your order.",
  },
  preparing: {
    title: "Preparing your order",
    subtitle: "The kitchen just started — sit tight, it won't be long.",
  },
  ready: {
    title: "Ready for pickup!",
    subtitle: "Head to the counter with your QR code or order ID.",
  },
  picked_up: {
    title: "Picked up",
    subtitle: "Enjoy your meal!",
  },
  cancelled: {
    title: "Order cancelled",
    subtitle: "This order was cancelled by cafeteria staff.",
  },
};

const CONFETTI = [
  { top: "6%", left: "14%", size: 8, color: "var(--color-blush-pink)", delay: 0 },
  { top: "2%", left: "80%", size: 6, color: "#E3A567", delay: 0.4 },
  { top: "12%", left: "88%", size: 7, color: "#8FA37E", delay: 0.8 },
  { top: "8%", left: "24%", size: 6, color: "var(--color-blush-pink)", delay: 1.2 },
];

function StatusIcon({ status }: { status: OrderStatus }) {
  if (status === "confirmed") {
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="4" width="14" height="17" rx="2" stroke="var(--color-blush-pink)" strokeWidth="2" />
        <path d="M9 3h6v3H9z" fill="var(--color-blush-pink)" />
        <path d="M8 12h8M8 16h5" stroke="var(--color-blush-pink)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "preparing") {
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="var(--color-blush-pink)" strokeWidth="2" />
        <path d="M12 7v5l4 2" stroke="var(--color-blush-pink)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "ready") {
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 4a5 5 0 0 0-5 5v3l-1.5 2h13L17 12V9a5 5 0 0 0-5-5Z"
          stroke="var(--color-warm-cream)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M10 17a2 2 0 0 0 4 0" stroke="var(--color-warm-cream)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "picked_up") {
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 13l4 4L19 7"
          stroke="var(--color-warm-cream)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 7l10 10M17 7L7 17" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId?: string }>();
  const { lastOrder } = useCart();
  const { token } = useAuth();

  const [targetId, setTargetId] = useState<string | null>(orderId ?? lastOrder?.id ?? null);
  const [isResolvingTarget, setIsResolvingTarget] = useState(!orderId && !lastOrder);
  const [order, setOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (orderId || targetId) return;
    apiFetch<unknown[]>("/orders", { token })
      .then((raw) => {
        const orders = raw.map((o) => mapOrder(o as never));
        if (orders.length > 0) {
          setTargetId(orders[0].id);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsResolvingTarget(false));
  }, [orderId, targetId, token]);

  const refresh = () => {
    if (!targetId) return;
    setIsRefreshing(true);
    apiFetch<unknown>(`/orders/${targetId}`, { token })
      .then((raw) => setOrder(mapOrder(raw as never)))
      .catch(() => setNotFound(true))
      .finally(() => setIsRefreshing(false));
  };

  useEffect(refresh, [targetId, token]);

  if (isResolvingTarget) {
    return (
      <PageShell title="Order Tracking">
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">Loading...</p>
      </PageShell>
    );
  }

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
  const isReady = order.status === "ready";
  const isCancelled = order.status === "cancelled";
  const content = STATUS_CONTENT[order.status];

  return (
    <PageShell title="Order Tracking">
      <div className="relative">
        {isReady &&
          CONFETTI.map((c, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="absolute rounded-sm"
              style={{ top: c.top, left: c.left, width: c.size, height: c.size, background: c.color }}
              animate={{ y: [-6, 10], opacity: [0, 1, 0.9] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
            />
          ))}

        <div className="rounded-[24px] bg-white p-6 text-center shadow-[0_6px_16px_rgba(43,43,43,0.06)]">
          <p className="font-body text-sm text-[var(--color-dark-charcoal)]/55">
            Order #{order.orderNumber}
          </p>

          <motion.div
            key={order.status}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={
              isReady
                ? { scale: [1, 1.06, 1], opacity: 1 }
                : { scale: 1, opacity: 1 }
            }
            transition={
              isReady
                ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                : { type: "spring", bounce: 0.4, duration: 0.5 }
            }
            className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background: isCancelled
                ? "#FBEAEA"
                : isReady || order.status === "picked_up"
                  ? "var(--color-blush-pink)"
                  : "var(--color-soft-peach)",
            }}
          >
            <StatusIcon status={order.status} />
          </motion.div>

          <p className="font-heading mt-5 text-2xl font-bold">{content.title}</p>
          <p className="mt-2 font-body text-sm text-[var(--color-dark-charcoal)]/60">
            {content.subtitle}
          </p>

          {!isCancelled && (
            <div className="mt-7">
              <div className="flex gap-1.5">
                {STATUSES.map((s, i) => (
                  <div
                    key={s}
                    className="h-1.5 flex-1 rounded-full"
                    style={{
                      background:
                        i <= activeIndex ? "var(--color-blush-pink)" : "var(--color-dark-charcoal)",
                      opacity: i <= activeIndex ? 1 : 0.12,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wide text-[var(--color-dark-charcoal)]/45">
                <span>Confirmed</span>
                <span>Picked Up</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={refresh}
        disabled={isRefreshing}
        className="mt-4 w-full rounded-full border border-[var(--color-dark-charcoal)]/15 py-3 text-sm font-medium disabled:opacity-50"
      >
        {isRefreshing ? "Refreshing..." : "Refresh status"}
      </motion.button>
    </PageShell>
  );
}
