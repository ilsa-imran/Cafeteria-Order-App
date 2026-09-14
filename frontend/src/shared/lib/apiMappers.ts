import type { MenuItem, Order, OrderStatus, PickupTime } from "../types/order";

const PICKUP_TIME_TO_BACKEND: Record<PickupTime, string> = {
  immediately: "IMMEDIATELY",
  within_30_min: "WITHIN_30_MIN",
  within_1_hour: "WITHIN_1_HOUR",
};

const PICKUP_TIME_FROM_BACKEND: Record<string, PickupTime> = {
  IMMEDIATELY: "immediately",
  WITHIN_30_MIN: "within_30_min",
  WITHIN_1_HOUR: "within_1_hour",
};

const STATUS_FROM_BACKEND: Record<string, OrderStatus> = {
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  PICKED_UP: "picked_up",
};

const STATUS_TO_BACKEND: Record<OrderStatus, string> = {
  confirmed: "CONFIRMED",
  preparing: "PREPARING",
  ready: "READY",
  picked_up: "PICKED_UP",
};

export function toBackendPickupTime(pickupTime: PickupTime): string {
  return PICKUP_TIME_TO_BACKEND[pickupTime];
}

export function toBackendStatus(status: OrderStatus): string {
  return STATUS_TO_BACKEND[status];
}

interface BackendMenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  available: boolean;
}

export function mapMenuItem(raw: BackendMenuItem): MenuItem {
  return {
    id: raw.id,
    name: raw.name,
    price: raw.price,
    available: raw.available,
    description: raw.description ?? undefined,
  };
}

interface BackendOrderItem {
  quantity: number;
  menuItem: BackendMenuItem;
}

interface BackendOrder {
  id: string;
  orderNumber: string;
  status: string;
  pickupTime: string;
  total: number;
  items: BackendOrderItem[];
}

export function mapOrder(raw: BackendOrder): Order {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    status: STATUS_FROM_BACKEND[raw.status] ?? "confirmed",
    pickupTime: PICKUP_TIME_FROM_BACKEND[raw.pickupTime] ?? "immediately",
    total: raw.total,
    items: raw.items.map((item) => ({
      menuItem: mapMenuItem(item.menuItem),
      quantity: item.quantity,
    })),
  };
}
