import React, { useState } from "react";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  UpOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  Pagination,
} from "antd";

const { Option } = Select;

const Discount = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const discounts = [
    {
      name: "Weekend Deal",
      value: "70 (Percentage)",
      plan: "Standard",
      validity: "22 May 2025 - 24 Jun 2025",
      days: "Sat, Sun",
      products: "All Products",
      status: "Active",
    },
    {
      name: "Loyalty Reward",
      value: "40 (Flat)",
      plan: "Membership",
      validity: "16 Apr 2025 - 16 May 2025",
      days: "Mon, Tue, Thu, Fri",
      products: "Specific Products",
      status: "Active",
    },
    {
      name: "Flash Sale",
      value: "60 (Percentage)",
      plan: "Standard",
      validity: "20 Mar 2025 - 20 Apr 2025",
      days: "Thu, Fri, Sat, Sun",
      products: "All Products",
      status: "Active",
    },
    {
      name: "Super Saver",
      value: "80 (Percentage)",
      plan: "Standard",
      validity: "15 Feb 2025 - 15 Apr 2025",
      days: "Mon, Tue, Wed",
      products: "All Products",
      status: "Active",
    },
    {
      name: "Surprise Savings",
      value: "50 (Flat)",
      plan: "Standard",
      validity: "24 Jan 2025 - 24 Mar 2025",
      days: "Mon, Tue, Thu, Sat",
      products: "Specific Products",
      status: "Active",
    },
  ];

  const filteredData = discounts.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      key: "checkbox",
      render: () => (
        <input type="checkbox" className="w-4 h-4 accent-orange-500" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Discount Plan",
      dataIndex: "plan",
      key: "plan",
    },
    {
      title: "Validity",
      dataIndex: "validity",
      key: "validity",
    },
    {
      title: "Days",
      dataIndex: "days",
      key: "days",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Discount</h2>
          <p className="text-gray-500">Manage your discount</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            icon={<FilePdfOutlined />}
            style={{
              backgroundColor: "#FF4D4F",
              color: "white",
              border: "none",
            }}
          />
          <Button
            icon={<FileExcelOutlined />}
            style={{
              backgroundColor: "#52C41A",
              color: "white",
              border: "none",
            }}
          />
          <Button icon={<ReloadOutlined />} />
          <Button icon={<UpOutlined />} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-orange-500 border-none hover:bg-orange-600"
          >
            Add Discount
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            className="w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-3">
            <Select defaultValue="Customer" style={{ width: 130 }}>
              <Option value="Customer">Customer</Option>
              <Option value="Member">Member</Option>
            </Select>
            <Select defaultValue="Status" style={{ width: 130 }}>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Discount Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          pagination={false}
          rowKey="name"
        />

        {/* Footer with Row Per Page Dropdown */}
        <div className="flex justify-between items-center mt-4 px-2 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <span>Row Per Page</span>
            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              size="small"
              style={{ width: 70 }}
            >
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span>Entries</span>
          </div>

          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Discount;
