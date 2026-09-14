import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  pickupTime: z.enum(["IMMEDIATELY", "WITHIN_30_MIN", "WITHIN_1_HOUR"]),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PREPARING", "READY", "PICKED_UP"]),
});
