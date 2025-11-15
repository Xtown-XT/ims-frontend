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
  PlusCircleOutlined
} from "@ant-design/icons";
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  Pagination,
  Form,
  Modal,
  Checkbox,
  DatePicker,
  Row,
  Col
} from "antd";

const { Option } = Select;

const Discount = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('')
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [checked, setChecked] = useState(true);
  const [shortByFilter, setShortByFilter] = useState("Customers");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState(true);

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
      title: <input type="checkbox" />,
      dataIndex: "checkbox",
      render: () => <input type="checkbox" />,
      width: 50,
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
      status: status === true ? "Active" : "InActive",
      render: (status) => (
        <button
          style={{
            backgroundColor:
              status.toLowerCase() === "active" ? "#71D98D" : "#FF9999",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            height: "22px",
            width: "70px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "default",
          }}
        >
          {status}
        </button>
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddDiscount = () => {
    setIsModalVisible(false);
  };

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
            onClick={showModal}
            style={{
              background: "#9333ea",
              borderColor: "#9333ea",
              height: "38px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <PlusCircleOutlined style={{ color: "#fff" }} />
              <span>Add Discount</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div>
        <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="flex gap-3">
            <Form.Item>
              <Select
                placeholder="Customers"
                style={{ width: 150 }}
                value={shortByFilter}
                onChange={(val) => setShortByFilter(val)}
              >

                <Option value="kiran">kiran</Option>
                <Option value="vijay">vijay</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Select
                placeholder="Status"
                style={{ width: 150 }}
                value={filterStatus}
                onChange={(val) => setFilterStatus(val)}
                allowClear
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>

          </div>
        </Form>
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

      {/* Add Discount Modal */}
      <Modal
        title="Add Discount"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="add" type="primary" onClick={handleAddDiscount}>
            Add Discount
          </Button>,
        ]}
        width={800} // Increased width to accommodate three columns
      >
        <Form layout="vertical">
          {/* First Row: Three inputs in one row */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Discount Name"
                required
                style={{ marginBottom: 16 }}
              >
                <Select placeholder="Select" style={{ width: "100%" }}>
                  <Option value="weekend">Weekend Deal</Option>
                  <Option value="loyalty">Loyalty Reward</Option>
                  <Option value="flash">Flash Sale</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Valid From"
                required
                style={{ marginBottom: 16 }}
              >
                <DatePicker
                  placeholder="dd/mm/yyyy"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Discount Plan"
                required
                style={{ marginBottom: 16 }}
              >
                <Select placeholder="Select" style={{ width: "100%" }}>
                  <Option value="standard">Standard</Option>
                  <Option value="membership">Membership</Option>
                  <Option value="premium">Premium</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Second Row: Three inputs in one row */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Valid Till"
                required
                style={{ marginBottom: 16 }}
              >
                <DatePicker
                  placeholder="13-11-2025"
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Applicable For"
                required
                style={{ marginBottom: 16 }}
              >
                <Select placeholder="Select" style={{ width: "100%" }}>
                  <Option value="all">All Products</Option>
                  <Option value="specific">Specific Products</Option>
                  <Option value="category">Product Category</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Discount Type"
                required
                style={{ marginBottom: 16 }}
              >
                <Select placeholder="Select" style={{ width: "100%" }}>
                  <Option value="percentage">Percentage</Option>
                  <Option value="flat">Flat</Option>
                  <Option value="fixed">Fixed Amount</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Days Checkboxes - Full width */}
          <Form.Item
            label="Valid on Following Days"
            required
            style={{ marginBottom: 16 }}
          >
            <div style={{ display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap" }}>
              <Checkbox checked={true} style={{ margin: 0 }}>Monday</Checkbox>
              <Checkbox checked={true} style={{ margin: 0 }}>Tuesday</Checkbox>
              <Checkbox style={{ margin: 0 }}>Wednesday</Checkbox>
              <Checkbox style={{ margin: 0 }}>Thursday</Checkbox>
              <Checkbox style={{ margin: 0 }}>Friday</Checkbox>
              <Checkbox style={{ margin: 0 }}>Saturday</Checkbox>
              <Checkbox style={{ margin: 0 }}>Sunday</Checkbox>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Discount;