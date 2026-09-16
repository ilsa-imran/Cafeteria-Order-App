import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FoodIllustration } from "../../shared/components/FoodIllustration";
import { PageShell } from "../../shared/components/PageShell";
import { useCart } from "../../shared/state/CartContext";

export function CartPage() {
  const { lines, total, setQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (lines.length === 0) {
    return (
      <PageShell title="Your Cart">
        <div className="rounded-[24px] border border-[var(--color-blush-pink)] bg-white p-8 text-center">
          <p className="font-body text-[var(--color-dark-charcoal)]/70">
            Your cart is empty.
          </p>
          <Link
            to="/menu"
            className="font-heading mt-4 inline-block rounded-full bg-[var(--color-blush-pink)] px-5 py-2 text-sm font-medium text-[var(--color-warm-cream)]"
          >
            Browse the menu
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Your Cart">
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.div
              key={line.menuItem.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 rounded-[20px] bg-white p-3 shadow-[0_4px_12px_rgba(34,34,34,0.05)]"
            >
              <FoodIllustration name={line.menuItem.name} size={48} className="shrink-0" />

              <div className="flex-1">
                <p className="font-heading font-semibold">{line.menuItem.name}</p>
                <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
                  Rs. {line.menuItem.price} each
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 rounded-full bg-[var(--color-warm-cream)] px-2 py-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(line.menuItem.id, line.quantity - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-blush-pink)] text-sm font-bold text-[var(--color-warm-cream)]"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm font-bold">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(line.menuItem.id, line.quantity + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-blush-pink)] text-sm font-bold text-[var(--color-warm-cream)]"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-body text-sm font-semibold">
                    Rs. {line.menuItem.price * line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(line.menuItem.id)}
                    className="text-xs text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 rounded-t-[28px] bg-white px-1 pb-1 pt-5 shadow-[0_-8px_20px_rgba(34,34,34,0.05)]">
        <div className="flex items-center justify-between px-4">
          <span className="text-sm text-[var(--color-dark-charcoal)]/60">Total</span>
          <span className="font-heading text-xl font-bold">Rs. {total}</span>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/pickup")}
          className="mx-4 mb-4 mt-4 block rounded-full bg-[var(--color-blush-pink)] py-3.5 font-heading font-bold text-[var(--color-warm-cream)] shadow-[0_10px_24px_rgba(244,182,194,0.4)]"
          style={{ width: "calc(100% - 2rem)" }}
        >
          Proceed to Pickup
        </motion.button>
      </div>
    </PageShell>
  );
}
