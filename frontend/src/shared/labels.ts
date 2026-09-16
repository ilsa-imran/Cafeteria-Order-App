import type { Order, OrderStatus, PickupTime } from "./types/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  picked_up: "Picked Up",
  cancelled: "Cancelled",
};

export const PICKUP_TIME_LABELS: Record<PickupTime, string> = {
  immediately: "Immediately",
  within_30_min: "Within 30 min",
  within_1_hour: "Within 1 hour",
  custom: "Custom",
};

export const MAX_CUSTOM_PICKUP_MINUTES = 180;

export function formatPickupTime(order: Pick<Order, "pickupTime" | "pickupTimeMinutes">) {
  if (order.pickupTime === "custom" && order.pickupTimeMinutes) {
    return `In ${order.pickupTimeMinutes} min`;
  }
  return PICKUP_TIME_LABELS[order.pickupTime];
}
