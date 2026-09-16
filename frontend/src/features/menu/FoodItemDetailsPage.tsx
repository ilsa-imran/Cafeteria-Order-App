import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FoodIllustration } from "../../shared/components/FoodIllustration";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch } from "../../shared/lib/api";
import { mapMenuItem } from "../../shared/lib/apiMappers";
import { useCart } from "../../shared/state/CartContext";
import type { MenuItem } from "../../shared/types/order";

export function FoodItemDetailsPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const { addItem } = useCart();
  const [items, setItems] = useState<MenuItem[] | null>(null);

  useEffect(() => {
    apiFetch<unknown[]>("/menu")
      .then((raw) => setItems(raw.map((item) => mapMenuItem(item as never))))
      .catch(() => setItems([]));
  }, []);

  if (!items) {
    return (
      <PageShell title="Item Details">
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">Loading...</p>
      </PageShell>
    );
  }

  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <PageShell title="Item Details">
        <p className="text-sm text-red-500">This menu item could not be found.</p>
        <Link to="/menu" className="mt-3 inline-block text-sm underline">
          Back to menu
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell title={item.name}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-[24px] bg-white p-6 shadow-[0_6px_16px_rgba(34,34,34,0.06)]"
      >
        <FoodIllustration name={item.name} size={96} className="mx-auto" />

        <div className="mt-4 flex items-start justify-between">
          <h2 className="font-heading text-xl font-semibold">{item.name}</h2>
          <span className="font-body text-lg">Rs. {item.price}</span>
        </div>

        <p className="mt-3 font-body text-sm text-[var(--color-dark-charcoal)]/70">
          {item.description ?? "No description available for this item."}
        </p>

        {!item.available && (
          <p className="mt-3 text-sm text-red-500">Currently unavailable</p>
        )}

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={!item.available}
          onClick={() => addItem(item)}
          className="mt-5 w-full rounded-full bg-[var(--color-blush-pink)] py-3 font-heading font-bold text-[var(--color-warm-cream)] shadow-[0_10px_24px_rgba(244,182,194,0.4)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          Add to cart
        </motion.button>
      </motion.div>
    </PageShell>
  );
}
