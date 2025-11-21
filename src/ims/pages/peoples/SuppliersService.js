// src/services/SupplierService.js
import api from "../../services/api";

const SupplierService = {
  // GET all suppliers
  getSuppliers: (page = 1, limit = 10, search = "") =>
    api.get(`/suppliers/getAllSuppliers?page=${page}&limit=${limit}&search=${search}`),

  // GET supplier by ID
  getSupplierById: (id) =>
    api.get(`/suppliers/getSupplierById/${id}`),

  // CREATE supplier
  createSupplier: (data) =>
    api.post("/suppliers/createsupplier", data),

  // UPDATE supplier by ID
  updateSupplier: (id, data) =>
    api.put(`/suppliers/updateSupplierById/${id}`, data),

  // DELETE supplier by ID
  deleteSupplier: (id) =>
    api.delete(`/suppliers/deleteSupplierById/${id}`),
};

export default SupplierService;
