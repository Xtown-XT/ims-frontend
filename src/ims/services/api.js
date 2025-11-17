import axios from "axios";
import { getAccessToken } from "./auth";

const api = axios.create({
  baseURL: "http://192.168.1.18:5000/ims_api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token to all requests automatically
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
