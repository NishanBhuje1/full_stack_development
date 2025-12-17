import { z } from "zod";

export const LeadCreateSchema = z.object({
  type: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(6),
  brand: z.string().optional().or(z.literal("")),
  model: z.string().min(1),
  issue: z.string().min(1),
  message: z.string().optional().or(z.literal("")),
  preferredDate: z.string().optional().or(z.literal("")),
  preferredTime: z.string().optional().or(z.literal("")),
  estimateLow: z.number().int().optional(),
  estimateHigh: z.number().int().optional()
});
