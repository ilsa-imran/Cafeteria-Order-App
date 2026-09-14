import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { PICKUP_TIME_LABELS } from "../../shared/labels";
import { useAuth } from "../../shared/state/AuthContext";
import { useCart } from "../../shared/state/CartContext";

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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        className="rounded-2xl border border-[var(--color-blush-pink)] bg-white p-6 text-center"
      >
        <p className="font-heading text-2xl font-semibold">{lastOrder.orderNumber}</p>

        {qrCodeUrl ? (
          <motion.img
            src={qrCodeUrl}
            alt={`QR code for order ${lastOrder.orderNumber}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mx-auto mt-4 h-48 w-48 rounded-xl border border-[var(--color-blush-pink)]"
          />
        ) : (
          <div className="mx-auto mt-4 flex h-48 w-48 items-center justify-center rounded-xl border border-[var(--color-blush-pink)] text-sm text-[var(--color-dark-charcoal)]/50">
            Loading QR...
          </div>
        )}

        <p className="mt-3 font-body text-sm text-[var(--color-dark-charcoal)]/70">
          Show this QR code at pickup, or give the order ID above.
        </p>

        <ul className="mt-4 text-left text-sm">
          {lastOrder.items.map((line) => (
            <li key={line.menuItem.id} className="flex justify-between py-1">
              <span>
                {line.quantity}x {line.menuItem.name}
              </span>
              <span>Rs. {line.menuItem.price * line.quantity}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-between border-t border-[var(--color-dark-charcoal)]/10 pt-3 text-sm">
          <span>Pickup</span>
          <span className="font-medium">{PICKUP_TIME_LABELS[lastOrder.pickupTime]}</span>
        </div>

        <div className="mt-1 flex justify-between text-sm">
          <span>Total</span>
          <span className="font-medium">Rs. {lastOrder.total}</span>
        </div>

        <Link
          to="/tracking"
          className="font-heading mt-6 inline-block w-full rounded-full bg-[var(--color-blush-pink)] py-3 font-medium text-[var(--color-dark-charcoal)]"
        >
          Track Order
        </Link>
      </motion.div>
    </PageShell>
  );
}
