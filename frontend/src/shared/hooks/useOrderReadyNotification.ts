import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../lib/api";
import { mapOrder } from "../lib/apiMappers";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";
import type { Order } from "../types/order";

const POLL_INTERVAL_MS = 8000;

export function useOrderReadyNotification() {
  const { lastOrder } = useCart();
  const { token, user } = useAuth();
  const [readyOrder, setReadyOrder] = useState<Order | null>(null);
  const dismissedOrderIds = useRef(new Set<string>());

  useEffect(() => {
    if (!lastOrder || user?.role !== "STUDENT" || lastOrder.status === "picked_up") {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const raw = await apiFetch<unknown>(`/orders/${lastOrder.id}`, { token });
        const order = mapOrder(raw as never);
        if (order.status === "ready" && !dismissedOrderIds.current.has(order.id)) {
          setReadyOrder(order);
        }
        if (order.status === "picked_up") {
          clearInterval(interval);
        }
      } catch {
        return;
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [lastOrder, token, user?.role]);

  const dismiss = () => {
    if (readyOrder) {
      dismissedOrderIds.current.add(readyOrder.id);
    }
    setReadyOrder(null);
  };

  return { readyOrder, dismiss };
}
