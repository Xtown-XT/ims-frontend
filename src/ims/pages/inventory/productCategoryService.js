import api from "../../services/api.js"; 

const categoryService = {
  createCategory: (data) => api.post("/categories/categories/create", data),
  getCategories: (page = 1, limit = 10, search = "") => api.get(`/categories/categories/all?page=${page}&limit=${limit}&search=${search}`),
  updateCategory: (id, data) => api.put(`/categories/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/categories/${id}`), 
};

export default categoryService;
