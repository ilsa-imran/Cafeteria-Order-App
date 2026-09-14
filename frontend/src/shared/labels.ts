import type { OrderStatus, PickupTime } from "./types/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  picked_up: "Picked Up",
};

export const PICKUP_TIME_LABELS: Record<PickupTime, string> = {
  immediately: "Immediately",
  within_30_min: "Within 30 min",
  within_1_hour: "Within 1 hour",
};
