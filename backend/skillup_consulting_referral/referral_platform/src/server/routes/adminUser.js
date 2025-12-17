import express from "express";
import _ from "lodash";
import * as adminUserService from "../services/adminUserService.js";

const router = express.Router();

router.post("/resister", async (req, res) => {
  try {
    const newAdminUser = await adminUserService.registerAdminUser(req.body);
    res.status(201).json({ data: _.omit(newAdminUser, "password") });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const token = await adminUserService.loginAdminUser(req.body);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "couldnot login admin user", error: error.message });
  }
});
export default router;
