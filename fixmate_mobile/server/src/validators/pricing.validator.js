import { z } from "zod";

export const PricingUpsertSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  issue: z.string().min(1),
  basePrice: z.number().int().positive(),
  rangePrice: z.number().int().nonnegative()
});
