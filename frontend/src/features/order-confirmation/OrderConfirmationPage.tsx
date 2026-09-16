import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { formatPickupTime, PAYMENT_METHOD_LABELS } from "../../shared/labels";
import { useAuth } from "../../shared/state/AuthContext";
import { useCart } from "../../shared/state/CartContext";

const CONFETTI = [
  { top: "8%", left: "12%", size: 8, color: "var(--color-blush-pink)", delay: 0 },
  { top: "4%", left: "78%", size: 6, color: "#E3A567", delay: 0.4 },
  { top: "14%", left: "88%", size: 7, color: "#8FA37E", delay: 0.8 },
  { top: "10%", left: "28%", size: 6, color: "var(--color-blush-pink)", delay: 1.2 },
];

export function OrderConfirmationPage() {
  const { lastOrder } = useCart();
  const { token } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!lastOrder) return;
    apiFetch<{ qrCodeUrl: string }>(`/orders/${lastOrder.id}/qr`, { token })
      .then((res) => setQrCodeUrl(res.qrCodeUrl))
      .catch(() => setQrCodeUrl(null));
  }, [lastOrder, token]);

  if (!lastOrder) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <PageShell title="Order Confirmed">
      <div className="relative">
        {CONFETTI.map((c, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute rounded-sm"
            style={{ top: c.top, left: c.left, width: c.size, height: c.size, background: c.color }}
            animate={{ y: [-6, 10], opacity: [0, 1, 0.9] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
          className="rounded-[24px] bg-white p-6 text-center shadow-[0_10px_28px_rgba(34,34,34,0.08)]"
        >
          <motion.div
            initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#8FA37E]"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 13l4 4L19 7"
                stroke="var(--color-warm-cream)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <p className="font-heading mt-3 text-2xl font-semibold">{lastOrder.orderNumber}</p>

          <div className="relative mx-auto mt-4 w-fit rounded-[28px] p-3">
            <span className="absolute left-1 top-1 h-4 w-4 rounded-tl-md border-l-4 border-t-4 border-[var(--color-blush-pink)]" />
            <span className="absolute right-1 top-1 h-4 w-4 rounded-tr-md border-r-4 border-t-4 border-[var(--color-blush-pink)]" />
            <span className="absolute bottom-1 left-1 h-4 w-4 rounded-bl-md border-b-4 border-l-4 border-[var(--color-blush-pink)]" />
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-br-md border-b-4 border-r-4 border-[var(--color-blush-pink)]" />

            {qrCodeUrl ? (
              <motion.img
                src={qrCodeUrl}
                alt={`QR code for order ${lastOrder.orderNumber}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="h-40 w-40"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center text-sm text-[var(--color-dark-charcoal)]/50">
                Loading QR...
              </div>
            )}
          </div>

          <p className="mt-3 font-body text-sm text-[var(--color-dark-charcoal)]/70">
            Show this QR code at pickup, or give the order ID above.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {lastOrder.items.map((line) => (
              <span
                key={line.menuItem.id}
                className="rounded-full border border-[var(--color-dark-charcoal)]/10 bg-[var(--color-warm-cream)] px-3 py-1.5 text-xs text-[var(--color-dark-charcoal)]/80"
              >
                {line.quantity}x {line.menuItem.name}
              </span>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-dashed border-[var(--color-dark-charcoal)]/15 pt-3 text-sm">
            <span className="text-[var(--color-dark-charcoal)]/60">Pickup</span>
            <span className="font-medium">{formatPickupTime(lastOrder)}</span>
          </div>

          <div className="mt-1 flex justify-between text-sm">
            <span className="text-[var(--color-dark-charcoal)]/60">Payment</span>
            <span className="font-medium">{PAYMENT_METHOD_LABELS[lastOrder.paymentMethod]}</span>
          </div>

          <div className="mt-1 flex justify-between text-sm">
            <span className="text-[var(--color-dark-charcoal)]/60">Total</span>
            <span className="font-medium">Rs. {lastOrder.total}</span>
          </div>

          <Link
            to="/tracking"
            className="font-heading mt-6 block w-full rounded-full bg-[var(--color-dark-charcoal)] py-3.5 font-bold text-[var(--color-warm-cream)]"
          >
            Track Order
          </Link>
        </motion.div>
      </div>
    </PageShell>
  );
}
