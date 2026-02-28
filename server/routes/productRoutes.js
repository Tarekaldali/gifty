/*
 * Product Routes
 * --------------
 * GET    /api/products       → list (supports ?category & ?search)
 * GET    /api/products/:id   → single product
 * POST   /api/products       → create (admin)
 * POST   /api/products/upload → upload 3D model (admin)
 * PUT    /api/products/:id   → update (admin)
 * DELETE /api/products/:id   → delete (admin)
 */

import { Router } from "express";
import {
  getProducts, getAllProducts, getProduct,
  createProduct, updateProduct, deleteProduct, toggleProduct,
} from "../controllers/productController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", getProducts);
router.get("/all", verifyToken, adminOnly, getAllProducts);
router.get("/:id", getProduct);
router.post("/", verifyToken, adminOnly, createProduct);
router.post("/upload", verifyToken, adminOnly, upload.single("model"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Return the path relative to public folder
  const modelPath = `/models/${req.file.filename}`;
  res.json({ modelPath });
});
router.put("/:id", verifyToken, adminOnly, updateProduct);
router.patch("/:id/toggle", verifyToken, adminOnly, toggleProduct);
router.delete("/:id", verifyToken, adminOnly, deleteProduct);

export default router;
