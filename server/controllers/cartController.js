/*
 * Cart Controller
 * ---------------
 * Manages the shopping cart for each logged-in user.
 * Each user has ONE cart document in the database.
 *
 * Operations: get, add item, update quantity, remove item,
 *             set gift box, clear entire cart.
 */

import Cart from "../models/Cart.js";

// ─── GET /api/cart ───────────────────────────────────────
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId })
      .populate("items.product")   // replace product ID with full product data
      .populate("giftBox");        // replace giftBox ID with full box data

    if (!cart) cart = { items: [], giftBox: null };
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/cart/add ──────────────────────────────────
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      // First time → create a new cart
      cart = await Cart.create({
        user: req.userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already exists in the cart
      const existing = cart.items.find(
        (i) => i.product.toString() === productId
      );

      if (existing) {
        existing.quantity += quantity; // just increase quantity
      } else {
        cart.items.push({ product: productId, quantity }); // add new item
      }
      await cart.save();
    }

    // Return populated cart
    cart = await Cart.findById(cart._id)
      .populate("items.product")
      .populate("giftBox");

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── PUT /api/cart/update ────────────────────────────────
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not in cart" });

    if (quantity <= 0) {
      // Remove item if quantity reaches zero
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const updated = await Cart.findById(cart._id)
      .populate("items.product")
      .populate("giftBox");

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── DELETE /api/cart/remove/:productId ──────────────────
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );

    await cart.save();

    const updated = await Cart.findById(cart._id)
      .populate("items.product")
      .populate("giftBox");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/cart/giftbox ───────────────────────────────
export const setGiftBox = async (req, res) => {
  try {
    const { giftBoxId } = req.body;
    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) cart = await Cart.create({ user: req.userId, items: [] });

    cart.giftBox = giftBoxId || null;
    await cart.save();

    const updated = await Cart.findById(cart._id)
      .populate("items.product")
      .populate("giftBox");

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── DELETE /api/cart/clear ──────────────────────────────
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.userId });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
