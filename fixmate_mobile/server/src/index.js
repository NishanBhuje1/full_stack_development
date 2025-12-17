import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./env.js";

import { authRouter } from "./routes/auth.routes.js";
import { pricingRouter } from "./routes/pricing.routes.js";
import { leadsRouter } from "./routes/leads.routes.js";
import { adminRouter } from "./routes/admin.routes.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use(
  cors({
    origin: env.CORS_ORIGIN.length ? env.CORS_ORIGIN : true,
    credentials: false
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/pricing", pricingRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/admin", adminRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
