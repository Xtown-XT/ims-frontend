import api from "../../services/api.js";

const subcategoriesService = {
  getSubcategories: (page = 1, limit = 10, search = "") => api.get(`/subcategories/getAllSubcategories?page=${page}&limit=${limit}&search=${search}`),
  createSubcategory: (formData) => api.post('/subcategories/createSubcategory', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateSubcategory: (id, formData) => api.put(`/subcategories/updateSubcategory/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteSubcategory: (id) => api.delete(`/subcategories/deleteSubcategory/${id}`)
};

export default subcategoriesService;
