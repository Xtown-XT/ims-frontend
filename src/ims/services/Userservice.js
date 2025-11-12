import api from "../services/api";

export const userService = {
  // ✅ Updated paths to match backend correctly
  register: (data) => api.post("user/user/register", data),
  login: (data) => api.post("user/user/login", data),
};
