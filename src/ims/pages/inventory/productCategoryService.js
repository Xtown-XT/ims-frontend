import api from "../../services/api.js"; 

const categoryService = {
  createCategory: (data) => api.post("/categories/createCategory", data),
  getCategories: (page = 1, limit = 10, search = "") => api.get(`/categories/getAllCategories?page=${page}&limit=${limit}&search=${search}`),
  updateCategory: (id, data) => api.put(`/categories/updateCategory/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/deleteCategory/${id}`), 
};

export default categoryService;
