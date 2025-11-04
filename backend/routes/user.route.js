import express from "express";
import {
  getprofile,
  login,
  logout,
  signup,
} from "../controllers/user.controllers.js";
import protectRoute from "../middlware/isProtected.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protectRoute, getprofile);
router.post("/logout", protectRoute, logout);

export default router;
