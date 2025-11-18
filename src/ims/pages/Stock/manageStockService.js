import api from "../../services/api.js"

const manageStockService = {
  createStock: (data) => api.post('/managestock/managestock/create', data),
  getStocks: (params) => api.get('/managestock/managestock/all', { params }),
  updateStock: (id, data) => api.put(`/managestock/managestock/${id}`, data),
  deleteStock: (id) => api.delete(`/managestock/managestock/${id}`)
}

export default manageStockService;
