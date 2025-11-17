import api from "../../services/api.js"

 const brandService = {
  createBrand: (data) => api.post('/brands/brands/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getBrands: () => api.get('/brands/brands/all'),
  updateBrand: (id, data) => api.put(`/brands/brands/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteBrand: (id) => api.delete(`/brands/brands/${id}`)
}

export default brandService;