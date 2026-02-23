import mongoose from "mongoose";

const readyBoxSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: { type: String, default: "" },
    giftBox:     { type: mongoose.Schema.Types.ObjectId, ref: "GiftBox", required: true },
    items: [
      {
        product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice:  { type: Number, default: 0 },
    image:       { type: String, default: "" },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("ReadyBox", readyBoxSchema);
