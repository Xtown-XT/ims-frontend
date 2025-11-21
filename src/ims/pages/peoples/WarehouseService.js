// src/services/warehouseService.js
import api from "../../services/api.js";

const warehouseService = {
  // GET all warehouses
  getWarehouses: (page = 1, limit = 10, search = "") =>
    api.get(
      `/warehouse/getAllwarehouse?page=${page}&limit=${limit}&search=${search}`
    ),

  // CREATE warehouse
  createWarehouse: (data) =>
    api.post("/warehouse/createwarehouse", data),

  // UPDATE warehouse (PUT)
  updateWarehouse: (id, data) =>
    api.put(`/warehouse/updatewarehouse/${id}`, data),

  // DELETE warehouse
  deleteWarehouse: (id) =>
    api.delete(`/warehouse/deletewarehouse/${id}`),

  // GET warehouse by ID
  getWarehouseById: (id) =>
    api.get(`/warehouse/getwarehouseByid/${id}`),
};

export default warehouseService;
