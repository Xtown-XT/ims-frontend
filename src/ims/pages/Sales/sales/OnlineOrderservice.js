// OnlineOrderService.js
// Service file for Online Orders API calls
// Backend team will provide the actual API endpoints

import axios from 'axios';

// Use import.meta.env for Vite or window.env for other setups
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080/api';

// Alternative: If using Create React App, uncomment below and comment above
// const API_BASE_URL = process?.env?.REACT_APP_API_URL || 'http://localhost:8080/api';

export class OnlineOrderService {
  
  // Get all orders
  static async getAllOrders(params = {}) {
    try {
      // TODO: Replace with actual API endpoint from backend team
      const response = await axios.get(`${API_BASE_URL}/online-orders`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
          status: params.status || '',
          paymentStatus: params.paymentStatus || '',
          customer: params.customer || '',
          sortBy: params.sortBy || 'createdAt',
          sortOrder: params.sortOrder || 'desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrderById(orderId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/online-orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // Create new order
  static async createOrder(orderData) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/online-orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Update order
  static async updateOrder(orderId, orderData) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.put(`${API_BASE_URL}/online-orders/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  // Delete order
  static async deleteOrder(orderId) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.delete(`${API_BASE_URL}/online-orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, status) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.patch(`${API_BASE_URL}/online-orders/${orderId}/status`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Update payment status
  static async updatePaymentStatus(orderId, paymentStatus) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.patch(`${API_BASE_URL}/online-orders/${orderId}/payment-status`, {
        paymentStatus
      });
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Export to PDF
  static async exportToPDF(filters = {}) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/online-orders/export/pdf`, {
        params: filters,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${Date.now()}.pdf`);
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
      const response = await axios.get(`${API_BASE_URL}/online-orders/export/excel`, {
        params: filters,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  // Get order statistics
  static async getOrderStatistics(params = {}) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/online-orders/statistics`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  // Search orders
  static async searchOrders(searchTerm) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/online-orders/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching orders:', error);
      throw error;
    }
  }

  // Filter orders
  static async filterOrders(filters) {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/online-orders/filter`, filters);
      return response.data;
    } catch (error) {
      console.error('Error filtering orders:', error);
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

  // Get billers list
  static async getBillers() {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get(`${API_BASE_URL}/billers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching billers:', error);
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
1. GET /api/online-orders
===============================================
Request Parameters:
{
  page: 1,
  limit: 10,
  search: "Carl",
  status: "Completed",
  paymentStatus: "Paid",
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
      customer: "Carl Evans",
      customerId: "CUST001",
      reference: "SL001",
      date: "2024-12-24",
      status: "Completed",
      grandTotal: 1000,
      paid: 1000,
      due: 0,
      paymentStatus: "Paid",
      biller: "Admin",
      billerId: "BILL001",
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
2. GET /api/online-orders/:id
===============================================
Response:
{
  success: true,
  data: {
    id: 1,
    customer: "Carl Evans",
    reference: "SL001",
    date: "2024-12-24",
    status: "Completed",
    grandTotal: 1000,
    paid: 1000,
    due: 0,
    paymentStatus: "Paid",
    biller: "Admin",
    items: [...],
    notes: "Order notes here"
  }
}

===============================================
3. POST /api/online-orders
===============================================
Request Body:
{
  customerId: "CUST001",
  billerId: "BILL001",
  items: [
    {
      productId: "PROD001",
      quantity: 2,
      price: 500
    }
  ],
  paymentStatus: "Paid",
  status: "Completed",
  notes: "Optional notes"
}

Response:
{
  success: true,
  message: "Order created successfully",
  data: {
    id: 1,
    reference: "SL001",
    ...
  }
}

===============================================
4. PUT /api/online-orders/:id
===============================================
Request Body:
{
  customerId: "CUST001",
  items: [...],
  paymentStatus: "Paid",
  status: "Completed"
}

Response:
{
  success: true,
  message: "Order updated successfully",
  data: { ... }
}

===============================================
5. DELETE /api/online-orders/:id
===============================================
Response:
{
  success: true,
  message: "Order deleted successfully"
}

===============================================
6. PATCH /api/online-orders/:id/status
===============================================
Request Body:
{
  status: "Completed"
}

Response:
{
  success: true,
  message: "Status updated successfully",
  data: { ... }
}

===============================================
7. PATCH /api/online-orders/:id/payment-status
===============================================
Request Body:
{
  paymentStatus: "Paid"
}

Response:
{
  success: true,
  message: "Payment status updated successfully",
  data: { ... }
}

===============================================
8. GET /api/online-orders/export/pdf
===============================================
Response: Binary PDF file

===============================================
9. GET /api/online-orders/export/excel
===============================================
Response: Binary Excel file

===============================================
10. GET /api/online-orders/statistics
===============================================
Response:
{
  success: true,
  data: {
    totalOrders: 100,
    totalSales: 150000,
    completedOrders: 80,
    pendingOrders: 20,
    totalPaid: 140000,
    totalDue: 10000
  }
}

===============================================
11. GET /api/online-orders/search?q=searchTerm
===============================================
Response:
{
  success: true,
  data: [...]
}

===============================================
12. GET /api/customers
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
    }
  ]
}

===============================================
13. GET /api/billers
===============================================
Response:
{
  success: true,
  data: [
    {
      id: "BILL001",
      name: "Admin",
      email: "admin@example.com"
    }
  ]
}

*/

export default OnlineOrderService;