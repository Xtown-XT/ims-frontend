import api from "../../services/api";

// Generate income category code
export const generateIncomeCode = async (name) => {
  try {
    const response = await api.get("/income/generateIncomeCode", {
      params: { name }
    });
    return response.data;
  } catch (error) {
    console.error("Error generating income code:", error);
    throw error;
  }
};

// Create income category
export const createIncomeCategory = async (categoryData) => {
  try {
    const response = await api.post("/income/createIncomeCategory", categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating income category:", error);
    throw error;
  }
};

// Get all income categories
export const getAllIncomeCategories = async () => {
  try {
    const response = await api.get("/income/getAllincomecategory");
    return response.data;
  } catch (error) {
    console.error("Error fetching income categories:", error);
    throw error;
  }
};

// Update income category
export const updateIncomeCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/income/category/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error updating income category:", error);
    throw error;
  }
};

// Delete income category
export const deleteIncomeCategory = async (id) => {
  try {
    const response = await api.delete(`/income/category/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting income category:", error);
    throw error;
  }
};
