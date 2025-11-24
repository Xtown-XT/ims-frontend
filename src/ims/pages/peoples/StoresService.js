import api from "../../services/api";

const storesService = {
  // Create Store
  createStore: async (data) => {
    try {
      const res = await api.post("store/createStore", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get All Stores
  getStores: async (page = 1, limit = 10, search = '') => {
    try {
      const res = await api.get(`store/getAllStores?page=${page}&limit=${limit}&search=${search}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get One Store
  getStoreById: async (id) => {
    try {
      const res = await api.get(`store/getStoreById/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update Store
  updateStore: async (id, data) => {
    try {
      const res = await api.put(`store/updateStore/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete Store
  deleteStore: async (id) => {
    try {
      const res = await api.delete(`store/deleteStore/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default storesService;