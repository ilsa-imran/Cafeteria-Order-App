import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider, useCart } from "./CartContext";
import type { MenuItem } from "../types/order";

vi.mock("../lib/api", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "../lib/api";

const BIRYANI: MenuItem = { id: "1", name: "Chicken Biryani", price: 250, available: true };
const BURGER: MenuItem = { id: "2", name: "Beef Burger", price: 300, available: true };

function wrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}

beforeEach(() => {
  sessionStorage.clear();
  vi.mocked(apiFetch).mockReset();
});

describe("CartContext", () => {
  it("adding the same item twice increments its quantity instead of duplicating", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(BIRYANI));
    act(() => result.current.addItem(BIRYANI));

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
  });

  it("calculates the total across multiple distinct items", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(BIRYANI));
    act(() => result.current.addItem(BURGER));

    expect(result.current.total).toBe(550);
  });

  it("setting quantity to 0 removes the line instead of leaving a zero-quantity row", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(BIRYANI));
    act(() => result.current.setQuantity(BIRYANI.id, 0));

    expect(result.current.lines).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it("refuses to confirm an order with no items or no pickup time", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await expect(result.current.confirmOrder()).rejects.toThrow();

    act(() => result.current.addItem(BIRYANI));
    await expect(result.current.confirmOrder()).rejects.toThrow();
  });

  it("refuses to confirm a custom pickup time with no minutes chosen", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(BIRYANI));
    act(() => result.current.setPickupTime("custom"));

    await expect(result.current.confirmOrder()).rejects.toThrow();
  });

  it("sends the chosen minutes when confirming a custom pickup time", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      id: "order-2",
      orderNumber: "ORD-654321",
      status: "CONFIRMED",
      pickupTime: "CUSTOM",
      pickupTimeMinutes: 90,
      total: 250,
      items: [{ quantity: 1, menuItem: { ...BIRYANI, description: null } }],
    });

    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(BIRYANI));
    act(() => result.current.setPickupTime("custom"));
    act(() => result.current.setCustomPickupMinutes(90));
    act(() => result.current.setPaymentMethod("cash"));

    await act(async () => {
      await result.current.confirmOrder();
    });

    expect(apiFetch).toHaveBeenCalledWith(
      "/orders",
      expect.objectContaining({
        body: expect.objectContaining({ pickupTime: "CUSTOM", pickupTimeMinutes: 90, paymentMethod: "CASH" }),
      }),
    );
  });

  it("clears the cart after a successful order confirmation", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-123456",
      status: "CONFIRMED",
      pickupTime: "IMMEDIATELY",
      total: 250,
      items: [{ quantity: 1, menuItem: { ...BIRYANI, description: null } }],
    });

    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(BIRYANI));
    act(() => result.current.setPickupTime("immediately"));
    act(() => result.current.setPaymentMethod("wallet"));

    await act(async () => {
      await result.current.confirmOrder();
    });

    await waitFor(() => {
      expect(result.current.lines).toHaveLength(0);
      expect(result.current.pickupTime).toBeNull();
      expect(result.current.paymentMethod).toBeNull();
      expect(result.current.lastOrder?.orderNumber).toBe("ORD-123456");
    });
  });
});
