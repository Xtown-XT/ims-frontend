import api from "../../services/api.js";

const warehouseService = {
  getWarehouses: (page = 1, limit = 100, search = "") =>
    api.get(`/warehouse/getAllwarehouse?page=${page}&limit=${limit}&search=${search}`),
};

export default warehouseService;
