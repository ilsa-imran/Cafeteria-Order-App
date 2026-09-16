import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../shared/components/PageShell";
import { MAX_CUSTOM_PICKUP_MINUTES, PAYMENT_METHOD_LABELS } from "../../shared/labels";
import { useCart } from "../../shared/state/CartContext";
import type { PaymentMethod, PickupTime } from "../../shared/types/order";

const OPTIONS: { value: PickupTime; label: string }[] = [
  { value: "immediately", label: "Immediately" },
  { value: "within_30_min", label: "Within 30 minutes" },
  { value: "within_1_hour", label: "Within 1 hour" },
  { value: "custom", label: "Write my own time" },
];

const PAYMENT_OPTIONS: PaymentMethod[] = ["cash", "wallet"];

export function PickupTimePage() {
  const {
    pickupTime,
    setPickupTime,
    customPickupMinutes,
    setCustomPickupMinutes,
    paymentMethod,
    setPaymentMethod,
    confirmOrder,
    lines,
  } = useCart();
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();

  const customMinutesValid =
    pickupTime !== "custom" ||
    (!!customPickupMinutes &&
      customPickupMinutes > 0 &&
      customPickupMinutes <= MAX_CUSTOM_PICKUP_MINUTES);

  const confirmDisabled =
    !pickupTime || !customMinutesValid || !paymentMethod || lines.length === 0 || isConfirming;

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
              className={`relative flex items-center gap-3 overflow-hidden rounded-[20px] bg-white p-4 text-left font-medium shadow-[0_4px_12px_rgba(34,34,34,0.05)] ${
                isActive ? "text-[var(--color-warm-cream)]" : ""
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="pickup-highlight"
                  className="absolute inset-0 bg-[var(--color-soft-peach)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <svg
                className="relative z-10 shrink-0"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" stroke="#222222" strokeWidth="1.6" />
                <path d="M12 7v5l3.5 2" stroke="#222222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="relative z-10">{opt.label}</span>
            </motion.button>
          );
        })}

        {pickupTime === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-[20px] bg-white p-4 shadow-[0_4px_12px_rgba(34,34,34,0.05)]"
          >
            <label className="flex items-center justify-between gap-3 text-sm font-medium">
              <span>Pick up in</span>
              <span className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={MAX_CUSTOM_PICKUP_MINUTES}
                  value={customPickupMinutes ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomPickupMinutes(value === "" ? null : Number(value));
                  }}
                  placeholder="e.g. 90"
                  className="w-20 rounded-lg border border-[var(--color-dark-charcoal)]/20 p-2 text-right"
                />
                minutes
              </span>
            </label>
            <p className="mt-2 text-xs text-[var(--color-dark-charcoal)]/60">
              Up to {MAX_CUSTOM_PICKUP_MINUTES} minutes (3 hours) from now.
            </p>
            {pickupTime === "custom" && !customMinutesValid && customPickupMinutes !== null && (
              <p className="mt-1 text-xs text-red-500">
                Enter a time between 1 and {MAX_CUSTOM_PICKUP_MINUTES} minutes.
              </p>
            )}
          </motion.div>
        )}
      </div>

      <p className="font-heading mt-6 mb-3 text-sm font-bold text-[var(--color-dark-charcoal)]/80">
        Payment Method
      </p>
      <div className="flex gap-3">
        {PAYMENT_OPTIONS.map((method) => {
          const isActive = paymentMethod === method;
          return (
            <motion.button
              key={method}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod(method)}
              className={`relative flex-1 overflow-hidden rounded-[20px] bg-white p-4 text-center font-medium shadow-[0_4px_12px_rgba(34,34,34,0.05)] ${
                isActive ? "text-[var(--color-warm-cream)]" : ""
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="payment-highlight"
                  className="absolute inset-0 bg-[var(--color-soft-peach)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{PAYMENT_METHOD_LABELS[method]}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        disabled={confirmDisabled}
        onClick={handleConfirm}
        className="mt-6 w-full rounded-full bg-[var(--color-blush-pink)] py-3.5 font-heading font-bold text-[var(--color-warm-cream)] shadow-[0_10px_24px_rgba(244,182,194,0.4)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        {isConfirming ? "Confirming..." : "Confirm Order"}
      </motion.button>
    </PageShell>
  );
}
