import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["all", "graduation", "wedding", "birthday", "general"];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch]     = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy]     = useState("newest");

  useEffect(() => {
    const params = {};
    if (category !== "all") params.category = category;
    if (search) params.search = search;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    API.get("/products", { params })
      .then((res) => {
        let data = res.data;
        if (sortBy === "price-low") data.sort((a, b) => a.price - b.price);
        if (sortBy === "price-high") data.sort((a, b) => b.price - a.price);
        if (sortBy === "name") data.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(data);
      })
      .catch(() => {});
  }, [category, search, minPrice, maxPrice, sortBy]);

  return (
    <div className="page products-page">
      <div className="page-header">
        <h2>Shop Gifts</h2>
        <p className="page-subtitle">Find the perfect gift for every occasion</p>
      </div>

      {/* ── Filters ──────────────────────────────────── */}
      <div className="filters">
        <div className="filters-top">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search gifts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <div className="category-btns">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`cat-btn ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        <div className="price-filter">
          <span className="price-label">💰 Price:</span>
          <input type="number" placeholder="Min $" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="price-input" min="0" />
          <span className="price-dash">—</span>
          <input type="number" placeholder="Max $" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="price-input" min="0" />
          {(minPrice || maxPrice) && (
            <button className="price-clear" onClick={() => { setMinPrice(""); setMaxPrice(""); }}>✕</button>
          )}
        </div>
      </div>

      <div className="results-info">
        <span>{products.length} product{products.length !== 1 ? "s" : ""} found</span>
      </div>

      {/* ── Grid ─────────────────────────────────────── */}
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      {products.length === 0 && <p className="muted center">No products found matching your filters.</p>}
    </div>
  );
}
