/*
 * Auth Routes
 * -----------
 * POST /api/auth/register  → create account
 * POST /api/auth/login     → login & get JWT
 * GET  /api/auth/me        → get current user (requires token)
 */

import { Router } from "express";
import { register, login, getMe, forgotPassword, resetPassword } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
