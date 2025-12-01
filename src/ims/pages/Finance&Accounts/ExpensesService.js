// src/services/expensesService.js
import api from "../../services/api.js";

const expensesService = {
  // CREATE Expense
  createExpense: (data) =>
    api.post("http://192.168.1.24:3000/ims_api/v1/expenses/createExpense", data),

  // GET All Expenses
  getAllExpenses: (page = 1, limit = 10, search = "") =>
    api.get(
      `http://192.168.1.24:3000/ims_api/v1/expenses/getAllExpenses?page=${page}&limit=${limit}&search=${search}`
    ),

  // GET Expense By ID
  getExpenseById: (id) =>
    api.get(
      `http://192.168.1.24:3000/ims_api/v1/expenses/getExpenseById/${id}`
    ),

  // DELETE Expense
  deleteExpense: (id) =>
    api.delete(
      `http://192.168.1.24:3000/ims_api/v1/expenses/getExpenseById/${id}`
    ),
};

export default expensesService;