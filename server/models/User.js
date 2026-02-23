/*
 * User Model
 * ----------
 * Stores registered users. The "role" field controls admin access.
 * Passwords are hashed BEFORE saving (see authController).
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

export default mongoose.model("User", userSchema);
