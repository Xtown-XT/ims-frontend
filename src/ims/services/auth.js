// src/service/auth.js

// ✅ Save auth data to localStorage
export const setAuthData = (data) => {
  if (data?.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  if (data?.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
};

// ✅ Get user info
export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// ✅ Get access token
export const getAccessToken = () => {
  return localStorage.getItem("accessToken") || null;
};

// ✅ Get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken") || null;
};

// ✅ Check if user is logged in
export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!token;
};

// ✅ Remove all auth data (logout)
export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// ✅ Automatically add token to API requests (optional)
// Import this and attach to axios interceptor if needed
export const attachAuthHeader = (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
