<<<<<<< HEAD
// import React from 'react'
=======
>>>>>>> 9bfe49312e904b8bd8d6562b9f7e1babd4b282ee

// function warrantyService() {
//   return (
//     <div>warrantyService</div>
//   )
// }

<<<<<<< HEAD
// export default warrantyService
=======
const warrantyService = {
  createWarranty: (data) => api.post("/warranty/createWarranty", data),
  getWarranties: (page = 1, limit = 10, search = "") => api.get(`/warranty/getAllWarranties?page=${page}&limit=${limit}&search=${search}`),
  updateWarranty: (id, data) => api.put(`/warranty/updateWarranty/${id}`, data),
  deleteWarranty: (id) => api.delete(`/warranty/deleteWarranty/${id}`), 
};

export default warrantyService;
>>>>>>> 9bfe49312e904b8bd8d6562b9f7e1babd4b282ee
