import api from "../../services/api.js"

 const brandService = {
  createBrands: (data) => api.post('/brands/brands/create', data),
  getBrands: (page = 1, limit = 10, search = "") => 
  api.get(`/brands/brands/all?page=${page}&limit=${limit}&search=${search}`),
  updateBrands: (id, data) => api.put(`/brands/brands/${id}`, data),
  deletBrands: (id) => api.delete(`/brands/brands/${id}`)
}

export default brandService;