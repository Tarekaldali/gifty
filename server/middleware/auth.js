/*
 * Auth Middleware
 * --------------
 * verifyToken  – checks the JWT from the Authorization header
 * adminOnly    – blocks non-admin users
 *
 * Usage in routes:
 *   router.get("/secret", verifyToken, handler)
 *   router.post("/admin-only", verifyToken, adminOnly, handler)
 */

import jwt from "jsonwebtoken";

// Read secret at call-time (after dotenv.config() has run in server.js)
const getSecret = () => process.env.JWT_SECRET || "gifty_secret_key";

// ─── Verify JWT Token ────────────────────────────────────
export const verifyToken = (req, res, next) => {
  // Expect header: Authorization: Bearer <token>
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token provided" });

  const token = header.split(" ")[1]; // extract the token part

  try {
    const decoded = jwt.verify(token, getSecret());
    req.userId   = decoded.id;   // attach user id to the request
    req.userRole = decoded.role;  // attach role (customer / admin)
    next();                       // continue to the route handler
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ─── Admin-Only Guard ────────────────────────────────────
export const adminOnly = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
