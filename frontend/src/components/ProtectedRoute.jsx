/*
 * ProtectedRoute Component
 * ------------------------
 * Wraps pages that require login.
 * If adminOnly=true, non-admin users get redirected too.
 *
 * Usage:
 *   <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
 *   <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;

  return children;
}
