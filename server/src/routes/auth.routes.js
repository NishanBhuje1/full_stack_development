import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../env.js";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

  // Single admin check
  if (username !== env.ADMIN_USERNAME) return res.status(401).json({ error: "Invalid credentials" });

  // Compare password using bcrypt-compatible approach:
  // For now we compare plain env password (simple). If you want, we can store bcrypt hash instead.
  if (password !== env.ADMIN_PASSWORD) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { role: "admin", username: env.ADMIN_USERNAME },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});
