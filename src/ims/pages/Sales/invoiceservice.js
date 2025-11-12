// invoiceservice.js
// Service file for Invoice API calls
// Backend team will provide the actual API endpoints

import axios from 'axios';

// Use import.meta.env for Vite or window.env for other setups
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080/api';

// Alternative: If using Create React App, uncomment below and comment above
// const API_BASE_URL = process?.env?.REACT_APP_API_URL || 'http://localhost:8080/api';

class InvoiceService {
  
  // Get all invoices
  static async getAllInvoices(params = {}) {
    try {
      // TODO: Replace with actual API endpoint from backend team
      const response = await axios.get(`${API_BASE_URL}/invoices`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
          status: params.status || '',
          customer: params.customer || '',
          sortBy: params.sortBy || 'createdAt',
          sortOrder: params.sortOrder || 'desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  // Get invoice by ID
  static async getInvoiceById(invoiceId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      throw error;
    }
  }

  // Create new invoice
  static async createInvoice(invoiceData) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/invoices`, invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  // Update invoice
  static async updateInvoice(invoiceId, invoiceData) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.put(`${API_BASE_URL}/invoices/${invoiceId}`, invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  // Delete invoice
  static async deleteInvoice(invoiceId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.delete(`${API_BASE_URL}/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  // Update invoice status
  static async updateInvoiceStatus(invoiceId, status) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.patch(`${API_BASE_URL}/invoices/${invoiceId}/status`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }

  // Send invoice via email
  static async sendInvoice(invoiceId, emailData) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/invoices/${invoiceId}/send`, emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw error;
    }
  }

  // Export to PDF
  static async exportToPDF(filters = {}) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/invoices/export/pdf`, {
        params: filters,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices_${Date.now()}.pdf`);
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
      const response = await axios.get(`${API_BASE_URL}/invoices/export/excel`, {
        params: filters,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  // Get invoice statistics
  static async getInvoiceStatistics(params = {}) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/invoices/statistics`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  // Search invoices
  static async searchInvoices(searchTerm) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/invoices/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching invoices:', error);
      throw error;
    }
  }

  // Print invoice
  static async printInvoice(invoiceId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/invoices/${invoiceId}/print`, {
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
      console.error('Error printing invoice:', error);
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

  // Mark invoice as paid
  static async markAsPaid(invoiceId, paymentData) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/invoices/${invoiceId}/mark-paid`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      throw error;
    }
  }

