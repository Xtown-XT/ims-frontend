// src/pages/peoples/customers.jsx
import React, { useState } from "react";
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
  Switch,
  Select,
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

const Customers = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [customers, setCustomers] = useState([
    {
      key: "1",
      code: "CU001",
      name: "Carl Evans",
      email: "carlevans@example.com",
      phone: "+12163547758",
      country: "Germany",
      status: "Active",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      address: "87 Griffin Street",
      city: "Los Angeles",
      state: "California",
      postalCode: "90001",
    },
    {
      key: "2",
      code: "CU002",
      name: "Minerva Rameriz",
      email: "rameriz@example.com",
      phone: "+11367529510",
      country: "Japan",
      status: "Active",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      address: "23 Sakura Avenue",
      city: "Tokyo",
      state: "Tokyo",
      postalCode: "100-0001",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);

  const [form] = Form.useForm();

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleMenuClick = (e) => {
    setStatusFilter(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="Active">Active</Menu.Item>
      <Menu.Item key="Inactive">Inactive</Menu.Item>
    </Menu>
  );

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter("All");
    setCurrentPage(1);
    setPageSize(10);
    message.success("Refreshed");
  };

  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
  };

  const filteredData = customers.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.code && item.code.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const openDeleteModal = (record) => {
    setDeleteCustomer(record);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setCustomers((prev) => prev.filter((c) => c.key !== deleteCustomer.key));
    message.success(`Customer "${deleteCustomer?.name}" deleted successfully!`);
    setIsDeleteModalVisible(false);
    setDeleteCustomer(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteCustomer(null);
  };

  const showAddModal = () => {
    form.resetFields();
    setSelectedCustomer(null);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    const [firstName, ...rest] = (record.name || "").split(" ");
    const lastName = rest.join(" ") || "";
    form.setFieldsValue({
      firstName,
      lastName,
      email: record.email,
      phone: record.phone,
      address: record.address,
      city: record.city,
      state: record.state,
      country: record.country,
      postalCode: record.postalCode,
      status: record.status === "Active",
    });
    setSelectedCustomer(record);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setViewCustomer(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setViewCustomer(null);
    setIsViewModalVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditMode(false);
    setSelectedCustomer(null);
  };

  const handleAddOrEditCustomer = (values) => {
    const newCustomerObj = {
      key: isEditMode && selectedCustomer ? selectedCustomer.key : Date.now().toString(),
      code:
        isEditMode && selectedCustomer
          ? selectedCustomer.code
          : `CU${String(customers.length + 1).padStart(3, "0")}`,
      name: `${values.firstName || ""} ${values.lastName || ""}`.trim(),
      email: values.email || "",
      phone: values.phone || "",
      country: values.country || "",
      status: values.status ? "Active" : "Inactive",
      avatar:
        (isEditMode && selectedCustomer && selectedCustomer.avatar) ||
        "https://via.placeholder.com/150",
      address: values.address || "",
      city: values.city || "",
      state: values.state || "",
      postalCode: values.postalCode || "",
    };

    if (isEditMode && selectedCustomer) {
      setCustomers((prev) => prev.map((c) => (c.key === selectedCustomer.key ? newCustomerObj : c)));
      message.success(`Customer "${newCustomerObj.name}" updated successfully!`);
    } else {
      setCustomers((prev) => [newCustomerObj, ...prev]);
      message.success(`Customer "${newCustomerObj.name}" added successfully!`);
    }

    setIsModalVisible(false);
    form.resetFields();
    setIsEditMode(false);
    setSelectedCustomer(null);
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} />
          {text}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      // ✅ UPDATED STATUS COLUMN WITH DROPDOWN FUNCTIONALITY
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const handleStatusChange = (newStatus) => {
          setCustomers((prev) =>
            prev.map((c) =>
              c.key === record.key ? { ...c, status: newStatus } : c
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
            <Button
              type="text"
              className="flex items-center gap-1"
              style={{ cursor: "pointer" }}
            >
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
            onClick={(e) => {
              e.stopPropagation();
              showViewModal(record);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              showEditModal(record);
            }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "black" }} />}
            title="Delete"
            onClick={(e) => {
              // prevent row click or other parent handlers from interfering
              e.stopPropagation();
              openDeleteModal(record);
            }}
          />
        </Space>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const pageSizeMenu = (
    <Menu onClick={(e) => handlePageSizeChange(Number(e.key))}>
      <Menu.Item key="10">10</Menu.Item>
      <Menu.Item key="25">25</Menu.Item>
      <Menu.Item key="50">50</Menu.Item>
      <Menu.Item key="100">100</Menu.Item>
    </Menu>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Customers</h2>
          <p className="text-gray-500">Manage your customers</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button
            icon={<FaFilePdf color="red" size={16} />}
            className="border-gray-300"
            title="Export to PDF"
          />
          <Button
            icon={<FaFileExcel color="green" size={16} />}
            className="border-gray-300"
            title="Export to Excel"
          />
          <Button
            icon={<IoReloadOutline color="#9333ea" size={18} />}
            onClick={handleRefresh}
            className="border-gray-300"
            title="Refresh"
          />
          <Button
            icon={
              <FaAngleUp
                color="#9333ea"
                size={16}
                style={{
                  transform: filtersCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={toggleFilters}
            className="border-gray-300"
            title={filtersCollapsed ? "Expand filters" : "Collapse filters"}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-orange-500 hover:bg-orange-600"
            onClick={showAddModal}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            Add Customer
          </Button>
        </div>
      </div>
      {/* Search & Filter */}
      {!filtersCollapsed && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <Input
            prefix={<SearchOutlined style={{ fontSize: "12px", color: "#999" }} />}
            placeholder="Search"
            value={searchText}
            onChange={handleSearch}
            className="w-full sm:w-20 h-6 text-[10px] rounded-sm px-2 py-0.5"
            style={{ maxWidth: "270px" }}
          />
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button size="small" className="text-[10px] h-6 flex items-center justify-center px-2">
              Status <DownOutlined style={{ fontSize: "10px", marginLeft: 6 }} />
            </Button>
          </Dropdown>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={paginatedData}
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
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {/* Add/Edit Customer Modal */}
      <Modal
        title={isEditMode ? "Edit Customer" : "Add Customer"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        centered
      >
        <Form layout="vertical" form={form} onFinish={handleAddOrEditCustomer}>
          <Form.Item label="Upload Image" name="avatar">
            <Upload maxCount={1} listType="picture-card" showUploadList={false}>
              <div>
                <UploadOutlined /> Upload Image
              </div>
            </Upload>
            <p>JPEG, PNG up to 2MB</p>
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

          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Please enter phone number" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter address" }]}>
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
                <Select.Option value="Los Angeles">Los Angeles</Select.Option>
                <Select.Option value="Chennai">Chennai</Select.Option>
                <Select.Option value="Mumbai">Mumbai</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please select state" }]}
              className="flex-1"
            >
              <Select>
                <Select.Option value="California">California</Select.Option>
                <Select.Option value="TN">Tamil Nadu</Select.Option>
                <Select.Option value="MH">Maharashtra</Select.Option>
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
                <Select.Option value="Japan">Japan</Select.Option>
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

          <Form.Item name="status" label="Status" valuePropName="checked" initialValue={true}>
            <Switch defaultChecked />
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Save Changes" : "Add Customer"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Customer Modal */}
      <Modal
        title="Customer Details"
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
        {viewCustomer ? (
          <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar size={80} src={viewCustomer.avatar} />
              <div>
                <h3 className="text-lg font-semibold">{viewCustomer.name}</h3>
                <p className="text-sm text-gray-500">Code: {viewCustomer.code}</p>
                <div style={{ marginTop: 6 }}>
                  {viewCustomer.status === "Active" ? (
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
                <p className="text-sm">{viewCustomer.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm">{viewCustomer.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="text-sm">{viewCustomer.address || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">City / State</p>
                <p className="text-sm">
                  {viewCustomer.city || "-"} {viewCustomer.state ? `/ ${viewCustomer.state}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Country</p>
                <p className="text-sm">{viewCustomer.country || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Postal Code</p>
                <p className="text-sm">{viewCustomer.postalCode || "-"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
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
          <h3 className="text-lg font-semibold mb-1">Delete Customer</h3>
          <p className="text-gray-500 mb-5">Are you sure you want to delete customer?</p>
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

export default Customers;
