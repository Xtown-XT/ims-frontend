import React, { useState } from "react";
import { Table, Button, DatePicker, Select } from "antd";
import { FaFilePdf, FaFileExcel } from "react-icons/fa6";
import { PrinterOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";

const currencyFormatter = (value) => {
  if (value == null) return "-";
  return `$${Number(value).toLocaleString()}`;
};

const { RangePicker } = DatePicker;
const { Option } = Select;

const taxReportData = [
  {
    key: "1",
    reference: "#4237022",
    supplier: "A-Z Store",
    date: "06 Nov 2024",
    store: "Volt Vault",
    amount: 700,
    paymentMethod: "Cash",
    discount: 700,
    taxAmount: 700,
  },
  {
    key: "2",
    reference: "#4237300",
    supplier: "Apex Computers",
    date: "24 Dec 2024",
    store: "Electro Mart",
    amount: 200,
    paymentMethod: "Stripe",
    discount: 200,
    taxAmount: 200,
  },
  {
    key: "3",
    reference: "#7590321",
    supplier: "Sigma Chairs",
    date: "20 Sep 2024",
    store: "Urban Mart",
    amount: 450,
    paymentMethod: "Stripe",
    discount: 450,
    taxAmount: 450,
  },
  {
    key: "4",
    reference: "#7590325",
    supplier: "Beats Headphones",
    date: "10 Dec 2024",
    store: "Quantum Gadgets",
    amount: 50,
    paymentMethod: "Paypal",
    discount: 50,
    taxAmount: 50,
  },
  {
    key: "5",
    reference: "#7590365",
    supplier: "Aesthetic Bags",
    date: "14 Oct 2024",
    store: "Prime Mart",
    amount: 1200,
    paymentMethod: "Paypal",
    discount: 1200,
    taxAmount: 1200,
  },
  {
    key: "6",
    reference: "#8744439",
    supplier: "Hatimi Hardwares",
    date: "25 Oct 2024",
    store: "Elite Retail",
    amount: 1000,
    paymentMethod: "Cash",
    discount: 1000,
    taxAmount: 1000,
  },
  {
    key: "7",
    reference: "#8745225",
    supplier: "Best Accessories",
    date: "18 Nov 2024",
    store: "Gadget World",
    amount: 100,
    paymentMethod: "Paypal",
    discount: 100,
    taxAmount: 100,
  },
  {
    key: "8",
    reference: "#8745245",
    supplier: "Zenith Bags",
    date: "10 Sep 2024",
    store: "Travel Mart",
    amount: 300,
    paymentMethod: "Cash",
    discount: 300,
    taxAmount: 300,
  },
  {
    key: "9",
    reference: "#8745478",
    supplier: "Alpha Mobiles",
    date: "03 Oct 2024",
    store: "NeoTech Store",
    amount: 750,
    paymentMethod: "Stripe",
    discount: 750,
    taxAmount: 750,
  },
  {
    key: "10",
    reference: "#9814521",
    supplier: "Dazzle Shoes",
    date: "27 Nov 2024",
    store: "Prime Bazaar",
    amount: 800,
    paymentMethod: "Cash",
    discount: 800,
    taxAmount: 800,
  },
];

const columns = [
  {
    title: "Reference",
    dataIndex: "reference",
    key: "reference",
    align: "left",
  },
  {
    title: "Supplier",
    dataIndex: "supplier",
    key: "supplier",
    align: "left",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "left",
  },
  {
    title: "Store",
    dataIndex: "store",
    key: "store",
    align: "left",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    align: "right",
    render: currencyFormatter,
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    align: "left",
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
    align: "right",
    render: currencyFormatter,
  },
  {
    title: "Tax Amount",
    dataIndex: "taxAmount",
    key: "taxAmount",
    align: "right",
    render: currencyFormatter,
  },
];

const TaxReport = () => {
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [10, 25, 50, 100];
  const location = useLocation();
  const isPurchaseTabActive = location.pathname
    .toLowerCase()
    .includes("taxreport");

  const tabBaseStyle = {
    borderRadius: 10,
    padding: "8px 22px",
    fontWeight: 600,
    fontSize: 14,
  };

  const activeTabStyle = {
    backgroundColor: "#9333ea",
    color: "#ffffff",
    borderColor: "#9333ea",
  };

  const inactiveTabStyle = {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    borderColor: "#f3f4f6",
  };

  const actionButtonBase = {
    width: 38,
    height: 36,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    padding: 0,
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <div className="px-6 py-5">
          <div className="flex flex-wrap gap-3 mb-5">
            <Link to="/ims/reports/TaxReport">
              <Button
                type="text"
                style={{
                  ...tabBaseStyle,
                  ...(isPurchaseTabActive ? activeTabStyle : inactiveTabStyle),
                }}
              >
                Purchase Tax
              </Button>
            </Link>
            <Link to="/ims/reports/SaleTax">
              <Button
                type="text"
                style={{
                  ...tabBaseStyle,
                  ...(!isPurchaseTabActive ? activeTabStyle : inactiveTabStyle),
                }}
              >
                Sales Tax
              </Button>
            </Link>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Purchase Tax
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            View Reports of Purchase Tax
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose Date
              </label>
              <RangePicker
                defaultValue={[
                  dayjs("2025-11-07"),
                  dayjs("2025-11-13"),
                ]}
                className="w-full"
                format="MM/DD/YYYY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store
              </label>
              <Select defaultValue="All" className="w-full">
                <Option value="All">All</Option>
                <Option value="Volt Vault">Volt Vault</Option>
                <Option value="Urban Mart">Urban Mart</Option>
                <Option value="Prime Mart">Prime Mart</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <Select defaultValue="All" className="w-full">
                <Option value="All">All</Option>
                <Option value="A-Z Store">A-Z Store</Option>
                <Option value="Apex Computers">Apex Computers</Option>
                <Option value="Sigma Chairs">Sigma Chairs</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <Select defaultValue="All" className="w-full">
                <Option value="All">All</Option>
                <Option value="Cash">Cash</Option>
                <Option value="Stripe">Stripe</Option>
                <Option value="Paypal">Paypal</Option>
              </Select>
            </div>

            <div>
              <Button
                type="primary"
                className="w-full h-10"
                style={{
                  backgroundColor: "#9333ea",
                  borderColor: "#9333ea",
                  borderRadius: 8,
                  fontWeight: 600,
                }}
              >
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-wrap gap-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Purchase Tax Report
          </h3>
          <div className="flex items-center gap-2">
            <Button
              icon={<FaFilePdf color="#ef4444" size={16} />}
              style={{
                ...actionButtonBase,
                backgroundColor: "#fee2e2",
              }}
              title="Export to PDF"
            />
            <Button
              icon={<FaFileExcel color="#047857" size={16} />}
              style={{
                ...actionButtonBase,
                backgroundColor: "#dcfce7",
              }}
              title="Export to Excel"
            />
            <Button
              icon={<PrinterOutlined style={{ color: "#1f2937" }} />}
              style={{
                ...actionButtonBase,
                backgroundColor: "#f3f4f6",
              }}
              title="Print"
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={taxReportData}
          pagination={false}
          bordered={false}
          rowClassName={() => "hover:bg-gray-50"}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
          scroll={{ x: "max-content" }}
        />
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 text-sm text-gray-600 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span>Row Per Page</span>
            <Select
              value={pageSize}
              onChange={setPageSize}
              popupMatchSelectWidth={false}
              placement="bottomLeft"
              getPopupContainer={(trigger) => trigger.parentNode}
              style={{ width: 88 }}
            >
              {pageSizeOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>
          <span className="text-gray-500">Entries</span>
        </div>
      </div>
    </div>
  );
};

export default TaxReport;