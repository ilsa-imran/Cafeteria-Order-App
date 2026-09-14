import { motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { mapOrder } from "../../shared/lib/apiMappers";
import { ORDER_STATUS_LABELS } from "../../shared/labels";
import { useAuth } from "../../shared/state/AuthContext";
import type { Order } from "../../shared/types/order";

export function PickupVerificationPage() {
  const { token } = useAuth();
  const [orderIdInput, setOrderIdInput] = useState("");
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searchedFor, setSearchedFor] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const lookUp = async () => {
    const orderNumber = orderIdInput.trim().toUpperCase();
    setSearchedFor(orderNumber);
    setIsBusy(true);
    try {
      const raw = await apiFetch<unknown[]>(
        `/orders?orderNumber=${encodeURIComponent(orderNumber)}`,
        { token },
      );
      const orders = raw.map((order) => mapOrder(order as never));
      setFoundOrder(orders[0] ?? null);
    } finally {
      setIsBusy(false);
    }
  };

  const confirmPickup = async () => {
    if (!foundOrder) return;
    setIsBusy(true);
    try {
      const raw = await apiFetch<unknown>(`/orders/${foundOrder.id}/pickup`, {
        method: "POST",
        token,
      });
      setFoundOrder(mapOrder(raw as never));
    } finally {
      setIsBusy(false);
    }
  };

  const notFound = searchedFor !== null && !isBusy && !foundOrder;

  return (
    <PageShell title="Pickup Verification">
      <div className="flex gap-2">
        <input
          type="text"
          value={orderIdInput}
          onChange={(e) => setOrderIdInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookUp()}
          placeholder="Enter order ID, e.g. ORD-042081"
          className="flex-1 rounded-lg border border-[var(--color-dark-charcoal)]/20 px-3 py-2"
        />
        <button
          type="button"
          onClick={lookUp}
          disabled={orderIdInput.trim().length === 0 || isBusy}
          className="rounded-full bg-[var(--color-blush-pink)] px-5 py-2 font-medium text-[var(--color-dark-charcoal)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Verify
        </button>
      </div>

      {notFound && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-red-500"
        >
          No order found for "{searchedFor}".
        </motion.p>
      )}

      {foundOrder && (
        <motion.div
          key={foundOrder.id + foundOrder.status}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="mt-4 rounded-2xl border border-[var(--color-blush-pink)] bg-white p-6"
        >
          <p className="font-heading text-lg font-semibold">{foundOrder.orderNumber}</p>
          <ul className="mt-2 text-sm text-[var(--color-dark-charcoal)]/80">
            {foundOrder.items.map((line) => (
              <li key={line.menuItem.id}>
                {line.quantity}x {line.menuItem.name}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm">
            Status: <span className="font-medium">{ORDER_STATUS_LABELS[foundOrder.status]}</span>
          </p>

          {foundOrder.status === "ready" && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              disabled={isBusy}
              onClick={confirmPickup}
              className="mt-4 w-full rounded-full bg-[var(--color-blush-pink)] py-3 font-medium text-[var(--color-dark-charcoal)] disabled:opacity-50"
            >
              Confirm Pickup
            </motion.button>
          )}

          {foundOrder.status === "picked_up" && (
            <p className="mt-4 text-sm text-green-600">
              This order has already been picked up.
            </p>
          )}

          {foundOrder.status !== "ready" && foundOrder.status !== "picked_up" && (
            <p className="mt-4 text-sm text-[var(--color-dark-charcoal)]/70">
              This order is not ready for pickup yet.
            </p>
          )}
        </motion.div>
      )}
    </PageShell>
  );
}
