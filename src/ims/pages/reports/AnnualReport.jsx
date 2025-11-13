import React, { useState } from "react";
import {
  Table,
  Select,
  Button,
  DatePicker,
} from "antd";
import {
  FaFilePdf,
  FaFileExcel,
  FaAngleUp,
} from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import { PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const AnnualReport = () => {
  const [selectedYear, setSelectedYear] = useState(dayjs("2025"));
  const [selectedStore, setSelectedStore] = useState("All Stores");
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [10, 25, 50, 100];

  const handleRefresh = () => {
    setSelectedYear(dayjs("2025"));
    setSelectedStore("All Stores");
  };

  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // PDF export logic
    console.log("Export to PDF");
  };

  const handleExportCSV = () => {
    // CSV export logic
    console.log("Export to CSV");
  };

  // Sample data matching the image
  const reportData = [
    {
      key: "january",
      month: "January",
      jan: 50000,
      feb: 50000,
      mar: 50000,
      apr: 50000,
      may: 50000,
      jun: 50000,
      jul: 50000,
      aug: 50000,
      sep: 50000,
      oct: 50000,
      nov: 50000,
      dec: 50000,
    },
    {
      key: "february",
      month: "February",
      jan: 30000,
      feb: 50000,
      mar: 50000,
      apr: 50000,
      may: 50000,
      jun: 50000,
      jul: 50000,
      aug: 50000,
      sep: 50000,
      oct: 50000,
      nov: 50000,
      dec: 50000,
    },
    {
      key: "march",
      month: "March",
      jan: 7000,
      feb: 50000,
      mar: 50000,
      apr: 50000,
      may: 50000,
      jun: 50000,
      jul: 50000,
      aug: 50000,
      sep: 50000,
      oct: 50000,
      nov: 50000,
      dec: 50000,
    },
    {
      key: "april",
      month: "April",
      jan: 7000,
      feb: 50000,
      mar: 50000,
      apr: 50000,
      may: 50000,
      jun: 50000,
      jul: 50000,
      aug: 50000,
      sep: 50000,
      oct: 50000,
      nov: 50000,
      dec: 50000,
    },
    {
      key: "may",
      month: "May",
      jan: 7000,
      feb: 50000,
      mar: 50000,
      apr: 50000,
      may: 50000,
      jun: 50000,
      jul: 50000,
      aug: 50000,
      sep: 50000,
      oct: 50000,
      nov: 50000,
      dec: 50000,
    },
    {
      key: "june",
      month: "June",
      jan: 7000,
      feb: 30000,
      mar: 30000,
      apr: 30000,
      may: 30000,
      jun: 30000,
      jul: 30000,
      aug: 30000,
      sep: 30000,
      oct: 30000,
      nov: 30000,
      dec: 30000,
    },
    {
      key: "july",
      month: "July",
      jan: 7000,
      feb: 30000,
      mar: 30000,
      apr: 30000,
      may: 30000,
      jun: 30000,
      jul: 30000,
      aug: 30000,
      sep: 30000,
      oct: 30000,
      nov: 30000,
      dec: 30000,
    },
    {
      key: "august",
      month: "August",
      jan: 7000,
      feb: 30000,
      mar: 30000,
      apr: 30000,
      may: 30000,
      jun: 30000,
      jul: 30000,
      aug: 30000,
      sep: 30000,
      oct: 30000,
      nov: 30000,
      dec: 30000,
    },
    {
      key: "september",
      month: "September",
      jan: 7000,
      feb: 7000,
      mar: 7000,
      apr: 7000,
      may: 7000,
      jun: 7000,
      jul: 7000,
      aug: 7000,
      sep: 7000,
      oct: 7000,
      nov: 7000,
      dec: 7000,
    },
    {
      key: "october",
      month: "October",
      jan: 7000,
      feb: 7000,
      mar: 7000,
      apr: 7000,
      may: 7000,
      jun: 7000,
      jul: 7000,
      aug: 7000,
      sep: 7000,
      oct: 7000,
      nov: 7000,
      dec: 7000,
    },
    {
      key: "november",
      month: "November",
      jan: 7000,
      feb: 7000,
      mar: 7000,
      apr: 7000,
      may: 7000,
      jun: 7000,
      jul: 7000,
      aug: 7000,
      sep: 7000,
      oct: 7000,
      nov: 7000,
      dec: 7000,
    },
    {
      key: "december",
      month: "December",
      jan: 7000,
      feb: 7000,
      mar: 7000,
      apr: 7000,
      may: 7000,
      jun: 7000,
      jul: 7000,
      aug: 7000,
      sep: 7000,
      oct: 7000,
      nov: 7000,
      dec: 7000,
    },
  ];

  // Calculate totals
  const totalRow = {
    key: "total",
    month: "Total",
    jan: reportData.reduce((sum, row) => sum + row.jan, 0),
    feb: reportData.reduce((sum, row) => sum + row.feb, 0),
    mar: reportData.reduce((sum, row) => sum + row.mar, 0),
    apr: reportData.reduce((sum, row) => sum + row.apr, 0),
    may: reportData.reduce((sum, row) => sum + row.may, 0),
    jun: reportData.reduce((sum, row) => sum + row.jun, 0),
    jul: reportData.reduce((sum, row) => sum + row.jul, 0),
    aug: reportData.reduce((sum, row) => sum + row.aug, 0),
    sep: reportData.reduce((sum, row) => sum + row.sep, 0),
    oct: reportData.reduce((sum, row) => sum + row.oct, 0),
    nov: reportData.reduce((sum, row) => sum + row.nov, 0),
    dec: reportData.reduce((sum, row) => sum + row.dec, 0),
  };

  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  const columns = [
    {
      title: "",
      dataIndex: "month",
      key: "month",
      align: "left",
      width: 150,
      fixed: "left",
    },
    {
      title: "Jan 2025",
      dataIndex: "jan",
      key: "jan",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Feb 2025",
      dataIndex: "feb",
      key: "feb",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Mar 2025",
      dataIndex: "mar",
      key: "mar",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Apr 2025",
      dataIndex: "apr",
      key: "apr",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "May 2025",
      dataIndex: "may",
      key: "may",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Jun 2025",
      dataIndex: "jun",
      key: "jun",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Jul 2025",
      dataIndex: "jul",
      key: "jul",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Aug 2025",
      dataIndex: "aug",
      key: "aug",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Sep 2025",
      dataIndex: "sep",
      key: "sep",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Oct 2025",
      dataIndex: "oct",
      key: "oct",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Nov 2025",
      dataIndex: "nov",
      key: "nov",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Dec 2025",
      dataIndex: "dec",
      key: "dec",
      align: "right",
      render: (value) => formatCurrency(value),
    },
  ];

  const dataSource = [...reportData, totalRow];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Annual Report</h2>
          <p className="text-sm text-gray-500">View Reports of Annual Report</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button
            icon={<FaFilePdf color="red" size={16} />}
            onClick={handleExportPDF}
            title="Export to PDF"
          />
          <Button
            icon={<FaFileExcel color="green" size={16} />}
            onClick={handleExportCSV}
            title="Export to Excel"
          />
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            title="Print"
          />
          <Button
            icon={<IoReloadOutline color="#9333ea" size={18} />}
            onClick={handleRefresh}
            title="Refresh"
          />
          <Button
            icon={<FaAngleUp color="#9333ea" size={16} />}
            onClick={toggleFilters}
            title={filtersCollapsed ? "Expand filters" : "Collapse filters"}
            style={{
              transform: filtersCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </div>
      </div>

      {/* Filters Section */}
      {!filtersCollapsed && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <DatePicker
                picker="year"
                value={selectedYear}
                onChange={setSelectedYear}
                className="w-full"
                format="YYYY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store
              </label>
              <Select
                value={selectedStore}
                onChange={setSelectedStore}
                className="w-full"
              >
                <Option value="All Stores">All Stores</Option>
                <Option value="Store 1">Store 1</Option>
                <Option value="Store 2">Store 2</Option>
              </Select>
            </div>

            <div>
              <Button
                type="primary"
                className="w-full"
                style={{
                  background: "#9333ea",
                  borderColor: "#9333ea",
                  height: 38,
                }}
              >
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered={false}
          rowClassName={(record) => {
            if (record.key === "total") {
              return "bg-gray-50 font-semibold";
            }
            return "hover:bg-gray-50";
          }}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
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

export default AnnualReport;