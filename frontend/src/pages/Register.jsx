import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const { register } = useAuth();
  const navigate      = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <div className="auth-icon">🎁</div>
        <h2>Join Gifty</h2>
        <p className="auth-subtitle">Create your account and start gifting</p>
        {error && <p className="msg error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text" placeholder="Your name"
            value={name} onChange={(e) => setName(e.target.value)} required
          />
          <input
            type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <input
            type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} required
          />
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <p className="toggle">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
