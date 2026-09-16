import { describe, expect, it } from "vitest";
import { mapMenuItem, mapOrder, toBackendPickupTime, toBackendStatus } from "./apiMappers";
import type { OrderStatus, PickupTime } from "../types/order";

describe("toBackendPickupTime / toBackendStatus", () => {
  it("round-trips every pickup time value", () => {
    const values: PickupTime[] = ["immediately", "within_30_min", "within_1_hour"];
    for (const value of values) {
      expect(toBackendPickupTime(value)).toMatch(/^[A-Z0-9_]+$/);
    }
  });

  it("round-trips every order status value", () => {
    const values: OrderStatus[] = ["confirmed", "preparing", "ready", "picked_up"];
    for (const value of values) {
      expect(toBackendStatus(value)).toMatch(/^[A-Z_]+$/);
    }
  });
});

describe("mapMenuItem", () => {
  it("converts a null backend description to undefined", () => {
    const item = mapMenuItem({
      id: "1",
      name: "Chicken Biryani",
      description: null,
      price: 250,
      available: true,
    });
    expect(item.description).toBeUndefined();
  });

  it("preserves a real description", () => {
    const item = mapMenuItem({
      id: "1",
      name: "Chicken Biryani",
      description: "Spicy",
      price: 250,
      available: true,
    });
    expect(item.description).toBe("Spicy");
  });
});

describe("mapOrder", () => {
  it("maps backend enum values to frontend-shaped values", () => {
    const order = mapOrder({
      id: "order-1",
      orderNumber: "ORD-123456",
      status: "READY",
      pickupTime: "WITHIN_30_MIN",
      pickupTimeMinutes: null,
      total: 500,
      items: [
        {
          quantity: 2,
          menuItem: {
            id: "1",
            name: "Chicken Biryani",
            description: null,
            price: 250,
            available: true,
          },
        },
      ],
    });

    expect(order.status).toBe("ready");
    expect(order.pickupTime).toBe("within_30_min");
    expect(order.items).toHaveLength(1);
    expect(order.items[0].quantity).toBe(2);
    expect(order.items[0].menuItem.name).toBe("Chicken Biryani");
  });

  it("falls back to a safe default for an unrecognized backend status", () => {
    const order = mapOrder({
      id: "order-1",
      orderNumber: "ORD-123456",
      status: "SOMETHING_NEW",
      pickupTime: "IMMEDIATELY",
      pickupTimeMinutes: null,
      total: 0,
      items: [],
    });
    expect(order.status).toBe("confirmed");
  });
});
