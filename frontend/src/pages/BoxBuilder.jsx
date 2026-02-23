/*
 * BoxBuilder – 4-step custom gift box builder
 * Step 1: Choose box size/theme
 * Step 2: Choose a cover design
 * Step 3: Add items
 * Step 4: Preview (3D) & Add to Cart
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../api/axios";
import BoxScene from "../3d/BoxScene";

/* ── 8 Cover designs (pure CSS patterns) ────────────────────────── */
const COVERS = [
  { id: "classic-red",    label: "Classic Red",     bg: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)", emoji: "🎀",  ribbonColor: "#c0392b" },
  { id: "gold-foil",      label: "Gold Foil",       bg: "linear-gradient(135deg, #f7dc6f 0%, #d4ac0d 100%)", emoji: "✨",  ribbonColor: "#d4ac0d" },
  { id: "midnight-stars",  label: "Midnight Stars", bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", emoji: "🌙",  ribbonColor: "#e8d5b7" },
  { id: "rose-garden",    label: "Rose Garden",     bg: "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)", emoji: "🌹",  ribbonColor: "#e84393" },
  { id: "ocean-wave",     label: "Ocean Wave",      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", emoji: "🌊",  ribbonColor: "#0984e3" },
  { id: "forest-green",   label: "Evergreen",       bg: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)", emoji: "🌿",  ribbonColor: "#00b894" },
  { id: "confetti",       label: "Confetti Party",  bg: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", emoji: "🎉",  ribbonColor: "#e17055" },
  { id: "royal-purple",   label: "Royal Purple",    bg: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)", emoji: "👑",  ribbonColor: "#6c5ce7" },
];

/* Map box themes to visual characteristics passed to 3D */
const BOX_THEME_MAP = {
  minimal:  { color: "#e8d5b7", ribbon: "#999",    accent: "#bbb" },
  classic:  { color: "#d4a574", ribbon: "#e74c3c", accent: "#c0392b" },
  luxury:   { color: "#2c3e50", ribbon: "#f1c40f", accent: "#d4ac0d" },
  premium:  { color: "#1a1a2e", ribbon: "#e74c3c", accent: "#c0392b" },
  fun:      { color: "#ff9ff3", ribbon: "#54a0ff", accent: "#48dbfb" },
  romantic: { color: "#fdcbf1", ribbon: "#e74c3c", accent: "#c0392b" },
};

export default function BoxBuilder() {
  const { user } = useAuth();
  const { addToCart, clearCart, setGiftBox } = useCart();
  const navigate = useNavigate();

  const [giftBoxes, setGiftBoxes] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    API.get("/giftboxes").then((r) => setGiftBoxes(r.data)).catch(() => {});
    API.get("/products").then((r) => setProducts(r.data)).catch(() => {});
  }, []);

  const totalItems = selectedItems.reduce((s, i) => s + i.quantity, 0);
  const maxItems = selectedBox?.maxItems || 10;
  const itemsPrice = selectedItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const boxPrice = selectedBox?.basePrice || 0;
  const totalPrice = boxPrice + itemsPrice;

  /* ── Item helpers ─────────────────────────────── */
  const addItemToBox = (product) => {
    if (totalItems >= maxItems) return;
    const existing = selectedItems.find((i) => i.product._id === product._id);
    if (existing) {
      setSelectedItems(selectedItems.map((i) =>
        i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { product, quantity: 1 }]);
    }
  };

  const removeItem = (id) => setSelectedItems(selectedItems.filter((i) => i.product._id !== id));

  const updateQty = (id, delta) => {
    setSelectedItems(selectedItems.map((i) => {
      if (i.product._id !== id) return i;
      const nq = i.quantity + delta;
      if (nq <= 0) return null;
      if (totalItems + delta > maxItems && delta > 0) return i;
      return { ...i, quantity: nq };
    }).filter(Boolean));
  };

  /* ── Save to cart using CartContext ────────────── */
  const saveToCart = async () => {
    if (!user) { navigate("/login"); return; }
    setSaving(true);
    try {
      await clearCart();
      for (const item of selectedItems) {
        await addToCart(item.product._id, item.quantity);
      }
      if (selectedBox) {
        await setGiftBox(selectedBox._id);
      }
      setSuccess(true);
    } catch (err) {
      console.error("Failed to save box to cart:", err);
    }
    setSaving(false);
  };

  /* ── Resolve box theme visuals ────────────────── */
  const themeVisuals = BOX_THEME_MAP[selectedBox?.theme] || BOX_THEME_MAP.classic;

  /* ── Success screen ───────────────────────────── */
  if (success) {
    return (
      <div className="page confirmation">
        <div className="confirm-icon">🎁</div>
        <h2>Box Added to Cart!</h2>
        <p>Your custom gift box has been saved.</p>
        <div className="confirm-actions">
          <button className="btn btn-primary" onClick={() => navigate("/cart")}>View Cart</button>
          <button className="btn btn-secondary" onClick={() => { setSuccess(false); setStep(1); setSelectedBox(null); setSelectedCover(null); setSelectedItems([]); }}>Build Another</button>
        </div>
      </div>
    );
  }

  /* helper: icon per box theme */
  const boxIcon = (theme) => {
    const icons = { minimal: "📦", classic: "🎁", luxury: "💎", premium: "👑", fun: "🎈", romantic: "💝" };
    return icons[theme] || "📦";
  };

  const STEPS = [
    { n: 1, label: "Choose Box" },
    { n: 2, label: "Choose Cover" },
    { n: 3, label: "Add Items" },
    { n: 4, label: "Preview" },
  ];

  return (
    <div className="page box-builder-page">
      <div className="page-header">
        <h2>🎁 Custom Gift Box Builder</h2>
        <p className="page-subtitle">Design your perfect gift box in 4 easy steps</p>
      </div>

      {/* ── Steps indicator ─────────────────────── */}
      <div className="steps-indicator">
        {STEPS.map((s, idx) => (
          <div key={s.n} className="step-wrapper">
            {idx > 0 && <div className="step-line" />}
            <div
              className={`step-dot ${step >= s.n ? "active" : ""}`}
              onClick={() => {
                if (s.n === 1) setStep(1);
                else if (s.n === 2 && selectedBox) setStep(2);
                else if (s.n === 3 && selectedCover) setStep(3);
                else if (s.n === 4 && selectedItems.length > 0) setStep(4);
              }}
            >
              <span className="step-num">{s.n}</span>
              <span className="step-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Step 1: Choose Box ──────────────────── */}
      {step === 1 && (
        <div className="builder-section">
          <h3>Select a Box Size &amp; Theme</h3>
          {giftBoxes.length === 0 && <p className="muted">No box types available yet.</p>}
          <div className="box-type-grid">
            {giftBoxes.map((box) => {
              const tv = BOX_THEME_MAP[box.theme] || BOX_THEME_MAP.classic;
              return (
                <div
                  key={box._id}
                  className={`box-type-card ${selectedBox?._id === box._id ? "selected" : ""}`}
                  onClick={() => setSelectedBox(box)}
                >
                  <div className="box-type-swatch" style={{ background: tv.color, borderColor: tv.ribbon }}>
                    <span className="box-type-icon">{boxIcon(box.theme)}</span>
                  </div>
                  <h4>{box.name}</h4>
                  <p className="box-theme">Theme: {box.theme}</p>
                  <p className="box-info">Max {box.maxItems} items</p>
                  <p className="box-price">Base: ${box.basePrice.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
          {selectedBox && (
            <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
              Continue with {selectedBox.name} →
            </button>
          )}
        </div>
      )}

      {/* ── Step 2: Choose Cover ────────────────── */}
      {step === 2 && (
        <div className="builder-section">
          <h3>Choose a Gift Box Cover</h3>
          <p className="muted">Pick a wrapping style for your {selectedBox?.name}</p>
          <div className="cover-grid">
            {COVERS.map((cover) => (
              <div
                key={cover.id}
                className={`cover-card ${selectedCover?.id === cover.id ? "selected" : ""}`}
                onClick={() => setSelectedCover(cover)}
              >
                <div className="cover-preview" style={{ background: cover.bg }}>
                  <span className="cover-emoji">{cover.emoji}</span>
                </div>
                <span className="cover-label">{cover.label}</span>
              </div>
            ))}
          </div>
          <div className="builder-nav-btns" style={{ marginTop: "1.5rem" }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
            {selectedCover && (
              <button className="btn btn-primary" onClick={() => setStep(3)}>
                Continue with {selectedCover.label} →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Step 3: Add Items ───────────────────── */}
      {step === 3 && (
        <div className="builder-section">
          <div className="builder-layout">
            <div className="builder-products">
              <h3>Add Items to Your Box</h3>
              <p className="items-counter">
                {totalItems} / {maxItems} items added
                <span className="items-bar">
                  <span className="items-fill" style={{ width: `${(totalItems / maxItems) * 100}%` }} />
                </span>
              </p>
              <div className="builder-product-grid">
                {products.map((p) => (
                  <div key={p._id} className="builder-product-card">
                    {p.image && <img src={p.image} alt={p.name} className="builder-product-img" />}
                    <div className="builder-product-info">
                      <h4>{p.name}</h4>
                      <p className="builder-product-price">${p.price.toFixed(2)}</p>
                    </div>
                    <button
                      className="btn btn-add-item"
                      onClick={() => addItemToBox(p)}
                      disabled={totalItems >= maxItems}
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="builder-sidebar">
              <div className="builder-summary">
                <h3>Your Box</h3>
                <div className="summary-box-name">
                  {selectedBox?.name}
                  {selectedCover && <span className="summary-cover-tag">{selectedCover.emoji} {selectedCover.label}</span>}
                </div>
                {selectedItems.length === 0 ? (
                  <p className="muted">No items added yet</p>
                ) : (
                  <div className="summary-items">
                    {selectedItems.map((item) => (
                      <div key={item.product._id} className="summary-item">
                        <span className="summary-item-name">{item.product.name}</span>
                        <div className="summary-item-controls">
                          <button className="qty-btn" onClick={() => updateQty(item.product._id, -1)}>−</button>
                          <span className="qty-num">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateQty(item.product._id, 1)} disabled={totalItems >= maxItems}>+</button>
                          <button className="remove-btn" onClick={() => removeItem(item.product._id)}>✕</button>
                        </div>
                        <span className="summary-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="price-breakdown">
                  <div className="price-row"><span>Box ({selectedBox?.name})</span><span>${boxPrice.toFixed(2)}</span></div>
                  <div className="price-row"><span>Items</span><span>${itemsPrice.toFixed(2)}</span></div>
                  <div className="price-row total"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
                </div>
                <div className="builder-nav-btns">
                  <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(4)} disabled={selectedItems.length === 0}>Preview →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Preview ─────────────────────── */}
      {step === 4 && (
        <div className="builder-section">
          <h3>Preview Your Gift Box</h3>
          <div className="preview-layout">
            <div className="preview-3d">
              <BoxScene
                items={selectedItems}
                boxTheme={themeVisuals}
                cover={selectedCover}
              />
            </div>
            <div className="preview-details">
              <div className="preview-box-info">
                <h4>{selectedBox?.name}</h4>
                <p>Theme: {selectedBox?.theme}</p>
                {selectedCover && (
                  <div className="preview-cover-badge" style={{ background: selectedCover.bg }}>
                    <span>{selectedCover.emoji}</span>
                    <span>{selectedCover.label}</span>
                  </div>
                )}
              </div>
              <div className="preview-items-list">
                <h4>Items ({totalItems})</h4>
                {selectedItems.map((item) => (
                  <div key={item.product._id} className="preview-item">
                    <span>{item.product.name} ×{item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="price-breakdown">
                <div className="price-row"><span>Box</span><span>${boxPrice.toFixed(2)}</span></div>
                <div className="price-row"><span>Items</span><span>${itemsPrice.toFixed(2)}</span></div>
                <div className="price-row total"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
              </div>
              <div className="builder-nav-btns">
                <button className="btn btn-secondary" onClick={() => setStep(3)}>← Edit Items</button>
                <button className="btn btn-primary btn-lg" onClick={saveToCart} disabled={saving}>
                  {saving ? "Saving..." : "🛒 Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
