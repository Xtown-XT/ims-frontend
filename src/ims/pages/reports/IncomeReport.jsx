import React, { useState } from "react";
import { Calendar, FileText, FileSpreadsheet, Search } from "lucide-react";

const IncomeReport = () => {
  const [startDate, setStartDate] = useState("2025-11-07");
  const [endDate, setEndDate] = useState("2025-11-13");
  const [store, setStore] = useState("All");
  const [payment, setPayment] = useState("All");

  const incomeData = [
    {
      date: "10 Sep 2024",
      store: "Travel Mart",
      category: "Return/Refund Income",
      notes: "Services that have been verified",
      amount: "$530",
      method: "Cash",
    },
    {
      date: "20 Sep 2024",
      store: "Urban Mart",
      category: "Product Export",
      notes: "Categorize income derived in office",
      amount: "$450",
      method: "Stripe",
    },
    {
      date: "03 Oct 2024",
      store: "NeoTech Store",
      category: "Foreign investment",
      notes: "Services that have been verified",
      amount: "$750",
      method: "Stripe",
    },
    {
      date: "14 Oct 2024",
      store: "Prime Mart",
      category: "Return/Refund Income",
      notes: "Flight tickets for meetings",
      amount: "$1200",
      method: "Paypal",
    },
    {
      date: "25 Oct 2024",
      store: "Elite Retail",
      category: "Service Fees",
      notes: "Services that have been verified",
      amount: "$1000",
      method: "Cash",
    },
    {
      date: "06 Nov 2024",
      store: "Volt Vault",
      category: "Local Sale",
      notes: "Travel fare for client meeting",
      amount: "$700",
      method: "Cash",
    },
    {
      date: "18 Nov 2024",
      store: "Gadget World",
      category: "Product Sales",
      notes: "Services that have been verified",
      amount: "$100",
      method: "Paypal",
    },
    {
      date: "27 Nov 2024",
      store: "Prime Bazaar",
      category: "Installation",
      notes: "POS Installation for Store",
      amount: "$800",
      method: "Cash",
    },
    {
      date: "10 Dec 2024",
      store: "Quantum Gadgets",
      category: "Product Export",
      notes: "Services that have been verified",
      amount: "$50",
      method: "Paypal",
    },
    {
      date: "24 Dec 2024",
      store: "Electro Mart",
      category: "Foreign investment",
      notes: "Categorize income derived",
      amount: "$200",
      method: "Stripe",
    },
  ];

  const handleGenerate = () => {
    alert(`Generating report from ${startDate} to ${endDate}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">Income Report</h2>
      <p className="text-gray-500 mb-6">View Reports of Purchases</p>

      {/* Filter Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Picker */}
          <div>
            <label className="text-sm font-medium text-gray-700">Choose Date</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 mt-1 bg-gray-50">
              <Calendar size={18} className="text-gray-400 mr-2" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
              <span className="mx-2 text-gray-400">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* Store Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700">Store</label>
            <select
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm bg-gray-50"
            >
              <option>All</option>
              <option>Travel Mart</option>
              <option>Urban Mart</option>
              <option>NeoTech Store</option>
              <option>Prime Mart</option>
            </select>
          </div>

          {/* Payment Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm bg-gray-50"
            >
              <option>All</option>
              <option>Cash</option>
              <option>Stripe</option>
              <option>Paypal</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center transition"
            >
              <Search size={18} className="mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Income Report</h3>
          <div className="flex gap-2">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center text-sm">
              <FileText size={16} className="mr-1" /> PDF
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center text-sm">
              <FileSpreadsheet size={16} className="mr-1" /> XLS
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="p-3 text-left font-medium border-b border-gray-100">Date</th>
                <th className="p-3 text-left font-medium border-b border-gray-100">Store</th>
                <th className="p-3 text-left font-medium border-b border-gray-100">Category</th>
                <th className="p-3 text-left font-medium border-b border-gray-100">Notes</th>
                <th className="p-3 text-left font-medium border-b border-gray-100">Amount</th>
                <th className="p-3 text-left font-medium border-b border-gray-100">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {incomeData.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-purple-50 transition`}
                >
                  <td className="p-3 border-b border-gray-100">{item.date}</td>
                  <td className="p-3 border-b border-gray-100">{item.store}</td>
                  <td className="p-3 border-b border-gray-100">{item.category}</td>
                  <td className="p-3 border-b border-gray-100">{item.notes}</td>
                  <td className="p-3 border-b border-gray-100 text-gray-800 font-medium">
                    {item.amount}
                  </td>
                  <td className="p-3 border-b border-gray-100">{item.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div>Showing 1 to 10 entries</div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">
              &lt;
            </button>
            <span className="text-purple-700 font-semibold">1</span>
            <button className="px-2 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeReport;
