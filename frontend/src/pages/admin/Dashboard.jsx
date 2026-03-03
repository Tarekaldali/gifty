import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../../api/axios";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/boxes", label: "Box Types" },
  { to: "/admin/ready-boxes", label: "Ready Boxes" },
  { to: "/admin/orders", label: "Orders" },
];

export function AdminShell({ children, title, subtitle }) {
  const location = useLocation();
  return (
    <div className="adm">
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <span className="adm-brand-mark">G</span>
          <span className="adm-brand-text">Gifty Admin</span>
        </div>
        <nav className="adm-nav">
          {NAV_ITEMS.map((n) => {
            const active = n.exact
              ? location.pathname === n.to
              : location.pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`adm-nav-link${active ? " active" : ""}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/" className="adm-back-link">Back to Store</Link>
      </aside>
      <div className="adm-main">
        <header className="adm-header">
          <div>
            <h1 className="adm-title">{title}</h1>
            {subtitle && <p className="adm-subtitle">{subtitle}</p>}
          </div>
        </header>
        <div className="adm-content">{children}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AdminShell title="Dashboard" subtitle="Loading...">
        <p className="muted">Loading dashboard data...</p>
      </AdminShell>
    );

  return (
    <AdminShell title="Dashboard" subtitle="Overview of your Gifty store">
      {/* KPI Cards */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi">
          <span className="adm-kpi-label">Total Users</span>
          <span className="adm-kpi-value">{stats?.totalUsers || 0}</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi-label">Total Orders</span>
          <span className="adm-kpi-value">{stats?.totalOrders || 0}</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi-label">Revenue</span>
          <span className="adm-kpi-value">${(stats?.totalRevenue || 0).toFixed(2)}</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi-label">Products</span>
          <span className="adm-kpi-value">{stats?.totalProducts || 0} ({stats?.activeProducts || 0} active)</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi-label">Ready Boxes</span>
          <span className="adm-kpi-value">{stats?.totalReadyBoxes || 0} ({stats?.activeReadyBoxes || 0} active)</span>
        </div>
        <div className="adm-kpi">
          <span className="adm-kpi-label">Box Types</span>
          <span className="adm-kpi-value">{stats?.totalGiftBoxes || 0}</span>
        </div>
      </div>

      <div className="adm-grid-2">
        {/* Order Status */}
        {stats?.statusCounts && (
          <section className="adm-card">
            <h3 className="adm-card-title">Order Status</h3>
            <div className="adm-status-chips">
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className={`adm-chip adm-chip--${status}`}>
                  <span className="adm-chip-count">{count}</span>
                  <span className="adm-chip-label">{status}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Links */}
        <section className="adm-card">
          <h3 className="adm-card-title">Quick Actions</h3>
          <div className="adm-quick-actions">
            <Link to="/admin/products" className="adm-action-btn">Manage Products</Link>
            <Link to="/admin/boxes" className="adm-action-btn">Manage Box Types</Link>
            <Link to="/admin/ready-boxes" className="adm-action-btn">Ready Gift Boxes</Link>
            <Link to="/admin/orders" className="adm-action-btn">Manage Orders</Link>
          </div>
        </section>
      </div>

      {/* Low Stock */}
      {stats?.lowStock?.length > 0 && (
        <section className="adm-card">
          <h3 className="adm-card-title">Low Stock Alert</h3>
          <table className="adm-table">
            <thead>
              <tr><th>Product</th><th>Status</th></tr>
            </thead>
            <tbody>
              {stats.lowStock.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>
                    <span className={`adm-badge ${item.stock === 0 ? "adm-badge--danger" : "adm-badge--warning"}`}>
                      {item.stock === 0 ? "Out of Stock" : `${item.stock} left`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Best Sellers */}
      {stats?.mostSold?.length > 0 && (
        <section className="adm-card">
          <h3 className="adm-card-title">Best Sellers</h3>
          <table className="adm-table">
            <thead>
              <tr><th>#</th><th>Product</th><th>Sold</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {stats.mostSold.map((item, i) => (
                <tr key={i}>
                  <td className="adm-rank">{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.totalSold}</td>
                  <td className="adm-money">${item.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </AdminShell>
  );
}
