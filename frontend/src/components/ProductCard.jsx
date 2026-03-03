/*
 * ProductCard Component
 * ---------------------
 * Displays a single product as a card with image, name, price,
 * category badge, and an "Add to Cart" button.
 */

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!user) return navigate("/login"); // must be logged in
    addToCart(product._id);
  };

  return (
    <div className="product-card">
      <div className="product-img">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="placeholder-img">🎁</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <span className="badge">{product.category}</span>
        <p className="price">${product.price.toFixed(2)}</p>
        <button onClick={handleAdd} className="btn btn-primary">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
