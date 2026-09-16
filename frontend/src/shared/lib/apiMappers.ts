import type { MenuItem, Order, OrderStatus, PaymentMethod, PickupTime } from "../types/order";

const PICKUP_TIME_TO_BACKEND: Record<PickupTime, string> = {
  immediately: "IMMEDIATELY",
  within_30_min: "WITHIN_30_MIN",
  within_1_hour: "WITHIN_1_HOUR",
  custom: "CUSTOM",
};

const PICKUP_TIME_FROM_BACKEND: Record<string, PickupTime> = {
  IMMEDIATELY: "immediately",
  WITHIN_30_MIN: "within_30_min",
  WITHIN_1_HOUR: "within_1_hour",
  CUSTOM: "custom",
};

const PAYMENT_METHOD_TO_BACKEND: Record<PaymentMethod, string> = {
  cash: "CASH",
  wallet: "WALLET",
};

const PAYMENT_METHOD_FROM_BACKEND: Record<string, PaymentMethod> = {
  CASH: "cash",
  WALLET: "wallet",
};

const STATUS_FROM_BACKEND: Record<string, OrderStatus> = {
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  PICKED_UP: "picked_up",
  CANCELLED: "cancelled",
};

const STATUS_TO_BACKEND: Record<OrderStatus, string> = {
  confirmed: "CONFIRMED",
  preparing: "PREPARING",
  ready: "READY",
  picked_up: "PICKED_UP",
  cancelled: "CANCELLED",
};

export function toBackendPickupTime(pickupTime: PickupTime): string {
  return PICKUP_TIME_TO_BACKEND[pickupTime];
}

export function toBackendPaymentMethod(paymentMethod: PaymentMethod): string {
  return PAYMENT_METHOD_TO_BACKEND[paymentMethod];
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
  pickupTimeMinutes: number | null;
  paymentMethod?: string;
  total: number;
  items: BackendOrderItem[];
}

export function mapOrder(raw: BackendOrder): Order {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    status: STATUS_FROM_BACKEND[raw.status] ?? "confirmed",
    pickupTime: PICKUP_TIME_FROM_BACKEND[raw.pickupTime] ?? "immediately",
    pickupTimeMinutes: raw.pickupTimeMinutes ?? undefined,
    paymentMethod: raw.paymentMethod ? (PAYMENT_METHOD_FROM_BACKEND[raw.paymentMethod] ?? "cash") : "cash",
    total: raw.total,
    items: raw.items.map((item) => ({
      menuItem: mapMenuItem(item.menuItem),
      quantity: item.quantity,
    })),
  };
}
