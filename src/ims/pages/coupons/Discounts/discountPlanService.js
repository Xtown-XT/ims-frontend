import api from "../../../services/api";

const discountPlanService = {
  createDiscountPlan: (data) => api.post('/discount/createDiscountplan', data),
  getDiscountPlan: (page = 1, limit = 10, search = '') => api.get(`/discount/getAllDiscountsplan?page=${page}&limit=${limit}&search=${search}`),
  updateDiscountPlan: (id, data) => api.put(`/discount/updateDiscountplan/${id}`, data),
  deleteDiscountPlan: (id) => api.delete(`/discount/deleteDiscountplan/${id}`)
}

export default discountPlanService;