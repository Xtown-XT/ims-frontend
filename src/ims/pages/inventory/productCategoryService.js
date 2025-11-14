import api from "../../services/api.js"; 

const categoryService = {
  createCategory: (data) => api.post("/categories/categories/create", data),
  getCategories: () => api.get("/categories/categories/all"), 
  // updateCategory: (id, data) => api.put(`/categories/categories/${id}`, data),
  // deleteCategory: (id) => api.delete(`/categories/categories/${id}`), 
};

export default categoryService;
