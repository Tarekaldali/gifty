/*
 * Order Controller
 * ----------------
 * Creates an order from the user's cart at checkout,
 * and provides listing endpoints for customers and admins.
 *
 * Flow: Customer fills delivery form → POST /api/orders
 *       → cart items become order items → cart is cleared.
 */

import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// ─── POST /api/orders ────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    // 1. Get the user's cart with populated products
    const cart = await Cart.findOne({ user: req.userId })
      .populate("items.product")
      .populate("giftBox");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2. Validate delivery info
    const { delivery } = req.body;
    if (!delivery?.name || !delivery?.phone || !delivery?.city || !delivery?.address) {
      return res.status(400).json({
        error: "Delivery info required: name, phone, city, address",
      });
    }

    // 3. Snapshot the cart items (save name & price at time of purchase)
    const items = cart.items.map((i) => ({
      product:  i.product._id,
      name:     i.product.name,
      price:    i.product.price,
      quantity: i.quantity,
    }));

    // 4. Calculate total (items + gift box base price)
    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const boxPrice   = cart.giftBox?.basePrice || 0;
    const totalPrice = itemsTotal + boxPrice;

    // 5. Create the order
    const order = await Order.create({
      user: req.userId,
      items,
      giftBox: cart.giftBox?._id || null,
      delivery,
      totalPrice,
    });

    // 6. Clear the cart after successful order
    await Cart.findOneAndDelete({ user: req.userId });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── GET /api/orders ─────────────────────────────────────
// Returns the logged-in customer's own orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/orders/all  (admin) ────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")  // show customer name & email
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/orders/:id/status  (admin) ─────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── GET /api/orders/:id  (admin) ───────────────────────
// Full order detail for admin (customer info, delivery, items)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("giftBox");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
