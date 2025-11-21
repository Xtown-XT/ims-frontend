// src/service/auth.js

// ✅ Save auth data to localStorage (supports all backend formats)
export const setAuthData = (data) => {
  // ---- Access Token ----
  const access =
    data?.accessToken ||
    data?.token ||                 // backend might send "token"
    data?.access_token;            // some backend use access_token

  if (access) {
    localStorage.setItem("accessToken", access);
  }

  // ---- Refresh Token ----
  const refresh =
    data?.refreshToken ||
    data?.refresh_token;           // backend might send refresh_token

  if (refresh) {
    localStorage.setItem("refreshToken", refresh);
  }

  // ---- User Info ----
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

// ✅ Automatically attach token to API requests
export const attachAuthHeader = (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
