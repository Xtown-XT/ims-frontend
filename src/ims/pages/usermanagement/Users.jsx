import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  UploadOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SearchOutlined,
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
  message,
} from "antd";

import userService from "./UserService";
import RoleService from "./RoleService";

const { Option } = Select;

const Users = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [pageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [imagePreview, setImagePreview] = useState(null);
  const [modalImageFile, setModalImageFile] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [roles, setRoles] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ✅ FIXED ROLE FETCHING WITH ERROR HANDLING
  const fetchRoles = async () => {
    try {
      const res = await RoleService.getAllRoles();
      console.log("Roles Response:", res.data);

      let rolesArray = [];
      if (Array.isArray(res.data)) rolesArray = res.data;
      else if (Array.isArray(res.data.data)) rolesArray = res.data.data;
      else if (Array.isArray(res.data.rows)) rolesArray = res.data.rows;

      setRoles(rolesArray);
    } catch (err) {
      console.error("Failed to load roles:", err);
      setRoles([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      console.log("Users API Response:", res);
      console.log("Users Data:", res.data);
      setAllUsers(res.data || []);
      setFilteredData(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      messageApi.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const applyFilters = () => {
    let filtered = [...allUsers];

    if (searchText) {
      filtered = filtered.filter(
        (user) =>
          (user.username || "")
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          (user.email || "")
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          (user.phone || "").includes(searchText)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (user) =>
          (user.is_active ? "Active" : "Inactive").toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    setFilteredData(filtered);
    setCurrent(1);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, statusFilter, allUsers]);

  // ✅ Updated getRoleName to use nested role from API if roles array empty
  const getRoleName = (record) => {
    if (record.role && record.role.role_name) return record.role.role_name;
    const role = roles.find((r) => r.id === record.role_id || r._id === record.role_id);
    return role ? role.role_name || role.roleName : "—";
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record.profile_picture
                ? record.profile_picture.startsWith("http")
                  ? record.profile_picture
                  : `${import.meta.env.VITE_API_URL}/${record.profile_picture}`
                : "/img/noimg.png"
            }
            alt={record.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-gray-800">{record.username}</span>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      render: (_, record) => (
        <span className="text-gray-700">{getRoleName(record)}</span>
      ),
    },
    {
      title: "Status",
      render: (_, record) => {
        const status = record.is_active ? "Active" : "Inactive";
        return (
          <span
            style={{
              backgroundColor: record.is_active ? "#3EB780" : "#d63031",
              color: "#fff",
              padding: "4px 6px",
              borderRadius: "4px",
              fontSize: "12px",
              width: "60px",
              display: "inline-block",
              textAlign: "center",
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
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            size="small"
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete User?",
      okType: "danger",
      onOk: async () => {
        try {
          await userService.deleteUser(id);
          messageApi.success("User deleted");
          fetchUsers();
        } catch {
          messageApi.error("Delete failed");
        }
      },
    });
  };

  const showModal = () => {
    setIsEditMode(false);
    setEditingUser(null);
    form.resetFields();
    setImagePreview(null);
    setModalImageFile(null);
    setIsModalVisible(true);
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setEditingUser(user);

    form.setFieldsValue({
      username: user.username,
      email: user.email,
      phone: user.phone,
      role_id: user.role_id,
      is_active: user.is_active,
    });

    if (user.profile_picture) {
      const preview = user.profile_picture.startsWith("http")
        ? user.profile_picture
        : `${import.meta.env.VITE_API_URL}/${user.profile_picture}`;
      setImagePreview(preview);
    } else {
      setImagePreview(null);
    }

    setIsModalVisible(true);
  };

  const handleImageUpload = (info) => {
    const possibleFile = info?.file?.originFileObj ?? info?.file;

    if (!possibleFile) return;

    if (possibleFile instanceof Blob) {
      setModalImageFile(possibleFile);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(possibleFile);
    } else if (typeof possibleFile === "string") {
      const preview = possibleFile.startsWith("http")
        ? possibleFile
        : `${import.meta.env.VITE_API_URL}/${possibleFile}`;
      setImagePreview(preview);
      setModalImageFile(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("role_id", values.role_id);
      formData.append("is_active", values.is_active);

      if (!isEditMode) formData.append("password", values.password);
      if (modalImageFile) formData.append("profile_picture", modalImageFile);

      if (isEditMode) {
        await userService.updateUser(editingUser.id, formData);
        messageApi.success("User updated");
      } else {
        await userService.createUser(formData);
        messageApi.success("User created");
      }

      setIsModalVisible(false);
      fetchUsers();
    } catch {
      messageApi.error("Check required fields");
    }
  };

  const onPageChange = (page) => setCurrent(page);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {contextHolder}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <div className="flex gap-2">
          <Button icon={<ReloadOutlined />} onClick={fetchUsers} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-purple-500 text-white"
            onClick={showModal}
          >
            Add User
          </Button>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-64"
        />

        <Select
          placeholder="Status"
          className="w-32"
          allowClear
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
        >
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={false}
        rowKey="id"
      />

      <Pagination
        current={current}
        pageSize={pageSize}
        total={filteredData.length}
        className="mt-6"
        onChange={onPageChange}
      />

      <Modal
        title={isEditMode ? "Edit User" : "Add User"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-28 h-28 border rounded-lg overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center text-gray-400 h-full">
                  No Image
                </div>
              )}
            </div>

            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageUpload}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </div>

          <Form.Item name="username" label="User Name" rules={[{ required: true }]}>
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item name="role_id" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select Role">
              {roles.map((role) => (
                <Option key={role.id || role._id} value={role.id || role._id}>
                  {role.role_name || role.roleName || "—"}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="Enter phone" />
          </Form.Item>

          {!isEditMode && (
            <>
              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password
                  placeholder="Enter password"
                  iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || value === getFieldValue("password")) return Promise.resolve();
                      return Promise.reject("Passwords do not match!");
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm password"
                  iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </>
          )}

          <Form.Item name="is_active" label="Status" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-purple-500 text-white">
              {isEditMode ? "Update User" : "Add User"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;