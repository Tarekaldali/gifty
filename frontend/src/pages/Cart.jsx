/*
 * Cart Page
 * ---------
 * Left side:  list of cart items with quantity controls
 * Right side: 3D gift box preview (the cool part!)
 */

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import BoxScene from "../3d/BoxScene";

export default function Cart() {
  const { cart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="page">
        <p>Please <Link to="/login">login</Link> to see your cart.</p>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="cart-layout">
        {/* ── Left: Cart Items ────────────────────────── */}
        <div className="cart-list">
          <h2>Your Cart</h2>

          {cart.items?.length === 0 ? (
            <p className="muted">
              Your cart is empty. <Link to="/products">Browse gifts</Link>
            </p>
          ) : (
            <>
              {cart.items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}

              <div className="cart-summary">
                <p className="total">
                  Total: <strong>${totalPrice.toFixed(2)}</strong>
                </p>
                <div className="cart-actions">
                  <button className="btn btn-secondary" onClick={clearCart}>
                    Clear Cart
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Right: 3D Gift Box Preview ──────────────── */}
        {cart.items?.length > 0 && (
          <div className="cart-3d">
            <h3>🎁 Gift Box Preview</h3>
            <BoxScene items={cart.items} />
          </div>
        )}
      </div>
    </div>
  );
}
