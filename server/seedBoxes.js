/*
 * seedBoxes.js – Seed Gift Box types and Ready Boxes
 * Run:  node server/seedBoxes.js
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import GiftBox from "./models/GiftBox.js";
import ReadyBox from "./models/ReadyBox.js";
import Product from "./models/Product.js";

const MONGO = process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce_3d";

const giftBoxTypes = [
  { name: "Small Box",    theme: "minimal",   maxItems: 3,  basePrice: 5,  image: "" },
  { name: "Medium Box",   theme: "classic",   maxItems: 5,  basePrice: 10, image: "" },
  { name: "Large Box",    theme: "luxury",    maxItems: 8,  basePrice: 18, image: "" },
  { name: "Premium Box",  theme: "premium",   maxItems: 12, basePrice: 30, image: "" },
  { name: "Kids Box",     theme: "fun",       maxItems: 5,  basePrice: 8,  image: "" },
  { name: "Romantic Box", theme: "romantic",   maxItems: 6,  basePrice: 15, image: "" },
];

async function seed() {
  await mongoose.connect(MONGO);
  console.log("Connected to MongoDB");

  // Seed gift box types
  await GiftBox.deleteMany({});
  const boxes = await GiftBox.insertMany(giftBoxTypes);
  console.log(`Inserted ${boxes.length} gift box types`);

  // Create a few ready boxes from real products
  const products = await Product.find({ isActive: true }).limit(10);
  if (products.length >= 4) {
    await ReadyBox.deleteMany({});
    const readyBoxes = [
      {
        name: "Self-Care Starter",
        description: "A curated set of self-care essentials for ultimate relaxation.",
        giftBox: boxes[1]._id, // Medium Box
        items: [
          { product: products[0]._id, quantity: 1 },
          { product: products[1]._id, quantity: 1 },
          { product: products[2]._id, quantity: 1 },
        ],
        totalPrice: boxes[1].basePrice + products[0].price + products[1].price + products[2].price,
        isActive: true,
      },
      {
        name: "Luxury Pampering Set",
        description: "Premium products wrapped in an elegant luxury box. Perfect for someone special.",
        giftBox: boxes[2]._id, // Large Box
        items: [
          { product: products[0]._id, quantity: 2 },
          { product: products[3]._id, quantity: 1 },
          { product: products[1]._id, quantity: 1 },
        ],
        totalPrice: boxes[2].basePrice + products[0].price * 2 + products[3].price + products[1].price,
        isActive: true,
      },
    ];
    if (products.length >= 6) {
      readyBoxes.push({
        name: "Surprise Fun Pack",
        description: "A fun mix of goodies in a cheerful kids box. Great for birthdays!",
        giftBox: boxes[4]._id, // Kids Box
        items: [
          { product: products[4]._id, quantity: 1 },
          { product: products[5]._id, quantity: 1 },
        ],
        totalPrice: boxes[4].basePrice + products[4].price + products[5].price,
        isActive: true,
      });
    }
    const inserted = await ReadyBox.insertMany(readyBoxes);
    console.log(`Inserted ${inserted.length} ready gift boxes`);
  } else {
    console.log("Not enough products to create ready boxes (need >= 4)");
  }

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
