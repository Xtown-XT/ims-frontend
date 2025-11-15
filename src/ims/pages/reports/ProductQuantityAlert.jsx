import React, { useState } from 'react';
import { Calendar, RefreshCw, ChevronUp, Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductQuantityAlert = () => {
  const [activeTab, setActiveTab] = useState('quantity');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const quantityData = [
    { sku: 'PT001', serialNo: 'LNV-IP3-8GB-256SSD-BL', icon: '💻', name: 'Lenovo IdeaPad 3', totalQty: 98, alertQty: 79 },
    { sku: 'PT002', serialNo: 'LNV-IP3-8GB-256SSD-BL', icon: '🎧', name: 'Beats Pro', totalQty: 156, alertQty: 66 },
    { sku: 'PT003', serialNo: 'LNV-IP3-8GB-256SSD-BL', icon: '👟', name: 'Nike Jordan', totalQty: 89, alertQty: 69 },
    { sku: 'PT004', serialNo: 'LNV-IP3-8GB-256SSD-BL', icon: '⌚', name: 'Apple Series 5 Watch', totalQty: 569, alertQty: 68 },
    { sku: 'PT005', serialNo: 'LNV-IP3-8GB-256SSD-BL', icon: '🔊', name: 'Amazon Echo Dot', totalQty: 548, alertQty: 33 },
    { sku: 'PT006', serialNo: 'LNV-IP3-8GB-256SSD-BL', icon: '🪑', name: 'Sanford Chair Sofa', totalQty: 456, alertQty: 16 },
    { sku: 'PT007', serialNo: 'LNV-IP3-8GB-256SSD-BL', icon: '👜', name: 'Red Premium Satchel', totalQty: 178, alertQty: 86 },
    { sku: 'PT008', serialNo: 'LNV-IP3-8GB-256SSD-BL', icon: '📱', name: 'Iphone 14 Pro', totalQty: 1768, alertQty: 33 },
    { sku: 'PT009', serialNo: 'LNV-IP3-8GB-256SSD-BL', icon: '🪑', name: 'Gaming Chair', totalQty: 568, alertQty: 528 },
    { sku: 'PT010', serialNo: 'LNV-IP3-8GB-256SSD-BL', icon: '🎒', name: 'Borealis Backpack', totalQty: 146, alertQty: 11 },
  ];

  const handleTabChange = (tab) => {
    if (tab === 'report') {
      window.location.href = '/reports/ProductReport';
    } else if (tab === 'expiry') {
      window.location.href = '/reports/ProductExpiryReport';
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleTabChange('report')}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm ${
            activeTab === 'report'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Product Report
        </button>
        <button
          onClick={() => handleTabChange('expiry')}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm ${
            activeTab === 'expiry'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Product Expiry Report
        </button>
        <button
          onClick={() => handleTabChange('quantity')}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm ${
            activeTab === 'quantity'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Product Quantity Alert
        </button>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Product Expiry Report</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronUp size={18} />
            </button>
          </div>
        </div>
        <p className="text-gray-500 text-sm">View Reports of Products</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value="11/07/2025 - 11/13/2025"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
            <div className="flex gap-2">
              <select className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All</option>
              </select>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 whitespace-nowrap">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Product Expiry Report</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              <Download size={18} />
            </button>
            <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <Download size={18} />
            </button>
            <button className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
              <Printer size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Serial No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Alert Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quantityData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.serialNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-lg">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.totalQty}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.alertQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Row Per Page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <span className="text-sm text-gray-600">Entries</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50">
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
              1
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-600">
        2014 - 2025 © DreamsPOS. All Right Reserved
        <span className="ml-2">Designed & Developed by <span className="text-purple-600">Dreams</span></span>
      </div>
    </div>
  );
};

export default ProductQuantityAlert;