import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter new password
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setResetToken(res.data.resetToken);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
    setLoading(false);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { resetToken, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="page auth-page">
        <div className="auth-card">
          <div className="auth-icon">✅</div>
          <h2>Password Reset!</h2>
          <p className="auth-subtitle">Your password has been updated successfully.</p>
          <Link to="/login" className="btn btn-primary">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <div className="auth-icon">🔑</div>
        <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
        <p className="auth-subtitle">
          {step === 1
            ? "Enter your email and we'll help you reset your password"
            : "Enter your new password below"}
        </p>
        {error && <p className="msg error">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit}>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        <p className="toggle">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
