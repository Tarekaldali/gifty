/*
 * Auth Controller
 * ---------------
 * Handles user registration, login, and "get current user" (me).
 *
 * register → hash password → save user → return JWT
 * login    → find user → compare password → return JWT
 * getMe    → return the logged-in user (token required)
 */

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper: get the secret at call-time (after dotenv has loaded)
const getSecret = () => process.env.JWT_SECRET || "gifty_secret_key";

// Helper: create a signed JWT that lasts 7 days
const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, getSecret(), { expiresIn: "7d" });

// ─── POST /api/auth/register ─────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already taken
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    // Hash the plain-text password before saving
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });
    const token = makeToken(user);

    res.status(201).json({
      message: "Registered!",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── POST /api/auth/login ────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare the entered password with the stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Wrong password" });

    const token = makeToken(user);

    res.json({
      message: "Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/auth/me ────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    // req.userId is set by the verifyToken middleware
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/auth/forgot-password ──────────────────────
// Simplified: verify email exists then allow setting new password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "No account with that email" });

    // Generate a short-lived reset token (15 min)
    const resetToken = jwt.sign({ id: user._id, purpose: "reset" }, getSecret(), { expiresIn: "15m" });
    res.json({ message: "Reset token generated", resetToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/auth/reset-password ───────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const decoded = jwt.verify(resetToken, getSecret());
    if (decoded.purpose !== "reset") return res.status(400).json({ error: "Invalid token" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired reset token" });
  }
};
