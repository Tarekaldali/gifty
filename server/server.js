/*
 * ================================================
 *  Gifty – Express.js Backend  (server.js)
 * ================================================
 *
 *  This is the MAIN file that starts the backend.
 *
 *  What it does:
 *  1. Load environment variables (.env)
 *  2. Connect to MongoDB
 *  3. Set up middleware (CORS, JSON parser)
 *  4. Register all API routes under /api/...
 *  5. Start the HTTP server
 *
 *  To run:  npm run dev   (uses nodemon for auto-reload)
 *
 * ================================================
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Import route files ─────────────────────────────────
import authRoutes     from "./routes/authRoutes.js";
import productRoutes  from "./routes/productRoutes.js";
import cartRoutes     from "./routes/cartRoutes.js";
import orderRoutes    from "./routes/orderRoutes.js";
import giftBoxRoutes  from "./routes/giftBoxRoutes.js";
import readyBoxRoutes from "./routes/readyBoxRoutes.js";
import adminRoutes    from "./routes/adminRoutes.js";

// ─── Configuration ──────────────────────────────────────
// Load .env FIRST so all process.env.* values are available
dotenv.config();
const app  = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ─────────────────────────────────────────
app.use(cors());           // Allow the React frontend (port 5173) to call this server
app.use(express.json());   // Parse JSON bodies from incoming requests

// serve static files from server/public
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));  // Serve static files (3D models, images, etc.)

// ─── API Routes ─────────────────────────────────────────
app.use("/api/auth",       authRoutes);      // Register, Login, Me, Forgot password
app.use("/api/products",   productRoutes);   // Products CRUD
app.use("/api/cart",       cartRoutes);      // Cart operations
app.use("/api/orders",     orderRoutes);     // Orders
app.use("/api/giftboxes",  giftBoxRoutes);   // Gift box types
app.use("/api/readyboxes", readyBoxRoutes);  // Ready-made gift boxes
app.use("/api/admin",      adminRoutes);     // Admin stats & utilities

// Simple health-check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Gifty API is running 🎁" });
});

// ─── Start server ───────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Gifty server running → http://localhost:${PORT}`);
  });
});
