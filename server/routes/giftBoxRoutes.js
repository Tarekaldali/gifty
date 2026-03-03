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

const router = Router();

router.get("/", getGiftBoxes);
router.post("/", verifyToken, adminOnly, createGiftBox);
router.put("/:id", verifyToken, adminOnly, updateGiftBox);
router.delete("/:id", verifyToken, adminOnly, deleteGiftBox);

export default router;
