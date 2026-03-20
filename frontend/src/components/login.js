import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/login.css";
import seatLogo from "../assets/logo.png";

const SeatLogo = () => (
  <img 
    src={seatLogo} 
    alt="Seat Allocate Logo" 
    className="reg-logo-img"
  />
);

const roles = [
  { value: "", label: "Select your role" },
  { value: "admin", label: "Administrator" },
  { value: "student", label: "Student" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // ✅ already correct

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !role || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://seat-allotment-production.up.railway.app/api/auth/login",
        {
          email,
          password,
          role,
        }
      );

      setSuccess("Login successful!");

      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "student") {
        navigate("/collegecutoffsearch");
      } else if (res.data.user.role === "admin") {
        navigate("/addcollegecutoff");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg-shape login-bg-shape--1" />
      <div className="login-bg-shape login-bg-shape--2" />
      <div className="login-bg-shape login-bg-shape--3" />

      <div className="login-card">
        <div className="login-logo-wrap">
          <div className="login-logo-placeholder">
            <SeatLogo />
          </div>
        </div>

        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">
            Sign in to continue to your account
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div className="login-field-group">
            <label className="login-label">Email Address</label>
            <input
              className="login-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="login-field-group">
            <label className="login-label">Role</label>
            <select
              className="login-role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value} disabled={r.value === ""}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="login-field-group">
            <label className="login-label">Password</label>
            <div className="login-password-wrap">
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="login-pw-toggle"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* ✅ FIXED Forgot Password */}
          <div className="login-forgot">
            <span
              onClick={() => navigate("/forgotpassword")}
              className="login-forgot-link"
              style={{ cursor: "pointer" }}
            >
              Forgot password?
            </span>
          </div>

          {/* Messages */}
          {error && <p className="login-error-msg">⚠️ {error}</p>}
          {success && <p className="login-success-msg">✅ {success}</p>}

          {/* Submit */}
          <button className="login-submit-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              <>
                <span className="login-submit-btn__text">Sign In</span>
                <span className="login-submit-btn__icon">→</span>
              </>
            )}
          </button>

          {/* ✅ FIXED Create Account */}
          <p className="login-login-link">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="login-login-anchor"
              style={{ cursor: "pointer" }}
            >
              Create one
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
