/*
 * Product Routes
 * --------------
 * GET    /api/products       → list (supports ?category & ?search)
 * GET    /api/products/:id   → single product
 * POST   /api/products       → create (admin)
 * PUT    /api/products/:id   → update (admin)
 * DELETE /api/products/:id   → delete (admin)
 */

import { Router } from "express";
import {
  getProducts, getAllProducts, getProduct,
  createProduct, updateProduct, deleteProduct, toggleProduct,
} from "../controllers/productController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", getProducts);
router.get("/all", verifyToken, adminOnly, getAllProducts);
router.get("/:id", getProduct);
router.post("/", verifyToken, adminOnly, createProduct);
router.put("/:id", verifyToken, adminOnly, updateProduct);
router.patch("/:id/toggle", verifyToken, adminOnly, toggleProduct);
router.delete("/:id", verifyToken, adminOnly, deleteProduct);

export default router;
