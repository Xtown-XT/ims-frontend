<<<<<<< HEAD
// import React from 'react'

// function variantattributesService() {
//   return (
//     <div>variantattributesService</div>
//   )
// }

// export default variantattributesService
=======

import api from "../../services/api.js"; 

const variantAttributesService = {
  createVariantAttribute: (data) => api.post("/varrient/createVariant", data),
  getVariantAttributes: (page = 1, limit = 10, search = "") => api.get(`/varrient/getAllvariants?page=${page}&limit=${limit}&search=${search}`),
  getVariantAttributeById: (id) => api.get(`/varrient/getVariantById/${id}`),
  updateVariantAttribute: (id, data) => api.put(`/varrient/updateVariant/${id}`, data),
  deleteVariantAttribute: (id) => api.delete(`/varrient/deleteVariant/${id}`), 
};

export default variantAttributesService;
>>>>>>> 9bfe49312e904b8bd8d6562b9f7e1babd4b282ee
