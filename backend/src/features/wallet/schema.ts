import { z } from "zod";

export const MAX_TOPUP_AMOUNT = 50000;

export const topUpSchema = z.object({
  amount: z.number().positive().max(MAX_TOPUP_AMOUNT),
});

export const lookupQuerySchema = z.object({
  email: z.string().email(),
});
