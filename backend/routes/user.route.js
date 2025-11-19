import express from "express";
import {
  getprofile,
  getSocieties,
  login,
  logout,
  signup,
  updateProfile,
  getAllUsers,
  getMe, // ✅ Import the new function
} from "../controllers/user.controllers.js";

import { validateUser, validateLogin } from "../middleware/validation.user.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import protectRoute from "../middleware/isProtected.js";

const router = express.Router();

// ✅ Signup
router.post("/signup", validateRequest(validateUser), signup);

// ✅ Login
router.post("/login", validateRequest(validateLogin), login);

// ✅ Get current authenticated user (CRITICAL for useAuthUser hook)
router.get("/me", protectRoute, getMe);

// ✅ Get profile (read)
router.get("/profile", protectRoute, getprofile);

// ✅ Update profile (edit)
router.put("/profile", protectRoute, updateProfile);

// ✅ Get societies
router.get("/societies", protectRoute, getSocieties);

// ✅ Logout
router.post("/logout", protectRoute, logout);

// ✅ Get all users (admin only - you might want to add admin middleware here)
router.get("/", getAllUsers);

export default router;