import api from "../../services/api.js";

const expenseCategoryService = {
  createExpenseCategory: (data) => api.post('/finance/addExpesescategory', data),
  getExpenseCategories: (page = 1, limit = 10, search = '') => api.get(`/finance/getAllExpenseCategories?page=${page}&limit=${limit}&search=${search}`),
  updateExpenseCategory: (id, data) => api.put(`/finance/updateExpenseCategory/${id}`, data),
  deleteExpenseCategory: (id) => api.delete(`/finance/deleteExpenseCategory/${id}`)
};

export default expenseCategoryService;
