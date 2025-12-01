import api from "../../services/api.js";

const productService = {
  getProducts: (page = 1, limit = 10, search = "") => 
    api.get(`/product/getAllProducts?page=${page}&limit=${limit}&search=${search}`),
  
  getProductById: (id) => 
    api.get(`/product/getProduct/${id}`),
  
  createProduct: (formData) => 
    api.post('/product/createFullProduct', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  updateProduct: (id, formData) => 
    api.put(`/product/updateProduct/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  deleteProduct: (id) => 
    api.delete(`/product/deleteProduct/${id}`)
};

export default productService;
