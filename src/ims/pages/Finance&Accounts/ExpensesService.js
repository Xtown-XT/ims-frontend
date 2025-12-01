// src/services/expensesService.js
import api from "../../services/api.js";

const expensesService = {
  // CREATE Expense
  createExpense: (data) =>
    api.post("/expenses/createExpense", data),

  // GET All Expenses
  getAllExpenses: (page = 1, limit = 10, search = "") =>
    api.get(`/expenses/getAllExpenses?page=${page}&limit=${limit}&search=${search}`),

  // GET Expense By ID
  getExpenseById: (id) =>
    api.get(`/expenses/getExpenseById/${id}`),

  // DELETE Expense
  deleteExpense: (id) =>
    api.delete(`/expenses/getExpenseById/${id}`),
};

export default expensesService;
