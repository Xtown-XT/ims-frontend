



import api from "../../services/api.js"; 

const warrantyService = {
  createWarranty: (data) => api.post("/warranty/createWarranty", data),
  getWarranties: (page = 1, limit = 10, search = "") => api.get(`/warranty/getAllWarranties?page=${page}&limit=${limit}&search=${search}`),
  updateWarranty: (id, data) => api.put(`/warranty/updateWarranty/${id}`, data),
  deleteWarranty: (id) => api.delete(`/warranty/deleteWarranty/${id}`), 
};


export default warrantyService;



