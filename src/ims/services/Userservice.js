import api from "../services/api";

export const userService = {
  register: (data) => api.post("user/user/register", data),
  login: (data) => api.post("user/user/login", data),
  forgetPassword: (data) => api.post("user/user/forgetpassword", data),
  verifyOTP: (data) => api.post("user/user/verifyOTP", data),
  resetPassword: (data) => api.post("user/user/resetPassword", data),
  changePassword: (data) => api.post("user/user/changePassword", data),
};