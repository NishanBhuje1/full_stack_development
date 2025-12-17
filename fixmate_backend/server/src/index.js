import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./env.js";

import { authRouter } from "./routes/auth.routes.js";
import { pricingRouter } from "./routes/pricing.routes.js";
import { leadsRouter } from "./routes/leads.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { quotesRouter } from "./routes/quotes.routes.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// --- CORS Setup Start ---
const allowedOrigins = [
  env.CORS_ORIGIN, // Used from your env.js
  "http://localhost:5173", // Local frontend development
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser requests (Postman/curl) with no origin
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error("CORS blocked: " + origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Ensure preflight works across all routes
app.options("*", cors());
// --- CORS Setup End ---

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/pricing", pricingRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/quotes", quotesRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});