import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderReadyNotification } from "../hooks/useOrderReadyNotification";

export function ReadyNotificationBanner() {
  const { readyOrder, dismiss } = useOrderReadyNotification();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {readyOrder && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
          className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between gap-4 bg-[var(--color-blush-pink)] px-4 py-3 shadow-md"
        >
          <p className="font-heading text-sm font-semibold text-[var(--color-dark-charcoal)]">
            Your order {readyOrder.orderNumber} is ready for pickup!
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigate(`/tracking/${readyOrder.id}`);
                dismiss();
              }}
              className="rounded-full bg-[var(--color-dark-charcoal)] px-3 py-1.5 text-sm text-[var(--color-warm-cream)]"
            >
              Track Order
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="rounded-full px-2 py-1 text-sm text-[var(--color-dark-charcoal)]/70"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
