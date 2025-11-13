import React, { useState } from 'react';
import { Calendar, RefreshCw, ChevronUp, Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomerReport = () => {
  const [activeTab, setActiveTab] = useState('report');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const customerData = [
    { reference: 'INV2011', code: 'CU006', customer: 'Marsha Betts', orders: 45, amount: 750, method: 'Cash', status: 'Completed', avatar: '🔴' },
    { reference: 'INV2014', code: 'CU007', customer: 'Daniel Jude', orders: 21, amount: 1300, method: 'Credit Card', status: 'Completed', avatar: '🟠' },
    { reference: 'INV2025', code: 'CU001', customer: 'Carl Evans', orders: 10, amount: 1000, method: 'Cash', status: 'Completed', avatar: '🔵' },
    { reference: 'INV2031', code: 'CU002', customer: 'Minerva Rameriz', orders: 15, amount: 1500, method: 'Paypal', status: 'Completed', avatar: '🟣' },
    { reference: 'INV2033', code: 'CU004', customer: 'Patricia Lewis', orders: 14, amount: 2000, method: 'Stripe', status: 'Completed', avatar: '🟤' },
    { reference: 'INV2042', code: 'CU003', customer: 'Robert Lamon', orders: 22, amount: 1500, method: 'Paypal', status: 'Completed', avatar: '🟠' },
    { reference: 'INV2042', code: 'CU005', customer: 'Mark Joslyn', orders: 12, amount: 800, method: 'Paypal', status: 'Completed', avatar: '🔵' },
    { reference: 'INV2047', code: 'CU009', customer: 'Richard Fralick', orders: 15, amount: 1700, method: 'Credit Card', status: 'Completed', avatar: '🟡' },
    { reference: 'INV2056', code: 'CU008', customer: 'Emma Bates', orders: 78, amount: 1100, method: 'Stripe', status: 'Completed', avatar: '🟣' },
  ];

  const total = customerData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('report')}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm ${
            activeTab === 'report'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Customer Report
        </button>
        <button
          onClick={() => setActiveTab('due')}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm ${
            activeTab === 'due'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Customer Due
        </button>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Customer Report</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronUp size={18} />
            </button>
          </div>
        </div>
        <p className="text-gray-500 text-sm">View Reports of Customer</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-4 gap-4 items-end">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
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
          <h2 className="text-lg font-bold text-gray-900">Customer Report</h2>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customerData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.reference}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.code}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-sm">
                        {item.avatar}
                      </div>
                      <span className={`text-sm font-medium ${item.customer === 'Robert Lamon' ? 'text-purple-600' : 'text-gray-900'}`}>
                        {item.customer}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.orders}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${item.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.method}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
                <td colSpan="3"></td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">${total.toFixed(2)}</td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
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

      {/* Settings Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
};

export default CustomerReport;