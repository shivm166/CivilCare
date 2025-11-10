import express from "express";
import {
  getprofile,
  getSocieties,
  login,
  logout,
  signup,
  updateProfile, // ✅ make sure it's imported here
} from "../controllers/user.controllers.js";

import { validateUser, validateLogin } from "../middlelware/validation.user.js";
import { validateRequest } from "../middlelware/validateMiddleware.js";
import protectRoute from "../middlelware/isProtected.js";

const router = express.Router();

// ✅ Signup
router.post("/signup", validateRequest(validateUser), signup);

// ✅ Login
router.post("/login", validateRequest(validateLogin), login);

// ✅ Get profile (read)
router.get("/profile", protectRoute, getprofile);

// ✅ Update profile (edit)
router.put("/profile", protectRoute, updateProfile);

// ✅ Get societies (optional)
router.get("/societies", protectRoute, getSocieties);

// ✅ Current logged-in user (for testing)
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// ✅ Logout
router.post("/logout", protectRoute, logout);

export default router;
