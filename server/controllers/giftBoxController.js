/*
 * GiftBox Controller
 * ------------------
 * CRUD for gift box types (e.g. "Small Box", "Premium Box").
 * Customers read all boxes; admins create & delete.
 */

import GiftBox from "../models/GiftBox.js";

// ─── GET /api/giftboxes ─────────────────────────────────
export const getGiftBoxes = async (req, res) => {
  try {
    const boxes = await GiftBox.find();
    res.json(boxes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/giftboxes  (admin) ───────────────────────
export const createGiftBox = async (req, res) => {
  try {
    const box = await GiftBox.create(req.body);
    res.status(201).json(box);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── PUT /api/giftboxes/:id  (admin) ────────────────────
export const updateGiftBox = async (req, res) => {
  try {
    const box = await GiftBox.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!box) return res.status(404).json({ error: "Gift box not found" });
    res.json(box);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── DELETE /api/giftboxes/:id  (admin) ──────────────────
export const deleteGiftBox = async (req, res) => {
  try {
    await GiftBox.findByIdAndDelete(req.params.id);
    res.json({ message: "Gift box type deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
