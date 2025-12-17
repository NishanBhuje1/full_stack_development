import express from "express";
import { prisma } from "../prisma.js";

export const pricingRouter = express.Router();

// Public: get pricing rules for a model (and optional issue)
pricingRouter.get("/", async (req, res) => {
  const brand = String(req.query.brand || "");
  const model = String(req.query.model || "");
  const issue = String(req.query.issue || "");

  if (!brand || !model) return res.status(400).json({ error: "brand and model are required" });

  const where = { brand, model, ...(issue ? { issue } : {}) };
  const rules = await prisma.pricing.findMany({ where, orderBy: { updatedAt: "desc" } });

  res.json({ rules });
});
