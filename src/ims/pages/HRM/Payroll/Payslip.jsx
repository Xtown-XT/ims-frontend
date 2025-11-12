import React from "react";
import { Button } from "antd";
import { 
  FilePdfOutlined, 
  PrinterOutlined, 
  ReloadOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  DownloadOutlined,
  BarcodeOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Payslip = () => {
  const navigate = useNavigate();

  // Employee and payslip data
  const payslipData = {
    month: "Jan 2025",
    employeeName: "Carl Evans",
    employeeId: "EMP001",
    location: "USA",
    payPeriod: "Jan 2025",
    earnings: [
      { type: "Basic Salary", amount: "$32,000" },
      { type: "HRA Allowance", amount: "$0.00" },
      { type: "Conveyance", amount: "$0.00" },
      { type: "Medical Allowance", amount: "$0.00" },
      { type: "Bonus", amount: "$0.00" },
    ],
    deductions: [
      { type: "PF", amount: "$0.00" },
      { type: "Professional Tax", amount: "$0.00" },
      { type: "TDS", amount: "$0.00" },
      { type: "Loans & Others", amount: "$0.00" },
      { type: "Bonus", amount: "$0.00" },
    ],
    totalEarnings: "$32,000",
    totalDeductions: "$0.00",
    netSalary: "$32,000",
    netSalaryWords: "Thirty Two Thousand Only",
  };

  // Navigate back to Employee Salary page
  const handleBackToPayroll = () => {
    navigate("/ims/hrm/payroll/salary");
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Payslip</h2>
        </div>
        <div className="flex gap-2">
          <Button
            icon={<FilePdfOutlined />}
            style={{
              background: "#DC2626",
              color: "white",
              borderColor: "#DC2626",
              borderRadius: "8px",
            }}
          />
          <Button
            icon={<PrinterOutlined />}
            style={{ borderRadius: "8px" }}
          />
          <Button
            icon={<ReloadOutlined />}
            style={{ borderRadius: "8px" }}
          />
          <button
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition text-sm"
            onClick={handleBackToPayroll}
          >
            <ArrowLeftOutlined /> Back to Payroll
          </button>
        </div>
      </div>

      {/* Payslip Content */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        {/* Top Section with Employee Info and Action Buttons */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Payslip for the Month of {payslipData.month}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Employee Name: {payslipData.employeeName}</p>
                <p>Employee ID: {payslipData.employeeId}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                icon={<MailOutlined />}
                style={{
                  background: "#FF9800",
                  color: "white",
                  borderColor: "#FF9800",
                  borderRadius: "8px",
                }}
              >
                Send Email
              </Button>
              <Button
                icon={<DownloadOutlined />}
                style={{
                  background: "#2563EB",
                  color: "white",
                  borderColor: "#2563EB",
                  borderRadius: "8px",
                }}
              >
                Download
              </Button>
              <Button
                icon={<BarcodeOutlined />}
                style={{
                  background: "#DC2626",
                  color: "white",
                  borderColor: "#DC2626",
                  borderRadius: "8px",
                }}
              >
                Print Barcode
              </Button>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Location: {payslipData.location}</p>
            <p>Pay Period: {payslipData.payPeriod}</p>
          </div>
        </div>

        {/* Earnings and Deductions Table */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Earnings Section */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-4">Earnings</h4>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-sm font-medium text-gray-600 pb-2">Pay Type</th>
                    <th className="text-right text-sm font-medium text-gray-600 pb-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payslipData.earnings.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="text-sm text-gray-700 py-2">{item.type}</td>
                      <td className="text-sm text-gray-700 py-2 text-right">{item.amount}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-300">
                    <td className="text-sm font-bold text-gray-800 py-2">Total Earnings</td>
                    <td className="text-sm font-bold text-gray-800 py-2 text-right">{payslipData.totalEarnings}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions Section */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-4">Deductions</h4>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-sm font-medium text-gray-600 pb-2">Pay Type</th>
                    <th className="text-right text-sm font-medium text-gray-600 pb-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payslipData.deductions.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="text-sm text-gray-700 py-2">{item.type}</td>
                      <td className="text-sm text-gray-700 py-2 text-right">{item.amount}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-300">
                    <td className="text-sm font-bold text-gray-800 py-2">Total Deductions</td>
                    <td className="text-sm font-bold text-gray-800 py-2 text-right">{payslipData.totalDeductions}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Net Salary Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Net Salary</p>
                <p className="text-2xl font-bold text-gray-800">{payslipData.netSalary}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Inwords</p>
                <p className="text-sm font-medium text-gray-700">{payslipData.netSalaryWords}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payslip;
