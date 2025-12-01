import api from "../../services/api.js"

const manageStockService = {
  createStock: (data) => api.post('/managestock/createManageStock', data),
  getStocks: (params) => api.get('/managestock/getAllManageStock', { params }),
  updateStock: (id, data) => api.put(`/managestock/updateManageStock/${id}`, data),
  deleteStock: (id) => api.delete(`/managestock/deleteManageStock/${id}`)
}

export default manageStockService;
