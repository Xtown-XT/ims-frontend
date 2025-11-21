import React, { useState } from "react";
import "./Login.css";
import logo from "../components/assets/Company_logo.png";
import x_logo from "../components/assets/Dark Logo.png";
import { FaEnvelope, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { message as antdMessage, Modal, Button, Input } from "antd";
import Loading from "../utils/Loading";
import { setAuthData } from "../ims/services/auth";

import { userService } from "../ims/services/Userservice";
import { employeeService } from "../ims/pages/usermanagement/employeeService";

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
  const [step, setStep] = useState(1);

  // ---------------- LOGIN FUNCTION ----------------
  const handleSubmit = async (roleType) => {
    setLoginError("");

    const identifier = isMobileLogin ? mobile.trim() : email.trim();
    if (!identifier || !password) {
      setLoginError("Please fill all required fields.");
      return;
    }

    const payload =
      roleType === "user"
        ? { identifier, password, role: "user" }
        : { username: identifier, password };

    try {
      setLoading(true);
      let response =
        roleType === "user"
          ? await userService.login(payload)
          : await employeeService.login(payload);

      const success =
        response.data?.message?.toLowerCase().includes("login") ||
        response.data?.status === true;

      if (success) {
        antdMessage.success(`${roleType} Login Successful`);

        if (roleType === "employee") {
          setAuthData({
            token: response.data.token,
            user: response.data.user,
          });
        } else {
          setAuthData(response.data);
        }

        navigate(roleType === "user" ? "/user/dashboard" : "/employee/dashboard");
      } else {
        setLoginError(response.data?.message || "Invalid credentials!");
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FORGOT PASSWORD FLOW ----------------

  const handleSendOTP = async () => {
    if (!forgotEmailOrMobile) return antdMessage.error("Enter registered Email");

    try {
      await userService.forgetPassword({ identifier: forgotEmailOrMobile });
      antdMessage.success("OTP sent to your registered email");
      setStep(2);
    } catch (err) {
      antdMessage.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return antdMessage.error("Enter OTP");

    try {
      await userService.verifyOTP({
        identifier: forgotEmailOrMobile,
        otp,
      });
      antdMessage.success("OTP Verified Successfully!");
      setStep(3);
    } catch (err) {
      antdMessage.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return antdMessage.error("Enter new password");

    try {
      await userService.resetPassword({
        identifier: forgotEmailOrMobile,
        newPassword,
      });

      antdMessage.success("Password Changed Successfully!");
      setForgotModalVisible(false);
      setStep(1);
      setOtp("");
      setNewPassword("");
      setForgotEmailOrMobile("");
    } catch (err) {
      antdMessage.error(err.response?.data?.message || "Password reset failed");
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const toggleLoginMode = () => {
    setIsMobileLogin(!isMobileLogin);
    setEmail("");
    setMobile("");
    setLoginError("");
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
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

      {/* RIGHT SIDE */}
      <div className="login-right">
        <img src={logo} alt="Company Logo" className="logo" />

        <form className="login-form">
          <h3>LOGIN TO YOUR ACCOUNT</h3>

          {loginError && (
            <div className="login-error-message">{loginError}</div>
          )}

          {/* Email / Mobile */}
          <div className="form-group mb-4">
            <div className="input-wrapper">
              {isMobileLogin ? (
                <>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={mobile ? "filled" : ""}
                  />
                  <label>Mobile Number</label>
                  <FaEnvelope className="input-icon toggle-icon" onClick={toggleLoginMode} />
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
                  <FaPhone className="input-icon toggle-icon" onClick={toggleLoginMode} />
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
                <FaEyeSlash
                  className="input-icon toggle-icon"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <FaEye
                  className="input-icon toggle-icon"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button
              type="button"
              className="log-button"
              disabled={loading}
              onClick={() => handleSubmit("user")}
            >
              {loading ? <Loading /> : "User Login"}
            </button>

            <button
              type="button"
              className="log-button"
              disabled={loading}
              onClick={() => handleSubmit("employee")}
            >
              {loading ? <Loading /> : "Employee Login"}
            </button>
          </div>

          {/* Links */}
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <span
              style={{ cursor: "pointer", color: "#3d2c8bff", fontWeight: "bold" }}
              onClick={() => setForgotModalVisible(true)}
            >
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

      {/* FORGOT PASSWORD MODAL */}
      <Modal open={forgotModalVisible} footer={null} centered closable={false} title="Forgot Password">
        {step === 1 && (
          <>
            <Input
              placeholder="Enter Email or Mobile"
              value={forgotEmailOrMobile}
              onChange={(e) => setForgotEmailOrMobile(e.target.value)}
            />
            <Button type="primary" block style={{ marginTop: "1rem" }} onClick={handleSendOTP}>
              Send OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button type="primary" block style={{ marginTop: "1rem" }} onClick={handleVerifyOTP}>
              Verify OTP
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Input.Password
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button type="primary" block style={{ marginTop: "1rem" }} onClick={handleResetPassword}>
              Reset Password
            </Button>
          </>
        )}

        <Button block style={{ marginTop: "10px" }} onClick={() => setForgotModalVisible(false)}>
          Cancel
        </Button>
      </Modal>
    </div>
  );
};

export default Login;