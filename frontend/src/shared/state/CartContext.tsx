import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "../lib/api";
import { mapOrder, toBackendPickupTime } from "../lib/apiMappers";
import type { MenuItem, Order, OrderLineItem, PickupTime } from "../types/order";
import { useAuth } from "./AuthContext";

interface CartContextValue {
  lines: OrderLineItem[];
  total: number;
  itemCount: number;
  pickupTime: PickupTime | null;
  lastOrder: Order | null;
  addItem: (menuItem: MenuItem) => void;
  setQuantity: (menuItemId: string, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  setPickupTime: (pickupTime: PickupTime) => void;
  confirmOrder: () => Promise<Order>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [lines, setLines] = useState<OrderLineItem[]>([]);
  const [pickupTime, setPickupTime] = useState<PickupTime | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const addItem = (menuItem: MenuItem) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((line) =>
          line.menuItem.id === menuItem.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const setQuantity = (menuItemId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) {
        return prev.filter((line) => line.menuItem.id !== menuItemId);
      }
      return prev.map((line) =>
        line.menuItem.id === menuItemId ? { ...line, quantity } : line,
      );
    });
  };

  const removeItem = (menuItemId: string) => {
    setLines((prev) => prev.filter((line) => line.menuItem.id !== menuItemId));
  };

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.menuItem.price * line.quantity, 0),
    [lines],
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const confirmOrder = async () => {
    if (lines.length === 0 || !pickupTime) {
      throw new Error("Cannot confirm an order without items and a pickup time");
    }

    const raw = await apiFetch<unknown>("/orders", {
      method: "POST",
      token,
      body: {
        items: lines.map((line) => ({
          menuItemId: line.menuItem.id,
          quantity: line.quantity,
        })),
        pickupTime: toBackendPickupTime(pickupTime),
      },
    });

    const order = mapOrder(raw as never);
    setLastOrder(order);
    setLines([]);
    setPickupTime(null);

    return order;
  };

  const value: CartContextValue = {
    lines,
    total,
    itemCount,
    pickupTime,
    lastOrder,
    addItem,
    setQuantity,
    removeItem,
    setPickupTime,
    confirmOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
