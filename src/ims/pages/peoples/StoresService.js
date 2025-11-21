// src/pages/peoples/StoresService.js
import api from "../../services/api.js";

const storesService = {
  createStore: (data) => api.post("/store/createStore", data),
  getStores: () => api.get("/store/getAllStores"),
};

export default storesService;
