import React, { useState, useEffect } from "react";
import BoxScene, { SafeModel } from "../3d/BoxScene";
import API from "../api/axios";
import { Canvas } from "@react-three/fiber";
import { Center, ContactShadows, Environment } from "@react-three/drei";

// small reusable preview component for slider
function PreviewModel({ data, angle = 0 }) {
  if (!data || !data.modelPath) return null;
  const rad = (angle * Math.PI) / 180;
  const xPos = Math.sin(rad) * 0.5; // slide back and forth
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Center>
        <group rotation={[0, rad, 0]} position={[xPos, 0, 0]}>
          <SafeModel path={data.modelPath} scale={data.scale} position={[0, 0, 0]} />
        </group>
      </Center>
      <ContactShadows position={[0, -1, 0]} opacity={0.5} blur={2} scale={5} />
      <Environment preset="studio" />
    </Canvas>
  );
}

// NOTE: we will load real box types from the server instead of hardcoded catalog
  // CATALOG remains for default/fallback (not used when boxes state is populated)
  const CATALOG = {
    boxes: [
      { id: "b1", name: "Gift Box Large", color: "#d4a574", size: [4, 2, 4] }
    ],
  };

export default function BoxBuilder() {
  const [itemsInScene, setItemsInScene] = useState([]);
  const [activeBox, setActiveBox] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [giftboxes, setGiftboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  // preview state for sidebar
  const [previewItem, setPreviewItem] = useState(null);
  const [previewAngle, setPreviewAngle] = useState(0);

  useEffect(() => {
    setPreviewAngle(0);
  }, [previewItem]);

  // Fetch products from API
  useEffect(() => {
    API.get("/products")
      .then((res) => {
        console.log("Products fetched:", res.data);
        const productsWithScale = res.data.map((p) => ({
          ...p,
          modelPath: p.modelPath || "",
          scale: p.scale || 0.05,
        }));
        setProducts(productsWithScale);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));

    // also load gift box types
    API.get("/giftboxes")
      .then((res) => {
        console.log("Gift boxes fetched:", res.data);
        const withScale = res.data.map((b) => ({
          ...b,
          modelPath: b.modelPath || "",
          scale: b.scale || 0.05,
          // provide default size/color so dragging still works when model is missing
          size: b.size || [4, 2, 4],
          color: b.color || "#d4a574",
        }));
        setGiftboxes(withScale);
      })
      .catch((err) => {
        console.error("Failed to load gift boxes:", err);
        setGiftboxes([]);
      });
  }, []);

  const startDragging = (item, isBox = false) => {
    if (!isBox && !item.modelPath) {
      console.warn("product has no modelPath, cannot drag", item);
      return;
    }
    setDraggedItem({ ...item, instanceId: Date.now(), isBox });
  };

  // grab an existing item/box from the scene so it can be moved
  const grabExisting = (item) => {
    if (item.isBox) {
      // remove current box from scene
      setActiveBox(null);
    } else {
      setItemsInScene((prev) => prev.filter((it) => it.instanceId !== item.instanceId));
    }
    // prepare draggedItem (retain same instanceId so we don't create duplicates)
    setDraggedItem(item);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#111", color: "#eee", overflow: "hidden" }}>
      <div style={{ width: "280px", background: "#1a1a1a", padding: "20px", borderRight: "2px solid #333", zIndex: 10 }}>
        <h2 style={{ color: "#e74c3c" }}>Gift Studio</h2>
        
        <p style={{ color: "#888", fontSize: "0.8rem" }}>1. Drag the Box first</p>
        {(giftboxes.length > 0 ? giftboxes : CATALOG.boxes).map(b => (
          <div 
            key={b._id || b.id} 
            onMouseDown={() => startDragging(b, true)}
            style={{ padding: "15px", background: "#333", marginBottom: "10px", cursor: "grab", borderRadius: "8px", border: activeBox ? "1px solid #27ae60" : "1px dashed #e74c3c" }}
          >
            📦 {b.name}
          </div>
        ))}

        {/* slider-driven preview for highlighted product */}
        {previewItem && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <strong style={{ color: "#eee" }}>Preview: {previewItem.name}</strong>
            <div style={{ height: "120px" }}>
              <PreviewModel data={previewItem} angle={previewAngle} />
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={previewAngle}
              onChange={(e) => setPreviewAngle(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        )}

        <p style={{ color: "#888", fontSize: "0.8rem", marginTop: "20px" }}>2. Add items into it</p>
        {loading ? (
          <p style={{ color: "#666" }}>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{ color: "#666" }}>No products available</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {products.map(p => (
              <div 
                key={p._id} 
                onMouseDown={() => startDragging(p)}
                onMouseEnter={() => setPreviewItem(p)}
                onMouseLeave={() => setPreviewItem(null)}
                style={{ padding: "10px", background: "#222", cursor: "grab", borderRadius: "8px", textAlign: "center", border: "1px solid #444" }}
              >
                <div style={{ width: "100%", height: "30px", background: "#e74c3c", borderRadius: "4px", marginBottom: "5px" }} />
                <small>{p.name}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, cursor: draggedItem ? "grabbing" : "default" }}>
        <BoxScene 
          activeBox={activeBox} 
          setActiveBox={setActiveBox}
          items={itemsInScene} 
          setItemsInScene={setItemsInScene}
          draggedItem={draggedItem} 
          setDraggedItem={setDraggedItem}
          onGrab={grabExisting}
        />
      </div>
    </div>
  );
}