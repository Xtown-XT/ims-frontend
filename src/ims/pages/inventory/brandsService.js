import api from "../../services/api.js"

 const brandService = {
  createBrand: (data) => api.post('/brands/createBrand', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getBrands: () => api.get('/brands/getAllBrands'),

  updateBrand: (id, data) => api.put(`/brands/updateBrand/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteBrand: (id) => api.delete(`/brands/deletBrand/${id}`)
}

export default brandService;