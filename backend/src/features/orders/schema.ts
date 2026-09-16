import { z } from "zod";

export const MAX_CUSTOM_PICKUP_MINUTES = 180;

export const createOrderSchema = z
  .object({
    items: z
      .array(
        z.object({
          menuItemId: z.string().min(1),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1),
    pickupTime: z.enum(["IMMEDIATELY", "WITHIN_30_MIN", "WITHIN_1_HOUR", "CUSTOM"]),
    pickupTimeMinutes: z.number().int().positive().max(MAX_CUSTOM_PICKUP_MINUTES).optional(),
    paymentMethod: z.enum(["CASH", "WALLET"]).default("CASH"),
  })
  .refine(
    (data) => data.pickupTime !== "CUSTOM" || data.pickupTimeMinutes !== undefined,
    { message: "pickupTimeMinutes is required when pickupTime is CUSTOM", path: ["pickupTimeMinutes"] },
  );

export const updateOrderStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PREPARING", "READY", "PICKED_UP"]),
});
