import { useState } from "react";
import "../assets/registration.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import seatLogo from  "../assets/logo.png";

const SeatLogo = () => (
 <img 
    src={seatLogo} 
    alt="Seat Allocate Logo" 
    className="reg-logo-img"
  />
);

export default function Registration() {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", otp: "", password: ""
  });
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSendOtp = async () => {
  if (!form.email) return;

  try {
    setSending(true);

    await axios.post("https://seat-allotment-production.up.railway.app/api/auth/send-otp", {
      email: form.email
    });

    setOtpSent(true);
    alert("OTP sent successfully!");

  } catch (error) {
    alert(error.response?.data?.message || "Error sending OTP");
  } finally {
    setSending(false);
  }
};

 const handleVerifyOtp = async () => {
  if (form.otp.length !== 6) {
    alert("Enter 6 digit OTP");
    return;
  }

  try {
    await axios.post("https://seat-allotment-production.up.railway.app/api/auth/verify-otp", {
      email: form.email,
      otp: form.otp
    });

    setOtpVerified(true);
    alert("OTP Verified Successfully!");

  } catch (error) {
    alert(error.response?.data?.message || "Invalid OTP");
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!otpVerified) {
    alert("Please verify OTP first");
    return;
  }

  try {
    await axios.post("https://seat-allotment-production.up.railway.app/api/auth/register", {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password
    });

    alert("Registration submitted successfully!");
    navigate("/");
  } catch (error) {
    alert(error.response?.data?.message || "Registration failed");
  }
};
  return (
    <div className="reg-root">
      {/* Background decoration */}
      <div className="reg-bg-shape reg-bg-shape--1" />
      <div className="reg-bg-shape reg-bg-shape--2" />
      <div className="reg-bg-shape reg-bg-shape--3" />

      <div className="reg-card">
        {/* Logo */}
        <div className="reg-logo-wrap">
          <SeatLogo />
        </div>

        <div className="reg-header">
          <h1 className="reg-title">Create Account</h1>
          <p className="reg-subtitle">Register to access the seat allocation portal</p>
        </div>

        <form className="reg-form" onSubmit={handleSubmit} noValidate>
          {/* Name Row */}
          <div className="reg-row">
            <div className="reg-field-group">
              <label className="reg-label" htmlFor="firstName">First Name</label>
              <input
                className="reg-input reg-input--firstname"
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="reg-field-group">
              <label className="reg-label" htmlFor="lastName">Last Name</label>
              <input
                className="reg-input reg-input--lastname"
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email + OTP Button */}
          <div className="reg-field-group">
            <label className="reg-label" htmlFor="email">Email Address</label>
            <div className="reg-email-row">
              <input
                className="reg-input reg-input--email"
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={`reg-otp-send-btn ${otpSent ? "reg-otp-send-btn--sent" : ""}`}
                onClick={handleSendOtp}
                disabled={otpSent || sending}
              >
                {sending ? (
                  <span className="reg-spinner" />
                ) : otpSent ? (
                  "✓ Sent"
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>

          {/* OTP Field — slides in when sent */}
          <div className={`reg-otp-section ${otpSent ? "reg-otp-section--visible" : ""}`}>
            <div className="reg-field-group">
              <label className="reg-label reg-label--otp" htmlFor="otp">
                Enter OTP
                <span className="reg-otp-hint">Check your inbox for a 6-digit code</span>
              </label>
              <div className="reg-otp-verify-row">
                <input
                  className="reg-input reg-input--otp"
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="• • • • • •"
                  maxLength={6}
                  value={form.otp}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={`reg-verify-btn ${otpVerified ? "reg-verify-btn--verified" : ""}`}
                  onClick={handleVerifyOtp}
                  disabled={otpVerified}
                >
                  {otpVerified ? "✓ Verified" : "Verify"}
                </button>
              </div>
              {otpVerified && (
                <p className="reg-verified-msg">✅ Email verified successfully</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="reg-field-group">
            <label className="reg-label" htmlFor="password">Password</label>
            <input
              className="reg-input reg-input--password"
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <div className="reg-pw-strength">
              <div className={`reg-pw-bar ${form.password.length > 0 ? "reg-pw-bar--weak" : ""}`} />
              <div className={`reg-pw-bar ${form.password.length >= 6 ? "reg-pw-bar--medium" : ""}`} />
              <div className={`reg-pw-bar ${form.password.length >= 10 ? "reg-pw-bar--strong" : ""}`} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="reg-submit-btn">
            <span className="reg-submit-btn__text">Register Account</span>
            <span className="reg-submit-btn__icon">→</span>
          </button>

          <p className="reg-login-link">
            Already have an account? <a href="/" className="reg-login-anchor">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );

}
