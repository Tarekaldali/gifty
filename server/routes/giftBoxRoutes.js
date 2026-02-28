/*
 * GiftBox Routes
 * --------------
 * GET    /api/giftboxes       → list all box types (public)
 * POST   /api/giftboxes       → create (admin)
 * DELETE /api/giftboxes/:id   → delete (admin)
 */

import { Router } from "express";
import {
  getGiftBoxes, createGiftBox, updateGiftBox, deleteGiftBox,
} from "../controllers/giftBoxController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", getGiftBoxes);
router.post("/", verifyToken, adminOnly, createGiftBox);
// upload model file for a box
router.post("/upload", verifyToken, adminOnly, upload.single("model"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const modelPath = `/models/${req.file.filename}`;
  res.json({ modelPath });
});
router.put("/:id", verifyToken, adminOnly, updateGiftBox);
router.delete("/:id", verifyToken, adminOnly, deleteGiftBox);

export default router;
