import express from "express";
import { prisma } from "../prisma.js";
import { requireAdmin } from "../middleware/auth.js";
import { PricingUpsertSchema } from "../validators/pricing.validator.js";

export const adminRouter = express.Router();

adminRouter.use(requireAdmin);

// Admin: list all pricing rules
adminRouter.get("/pricing", async (_req, res) => {
  const rules = await prisma.pricing.findMany({
    orderBy: { updatedAt: "desc" }
  });
  res.json({ rules });
});

// Admin: upsert pricing rule
adminRouter.put("/pricing", async (req, res) => {
  const parsed = PricingUpsertSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const { brand, model, issue, basePrice, rangePrice } = parsed.data;

  const rule = await prisma.pricing.upsert({
    where: { brand_model_issue: { brand, model, issue } },
    update: { basePrice, rangePrice },
    create: { brand, model, issue, basePrice, rangePrice }
  });

  res.json({ rule });
});

// Admin: delete pricing rule
adminRouter.delete("/pricing", async (req, res) => {
  const brand = String(req.query.brand || "");
  const model = String(req.query.model || "");
  const issue = String(req.query.issue || "");

  if (!brand || !model || !issue) {
    return res.status(400).json({ error: "brand, model, issue are required" });
  }

  await prisma.pricing.delete({
    where: { brand_model_issue: { brand, model, issue } }
  });

  res.json({ ok: true });
});

// Admin: list leads with basic search + pagination
adminRouter.get("/leads", async (req, res) => {
  const q = String(req.query.q || "").trim();
  const type = String(req.query.type || "").trim(); // optional
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(100, Math.max(10, Number(req.query.pageSize || 25)));

  const where = {
    AND: [
      type ? { type } : {},
      q
        ? {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
              { brand: { contains: q, mode: "insensitive" } },
              { model: { contains: q, mode: "insensitive" } },
              { issue: { contains: q, mode: "insensitive" } }
            ]
          }
        : {}
    ]
  };

  const [total, items] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);

  res.json({ total, page, pageSize, items });
});
