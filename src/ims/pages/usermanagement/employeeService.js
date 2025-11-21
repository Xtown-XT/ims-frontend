import api from "../../services/api";

export const employeeService = {
  login: (data) => api.post("/employee/login", data),
  profile: () => api.get("/employee/profile"),
  logout: () => api.post("/employee/logout"),
};
