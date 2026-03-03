/*
 * GiftBox Model
 * -------------
 * Represents a type of gift box (e.g. "Small Box", "Premium Box").
 * Used in the Custom Box Builder – the customer picks a box type,
 * then adds items into it.
 */

import mongoose from "mongoose";

const giftBoxSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    theme:     { type: String, default: "general" },
    maxItems:  { type: Number, default: 5 },     // how many items fit inside
    basePrice: { type: Number, default: 0 },     // box itself costs this much
    image:     { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("GiftBox", giftBoxSchema);
