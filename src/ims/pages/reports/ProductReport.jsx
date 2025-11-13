import React, { useState } from "react";
import {
  Calendar,
  RefreshCw,
  ChevronUp,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductReport = () => {
  const [activeTab, setActiveTab] = useState("report");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const productData = [
    { sku: "PT001", icon: "💻", name: "Lenovo IdeaPad 3", category: "Computers", brand: "Lenovo", qty: 100, price: 600, totalOrdered: 5000, revenue: 787258 },
    { sku: "PT002", icon: "🎧", name: "Beats Pro", category: "Electronics", brand: "Beats", qty: 140, price: 160, totalOrdered: 4860, revenue: 689788 },
    { sku: "PT003", icon: "👟", name: "Nike Jordan", category: "Shoe", brand: "Nike", qty: 300, price: 110, totalOrdered: 40, revenue: 7757 },
    { sku: "PT004", icon: "⌚", name: "Apple Series 5 Watch", category: "Electronics", brand: "Apple", qty: 450, price: 120, totalOrdered: 9642, revenue: 7555 },
    { sku: "PT005", icon: "🔊", name: "Amazon Echo Dot", category: "Electronics", brand: "Amazon", qty: 320, price: 80, totalOrdered: 5464, revenue: 39698 },
    { sku: "PT006", icon: "🪑", name: "Sanford Chair Sofa", category: "Furniture", brand: "Modern Wave", qty: 650, price: 320, totalOrdered: 158, revenue: 748 },
    { sku: "PT007", icon: "👜", name: "Red Premium Satchel", category: "Bags", brand: "Dior", qty: 700, price: 60, totalOrdered: 7845, revenue: 7985 },
    { sku: "PT008", icon: "📱", name: "Iphone 14 Pro", category: "Phone", brand: "Apple", qty: 630, price: 540, totalOrdered: 540, revenue: 8769798 },
    { sku: "PT009", icon: "🪑", name: "Gaming Chair", category: "Furniture", brand: "Artime", qty: 410, price: 200, totalOrdered: 200, revenue: 788979 },
    { sku: "PT010", icon: "🎒", name: "Borealis Backpack", category: "Bags", brand: "The North Face", qty: 550, price: 45, totalOrdered: 45, revenue: 895 },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "expiry") navigate("/ims/reports/ProductReportExpiry");
    else if (tab === "quantity") navigate("/ims/reports/ProductQuantityAlert");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "report", label: "Product Report" },
          { id: "expiry", label: "Product Expiry Report" },
          { id: "quantity", label: "Product Quantity Alert" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Product Report</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronUp size={18} />
            </button>
          </div>
        </div>
        <p className="text-gray-500 text-sm">View reports of all products</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Date
            </label>
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
          {["Store", "Category", "Brand"].map((label) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All</option>
              </select>
            </div>
          ))}
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
          <h2 className="text-lg font-bold text-gray-900">Product Report</h2>
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
                {["SKU", "Product Name", "Category", "Brand", "Qty", "Price", "Total Ordered", "Revenue"].map(
                  (col) => (
                    <th key={col} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.sku}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-lg">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.brand}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.qty}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${item.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.totalOrdered}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows Per Page</span>
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
        2014 - 2025 © DreamsPOS. All Rights Reserved
        <span className="ml-2">
          Designed & Developed by{" "}
          <span className="text-purple-600 font-medium">Dreams</span>
        </span>
      </div>
    </div>
  );
};

export default ProductReport;
