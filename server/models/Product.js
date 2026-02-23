/*
 * Product Model
 * -------------
 * Each product is a gift item the customer can browse and add to cart.
 * Admin can create / edit / delete products.
 */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: { type: String, default: "" },
    price:       { type: Number, required: true },
    image:       { type: String, default: "" },              // URL to product image
    category:    {
      type: String,
      enum: ["graduation", "wedding", "birthday", "general"],
      default: "general",
    },
    stock:       { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },            // soft-delete / hide
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
