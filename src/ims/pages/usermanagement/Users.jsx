import React, { useState, useEffect } from "react";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  PlusOutlined,
  UploadOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Table,
  Select,
  Modal,
  Upload,
  Form,
  Switch,
  Pagination,
} from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// 🖼️ Images
import AlizaDuncan from "../Sales/assets/AlizaDuncan.jpeg";
import HenryBryant from "../Sales/assets/HenryBryant.jpeg";
import JadaRobinson from "../Sales/assets/JadaRobinson.jpeg";
import JamesHigham from "../Sales/assets/JamesHigham.jpeg";
import JennyEllis from "../Sales/assets/JennyEllis.jpeg";
import KarenGalvan from "../Sales/assets/KarenGalvan.jpeg";
import LeonBaxter from "../Sales/assets/LeonBaxter.jpeg";
import MichaelDawson from "../Sales/assets/MichaelDawson.jpeg";
import ThomasWard from "../Sales/assets/ThomasWard.jpeg";

const { Search } = Input;
const { Option } = Select;

const Users = () => {
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const usersData = [
    {
      key: "1",
      avatar: HenryBryant,
      name: "Henry Bryant",
      phone: "+12498345785",
      email: "henry@example.com",
      role: "Admin",
      status: "InActive",
    },
    {
      key: "2",
      avatar: JennyEllis,
      name: "Jenny Ellis",
      phone: "+13178964582",
      email: "jenny@example.com",
      role: "Manager",
      status: "Active",
    },
    {
      key: "3",
      avatar: LeonBaxter,
      name: "Leon Baxter",
      phone: "+12796183487",
      email: "leon@example.com",
      role: "Salesman",
      status: "Active",
    },
    {
      key: "4",
      avatar: KarenGalvan,
      name: "Karen Flores",
      phone: "+17538647943",
      email: "karen@example.com",
      role: "Supervisor",
      status: "Active",
    },
    {
      key: "5",
      avatar: MichaelDawson,
      name: "Michael Dawson",
      phone: "+13798132475",
      email: "michael@example.com",
      role: "Store Keeper",
      status: "Active",
    },
    {
      key: "6",
      avatar: KarenGalvan,
      name: "Karen Galvan",
      phone: "+17596341894",
      email: "karen@example.com",
      role: "Purchase",
      status: "Active",
    },
  ];

  useEffect(() => {
    setFilteredData(usersData);
  }, []);

  const applyFilters = () => {
    let filtered = [...usersData];

    if (searchText) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          user.phone.includes(searchText) ||
          user.role.toLowerCase().includes(searchText.toLowerCase()) ||
          user.status.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (user) => user.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredData(filtered);
    setCurrent(1);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, statusFilter]);

  const handleSearch = (value) => setSearchText(value);
  const handleStatusFilter = (value) => setStatusFilter(value);

  const handleView = (record) => {
    Modal.info({
      title: "User Details",
      content: (
        <div>
          <p><strong>Name:</strong> {record.name}</p>
          <p><strong>Email:</strong> {record.email}</p>
          <p><strong>Phone:</strong> {record.phone}</p>
          <p><strong>Role:</strong> {record.role}</p>
          <p><strong>Status:</strong> {record.status}</p>
        </div>
      ),
      width: 500,
    });
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditingUser(record);
    form.setFieldsValue({
      user: record.name,
      role: record.role,
      email: record.email,
      phone: record.phone,
      status: record.status === "Active",
    });
    setImagePreview(record.avatar);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete ${record.name}?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        const updatedUsers = usersData.filter((user) => user.key !== record.key);
        setFilteredData(updatedUsers);
      },
    });
  };

  // ✅ Checkbox selection handlers
  const handleSelectAll = (selected) => {
    setSelectedRowKeys(selected ? filteredData.map((item) => item.key) : []);
  };

  const handleSelectRow = (record, selected) => {
    if (selected) {
      setSelectedRowKeys([...selectedRowKeys, record.key]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.key));
    }
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.avatar}
            alt={record.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-gray-800">{record.name}</span>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
   {
  title: "Status",
  dataIndex: "status",
  render: (status) => {
    const statusColors = {
      Active: { background: "#3EB780", color: "#fff" },
      InActive: { background: "#d63031", color: "#fff" },
    };

    const colors = statusColors[status] || {
      background: "#ff9999",
      color: "#fff",
    };

    return (
      <span
        style={{
          backgroundColor: colors.background,
          color: colors.color,
          padding: "4px 0px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "500",
          display: "inline-block",
          textAlign: "center",
          width: "46px",
        }}
      >
        {status}
      </span>
    );
  },
},

    {
      title: "",
      render: (_, record) => (
        <div className="flex gap-1">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
            className="w-8 h-8 flex items-center justify-center border-gray-300 text-gray-500 hover:text-blue-500 hover:border-blue-300"
            title="View User"
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            className="w-8 h-8 flex items-center justify-center border-gray-300 text-gray-500 hover:text-purple-500 hover:border-purple-300"
            title="Edit User"
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
            className="w-8 h-8 flex items-center justify-center border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-300"
            title="Delete User"
          />
        </div>
      ),
    },
  ];

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const showModal = () => {
    setIsEditMode(false);
    setEditingUser(null);
    form.resetFields();
    setImagePreview(null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setImagePreview(null);
    setIsEditMode(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (isEditMode) {
        console.log("User Edited:", { ...editingUser, ...values });
      } else {
        console.log("User Added:", values);
      }
      setIsModalVisible(false);
      form.resetFields();
      setImagePreview(null);
      setIsEditMode(false);
    });
  };

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter(null);
    setSelectedRowKeys([]);
    setFilteredData(usersData);
    setCurrent(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Users</h1>
          <p className="text-sm text-gray-500">Manage your users</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
            title="Refresh"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="h-9 px-4 rounded-lg font-medium"
            onClick={showModal}
            style={{
              backgroundColor: "#8b5cf6",
              border: "none",
            }}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-6">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64 h-10 rounded-lg border-gray-300"
        />

        <Select
          placeholder="Status"
          className="w-32 h-10"
          value={statusFilter}
          onChange={handleStatusFilter}
          suffixIcon={<DownOutlined className="text-gray-400" />}
          allowClear
        >
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          rowKey="key"
          rowSelection={{
            selectedRowKeys,
            onSelectAll: handleSelectAll,
            onSelect: handleSelectRow,
            checkStrictly: false,
          }}
          className="[&.ant-table-thead>tr>th]:bg-gray-50 [&.ant-table-thead>tr>th]:border-b [&.ant-table-thead>tr>th]:border-gray-200 [&.ant-table-thead>tr>th]:font-medium [&.ant-table-thead>tr>th]:text-gray-700 [&.ant-table-thead>tr>th]:py-4 [&.ant-table-tbody>tr>td]:border-b [&.ant-table-tbody>tr>td]:border-gray-100 [&.ant-table-tbody>tr>td]:py-4 [&.ant-table-tbody>tr:hover>td]:bg-gray-50 [&_.ant-checkbox-wrapper]:accent-purple-600"
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Pagination
          current={current}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold text-gray-800">
            {isEditMode ? "Edit User" : "Add User"}
          </span>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} className="mt-4" onFinish={handleSubmit}>
          {/* Image Upload */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-28 h-28 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm text-center">Add Image</span>
              )}
            </div>
            <div>
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleImageUpload}
                accept="image/png, image/jpeg"
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG up to 2 MB</p>
            </div>
          </div>

          <Form.Item
            label="User"
            name="user"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select">
              <Option value="Admin">Admin</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Accountant">Accountant</Option>
              <Option value="Salesman">Salesman</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          {!isEditMode && (
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password
                  placeholder="Enter password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </div>
          )}

          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-purple-500 hover:bg-purple-600 border-none text-white"
            >
              {isEditMode ? "Update User" : "Add User"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
