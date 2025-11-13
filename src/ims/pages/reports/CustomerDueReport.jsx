import React, { useState } from 'react';
import { Calendar, RefreshCw, ChevronUp, Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomerDueReport = () => {
  const [activeTab, setActiveTab] = useState('due');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const customerDueData = [
    { reference: 'INV2011', code: 'CU006', customer: 'Marsha Betts', totalAmount: 2000, paid: 2000, due: 0.0, status: 'Paid', statusColor: 'green', avatar: '🔴' },
    { reference: 'INV2014', code: 'CU007', customer: 'Daniel Jude', totalAmount: 600, paid: 600, due: 0.0, status: 'Overdue', statusColor: 'purple', avatar: '🟠' },
    { reference: 'INV2025', code: 'CU001', customer: 'Carl Evans', totalAmount: 1000, paid: 1000, due: 0.0, status: 'Paid', statusColor: 'green', avatar: '🔵' },
    { reference: 'INV2031', code: 'CU002', customer: 'Minerva Rameriz', totalAmount: 1500, paid: 1500, due: 0.0, status: 'Paid', statusColor: 'green', avatar: '🟣' },
    { reference: 'INV2033', code: 'CU004', customer: 'Patricia Lewis', totalAmount: 700, paid: 700, due: 0.0, status: 'Paid', statusColor: 'green', avatar: '🟤' },
    { reference: 'INV2042', code: 'CU003', customer: 'Robert Lamon', totalAmount: 1600, paid: 1600, due: 0.0, status: 'Paid', statusColor: 'green', avatar: '🟠' },
    { reference: 'INV2042', code: 'CU005', customer: 'Mark Joslyn', totalAmount: 1000, paid: 1000, due: 0.0, status: 'Paid', statusColor: 'green', avatar: '🔵' },
    { reference: 'INV2047', code: 'CU009', customer: 'Richard Fralick', totalAmount: 500, paid: 500, due: 0.0, status: 'Completed', statusColor: 'green', avatar: '🟡' },
    { reference: 'INV2056', code: 'CU008', customer: 'Emma Bates', totalAmount: 1000, paid: 1000, due: 0.0, status: 'Unpaid', statusColor: 'red', avatar: '🟣' },
  ];

  const totalAmount = customerDueData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalPaid = customerDueData.reduce((sum, item) => sum + item.paid, 0);
  const totalDue = customerDueData.reduce((sum, item) => sum + item.due, 0);

  const handleTabChange = (tab) => {
    if (tab === 'report') {
      // Navigate to Customer Report page
      window.location.href = '/reports/CustomerReport';
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
          Customer Report
        </button>
        <button
          onClick={() => handleTabChange('due')}
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
          <h1 className="text-2xl font-bold text-gray-900">Customer Due Report</h1>
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
          <h2 className="text-lg font-bold text-gray-900">Customer Due Report</h2>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Due</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customerDueData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.reference}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.code}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-sm">
                        {item.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.customer}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">${item.totalAmount}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${item.paid}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${item.due.toFixed(1)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                      item.statusColor === 'purple' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
                <td colSpan="2"></td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{totalAmount}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">${totalPaid.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">${totalDue.toFixed(1)}</td>
                <td></td>
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
    </div>
  );
};

export default CustomerDueReport;