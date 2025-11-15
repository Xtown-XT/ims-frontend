// src/pages/peoples/billers.jsx
import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  Menu,
  Tag,
  Space,
  Avatar,
  Pagination,
  message,
  Modal,
  Form,
  Upload,
  Select,
  Switch,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Billers = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [billers, setBillers] = useState([
    {
      key: "1",
      code: "BI001",
      name: "Shaun Farley",
      company: "GreenTech Industries",
      email: "shaun@example.com",
      phone: "+18647961254",
      country: "USA",
      status: "Active",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      address: "45 Main Street",
      city: "New York",
      state: "New York",
      postalCode: "10001",
    },
    {
      key: "2",
      code: "BI002",
      name: "Jenny Ellis",
      company: "BlueSky Logistics",
      email: "jenny@example.com",
      phone: "+13197521863",
      country: "Germany",
      status: "Active",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      address: "12 Green Avenue",
      city: "Berlin",
      state: "Berlin",
      postalCode: "10115",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewBiller, setViewBiller] = useState(null);
  const [form] = Form.useForm();

  // 🆕 Added states for Delete Confirmation Modal
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteBiller, setDeleteBiller] = useState(null);

  const handleSearch = (e) => setSearchText(e.target.value);
  const handleMenuClick = (e) => setStatusFilter(e.key);

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter("All");
    message.success("Refreshed");
  };

  const toggleFilters = () => setFiltersCollapsed((prev) => !prev);

  const filteredData = useMemo(() => {
    return billers.filter((item) => {
      const s = searchText.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(s) ||
        item.email.toLowerCase().includes(s) ||
        item.company.toLowerCase().includes(s);
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, billers]);

  // Export Functions
  const handleExportCSV = () => {
    if (!filteredData.length) return message.info("No data to export");
    const headers = [
      "Code",
      "Biller",
      "Company",
      "Email",
      "Phone",
      "Country",
      "Status",
    ];
    const csvRows = [headers.join(",")];
    filteredData.forEach((b) =>
      csvRows.push(
        [
          b.code,
          b.name,
          b.company,
          b.email,
          b.phone,
          b.country,
          b.status,
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
    );
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `billers_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Excel exported successfully");
  };

  const handleExportPDF = () => {
    if (!filteredData.length) return message.info("No data to export");

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });
    doc.setFontSize(16);
    doc.setTextColor("#9333ea");
    doc.text("Billers Report", 40, 40);

    autoTable(doc, {
      startY: 60,
      head: [["Code", "Biller", "Company", "Email", "Phone", "Country", "Status"]],
      body: filteredData.map((b) => [
        b.code,
        b.name,
        b.company,
        b.email,
        b.phone,
        b.country,
        b.status,
      ]),
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`billers_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // Modal Controls
  const showAddModal = () => {
    setIsEditMode(false);
    setSelectedBiller(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEditMode(true);
    setSelectedBiller(record);
    const [firstName, ...rest] = record.name.split(" ");
    const lastName = rest.join(" ");
    form.setFieldsValue({
      firstName,
      lastName,
      company: record.company,
      email: record.email,
      phone: record.phone,
      address: record.address,
      city: record.city,
      state: record.state,
      country: record.country,
      postalCode: record.postalCode,
      status: record.status === "Active",
    });
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setViewBiller(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setViewBiller(null);
    setIsViewModalVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditMode(false);
  };

  const handleSubmit = (values) => {
    const newBiller = {
      key: isEditMode && selectedBiller ? selectedBiller.key : Date.now().toString(),
      code:
        isEditMode && selectedBiller
          ? selectedBiller.code
          : `BI${String(billers.length + 1).padStart(3, "0")}`,
      name: `${values.firstName} ${values.lastName}`,
      company: values.company,
      email: values.email,
      phone: values.phone,
      country: values.country,
      status: values.status ? "Active" : "Inactive",
      avatar:
        (isEditMode && selectedBiller && selectedBiller.avatar) ||
        "https://via.placeholder.com/150",
      address: values.address,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
    };

    if (isEditMode && selectedBiller) {
      setBillers((prev) =>
        prev.map((b) => (b.key === selectedBiller.key ? newBiller : b))
      );
      message.success(`Biller "${newBiller.name}" updated successfully!`);
    } else {
      setBillers((prev) => [newBiller, ...prev]);
      message.success(`Biller "${newBiller.name}" added successfully!`);
    }

    form.resetFields();
    setIsModalVisible(false);
    setIsEditMode(false);
    setSelectedBiller(null);
  };

  // 🆕 Updated delete logic to open confirmation modal
  const openDeleteModal = (record) => {
    setDeleteBiller(record);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setBillers((prev) => prev.filter((b) => b.key !== deleteBiller.key));
    message.success(`Biller "${deleteBiller?.name}" deleted successfully!`);
    setIsDeleteModalVisible(false);
    setDeleteBiller(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteBiller(null);
  };

  const columns = [
    { title: "Code", dataIndex: "code", key: "code" },
    {
      title: "Biller",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} />
          {text}
        </Space>
      ),
    },
    { title: "Company Name", dataIndex: "company", key: "company" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const handleStatusChange = (newStatus) => {
          setBillers((prev) =>
            prev.map((b) =>
              b.key === record.key ? { ...b, status: newStatus } : b
            )
          );
          message.success(`Status changed to ${newStatus}`);
        };

        const statusMenu = (
          <Menu
            onClick={({ key }) => handleStatusChange(key)}
            items={[
              { key: "Active", label: "Active" },
              { key: "Inactive", label: "Inactive" },
            ]}
          />
        );

        return (
          <Dropdown overlay={statusMenu} trigger={["click"]}>
            <Button type="text" className="flex items-center gap-1">
              {status === "Active" ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              )}
              <DownOutlined style={{ fontSize: 10, color: "#888" }} />
            </Button>
          </Dropdown>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            title="View"
            onClick={() => showViewModal(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            title="Edit"
            onClick={() => showEditModal(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "black" }} />}
            title="Delete"
            onClick={() => openDeleteModal(record)} // 🆕 Changed
          />
        </Space>
      ),
    },
  ];

  const pageSizeMenu = (
    <Menu onClick={(e) => setPageSize(Number(e.key))}>
      <Menu.Item key="10">10</Menu.Item>
      <Menu.Item key="25">25</Menu.Item>
      <Menu.Item key="50">50</Menu.Item>
      <Menu.Item key="100">100</Menu.Item>
    </Menu>
  );

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="Active">Active</Menu.Item>
      <Menu.Item key="Inactive">Inactive</Menu.Item>
    </Menu>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Billers</h2>
          <p className="text-sm text-gray-500">Manage your Billers</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button icon={<FaFilePdf color="red" size={16} />} onClick={handleExportPDF} title="Export to PDF" />
          <Button icon={<FaFileExcel color="green" size={16} />} onClick={handleExportCSV} title="Export to Excel" />
          <Button icon={<IoReloadOutline color="#9333ea" size={18} />} onClick={handleRefresh} title="Refresh" />
          <Button
            icon={
              <FaAngleUp
                color="#9333ea"
                size={16}
                style={{
                  transform: filtersCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            }
            onClick={toggleFilters}
            title={filtersCollapsed ? "Expand filters" : "Collapse filters"}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              background: "#9333ea",
              borderColor: "#9333ea",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onClick={showAddModal}
          >
            Add Biller
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      {!filtersCollapsed && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <Input
            prefix={<SearchOutlined style={{ fontSize: "12px", color: "#999" }} />}
            placeholder="Search by name, email or company"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 250 }}
            allowClear
          />
          <Dropdown overlay={menu}>
            <Button size="small">
              Status <DownOutlined style={{ fontSize: 10, marginLeft: 6 }} />
            </Button>
          </Dropdown>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        pagination={false}
        bordered={false}
        className="rounded-md"
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span>Row Per Page</span>
          <Dropdown overlay={pageSizeMenu} placement="top">
            <Button className="border border-gray-300 rounded-md px-2 py-1">
              {pageSize} <DownOutlined style={{ marginLeft: 6 }} />
            </Button>
          </Dropdown>
          <span>Entries</span>
        </div>
        <Pagination
          current={currentPage}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>

      {/* Add/Edit Biller Modal */}
      <Modal
        title={isEditMode ? "Edit Biller" : "Add Biller"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item label="Upload Image">
            <Upload maxCount={1} listType="picture-card">
              <div>
                <UploadOutlined /> Upload Image
              </div>
            </Upload>
            <p>JPEG, PNG up to 2 MB</p>
          </Form.Item>

          <div className="flex gap-3">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter first name" }]}
              className="flex-1"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name" }]}
              className="flex-1"
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="company"
            label="Company Name"
            rules={[{ required: true, message: "Please enter company name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input />
          </Form.Item>

          <div className="flex gap-3">
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please select city" }]}
              className="flex-1"
            >
              <Select>
                <Select.Option value="Chennai">Chennai</Select.Option>
                <Select.Option value="Mumbai">Mumbai</Select.Option>
                <Select.Option value="Berlin">Berlin</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please select state" }]}
              className="flex-1"
            >
              <Select>
                <Select.Option value="TN">Tamil Nadu</Select.Option>
                <Select.Option value="MH">Maharashtra</Select.Option>
                <Select.Option value="Berlin">Berlin</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex gap-3">
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please select country" }]}
              className="flex-1"
            >
              <Select>
                <Select.Option value="India">India</Select.Option>
                <Select.Option value="USA">USA</Select.Option>
                <Select.Option value="Germany">Germany</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="postalCode"
              label="Postal Code"
              rules={[{ required: true, message: "Please enter postal code" }]}
              className="flex-1"
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Save Changes" : "Add Biller"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Biller Details Modal */}
      <Modal
        title="Biller Details"
        open={isViewModalVisible}
        onCancel={handleCloseViewModal}
        footer={[
          <Button key="close" onClick={handleCloseViewModal}>
            Close
          </Button>,
        ]}
        width={700}
        centered
      >
        {viewBiller ? (
          <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar size={80} src={viewBiller.avatar} />
              <div>
                <h3 className="text-lg font-semibold">{viewBiller.name}</h3>
                <p className="text-sm text-gray-500">Code: {viewBiller.code}</p>
                <p className="text-sm text-gray-500">
                  Company: {viewBiller.company}
                </p>
                <div style={{ marginTop: 6 }}>
                  {viewBiller.status === "Active" ? (
                    <Tag color="green">Active</Tag>
                  ) : (
                    <Tag color="red">Inactive</Tag>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm">{viewBiller.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm">{viewBiller.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="text-sm">{viewBiller.address || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">City / State</p>
                <p className="text-sm">
                  {viewBiller.city || "-"} {viewBiller.state ? `/ ${viewBiller.state}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Country</p>
                <p className="text-sm">{viewBiller.country || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Postal Code</p>
                <p className="text-sm">{viewBiller.postalCode || "-"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>

      {/* 🆕 Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalVisible}
        onCancel={handleCancelDelete}
        footer={null}
        centered
        width={400}
        className="delete-modal"
      >
        <div className="text-center p-4">
          <div
            className="flex justify-center items-center mb-3"
            style={{
              background: "#fdecea",
              width: 60,
              height: 60,
              margin: "0 auto",
              borderRadius: "50%",
            }}
          >
            <DeleteOutlined style={{ color: "black", fontSize: 28 }} />
          </div>
          <h3 className="text-lg font-semibold mb-1">Delete Biller</h3>
          <p className="text-gray-500 mb-5">Are you sure you want to delete biller?</p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={handleCancelDelete}
              style={{
                background: "#001f3f",
                color: "#fff",
                border: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              danger
              type="primary"
              onClick={handleConfirmDelete}
              style={{
                background: "#ff8c00",
                border: "none",
              }}
            >
              Yes Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Billers;
