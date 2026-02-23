import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">🎁 Gifty</div>
            <p>The premium gift box platform. Curated gifts for every occasion, beautifully boxed and delivered with love.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/products">All Gifts</Link>
            <Link to="/products">Graduation</Link>
            <Link to="/products">Wedding</Link>
            <Link to="/products">Birthday</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Shipping Info</a>
            <a href="#">Returns</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
