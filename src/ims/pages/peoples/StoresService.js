// src/pages/peoples/StoresService.js
import api from "../../services/api.js";

const storesService = {
  // ✅ Create Store (POST)
  createStore: (data) => api.post("/store/store/create", data),

  // ✅ Get All Stores (GET)
  getStores: () => api.get("/store/all"),
};

export default storesService;
