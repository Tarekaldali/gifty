/*
 * Product Controller
 * ------------------
 * CRUD operations for gift products.
 * Customers can READ (list + single).
 * Admins can CREATE, UPDATE, DELETE.
 */

import Product from "../models/Product.js";

// ─── GET /api/products ───────────────────────────────────
// Supports ?category=graduation &search=flower &minPrice=10 &maxPrice=50
export const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (search)   filter.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/products/all  (admin) ──────────────────────
// Returns ALL products including inactive ones
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── PATCH /api/products/:id/toggle  (admin) ────────────
// Toggle activate / deactivate
export const toggleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    product.isActive = !product.isActive;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/products/:id ───────────────────────────────
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/products  (admin) ─────────────────────────
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── PUT /api/products/:id  (admin) ──────────────────────
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── DELETE /api/products/:id  (admin) ───────────────────
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
