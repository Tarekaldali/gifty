import { useEffect, useState } from "react";
import API from "../api/axios";

const STATUS_COLORS = {
  pending:    "#f59e0b",
  preparing:  "#3b82f6",
  shipped:    "#8b5cf6",
  delivered:  "#10b981",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="page">
      <h2>My Orders</h2>
      {orders.length === 0 && <p className="muted">No orders yet.</p>}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span>Order #{order._id.slice(-6)}</span>
              <span
                className="status-badge"
                style={{ background: STATUS_COLORS[order.status] }}
              >
                {order.status}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, i) => (
                <span key={i} className="order-item-name">
                  {item.name} ×{item.quantity}
                </span>
              ))}
            </div>

            <div className="order-footer">
              <strong>${order.totalPrice.toFixed(2)}</strong>
              <span className="muted">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
