// Quotationservice.js
// Service file for Quotation API calls
// Backend team will provide the actual API endpoints

import axios from 'axios';

// Use import.meta.env for Vite or window.env for other setups
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080/api';

// Alternative: If using Create React App, uncomment below and comment above
// const API_BASE_URL = process?.env?.REACT_APP_API_URL || 'http://localhost:8080/api';

class QuotationService {
  
  // Get all quotations
  static async getAllQuotations(params = {}) {
    try {
      // TODO: Replace with actual API endpoint from backend team
      const response = await axios.get(`${API_BASE_URL}/quotations`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
          status: params.status || '',
          customer: params.customer || '',
          product: params.product || '',
          sortBy: params.sortBy || 'createdAt',
          sortOrder: params.sortOrder || 'desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quotations:', error);
      throw error;
    }
  }

  // Get quotation by ID
  static async getQuotationById(quotationId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/quotations/${quotationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quotation details:', error);
      throw error;
    }
  }

  // Create new quotation
  static async createQuotation(quotationData) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/quotations`, quotationData);
      return response.data;
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error;
    }
  }

  // Update quotation
  static async updateQuotation(quotationId, quotationData) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.put(`${API_BASE_URL}/quotations/${quotationId}`, quotationData);
      return response.data;
    } catch (error) {
      console.error('Error updating quotation:', error);
      throw error;
    }
  }

  // Delete quotation
  static async deleteQuotation(quotationId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.delete(`${API_BASE_URL}/quotations/${quotationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quotation:', error);
      throw error;
    }
  }

  // Update quotation status
  static async updateQuotationStatus(quotationId, status) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.patch(`${API_BASE_URL}/quotations/${quotationId}/status`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating quotation status:', error);
      throw error;
    }
  }

  // Send quotation via email
  static async sendQuotation(quotationId, emailData) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/quotations/${quotationId}/send`, emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending quotation:', error);
      throw error;
    }
  }

  // Convert quotation to order
  static async convertToOrder(quotationId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/quotations/${quotationId}/convert-to-order`);
      return response.data;
    } catch (error) {
      console.error('Error converting quotation to order:', error);
      throw error;
    }
  }

  // Export to PDF
  static async exportToPDF(filters = {}) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/quotations/export/pdf`, {
        params: filters,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quotations_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }

  // Export to Excel
  static async exportToExcel(filters = {}) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/quotations/export/excel`, {
        params: filters,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quotations_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  // Get quotation statistics
  static async getQuotationStatistics(params = {}) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/quotations/statistics`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  // Search quotations
  static async searchQuotations(searchTerm) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/quotations/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching quotations:', error);
      throw error;
    }
  }

  // Print quotation
  static async printQuotation(quotationId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/quotations/${quotationId}/print`, {
        responseType: 'blob'
      });
      
      // Create print window
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.print();
      }
      
      return response.data;
    } catch (error) {
      console.error('Error printing quotation:', error);
      throw error;
    }
  }

  // Download quotation PDF
  static async downloadQuotationPDF(quotationId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/quotations/${quotationId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quotation_${quotationId}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      console.error('Error downloading quotation:', error);
      throw error;
    }
  }

  // Get customers list for filter dropdown
  static async getCustomers() {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/customers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  // Get products list for filter dropdown
  static async getProducts() {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Duplicate quotation
  static async duplicateQuotation(quotationId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/quotations/${quotationId}/duplicate`);
      return response.data;
    } catch (error) {
      console.error('Error duplicating quotation:', error);
      throw error;
    }
  }

  // Get quotation by number
  static async getQuotationByNumber(quotationNumber) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/quotations/number/${quotationNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quotation by number:', error);
      throw error;
    }
  }
}

// ============================================
// API RESPONSE STRUCTURE EXAMPLES 
// For Backend Team Reference
// ============================================

/*
===============================================
1. GET /api/quotations
===============================================
Request Parameters:
{
  page: 1,
  limit: 10,
  search: "Lenovo",
  status: "Sent",
  customer: "customer_id",
  product: "product_id",
  sortBy: "createdAt",
  sortOrder: "desc"
}

Response:
{
  success: true,
  data: [
    {
      id: 1,
      quotationNo: "QT001",
      productId: "PROD001",
      productName: "Lenovo 3rd Generation",
      customerId: "CUST001",
      customer: "Carl Evans",
      status: "Sent",
      total: 550,
      validUntil: "2024-12-31",
      items: [
        {
          productId: "PROD001",
          productName: "Lenovo 3rd Generation",
          quantity: 1,
          price: 550,
          total: 550
        }
      ],
      createdAt: "2024-12-24T10:30:00Z",
      updatedAt: "2024-12-24T10:30:00Z"
    }
  ],
  pagination: {
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10
  }
}

===============================================
2. GET /api/quotations/:id
===============================================
Response:
{
  success: true,
  data: {
    id: 1,
    quotationNo: "QT001",
    productId: "PROD001",
    productName: "Lenovo 3rd Generation",
    customerId: "CUST001",
    customer: "Carl Evans",
    customerEmail: "carl@example.com",
    customerPhone: "1234567890",
    status: "Sent",
    total: 550,
    validUntil: "2024-12-31",
    items: [
      {
        id: 1,
        productId: "PROD001",
        productName: "Lenovo 3rd Generation",
        quantity: 1,
        price: 550,
        total: 550
      }
    ],
    notes: "Quotation notes here",
    terms: "Terms and conditions",
    createdAt: "2024-12-24T10:30:00Z",
    updatedAt: "2024-12-24T10:30:00Z"
  }
}

===============================================
3. POST /api/quotations
===============================================
Request Body:
{
  customerId: "CUST001",
  productId: "PROD001",
  validUntil: "2024-12-31",
  items: [
    {
      productId: "PROD001",
      quantity: 1,
      price: 550
    }
  ],
  status: "Pending",
  notes: "Optional notes",
  terms: "Terms and conditions"
}

Response:
{
  success: true,
  message: "Quotation created successfully",
  data: {
    id: 1,
    quotationNo: "QT001",
    customerId: "CUST001",
    total: 550,
    status: "Pending",
    ...
  }
}

===============================================
4. PUT /api/quotations/:id
===============================================
Request Body:
{
  customerId: "CUST001",
  productId: "PROD001",
  validUntil: "2024-12-31",
  items: [
    {
      productId: "PROD001",
      quantity: 1,
      price: 550
    }
  ],
  status: "Sent"
}

Response:
{
  success: true,
  message: "Quotation updated successfully",
  data: {
    id: 1,
    quotationNo: "QT001",
    ...
  }
}

===============================================
5. DELETE /api/quotations/:id
===============================================
Response:
{
  success: true,
  message: "Quotation deleted successfully"
}

===============================================
6. PATCH /api/quotations/:id/status
===============================================
Request Body:
{
  status: "Sent"
}

Response:
{
  success: true,
  message: "Status updated successfully",
  data: {
    id: 1,
    status: "Sent",
    ...
  }
}

===============================================
7. POST /api/quotations/:id/send
===============================================
Request Body:
{
  email: "customer@example.com",
  subject: "Quotation QT001",
  message: "Please find attached quotation",
  cc: ["manager@example.com"],
  attachPDF: true
}

Response:
{
  success: true,
  message: "Quotation sent successfully",
  data: {
    sentTo: "customer@example.com",
    sentAt: "2024-12-24T10:30:00Z"
  }
}

===============================================
8. POST /api/quotations/:id/convert-to-order
===============================================
Response:
{
  success: true,
  message: "Quotation converted to order successfully",
  data: {
    orderId: 1,
    orderNo: "ORD001",
    quotationId: 1,
    ...
  }
}

===============================================
9. GET /api/quotations/statistics
===============================================
Response:
{
  success: true,
  data: {
    totalQuotations: 100,
    totalAmount: 55000,
    sentQuotations: 80,
    pendingQuotations: 15,
    orderedQuotations: 5,
    conversionRate: 5,
    averageQuotationAmount: 550
  }
}

===============================================
10. GET /api/quotations/search?q=searchTerm
===============================================
Response:
{
  success: true,
  data: [
    {
      id: 1,
      quotationNo: "QT001",
      productName: "Lenovo 3rd Generation",
      customer: "Carl Evans",
      ...
    }
  ]
}

===============================================
11. GET /api/quotations/:id/print
===============================================
Response: Binary PDF file for printing

===============================================
12. GET /api/quotations/:id/download
===============================================
Response: Binary PDF file for download

===============================================
13. POST /api/quotations/:id/duplicate
===============================================
Response:
{
  success: true,
  message: "Quotation duplicated successfully",
  data: {
    id: 2,
    quotationNo: "QT002",
    ...
  }
}

===============================================
14. GET /api/quotations/number/:quotationNumber
===============================================
Response:
{
  success: true,
  data: {
    id: 1,
    quotationNo: "QT001",
    productName: "Lenovo 3rd Generation",
    customer: "Carl Evans",
    ...
  }
}

===============================================
15. GET /api/customers
===============================================
Response:
{
  success: true,
  data: [
    {
      id: "CUST001",
      name: "Carl Evans",
      email: "carl@example.com",
      phone: "1234567890"
    },
    ...
  ]
}

===============================================
16. GET /api/products
===============================================
Response:
{
  success: true,
  data: [
    {
      id: "PROD001",
      name: "Lenovo 3rd Generation",
      price: 550,
      stock: 50
    },
    ...
  ]
}

*/

// Named export
export { QuotationService };

// Default export
export default QuotationService;