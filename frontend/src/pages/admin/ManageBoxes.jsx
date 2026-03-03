import { useEffect, useState } from "react";
import API from "../../api/axios";
import { AdminShell } from "./Dashboard";

export default function ManageBoxes() {
  const [boxes, setBoxes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", theme: "", maxItems: "", basePrice: "", image: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const load = () => API.get("/giftboxes").then((res) => setBoxes(res.data)).catch(() => flash("Failed to load box types", "error"));
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { flash("Box name is required", "error"); return; }
    if (!form.maxItems || Number(form.maxItems) < 1) { flash("Max items must be at least 1", "error"); return; }
    const data = { ...form, maxItems: Number(form.maxItems), basePrice: Number(form.basePrice) || 0 };
    try {
      if (editId) {
        await API.put(`/giftboxes/${editId}`, data);
        flash("Box type updated successfully");
      } else {
        await API.post("/giftboxes", data);
        flash("Box type created successfully");
      }
      setForm({ name: "", theme: "", maxItems: "", basePrice: "", image: "" });
      setEditId(null);
      load();
    } catch (err) {
      flash(err.response?.data?.error || "Failed to save box type", "error");
    }
  };

  const startEdit = (box) => {
    setEditId(box._id);
    setForm({ name: box.name, theme: box.theme, maxItems: box.maxItems, basePrice: box.basePrice, image: box.image || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this box type?")) {
      try {
        await API.delete(`/giftboxes/${id}`);
        flash("Box type deleted");
        load();
      } catch (err) {
        flash(err.response?.data?.error || "Delete failed", "error");
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ name: "", theme: "", maxItems: "", basePrice: "", image: "" });
  };

  return (
    <AdminShell title="Box Types" subtitle="Add and configure gift box sizes and themes">
      {msg.text && <div className={`adm-flash adm-flash--${msg.type}`}>{msg.text}</div>}
      {/* Form */}
      <section className="adm-card">
        <h3 className="adm-card-title">{editId ? "Edit Box Type" : "Add New Box Type"}</h3>
        <form onSubmit={handleSubmit} className="adm-form">
          <div className="adm-form-row">
            <div className="adm-field">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Premium Box" />
            </div>
            <div className="adm-field">
              <label>Theme</label>
              <input name="theme" value={form.theme} onChange={handleChange} required placeholder="e.g. luxury, classic" />
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-field">
              <label>Max Items</label>
              <input name="maxItems" type="number" min="1" value={form.maxItems} onChange={handleChange} required placeholder="1" />
            </div>
            <div className="adm-field">
              <label>Base Price ($)</label>
              <input name="basePrice" type="number" step="0.01" min="0" value={form.basePrice} onChange={handleChange} required placeholder="0.00" />
            </div>
          </div>
          <div className="adm-field">
            <label>Image URL (optional)</label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="adm-form-actions">
            <button type="submit" className="adm-btn adm-btn--primary">{editId ? "Update Box" : "Add Box Type"}</button>
            {editId && <button type="button" className="adm-btn adm-btn--ghost" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </section>

      {/* Table */}
      <section className="adm-card">
        <h3 className="adm-card-title">All Box Types ({boxes.length})</h3>
        {boxes.length === 0 ? (
          <p className="muted">No box types added yet.</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Name</th><th>Theme</th><th>Max Items</th><th>Base Price</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {boxes.map((box) => (
                  <tr key={box._id}>
                    <td className="adm-cell-bold">{box.name}</td>
                    <td>{box.theme}</td>
                    <td>{box.maxItems}</td>
                    <td className="adm-money">${box.basePrice.toFixed(2)}</td>
                    <td className="adm-actions-cell">
                      <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => startEdit(box)}>Edit</button>
                      <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => handleDelete(box._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
