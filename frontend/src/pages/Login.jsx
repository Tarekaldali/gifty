import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const { login } = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <div className="auth-icon">👋</div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your Gifty account</p>
        {error && <p className="msg error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <input
            type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} required
          />
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p className="toggle forgot-link">
          <Link to="/forgot-password">Forgot your password?</Link>
        </p>
        <p className="toggle">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
