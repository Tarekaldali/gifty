import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../api/axios";

export default function ReadyBoxes() {
  const { user } = useAuth();
  const { addToCart, clearCart, setGiftBox } = useCart();
  const navigate = useNavigate();
  const [readyBoxes, setReadyBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    API.get("/readyboxes").then((res) => setReadyBoxes(res.data)).catch(() => {});
  }, []);

  const handleAddToCart = async (box) => {
    if (!user) { navigate("/login"); return; }
    setAdding(box._id);
    try {
      // Clear existing cart, then add ready-box items
      await clearCart();
      for (const item of box.items) {
        await addToCart(item.product._id, item.quantity);
      }
      // Set the gift box type
      if (box.giftBox) {
        await setGiftBox(box.giftBox._id);
      }
      navigate("/cart");
    } catch (err) {
      console.error("Failed to add ready box to cart:", err);
    }
    setAdding(null);
  };

  return (
    <div className="page ready-boxes-page">
      <div className="page-header">
        <h2>🎀 Ready Gift Boxes</h2>
        <p className="page-subtitle">Curated gift sets ready to order — no assembly needed!</p>
      </div>

      {readyBoxes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎁</div>
          <h3>Coming Soon!</h3>
          <p>Our curated gift boxes are being prepared. Check back soon!</p>
        </div>
      )}

      <div className="ready-box-grid">
        {readyBoxes.map((box) => (
          <div key={box._id} className="ready-box-card" onClick={() => setSelectedBox(selectedBox?._id === box._id ? null : box)}>
            <div className="ready-box-header">
              <h3>{box.name}</h3>
              <span className="ready-box-price">${box.totalPrice.toFixed(2)}</span>
            </div>
            {box.description && <p className="ready-box-desc">{box.description}</p>}
            <div className="ready-box-meta">
              <span className="meta-tag">📦 {box.giftBox?.name || "Gift Box"}</span>
              <span className="meta-tag">🎁 {box.items.length} items</span>
            </div>

            {selectedBox?._id === box._id && (
              <div className="ready-box-expand">
                <h4>Included Items:</h4>
                <div className="ready-box-items">
                  {box.items.map((item, i) => (
                    <div key={i} className="ready-box-item">
                      <span className="rb-item-name">{item.product?.name || "Item"}</span>
                      <span className="rb-item-qty">×{item.quantity}</span>
                      <span className="rb-item-price">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="ready-box-price-breakdown">
                  <div className="price-row"><span>Box</span><span>${(box.giftBox?.basePrice || 0).toFixed(2)}</span></div>
                  <div className="price-row total"><span>Total</span><span>${box.totalPrice.toFixed(2)}</span></div>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary ready-box-btn"
              onClick={(e) => { e.stopPropagation(); handleAddToCart(box); }}
              disabled={adding === box._id}
            >
              {adding === box._id ? "Adding..." : "🛒 Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
