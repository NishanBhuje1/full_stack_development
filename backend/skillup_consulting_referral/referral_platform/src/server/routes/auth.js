import express from "express";
import * as authService from "../services/authService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    const token = await authService.registerUser(body);

    res.json({ message: "Register successful", token });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Could not resister user", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "couldnot login user", error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const message = await authService.forgotPassword(req.body);
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "couldnot request forgot password", error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const body = req.body;
    const token = req.rawHeaders[1];
    const message = await authService.resetPassword(body, token);
    res.status(200).json("password reset successful");
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "couldnot request forgot password", error: error.message });
  }
});
export default router;
