/*
 * Cart Routes
 * -----------
 * All routes require login (verifyToken applied to the whole router).
 *
 * GET    /api/cart                      → get user's cart
 * POST   /api/cart/add                  → add item
 * PUT    /api/cart/update               → change quantity
 * DELETE /api/cart/remove/:productId    → remove one item
 * PUT    /api/cart/giftbox              → set gift box type
 * DELETE /api/cart/clear                → empty the cart
 */

import { Router } from "express";
import {
  getCart, addToCart, updateCartItem,
  removeFromCart, setGiftBox, clearCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.use(verifyToken); // ← every cart endpoint needs a logged-in user

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:productId", removeFromCart);
router.put("/giftbox", setGiftBox);
router.delete("/clear", clearCart);

export default router;
