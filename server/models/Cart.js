/*
 * Cart Model
 * ----------
 * Each logged-in user has ONE cart (unique per user).
 * The cart stores an array of items and an optional gift box.
 */

import mongoose from "mongoose";

// Sub-schema: one item inside the cart
const cartItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items:   [cartItemSchema],
    giftBox: { type: mongoose.Schema.Types.ObjectId, ref: "GiftBox", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
