import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { PageShell } from "../../shared/components/PageShell";
import { useCart } from "../../shared/state/CartContext";

export function CartPage() {
  const { lines, total, setQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (lines.length === 0) {
    return (
      <PageShell title="Your Cart">
        <div className="rounded-2xl border border-[var(--color-blush-pink)] bg-white p-8 text-center">
          <p className="font-body text-[var(--color-dark-charcoal)]/70">
            Your cart is empty.
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
              className="flex items-center justify-between rounded-xl border border-[var(--color-blush-pink)] bg-white p-4"
            >
              <div>
                <p className="font-heading font-semibold">{line.menuItem.name}</p>
                <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
                  Rs. {line.menuItem.price} each
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-[var(--color-dark-charcoal)]/20 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.menuItem.id, line.quantity - 1)}
                    className="h-6 w-6 rounded-full text-sm"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm">{line.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.menuItem.id, line.quantity + 1)}
                    className="h-6 w-6 rounded-full text-sm"
                  >
                    +
                  </button>
                </div>

                <span className="w-16 text-right font-body text-sm">
                  Rs. {line.menuItem.price * line.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(line.menuItem.id)}
                  className="text-sm text-red-500"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--color-dark-charcoal)]/10 pt-4">
        <span className="font-heading text-lg font-semibold">Total</span>
        <span className="font-heading text-lg font-semibold">Rs. {total}</span>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/pickup")}
        className="mt-4 w-full rounded-full bg-[var(--color-blush-pink)] py-3 font-medium text-[var(--color-dark-charcoal)]"
      >
        Proceed to Pickup
      </motion.button>
    </PageShell>
  );
}
