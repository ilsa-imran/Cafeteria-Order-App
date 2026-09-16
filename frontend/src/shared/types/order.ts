export type PickupTime = "immediately" | "within_30_min" | "within_1_hour" | "custom";

export type PaymentMethod = "cash" | "wallet";

export type OrderStatus = "confirmed" | "preparing" | "ready" | "picked_up" | "cancelled";

export type Role = "STUDENT" | "STAFF" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  walletBalance: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description?: string;
}

export interface OrderLineItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderLineItem[];
  pickupTime: PickupTime;
  pickupTimeMinutes?: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  total: number;
}
