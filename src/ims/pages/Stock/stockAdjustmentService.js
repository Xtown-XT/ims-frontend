import api from "../../services/api.js"

const stockAdjustmentService = {
  createAdjustment: (data) => api.post('/stockadjustment/createStockAdjustment', data),
  getAdjustments: (params) => api.get('/stockadjustment/getAllStockAdjustments', { params }),
  updateAdjustment: (id, data) => api.put(`/stockadjustment/updateStockAdjustment/${id}`, data),
  deleteAdjustment: (id) => api.delete(`/stockadjustment/deleteStockAdjustment/${id}`)
}

export default stockAdjustmentService;
