

import api from "../../services/api.js"

const taxService = {
  createTax: (data) => api.post('/tax/createtax', data),
  getTaxes: (page = 1, limit = 10, search = '') => api.get(`/tax/getalltax?page=${page}&limit=${limit}&search=${search}`),
  updateTax: (id, data) => api.put(`/tax/update/${id}`, data),
  deleteTax: (id) => api.delete(`/tax/softDelete/${id}`)
}

export default taxService;