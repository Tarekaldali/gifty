/*
 * Order Routes
 * ------------
 * POST /api/orders             → place order from cart (customer)
 * GET  /api/orders             → my orders (customer)
 * GET  /api/orders/all         → all orders (admin)
 * PUT  /api/orders/:id/status  → change status (admin)
 */

import { Router } from "express";
import {
  createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderById,
} from "../controllers/orderController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";

const router = Router();

router.use(verifyToken); // all order routes need login

router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/all", adminOnly, getAllOrders);
router.get("/:id", adminOnly, getOrderById);
router.put("/:id/status", adminOnly, updateOrderStatus);

export default router;
