import React, { useState } from "react";
import "./Login.css";
import logo from "../components/assets/Company_logo.png";
import x_logo from "../components/assets/Dark Logo.png";
import { FaEnvelope, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { message as antdMessage, Modal, Button, Input } from "antd";
import Loading from "../utils/Loading";
import { userService } from "../ims/services/Userservice";
import { setAuthData } from "../ims/services/auth";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isMobileLogin, setIsMobileLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Forgot Password
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmailOrMobile, setForgotEmailOrMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: enter email/phone, 2: verify OTP, 3: reset password

  // Validators
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobile = (mobile) => /^\d{10}$/.test(mobile);

  // Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if ((!email && !isMobileLogin) || (!mobile && isMobileLogin) || !password) {
      setLoginError("Please fill all required fields.");
      return;
    }

    const payload = {
      identifier: isMobileLogin ? mobile.trim() : email.trim(),
      password,
    };

    try {
      setLoading(true);
      const response = await userService.login(payload);
      if (response.data?.message === "Login successful") {
        antdMessage.success("Login successful!");
        setAuthData(response.data);
        navigate("/hrms/pages/dashboard");
      } else {
        setLoginError(response.data?.message || "Invalid credentials!");
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleLoginMode = () => {
    setIsMobileLogin(!isMobileLogin);
    setEmail("");
    setMobile("");
    setLoginError("");
  };

  // Forgot Password Flow
  const handleForgotNext = async () => {
    try {
      if (step === 1) {
        if (!forgotEmailOrMobile) throw new Error("Enter email or mobile.");
        await userService.forgetPassword({
          identifier: forgotEmailOrMobile.trim(),
        });
        antdMessage.success("OTP sent successfully!");
        setStep(2);
      } else if (step === 2) {
        if (!otp) throw new Error("Enter OTP.");
        await userService.verifyOTP({
          identifier: forgotEmailOrMobile.trim(),
          otp,
        });
        antdMessage.success("OTP verified!");
        setStep(3);
      } else if (step === 3) {
        if (!newPassword) throw new Error("Enter new password.");
        await userService.resetPassword({
          identifier: forgotEmailOrMobile.trim(),
          password: newPassword,
        });
        antdMessage.success("Password reset successfully!");
        setForgotModalVisible(false);
        setStep(1);
      }
    } catch (error) {
      antdMessage.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="login-container">
      {/* Left */}
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

      {/* Right */}
      <div className="login-right">
        <img src={logo} alt="Company Logo" className="logo" />
        <form className="login-form" onSubmit={handleSubmit}>
          <h3>LOGIN TO YOUR ACCOUNT</h3>

          {loginError && (
            <div className="login-error-message" style={{ marginBottom: "1rem" }}>
              {loginError}
            </div>
          )}

          {/* Email/Mobile */}
          <div className={`form-group ${isMobileLogin ? "mobile" : "email"} mb-4`}>
            <div className="input-wrapper">
              {isMobileLogin ? (
                <>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    maxLength={10}
                    className={mobile ? "filled" : ""}
                  />
                  <label>Mobile Number</label>
                  <FaEnvelope
                    className="input-icon toggle-icon"
                    onClick={toggleLoginMode}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={email ? "filled" : ""}
                  />
                  <label>Email</label>
                  <FaPhone
                    className="input-icon toggle-icon"
                    onClick={toggleLoginMode}
                  />
                </>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="form-group password mb-4">
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={password ? "filled" : ""}
              />
              <label>Password</label>
              {showPassword ? (
                <FaEyeSlash className="input-icon toggle-icon" onClick={togglePasswordVisibility} />
              ) : (
                <FaEye className="input-icon toggle-icon" onClick={togglePasswordVisibility} />
              )}
            </div>
          </div>

          <button type="submit" className="log-button" disabled={loading}>
            {loading ? <Loading /> : "LOGIN"}
          </button>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <span style={{ cursor: "pointer", color: "#3d2c8bff", fontWeight: "bold" }}
              onClick={() => setForgotModalVisible(true)}>
              Forgot Password?
            </span>
            <br />
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

      {/* Forgot Password Modal */}
      <Modal
        open={forgotModalVisible}
        footer={null}
        centered
        closable={false}
        title="Forgot Password"
      >
        {step === 1 && (
          <Input
            placeholder="Enter Email or Mobile"
            value={forgotEmailOrMobile}
            onChange={(e) => setForgotEmailOrMobile(e.target.value)}
          />
        )}
        {step === 2 && (
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}
        {step === 3 && (
          <Input.Password
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        )}

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Button type="primary" onClick={handleForgotNext}>
            {step === 3 ? "Reset Password" : "Next"}
          </Button>
          <Button style={{ marginLeft: "10px" }} onClick={() => {
            setForgotModalVisible(false);
            setStep(1);
          }}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
