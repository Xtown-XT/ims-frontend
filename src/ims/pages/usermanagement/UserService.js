import api from "../../services/api";

const userService = {
  // Create Employee
  createUser: async (data) => {
    try {
      const res = await api.post("employee/createEmployee", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get All Employees
  getAllUsers: async () => {
    try {
      const res = await api.get("employee/getAllEmployees");
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get One Employee
  getUserById: async (id) => {
    try {
      const res = await api.get(`employee/getEmployeeById/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update Employee
  updateUser: async (id, data) => {
    try {
      const res = await api.put(`employee/updateEmployee/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete Employee
  deleteUser: async (id) => {
    try {
      const res = await api.delete(`employee/deleteEmployee/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default userService; // ✅ Default export required
