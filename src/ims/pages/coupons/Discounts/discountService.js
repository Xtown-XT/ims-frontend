import api from "../../../services/api";

const discountService = {
  createDiscount: (data) => api.post('/adddiscount/Discountcreate', data),
  getDiscounts: (page = 1, limit = 10, search = '') => api.get(`/adddiscount/getAllDiscounts?page=${page}&limit=${limit}&search=${search}`),
  updateDiscount: (id, data) => api.put(`/adddiscount/updateDiscount/${id}`, data),
  deleteDiscount: (id) => api.delete(`/adddiscount/deleteDiscount/${id}`)
}

export default discountService;
