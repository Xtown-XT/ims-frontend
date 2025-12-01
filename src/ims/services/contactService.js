import api from "./api.js";

const contactService = {
  // Get all contacts/users for dropdown
  getContacts: (page = 1, limit = 100, search = "") =>
    api.get(`/user/users?page=${page}&limit=${limit}&search=${search}`),

  // Alternative: Get employees as contacts
  getEmployeesAsContacts: () => api.get("/hrms/employee?limit=100"),
};

export default contactService;
