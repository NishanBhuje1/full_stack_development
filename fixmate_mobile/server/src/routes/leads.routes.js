import express from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../prisma.js";
import { LeadCreateSchema } from "../validators/leads.validator.js";
import { sendLeadEmail } from "../email.js";


export const leadsRouter = express.Router();

const lead = await prisma.lead.create({ ... });

sendLeadEmail({ lead }).catch((err) => {
  console.error("Email send failed:", err);
});

res.status(201).json({ leadId: lead.id });


const leadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
});

// Public: create lead
leadsRouter.post("/", leadLimiter, async (req, res) => {
  const parsed = LeadCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const data = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      type: data.type,
      fullName: data.fullName,
      email: data.email || null,
      phone: data.phone,
      brand: data.brand || null,
      model: data.model,
      issue: data.issue,
      message: data.message || null,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
      preferredTime: data.preferredTime || null,
      estimateLow: data.estimateLow ?? null,
      estimateHigh: data.estimateHigh ?? null
    }
  });

  res.status(201).json({ leadId: lead.id });
});
