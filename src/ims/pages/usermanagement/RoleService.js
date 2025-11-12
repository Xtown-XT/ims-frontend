import api from "../../services/api";

const RoleService = {
  createRole: (data) => api.post("role/createRole", data),
  getAllRoles: () => api.get("role/getAllRoles"),
  getRoleById: (id) => api.get(`role/getRoleById/${id}`),
  updateRole: (id, data) => api.put(`role/updateRole/${id}`, data),
  deleteRole: (id) => api.delete(`role/deleteRole/${id}`),
};

export default RoleService;
