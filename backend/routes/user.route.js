import express from "express";
import {
  getprofile,
  getSocieties,
  login,
  logout,
  signup,
} from "../controllers/user.controllers.js";
import { validateUser } from "../middlelware/validation.user.js";
import { validateLogin } from "../middlelware/validation.user.js";
import { validateRequest } from "../middlelware/validateMiddleware.js";
import protectRoute from "../middlelware/isProtected.js";

const router = express.Router();

router.post("/signup", validateRequest(validateUser), signup);
router.post("/login", validateRequest(validateLogin), login);
router.get("/profile", protectRoute, getprofile);
router.get("/societies", protectRoute, getSocieties);

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.post("/logout", protectRoute, logout);

export default router;
