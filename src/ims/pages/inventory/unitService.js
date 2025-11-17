import api from "../../services/api.js"

 const unitService = {
  createUnit: (data) => api.post('/unit/create', data),
  getUnits: () => api.get('/unit/all'),
  updateUnit: (id, data) => api.put(`/unit/${id}`, data),
  deleteUnit: (id) => api.delete(`/unit/${id}`)
}

export default unitService;