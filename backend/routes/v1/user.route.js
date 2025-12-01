import express from "express";
import {
  getprofile,
  getSocieties,
  login,
  logout,
  signup,
  updateProfile,
  getAllUsers,
} from "../../controllers/auth/user.controllers.js";

import {
  validateUser,
  validateLogin,
} from "../../validatores/validation.user.js";
import { validateRequest } from "../../validatores/validateMiddleware.js";
import protectRoute from "../../middleware/isProtected.js";

const router = express.Router();

// Public Auth Routes
router.post("/signup", validateRequest(validateUser), signup);
router.post("/login", validateRequest(validateLogin), login);

// Protected User Routes
router.use(protectRoute);

router.get("/profile", getprofile);
router.put("/profile", updateProfile);
router.post("/logout", logout);
router.get("/societies", getSocieties);
router.get("/me", (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// Admin/SuperAdmin Routes
router.get("/", getAllUsers);

export default router;
