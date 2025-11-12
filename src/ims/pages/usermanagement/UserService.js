import api from "../../../services/api";

export const userService = {
  createUser: (data) => api.post("employee/createEmployee", data),
  getAllUsers: () => api.get("employee/getAllEmployees"),
  getUserById: (id) => api.get(`employee/getEmployeeById/${id}`),
  updateUser: (id, data) => api.put(`employee/updateEmployee/${id}`, data),
  deleteUser: (id) => api.delete(`employee/deleteEmployee/${id}`),
};
