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

  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmailOrMobile, setForgotEmailOrMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = async (roleType) => {
    setLoginError("");

    const identifier = isMobileLogin ? mobile.trim() : email.trim();
    if (!identifier || !password) {
      setLoginError("Please fill all required fields.");
      return;
    }

    let payload;

    // Build payload according to backend expectation
    if (roleType === "user") {
      payload = {
        identifier, // email or mobile
        password,
        role: roleType,
      };
    } else {
      payload = {
        username: identifier, // backend expects "username"
        password,
      };
    }

    try {
      setLoading(true);
      let response;

      if (roleType === "user") {
        response = await userService.login(payload);
      } else {
        response = await employeeService.login(payload);
      }

      // Backend success check
      const success = response.data?.message?.toLowerCase().includes("login") || response.data?.status === true;

      if (success) {
        antdMessage.success(`${roleType} Login Successful`);

        // Store token & user for employee
        if (roleType === "employee") {
          setAuthData({
            token: response.data.token,
            user: response.data.user,
          });
        } else {
          setAuthData(response.data);
        }

        // Navigate
        if (roleType === "user") {
          navigate("/user/dashboard");
        } else {
          navigate("/employee/dashboard");
        }
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

  return (
    <div className="login-container">
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

      <div className="login-right">
        <img src={logo} alt="Company Logo" className="logo" />

        <form className="login-form">
          <h3>LOGIN TO YOUR ACCOUNT</h3>

          {loginError && (
            <div className="login-error-message" style={{ marginBottom: "1rem" }}>
              {loginError}
            </div>
          )}

          {/* Email / Mobile */}
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
                <FaEyeSlash className="input-icon toggle-icon" onClick={togglePasswordVisibility} />
              ) : (
                <FaEye className="input-icon toggle-icon" onClick={togglePasswordVisibility} />
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

      {/* Forgot Modal */}
      <Modal open={forgotModalVisible} footer={null} centered closable={false} title="Forgot Password">
        {step === 1 && (
          <Input
            placeholder="Enter Email or Mobile"
            value={forgotEmailOrMobile}
            onChange={(e) => setForgotEmailOrMobile(e.target.value)}
          />
        )}
        {step === 2 && (
          <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        )}
        {step === 3 && (
          <Input.Password
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        )}

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Button type="primary" onClick={() => setStep(step + 1)}>
            {step === 3 ? "Reset Password" : "Next"}
          </Button>
          <Button style={{ marginLeft: "10px" }} onClick={() => setForgotModalVisible(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
