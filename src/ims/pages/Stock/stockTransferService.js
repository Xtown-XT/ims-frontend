import api from "../../services/api.js"

const stockTransferService = {
  createTransfer: (data) => api.post('/stocktransfer/createStockTransfer', data),
  getTransfers: (params) => api.get('/stocktransfer/getAllStockTransfers', { params }),
  updateTransfer: (id, data) => api.put(`/stocktransfer/updateStockTransfer/${id}`, data),
  deleteTransfer: (id) => api.delete(`/stocktransfer/deleteStockTransfer/${id}`)
}

export default stockTransferService;
