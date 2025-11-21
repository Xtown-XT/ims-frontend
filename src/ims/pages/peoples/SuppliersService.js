// src/services/SupplierService.js
import api from "../../services/api";

const SupplierService = {
  // GET all suppliers
  getSuppliers: () => api.get("/suppliers/getAllSuppliers"),

  // CREATE supplier
  createSupplier: (data) =>
    api.post("/suppliers/createsupplier", data),

  // UPDATE supplier by ID
  updateSupplier: (id, data) =>
    api.put(`/suppliers/updateSupplierById/${id}`, data),

  // DELETE supplier by ID
  deleteSupplier: (id) =>
    api.delete(`/suppliers/deleteSupplierById/${id}`),

  // Optional: GET supplier by ID (if ever needed)
  getSupplierById: (id) =>
    api.get(`/suppliers/getSupplierById/${id}`),
};

export default SupplierService;
