import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/login.css";
import seatLogo from "../assets/logo.png";

const SeatLogo = () => (
  <img src={seatLogo} alt="Seat Allocate Logo" className="reg-logo-img" />
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 Send OTP
  const sendOtp = async () => {
    try {
      setLoading(true);
      await axios.post("https://seat-allotment.onrender.com/api/auth/send-otp", { email });
      alert("OTP sent to your email");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);
      await axios.post("https://seat-allotment.onrender.com/api/auth/verify-otp", {
        email,
        otp,
      });
      alert("OTP verified");
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reset Password
  const resetPassword = async () => {
    try {
      setLoading(true);
      await axios.post("https://seat-allotment.onrender.com/api/auth/resetPassword", {
        email,
        newPassword: password,
      });

      alert("Password updated successfully");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-logo-wrap">
          <div className="login-logo-placeholder">
            <SeatLogo />
          </div>
        </div>

        <h2 className="login-title">Forgot Password</h2>

        <div className="login-form">

          {/* STEP 1 - EMAIL */}
          {step === 1 && (
            <>
              <div className="login-field-group">
                <label>Email</label>
                <input
                  type="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                className="login-submit-btn"
                onClick={sendOtp}
                disabled={loading}
              >
                Send OTP
              </button>
            </>
          )}

          {/* STEP 2 - OTP */}
          {step === 2 && (
            <>
              <div className="login-field-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  className="login-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button
                className="login-submit-btn"
                onClick={verifyOtp}
                disabled={loading}
              >
                Verify OTP
              </button>
            </>
          )}

          {/* STEP 3 - NEW PASSWORD */}
          {step === 3 && (
            <>
              <div className="login-field-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="login-submit-btn"
                onClick={resetPassword}
                disabled={loading}
              >
                Reset Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}