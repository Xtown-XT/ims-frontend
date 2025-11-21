import api from "../../services/api.js";

const expenseCategoryService = {
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
};

export default expenseCategoryService;
