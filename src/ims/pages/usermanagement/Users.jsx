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

  // FETCH ROLES (FIXED FOR YOUR API RESPONSE)
  const fetchRoles = async () => {
    try {
      const res = await RoleService.getAllRoles();
      const rolesArray = res?.data?.rows ?? [];
      setRoles(rolesArray);
    } catch (err) {
      console.error("Failed to load roles:", err);
      setRoles([]);
    }
  };

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers();
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

  // FILTER USERS
  useEffect(() => {
    let filtered = [...allUsers];

    if (searchText) {
      filtered = filtered.filter(
        (u) =>
          u.username?.toLowerCase().includes(searchText.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          u.phone?.includes(searchText)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (u) =>
          (u.is_active ? "active" : "inactive") === statusFilter.toLowerCase()
      );
    }

    setFilteredData(filtered);
    setCurrent(1);
  }, [searchText, statusFilter, allUsers]);

  // GET ROLE NAME
  const getRoleName = (record) => {
    const role = roles.find((r) => r.id === record.role_id);
    return role?.role_name || "—";
  };

  // TABLE COLUMNS
  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record.profile_picture
                ? (record.profile_picture.startsWith('http') 
                    ? record.profile_picture 
                    : `http://192.168.1.18:5000${record.profile_picture}`)
                : "https://via.placeholder.com/40x40?text=User"
            }
            alt={record.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-gray-800">{record.username}</span>
        </div>
      ),
    },
    { title: "Phone", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },

    {
      title: "Role",
      render: (_, record) => (
        <span className="text-gray-700">{getRoleName(record)}</span>
      ),
    },

    {
      title: "Status",
      render: (_, record) => (
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
          {record.is_active ? "Active" : "Inactive"}
        </span>
      ),
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

  // DELETE USER
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

  // ADD USER
  const showModal = () => {
    setIsEditMode(false);
    setEditingUser(null);
    setImagePreview(null);
    setModalImageFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // EDIT USER
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

    setImagePreview(
      user.profile_picture 
        ? (user.profile_picture.startsWith('http') 
            ? user.profile_picture 
            : `http://192.168.1.18:5000${user.profile_picture}`)
        : null
    );
    setModalImageFile(null);
    setIsModalVisible(true);
  };

  // IMAGE UPLOAD FIXED
  const handleImageUpload = (info) => {
    console.log("Upload info:", info);
    const file = info.file.originFileObj || info.file;
    console.log("Selected file:", file);
    
    if (file) {
      // Check if it's a valid image file
      if (!file.type || !file.type.startsWith('image/')) {
        messageApi.error('Please select a valid image file (JPEG or PNG)');
        return;
      }
      
      try {
        const imageUrl = URL.createObjectURL(file);
        console.log("Created image URL:", imageUrl);
        setImagePreview(imageUrl);
        setModalImageFile(file);
        messageApi.success('Image selected successfully');
      } catch (error) {
        console.error("Error creating image URL:", error);
        messageApi.error('Failed to load image preview');
      }
    } else {
      console.error("No file found in upload info");
    }
  };

  const removeImageField = () => {
    setImagePreview(null);
    setModalImageFile(null);
  };

  // SUBMIT FORM
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("role_id", values.role_id);
      formData.append("is_active", values.is_active ? true : false);
      formData.append("created_by", "92d252aa-4911-4961-a771-0706112c4d8a");

      if (!isEditMode && values.password) {
        formData.append("password", values.password);
      }

      if (modalImageFile) {
        formData.append("profile_picture", modalImageFile);
        console.log("Image file to upload:", modalImageFile.name, modalImageFile.type);
      } else {
        console.log("No image file selected");
      }

      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      if (isEditMode) {
        const res = await userService.updateUser(editingUser.id, formData);
        console.log("Update user response:", res.data);
        messageApi.success("User updated");
      } else {
        const res = await userService.createUser(formData);
        console.log("Create user response:", res.data);
        messageApi.success("User created");
      }

      setIsModalVisible(false);
      fetchUsers();
    } catch (err) {
      messageApi.error("Check required fields");
      console.error("Submit error:", err);
      console.error("Error response:", err.response?.data);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {contextHolder}

      {/* HEADER */}
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

      {/* SEARCH */}
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

      {/* TABLE */}
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
        onChange={(page) => setCurrent(page)}
      />

      {/* MODAL */}
      <Modal
        title={isEditMode ? "Edit User" : "Add User"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* IMAGE UPLOAD */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-28 h-28 border rounded-lg overflow-hidden">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Image failed to load:", imagePreview);
                    e.target.src = "https://via.placeholder.com/120x120?text=Error";
                  }}
                />
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
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>{isEditMode ? "Change Image" : "Upload Image"}</Button>
            </Upload>

            {imagePreview && (
              <Button danger onClick={removeImageField}>
                Remove
              </Button>
            )}
          </div>

          {/* FORM */}
          <Form.Item name="username" label="User Name" rules={[{ required: true }]}>
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item name="role_id" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select Role">
              {roles.map((r) => (
                <Option key={r.id} value={r.id}>
                  {r.role_name}
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
                      if (!value || value === getFieldValue("password"))
                        return Promise.resolve();
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

          <Form.Item
            name="is_active"
            label="Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
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
