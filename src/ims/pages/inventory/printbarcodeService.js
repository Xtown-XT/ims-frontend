import api from "../../services/api";

const printbarcodeService = {
  // POST → Create Barcode
  createBarcode: (data) => api.post("/barcode/createBarcode", data),

  // GET → Get All Barcodes
  getBarcode: () => api.get("/barcode/getAllBarcodes"),

  // GET -> Get By ID
  getById: (id) => api.get(`/barcode/getBarcodeById/${id}`),

  // DELETE -> Delete by ID
  deleteById: (id) => api.delete(`/barcode/deleteBarcode/${id}`)

};

export default printbarcodeService;