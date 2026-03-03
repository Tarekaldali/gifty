/*
 * CartItem Component
 * ------------------
 * One row inside the cart list.
 * Shows product name, price × quantity, and +/- buttons.
 */

import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const product = item.product;

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4>{product?.name}</h4>
        <p className="muted">
          ${product?.price?.toFixed(2)} × {item.quantity} ={" "}
          <strong>${(product?.price * item.quantity).toFixed(2)}</strong>
        </p>
      </div>

      <div className="cart-item-actions">
        <button
          onClick={() => updateQuantity(product._id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span className="qty">{item.quantity}</span>
        <button onClick={() => updateQuantity(product._id, item.quantity + 1)}>
          +
        </button>
        <button onClick={() => removeItem(product._id)} className="btn-remove">
          ✕
        </button>
      </div>
    </div>
  );
}
