import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message as antdMessage, Spin } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../components/assets/Company_logo.png";
import x_logo from "../components/assets/Dark Logo.png";
import { userService } from "../ims/services/Userservice";
import { setAuthData } from "../ims/services/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Handle input with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field and validate in real-time
    setErrors({ ...errors, [name]: "" });
    
    // Real-time validation
    validateField(name, value);
  };

  // 🔹 Real-time field validation
  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "username":
        if (!value.trim()) {
          error = "Username is required";
        } else if (value.trim().length < 3) {
          error = "Username must be at least 3 characters";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          error = "Username must contain only alphabets";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Phone number must be exactly 10 digits";
        }
        break;

      case "password":
        if (!value.trim()) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(value)) {
          error = "Password must contain at least one number";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          error = "Password must contain at least one special character";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  // 🔹 Validation for all fields
  const validate = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[A-Za-z\s]+$/.test(formData.username)) {
      newErrors.username = "Username must contain only alphabets";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    return newErrors;
  };

  // 🔹 Register
  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      antdMessage.error("Please fix all validation errors before submitting");
      return;
    }

    setLoading(true);
    try {
      console.log("📦 Payload sent to API:", formData);

      const res = await userService.register(formData);
      console.log("✅ Registered user:", res.data);

      if (res.data?.accessToken) {
        setAuthData(res.data);
      }

      antdMessage.success(res.data?.message || "Registration successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("❌ Register API Error:", err.response?.data || err);
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 400
          ? "User already exists!"
          : "Registration failed!");
      antdMessage.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle phone input - only allow numbers
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
      setErrors({ ...errors, phone: "" });
      validateField("phone", value);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-gray-800 to-gray-600 text-white flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          Welcome to <img src={x_logo} alt="XTOWN" className="w-28 inline" /> town..!
        </h3>
        <p className="text-gray-300">We're here to turn your ideas into reality.</p>
      </div>

      {/* Right Section */}
      <div className="flex w-full md:w-1/2 flex-col justify-center items-center p-8">
        <img src={logo} alt="Company Logo" className="w-28 mb-4" />

        <form
          onSubmit={handleRegister}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            CREATE AN ACCOUNT
          </h3>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg bg-gray-100 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-gray-400`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg bg-gray-100 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-gray-400`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={10}
              className={`w-full px-4 py-2 rounded-lg bg-gray-100 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-gray-400`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 pr-10 rounded-lg bg-gray-100 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-gray-400`}
              placeholder="Enter password"
            />
            {showPassword ? (
              <FaEyeSlash
                className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEye
                className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">SuperAdmin</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? <Spin /> : "REGISTER"}
          </button>

          {/* Login Redirect */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?
            <span
              className="text-gray-800 font-semibold ml-1 cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;