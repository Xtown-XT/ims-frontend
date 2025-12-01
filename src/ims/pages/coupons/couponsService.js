import api from "../../services/api.js"

const couponsService = {
  createCoupon: (data) => api.post('/cupon/createCupon', data),
  getCoupons: (params) => api.get('/cupon/getAllCupons', { params }),
  updateCoupon: (id, data) => api.put(`/cupon/updateCupon/${id}`, data),
  deleteCoupon: (id) => api.delete(`/cupon/deleteCupon/${id}`)
}

export default couponsService;
