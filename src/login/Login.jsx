import React, { useState } from "react";
import "./Login.css";
import logo from "../components/assets/Company_logo.png";
import x_logo from "../components/assets/Dark Logo.png";
import { FaEnvelope, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { message as antdMessage, Modal, Button } from "antd";
import Loading from "../utils/Loading";
import { userService } from "../ims/services/Userservice";
import { setAuthData } from "../ims/services/auth"; 

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isMobileLogin, setIsMobileLogin] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  // 🧠 Validators
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobile = (mobile) => /^\d{10}$/.test(mobile);

  // 🧩 Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setMobileError("");
    setPasswordError("");
    setLoginError("");

    let hasError = false;

    if (isMobileLogin) {
      if (!mobile.trim()) {
        setMobileError("Mobile number is required");
        hasError = true;
      } else if (!isValidMobile(mobile)) {
        setMobileError("Please enter a valid 10-digit mobile number");
        hasError = true;
      }
    } else {
      if (!email.trim()) {
        setEmailError("Email is required");
        hasError = true;
      } else if (!isValidEmail(email)) {
        setEmailError("Please enter a valid email address");
        hasError = true;
      }
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      // ✅ FIXED PAYLOAD — backend expects `identifier`
      const payload = {
        identifier: isMobileLogin ? mobile.trim() : email.trim(),
        password,
      };

      console.log("📦 Login payload:", payload);

      const response = await userService.login(payload);
      console.log("✅ Login API Response:", response.data);

      if (response.data?.message === "Login successful") {
        antdMessage.success({
          content: "Login successful!",
          duration: 3,
        });

        // ✅ Use auth helper
        setAuthData(response.data);

        navigate("/hrms/pages/dashboard");
      } else {
        throw new Error(response.data?.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("❌ Login API Error:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      setLoginError(errorMessage);
      setShowRegisterPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleLoginMode = () => {
    setIsMobileLogin(!isMobileLogin);
    setEmail("");
    setMobile("");
    setEmailError("");
    setMobileError("");
    setLoginError("");
  };

  return (
    <>
      <div className="login-container">
        {/* Left side */}
        <div className="login-left">
          <div className="welcome-container">
            <h3 className="welcome-heading">
              Welcome to &nbsp;
              <img src={x_logo} alt="XTOWN" />
              town..!
            </h3>
            <span className="welcome-tagline">
              We’re here to turn your ideas into reality.
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="login-right">
          <img src={logo} alt="Company Logo" className="logo" />

          <form className="login-form" onSubmit={handleSubmit}>
            <h3>LOGIN TO YOUR ACCOUNT</h3>

            {loginError && (
              <div
                className="login-error-message"
                style={{ marginBottom: "1rem", textAlign: "center" }}
              >
                {loginError}
              </div>
            )}

            {/* Email or Mobile */}
            <div
              className={`form-group ${isMobileLogin ? "mobile" : "email"} ${
                (isMobileLogin && mobileError) ||
                (!isMobileLogin && emailError)
                  ? "error-border"
                  : ""
              } mb-4`}
            >
              <div className="input-wrapper">
                {isMobileLogin ? (
                  <>
                    <input
                      id="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className={mobile ? "filled" : ""}
                      maxLength={10}
                      style={{
                        borderColor: mobileError ? "red" : "#ccc",
                        boxShadow: mobileError
                          ? "0 0 4px rgba(255, 0, 0, 0.5)"
                          : "none",
                      }}
                    />
                    <label htmlFor="mobile">Mobile Number</label>
                    <FaEnvelope
                      className="input-icon toggle-icon"
                      onClick={toggleLoginMode}
                      title="Use Email instead"
                    />
                  </>
                ) : (
                  <>
                    <input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={email ? "filled" : ""}
                      style={{
                        borderColor: emailError ? "red" : "#ccc",
                        boxShadow: emailError
                          ? "0 0 4px rgba(255, 0, 0, 0.5)"
                          : "none",
                      }}
                    />
                    <label htmlFor="email">Email</label>
                    <FaPhone
                      className="input-icon toggle-icon"
                      onClick={toggleLoginMode}
                      title="Use Mobile Number instead"
                    />
                  </>
                )}
              </div>
              {isMobileLogin && mobileError && (
                <div className="login-error-message">{mobileError}</div>
              )}
              {!isMobileLogin && emailError && (
                <div className="login-error-message">{emailError}</div>
              )}
            </div>

            {/* Password */}
            <div
              className={`form-group password ${
                passwordError ? "error-border" : ""
              }`}
            >
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={password ? "filled" : ""}
                  style={{
                    borderColor: passwordError ? "red" : "#ccc",
                    boxShadow: passwordError
                      ? "0 0 4px rgba(255, 0, 0, 0.5)"
                      : "none",
                  }}
                />
                <label htmlFor="password">Password</label>
                {showPassword ? (
                  <FaEyeSlash
                    className="input-icon toggle-icon"
                    onClick={togglePasswordVisibility}
                    title="Hide Password"
                  />
                ) : (
                  <FaEye
                    className="input-icon toggle-icon"
                    onClick={togglePasswordVisibility}
                    title="Show Password"
                  />
                )}
              </div>
              {passwordError && (
                <div className="login-error-message">{passwordError}</div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="log-button" disabled={loading}>
              {loading ? <Loading /> : "LOGIN"}
            </button>

            {/* Register link */}
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <span>Don't have an account?</span>
              <span
                style={{
                  color: "#3d2c8bff",
                  fontWeight: "bold",
                  marginLeft: "4px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/register")}
              >
                Register here
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* 🎨 Custom Styled Popup */}
      <Modal
        open={showRegisterPopup}
        footer={null}
        centered
        closable={false}
        className="custom-popup"
      >
        <div
          style={{
            textAlign: "center",
            padding: "30px 20px",
            borderRadius: "16px",
          }}
        >
          <h2 style={{ color: "#333", marginBottom: "10px" }}>
            User Not Found 😕
          </h2>
          <p style={{ color: "#666", marginBottom: "25px", fontSize: "15px" }}>
            We couldn't find an account with those credentials.
            <br />
            Would you like to register a new one?
          </p>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button
              type="primary"
              style={{
                background: "#3d2c8b",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
              onClick={() => {
                setShowRegisterPopup(false);
                navigate("/register");
              }}
            >
              Register Now
            </Button>
            <Button
              style={{
                borderRadius: "8px",
                fontWeight: "bold",
              }}
              onClick={() => setShowRegisterPopup(false)}
            >
              Try Again
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Login;
