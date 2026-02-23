import { Router } from "express";
import { verifyToken, adminOnly } from "../middleware/auth.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import ReadyBox from "../models/ReadyBox.js";
import GiftBox from "../models/GiftBox.js";

const router = Router();

// GET /api/admin/stats — dashboard statistics (REAL DATA)
router.get("/stats", verifyToken, adminOnly, async (req, res) => {
  try {
    // Run all count queries in parallel for efficiency
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      activeProducts,
      totalReadyBoxes,
      activeReadyBoxes,
      totalGiftBoxes,
      orders,
      lowStock,
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      ReadyBox.countDocuments(),
      ReadyBox.countDocuments({ isActive: true }),
      GiftBox.countDocuments(),
      Order.find().lean(),
      Product.find({ isActive: true, stock: { $lte: 5 } })
        .sort({ stock: 1 })
        .select("name stock price")
        .lean(),
    ]);

    // Total revenue
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    // Most sold items (aggregate from order items)
    const soldMap = {};
    for (const order of orders) {
      for (const item of order.items) {
        const key = item.name;
        if (!soldMap[key]) soldMap[key] = { name: item.name, totalSold: 0, revenue: 0 };
        soldMap[key].totalSold += item.quantity;
        soldMap[key].revenue += item.price * item.quantity;
      }
    }
    const mostSold = Object.values(soldMap).sort((a, b) => b.totalSold - a.totalSold).slice(0, 10);

    // Orders by status
    const statusCounts = { pending: 0, preparing: 0, shipped: 0, delivered: 0 };
    for (const o of orders) {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    }

    // Recent orders (last 5)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((o) => ({
        _id: o._id,
        totalPrice: o.totalPrice,
        status: o.status,
        itemCount: o.items.length,
        createdAt: o.createdAt,
      }));

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      activeProducts,
      totalReadyBoxes,
      activeReadyBoxes,
      totalGiftBoxes,
      lowStock,
      mostSold,
      statusCounts,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
