// src/services/SupplierService.js
import api from "../../services/api.js";

const SupplierService = {
  // GET all suppliers
  getSuppliers: (page = 1, limit = 10, search = "") =>
    api.get(
      `/suppliers/getAllSuppliers?page=${page}&limit=${limit}&search=${search}`
    ),

  // CREATE supplier
  createSupplier: (data) =>
    api.post("/suppliers/createsupplier", data),

  // UPDATE supplier
  updateSupplier: (id, data) =>
    api.put(`/suppliers/updateSupplierById/${id}`, data),

  // DELETE supplier
  deleteSupplier: (id) =>
    api.delete(`/suppliers/deleteSupplierById/${id}`),

  // GET supplier by ID
  getSupplierById: (id) =>
    api.get(`/suppliers/getSupplierById/${id}`),
};

export default SupplierService;
