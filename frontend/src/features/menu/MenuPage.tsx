import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FoodIllustration } from "../../shared/components/FoodIllustration";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { mapMenuItem } from "../../shared/lib/apiMappers";
import { useCart } from "../../shared/state/CartContext";
import type { MenuItem } from "../../shared/types/order";

export function MenuPage() {
  const { itemCount, total, addItem } = useCart();
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<unknown[]>("/menu")
      .then((raw) => setItems(raw.map((item) => mapMenuItem(item as never))))
      .catch(() => setError("Could not load the menu. Please try again."));
  }, []);

  if (error) {
    return (
      <PageShell title="Today's Menu">
        <p className="text-sm text-red-500">{error}</p>
      </PageShell>
    );
  }

  if (!items) {
    return (
      <PageShell title="Today's Menu">
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
          Loading menu...
        </p>
      </PageShell>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -right-12 -top-10 h-44 w-44 rounded-full bg-[var(--color-soft-peach)] opacity-50 blur-[2px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-16 top-24 h-36 w-36 rounded-full bg-[var(--color-blush-pink)] opacity-30 blur-[2px]"
      />

      <PageShell title="Today's Menu">
        {items.length === 0 ? (
          <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
            No menu items are available right now.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                className="flex flex-col gap-2 rounded-[24px] bg-white p-4 shadow-[0_6px_16px_rgba(34,34,34,0.06)] transition-shadow hover:shadow-[0_14px_28px_rgba(185,83,106,0.16)]"
              >
                <FoodIllustration name={item.name} className="mx-auto" />
                <h2 className="font-heading text-center text-[15px] font-semibold">
                  <Link to={`/menu/${item.id}`} className="hover:underline">
                    {item.name}
                  </Link>
                </h2>
                {!item.available && (
                  <p className="text-center text-xs text-red-500">Currently unavailable</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm font-semibold text-[var(--color-dark-charcoal)]/70">
                    Rs. {item.price}
                  </span>
                  <motion.button
                    type="button"
                    aria-label={`Add ${item.name} to cart`}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!item.available}
                    onClick={() => addItem(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-blush-pink)] text-[var(--color-warm-cream)] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-x-4 bottom-4 mx-auto flex max-w-3xl items-center justify-between rounded-[20px] bg-[var(--color-dark-charcoal)] px-5 py-3.5 shadow-[0_10px_24px_rgba(34,34,34,0.25)]"
          >
            <div className="flex flex-col">
              <span className="font-heading text-[11px] font-semibold tracking-wide text-[var(--color-blush-pink)]">
                {itemCount} ITEM{itemCount === 1 ? "" : "S"}
              </span>
              <span className="font-heading text-base font-bold text-[var(--color-warm-cream)]">
                Rs. {total}
              </span>
            </div>
            <Link
              to="/cart"
              className="font-heading rounded-full bg-[var(--color-blush-pink)] px-5 py-2 text-sm font-bold text-[var(--color-warm-cream)]"
            >
              View Cart
            </Link>
          </motion.div>
        )}
      </PageShell>
    </div>
  );
}
