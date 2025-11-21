import api from "../../services/api.js";

const expenseCategoryService = {
<<<<<<< HEAD
  createExpenseCategory: (data) => api.post('/finance/addExpesescategory', data),
  getExpenseCategories: (page = 1, limit = 10, search = '') => api.get(`/finance/getAllExpenseCategories?page=${page}&limit=${limit}&search=${search}`),
  updateExpenseCategory: (id, data) => api.put(`/finance/updateExpenseCategory/${id}`, data),
  deleteExpenseCategory: (id) => api.delete(`/finance/deleteExpenseCategory/${id}`)
=======
  // CREATE
  createExpenseCategory: (data) =>
    api.post('/finance/addExpesescategory', data),

  // GET ALL
  getExpenseCategories: (page = 1, limit = 10, search = '') =>
    api.get(`/finance/getAllExpenseCategories?page=${page}&limit=${limit}&search=${search}`),

  // GET BY ID
  getExpenseCategoryById: (id) =>
    api.get(`/finance/getExpenseCategoryById/${id}`),

  // UPDATE
  updateExpenseCategory: (id, data) =>
    api.put(`/finance/updateExpenseCategory/${id}`, data),

  // DELETE
  deleteExpenseCategory: (id) =>
    api.delete(`/finance/deleteExpenseCategory/${id}`)
>>>>>>> 3fbe18b2f3be4a4ef66ef580865500f50c713a42
};

export default expenseCategoryService;
