import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch, ApiError } from "../../shared/lib/api";
import { mapMenuItem } from "../../shared/lib/apiMappers";
import { useAuth } from "../../shared/state/AuthContext";
import type { MenuItem } from "../../shared/types/order";

export function MenuManagementPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const loadItems = () => {
    apiFetch<unknown[]>("/menu")
      .then((raw) => setItems(raw.map((item) => mapMenuItem(item as never))))
      .catch(() => setError("Could not load the menu. Please try again."));
  };

  useEffect(loadItems, []);

  const canAdd = newName.trim().length > 0 && Number(newPrice) > 0;

  const addItem = async () => {
    if (!canAdd) return;
    try {
      await apiFetch("/menu", {
        method: "POST",
        token,
        body: { name: newName.trim(), price: Number(newPrice) },
      });
      setNewName("");
      setNewPrice("");
      loadItems();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add the item.");
    }
  };

  const updatePrice = async (id: string, price: number) => {
    setItems((prev) => prev?.map((item) => (item.id === id ? { ...item, price } : item)) ?? null);
    try {
      await apiFetch(`/menu/${id}`, { method: "PATCH", token, body: { price } });
    } catch {
      setError("Could not update the price.");
      loadItems();
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    setItems(
      (prev) =>
        prev?.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i)) ?? null,
    );
    try {
      await apiFetch(`/menu/${item.id}`, {
        method: "PATCH",
        token,
        body: { available: !item.available },
      });
    } catch {
      setError("Could not update availability.");
      loadItems();
    }
  };

  const removeItem = async (id: string) => {
    try {
      await apiFetch(`/menu/${id}`, { method: "DELETE", token });
      loadItems();
    } catch {
      setError("Could not remove the item.");
    }
  };

  if (!items) {
    return (
      <PageShell title="Menu Management">
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">Loading...</p>
      </PageShell>
    );
  }

  return (
    <PageShell title="Menu Management">
      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-blush-pink)] bg-white p-4"
          >
            <span className="font-heading font-semibold">{item.name}</span>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-sm">
                Rs.
                <input
                  type="number"
                  min={0}
                  value={item.price}
                  onChange={(e) => updatePrice(item.id, Number(e.target.value))}
                  className="w-20 rounded-lg border border-[var(--color-dark-charcoal)]/20 px-2 py-1"
                />
              </label>

              <button
                type="button"
                onClick={() => toggleAvailability(item)}
                className={`rounded-full px-3 py-1 text-sm ${
                  item.available
                    ? "bg-[var(--color-soft-peach)]"
                    : "bg-gray-200 text-[var(--color-dark-charcoal)]/60"
                }`}
              >
                {item.available ? "Available" : "Unavailable"}
              </button>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}

        {items.length === 0 && (
          <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
            No menu items yet. Add one below.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-[var(--color-dark-charcoal)]/20 p-4">
        <label className="flex flex-col gap-1 text-sm">
          Item name
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="rounded-lg border border-[var(--color-dark-charcoal)]/20 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Price
          <input
            type="number"
            min={0}
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="w-24 rounded-lg border border-[var(--color-dark-charcoal)]/20 px-3 py-2"
          />
        </label>

        <button
          type="button"
          disabled={!canAdd}
          onClick={addItem}
          className="rounded-full bg-[var(--color-blush-pink)] px-5 py-2 font-medium text-[var(--color-dark-charcoal)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add item
        </button>
      </div>
    </PageShell>
  );
}
