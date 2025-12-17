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
const rawOrigins = [
  env.CORS_ORIGIN, // From your env.js
  "https://fixmatemobile.vercel.app", // Explicit production URL
  "http://localhost:5173", // Local development
]
  .filter(Boolean)
  .map((s) => s.trim().replace(/\/$/, "")); // Remove trailing slashes to prevent mismatches

const allowlist = new Set(rawOrigins);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return cb(null, true);

      const clean = origin.trim().replace(/\/$/, "");

      if (allowlist.has(clean)) return cb(null, true);

      // IMPORTANT: do NOT throw an error (which causes 500s).
      // Returning (null, false) simply blocks the request via CORS policy.
      return cb(null, false);
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
