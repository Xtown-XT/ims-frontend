// POSservice.js
export const POSService = {
  fetchProducts: async () => {
    // Mock fetching products
    return [
      { id: 1, name: 'iPhone 14 64GB', category: 'mobiles', price: 15800, stock: 50, image: '📱', featured: false },
      { id: 2, name: 'MacBook Pro', category: 'laptops', price: 1000, stock: 30, image: '💻', featured: true },
      { id: 3, name: 'Rolex Tribute V3', category: 'watches', price: 6800, stock: 40, image: '⌚', featured: false },
      { id: 4, name: 'Red Nike Angelo', category: 'shoes', price: 7800, stock: 60, image: '👟', featured: true },
      { id: 5, name: 'Airpod 2', category: 'headset', price: 5478, stock: 35, image: '🎧', featured: true },
      { id: 6, name: 'Blue White OGR', category: 'shoes', price: 987, stock: 45, image: '👟', featured: false }
    ];
  },

  fetchCustomers: async () => {
    // Mock fetching customers
    return [
      { id: 1, name: 'Walk in Customer', bonus: 0, loyalty: 0 },
      { id: 2, name: 'James Anderson', bonus: 148, loyalty: 20 },
      { id: 3, name: 'John Doe', bonus: 50, loyalty: 10 }
    ];
  },

  placeOrder: async (orderData) => {
    // Mock placing an order
    console.log('Placing order:', orderData);
    return { success: true, message: 'Order placed successfully', orderId: '#ORD12345' };
  }
};
