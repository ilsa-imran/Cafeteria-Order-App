import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../shared/components/PageShell";
import { useCart } from "../../shared/state/CartContext";
import type { PickupTime } from "../../shared/types/order";

const OPTIONS: { value: PickupTime; label: string }[] = [
  { value: "immediately", label: "Immediately" },
  { value: "within_30_min", label: "Within 30 minutes" },
  { value: "within_1_hour", label: "Within 1 hour" },
];

export function PickupTimePage() {
  const { pickupTime, setPickupTime, confirmOrder, lines } = useCart();
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();

  const confirmDisabled = !pickupTime || lines.length === 0 || isConfirming;

  const handleConfirm = async () => {
    setIsConfirming(true);
    await confirmOrder();
    setIsConfirming(false);
    navigate("/confirmation");
  };

  return (
    <PageShell title="Choose Pickup Time">
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const isActive = pickupTime === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setPickupTime(opt.value)}
              className="relative overflow-hidden rounded-xl border border-[var(--color-blush-pink)] bg-white p-4 text-left font-medium"
            >
              {isActive && (
                <motion.div
                  layoutId="pickup-highlight"
                  className="absolute inset-0 bg-[var(--color-soft-peach)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        disabled={confirmDisabled}
        onClick={handleConfirm}
        className="mt-6 w-full rounded-full bg-[var(--color-blush-pink)] py-3 font-medium text-[var(--color-dark-charcoal)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isConfirming ? "Confirming..." : "Confirm Order"}
      </motion.button>
    </PageShell>
  );
}
