import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { employeeService } from '../ims/pages/usermanagement/employeeService';
import { showSuccess } from '../utils/errorHandler';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ----------------- FIXED USER TYPE LOGIC -----------------
const determineUserType = (user) => {
  if (!user) return null;

  // Employee identifiers (backend usually sends these)
  if (user.employee_id || user.role_name === "employee" || user.is_employee === true) {
    return "employee";
  }

  // Normal system users
  if (user.role === "user" || user.user_type === "user") {
    return "user";
  }

  // Default → system user (not employee)
  return "user";
};
// ---------------------------------------------------------

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    const storedUserType = localStorage.getItem("userType");

    if (user) {
      setCurrentUser(user);

      // Redetermine correct user type
      const type = storedUserType || determineUserType(user);
      setUserType(type);
    }
    setLoading(false);
  }, []);

  // ----------------- USER LOGIN -----------------
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      const { token, user } = response.data;

      const type = determineUserType(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", type);

      setCurrentUser(user);
      setUserType(type);

      showSuccess("Login Successful", "Welcome back!");
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------- EMPLOYEE LOGIN -----------------
  const employeeLogin = async (email, password) => {
    try {
      setLoading(true);
      const response = await employeeService.login({
        username: email,
        password,
      });

      const { token, user } = response.data;

      const type = determineUserType(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", type);

      setCurrentUser(user);
      setUserType(type);

      showSuccess("Login Successful", "Welcome back!");
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      showSuccess("Registration Successful", "Your account has been created!");
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("userType");

    setCurrentUser(null);
    setUserType(null);

    showSuccess("Logout Successful", "You have been logged out.");
  };

  const value = {
    currentUser,
    userType,
    loading,
    error,
    login,
    employeeLogin,
    register,
    logout,

    // NEW — CORRECTED HELPERS
    isEmployee: userType === "employee",
    isUser: userType === "user",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
