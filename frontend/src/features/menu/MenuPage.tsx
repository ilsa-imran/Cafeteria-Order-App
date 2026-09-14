import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { mapMenuItem } from "../../shared/lib/apiMappers";
import { useCart } from "../../shared/state/CartContext";
import type { MenuItem } from "../../shared/types/order";

export function MenuPage() {
  const { itemCount, addItem } = useCart();
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
    <PageShell title="Today's Menu">
      {items.length === 0 ? (
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
          No menu items are available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className="rounded-2xl border border-[var(--color-blush-pink)] bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-heading text-lg font-semibold">
                  <Link to={`/menu/${item.id}`} className="hover:underline">
                    {item.name}
                  </Link>
                </h2>
                <span className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
                  Rs. {item.price}
                </span>
              </div>
              {!item.available && (
                <p className="mt-1 text-sm text-red-500">Currently unavailable</p>
              )}
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                disabled={!item.available}
                onClick={() => addItem(item)}
                className="mt-3 w-full rounded-full bg-[var(--color-blush-pink)] py-2 font-medium text-[var(--color-dark-charcoal)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add to cart
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <motion.p key={itemCount} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="font-body text-sm">
          Cart: {itemCount} item{itemCount === 1 ? "" : "s"}
        </motion.p>
        <Link
          to="/cart"
          className="font-heading rounded-full bg-[var(--color-dark-charcoal)] px-4 py-2 text-sm text-[var(--color-warm-cream)]"
        >
          View cart
        </Link>
      </div>
    </PageShell>
  );
}