  // Download invoice PDF
  static async downloadInvoicePDF(invoiceId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoiceId}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }

  // Get invoice by number
  static async getInvoiceByNumber(invoiceNumber) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/invoices/number/${invoiceNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice by number:', error);
      throw error;
    }
  }

  // Get overdue invoices
  static async getOverdueInvoices(params = {}) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/invoices/overdue`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue invoices:', error);
      throw error;
    }
  }

  // Record payment
  static async recordPayment(invoiceId, paymentData) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/invoices/${invoiceId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error recording payment:', error);
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
1. GET /api/invoices
===============================================
Request Parameters:
{
  page: 1,
  limit: 10,
  search: "Carl",
  status: "Paid",
  customer: "customer_id",
  sortBy: "createdAt",
  sortOrder: "desc"
}

Response:
{
  success: true,
  data: [
    {
      id: 1,
      invoiceNo: "INV001",
      customer: "Carl Evans",
      customerId: "CUST001",
      dueDate: "2024-12-24",
      amount: 1000,
      paid: 1000,
      amountDue: 0,
      status: "Paid",
      items: [
        {
          productId: "PROD001",
          productName: "Product 1",
          quantity: 2,
          price: 500,
          total: 1000
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
2. GET /api/invoices/:id
===============================================
Response:
{
  success: true,
  data: {
    id: 1,
    invoiceNo: "INV001",
    customer: "Carl Evans",
    customerId: "CUST001",
    customerEmail: "carl@example.com",
    customerPhone: "1234567890",
    dueDate: "2024-12-24",
    issueDate: "2024-12-20",
    amount: 1000,
    paid: 1000,
    amountDue: 0,
    status: "Paid",
    items: [
      {
        id: 1,
        productId: "PROD001",
        productName: "Product 1",
        quantity: 2,
        price: 500,
        total: 1000
      }
    ],
    notes: "Invoice notes here",
    terms: "Payment terms here",
    createdAt: "2024-12-24T10:30:00Z",
    updatedAt: "2024-12-24T10:30:00Z"
  }
}

===============================================
3. POST /api/invoices
===============================================
Request Body:
{
  customerId: "CUST001",
  dueDate: "2024-12-24",
  issueDate: "2024-12-20",
  items: [
    {
      productId: "PROD001",
      quantity: 2,
      price: 500
    }
  ],
  status: "Unpaid",
  notes: "Optional notes",
  terms: "Payment terms"
}

Response:
{
  success: true,
  message: "Invoice created successfully",
  data: {
    id: 1,
    invoiceNo: "INV001",
    customerId: "CUST001",
    dueDate: "2024-12-24",
    amount: 1000,
    status: "Unpaid",
    ...
  }
}

===============================================
4. PUT /api/invoices/:id
===============================================
Request Body:
{
  customerId: "CUST001",
  dueDate: "2024-12-24",
  items: [
    {
      productId: "PROD001",
      quantity: 2,
      price: 500
    }
  ],
  status: "Paid"
}

Response:
{
  success: true,
  message: "Invoice updated successfully",
  data: {
    id: 1,
    invoiceNo: "INV001",
    ...
  }
}

===============================================
5. DELETE /api/invoices/:id
===============================================
Response:
{
  success: true,
  message: "Invoice deleted successfully"
}

===============================================
6. PATCH /api/invoices/:id/status
===============================================
Request Body:
{
  status: "Paid"
}

Response:
{
  success: true,
  message: "Status updated successfully",
  data: {
    id: 1,
    status: "Paid",
    ...
  }
}

===============================================
7. POST /api/invoices/:id/send
===============================================
Request Body:
{
  email: "customer@example.com",
  subject: "Invoice INV001",
  message: "Please find attached invoice",
  cc: ["manager@example.com"],
  attachPDF: true
}

Response:
{
  success: true,
  message: "Invoice sent successfully",
  data: {
    sentTo: "customer@example.com",
    sentAt: "2024-12-24T10:30:00Z"
  }
}

===============================================
8. POST /api/invoices/:id/mark-paid
===============================================
Request Body:
{
  paymentMethod: "Cash",
  paymentDate: "2024-12-24",
  amount: 1000,
  reference: "TXN12345"
}

Response:
{
  success: true,
  message: "Invoice marked as paid",
  data: {
    id: 1,
    status: "Paid",
    paid: 1000,
    amountDue: 0,
    ...
  }
}

===============================================
9. GET /api/invoices/statistics
===============================================
Response:
{
  success: true,
  data: {
    totalInvoices: 100,
    totalAmount: 150000,
    paidInvoices: 80,
    unpaidInvoices: 15,
    overdueInvoices: 5,
    totalPaid: 140000,
    totalDue: 10000,
    averageInvoiceAmount: 1500
  }
}

===============================================
10. GET /api/invoices/search?q=searchTerm
===============================================
Response:
{
  success: true,
  data: [
    {
      id: 1,
      invoiceNo: "INV001",
      customer: "Carl Evans",
      ...
    }
  ]
}

===============================================
11. GET /api/invoices/:id/print
===============================================
Response: Binary PDF file for printing

===============================================
12. GET /api/invoices/:id/download
===============================================
Response: Binary PDF file for download

===============================================
13. GET /api/invoices/number/:invoiceNumber
===============================================
Response:
{
  success: true,
  data: {
    id: 1,
    invoiceNo: "INV001",
    customer: "Carl Evans",
    ...
  }
}

===============================================
14. GET /api/invoices/overdue
===============================================
Response:
{
  success: true,
  data: [
    {
      id: 4,
      invoiceNo: "INV004",
      customer: "Patricia Lewis",
      dueDate: "2024-12-24",
      amount: 2000,
      amountDue: 1000,
      status: "Overdue",
      daysOverdue: 5,
      ...
    }
  ]
}

===============================================
15. POST /api/invoices/:id/payment
===============================================
Request Body:
{
  amount: 500,
  paymentMethod: "Credit Card",
  paymentDate: "2024-12-24",
  reference: "TXN12345",
  notes: "Partial payment"
}

Response:
{
  success: true,
  message: "Payment recorded successfully",
  data: {
    id: 1,
    invoiceNo: "INV001",
    paid: 1500,
    amountDue: 500,
    status: "Partial",
    payments: [
      {
        id: 1,
        amount: 500,
        paymentMethod: "Credit Card",
        paymentDate: "2024-12-24",
        reference: "TXN12345"
      }
    ],
    ...
  }
}

===============================================
16. GET /api/customers
===============================================
Response:
{
  success: true,
  data: [
    {
      id: "CUST001",
      name: "Carl Evans",
      email: "carl@example.com",
      phone: "1234567890",
      address: "123 Main St"
    },
    ...
  ]
}

*/

// Named export
export { InvoiceService };

// Default export
export default InvoiceService;