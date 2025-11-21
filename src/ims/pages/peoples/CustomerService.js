import api from "../../services/api";

const customerService = {
  // Create Customer
  createCustomer: async (data) => {
    try {
      const res = await api.post("customers/createcustomer", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get All Customers
  getCustomers: async (page = 1, limit = 10, search = '') => {
    try {
      const res = await api.get(`customers/getallcustomers?page=${page}&limit=${limit}&search=${search}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get One Customer
  getCustomerById: async (id) => {
    try {
      const res = await api.get(`customers/getCustomerById/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update Customer
  updateCustomer: async (id, data) => {
    try {
      const res = await api.put(`customers/updateCustomerById/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete Customer
  deleteCustomer: async (id) => {
    try {
      const res = await api.delete(`customers/deleteCustomerById/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default customerService;
