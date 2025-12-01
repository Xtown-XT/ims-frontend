import api from "../../services/api.js";

const storeService = {
  getStores: (page = 1, limit = 100, search = '') => 
    api.get(`/store/getAllStores?page=${page}&limit=${limit}&search=${search}`),
};

export default storeService;
