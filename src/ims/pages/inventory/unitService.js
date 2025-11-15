import api from "../../services/api.js"

 const unitService = {
  createUnits: (data) => api.post('/unit/create', data),
  getUnits: (page = 1, limit = 10, search = "") => api.get(`/unit/all?page=${page}&limit=${limit}&search=${search}`),
  updateUnits: (id, data) => api.put(`/unit/${id}`, data),
  deleteUnits: (id) => api.delete(`/unit/${id}`)
}

export default unitService;