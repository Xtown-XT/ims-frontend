// src/pages/peoples/stores.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  Menu,
  Tag,
  Space,
  Pagination,
  message,
  Modal,
  Form,
  InputNumber,
  Switch,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import storesService from "../peoples/StoresService"; 

const Stores = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const [stores, setStores] =useState([])
  

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewStore, setViewStore] = useState(null);

  // 🆕 Delete Confirmation Modal States
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteStore, setDeleteStore] = useState(null);

  const handleSearch = (e) => setSearchText(e.target.value);
  const handleMenuClick = (e) => setStatusFilter(e.key);
  const toggleFilters = () => setFiltersCollapsed((prev) => !prev);

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter("All");
    setCurrentPage(1);
    setPageSize(10);
    message.success("Refreshed");
    // After refresh, also re-fetch from backend to get latest data
    fetchStores();
  };

  const filteredData = useMemo(() => {
    return stores.filter((item) => {
      const s = searchText.toLowerCase();
      const matchesSearch =
        item.store.toLowerCase().includes(s) ||
        item.username.toLowerCase().includes(s) ||
        item.email.toLowerCase().includes(s);
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, stores]);

  // EXPORTS
  const handleExportCSV = () => {
    if (!filteredData.length) return message.info("No data to export");
    const headers = ["Store", "Username", "Email", "Phone", "Status"];
    const csvRows = [headers.join(",")];
    filteredData.forEach((s) =>
      csvRows.push(
        [s.store, s.username, s.email, s.phone, s.status]
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
      `stores_${new Date().toISOString().slice(0, 10)}.csv`
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
    doc.text("Stores Report", 40, 40);

    autoTable(doc, {
      startY: 60,
      head: [["Store", "Username", "Email", "Phone", "Status"]],
      body: filteredData.map((s) => [
        s.store,
        s.username,
        s.email,
        s.phone,
        s.status,
      ]),
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`stores_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // --- NEW: fetchStores will call backend GET and update state ---
  const fetchStores = async () => {
    try {
      const res = await storesService.getStores();
//Expecting backend to return: res, data.data(array)
      
      const apiData = res?.data ?.data || res?.data || []; 
      
      // If the API returns objects with backend field names, normalize to your frontend shape
      const normalized = apiData.map((item) =>( {
        key: String(item.id),
        store:item.store_name,
        userName:item.userName,
        email: item.email,
        phone:item.phone,
        password:item.password,
        status: item.is_active ? "Active" : "Inactive",        
        products:item.products || []
      }));
      setstore(normalized);
    } catch (error) {
      console.error("Error fetching store data:", error);
      message.error("Failed to load stores");
    }
    };


  // Fetch on mount
  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MODAL LOGIC
  const showAddModal = () => {
    setIsEditMode(false);
    setSelectedStore(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEditMode(true);
    setSelectedStore(record);
    form.setFieldsValue({
      storeName: record.store,
      userName: record.username,
      password: record.password,
      email: record.email,
      phone: record.phone,
      status: record.status === "Active",
    });
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setViewStore(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setViewStore(null);
    setIsViewModalVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditMode(false);
  };

  // MADE async to call POST API when adding new store
  const handleSubmit = async (values) => {
    const newStore = {
      key: isEditMode && selectedStore ? selectedStore.key : Date.now().toString(),
      store: values.storeName,
      username: values.userName,
      email: values.email,
      phone: values.phone,
      password: values.password,
      status: values.status ? "Active" : "Inactive",
      products: selectedStore?.products || [],
    };

    if (isEditMode && selectedStore) {
      // Keep existing edit behavior (local update) as requested (no PUT implemented)
      setStores((prev) =>
        prev.map((s) => (s.key === selectedStore.key ? newStore : s))
      );
      message.success(`Store "${newStore.store}" updated successfully!`);
    } else {
      // Create - call POST endpoint
      try {
        // Build payload for backend - adjust field names to match backend expectations if needed
        const payload = {
          store_name: values.storeName,
          username: values.userName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          is_active: values.status ? "active" : "inactive",
        };

        const res = await storesService.createStore(payload);

        // Try to use returned data from API, fallback to local object
        const created =
          res?.data?.data ||
          res?.data ||
          {
            key: Date.now().toString(),
            store: values.storeName,
            username: values.userName,
            email: values.email,
            phone: values.phone,
            password: values.password,
            status: values.status ? "Active" : "Inactive",
            products: [],
          };

        // If backend returns object with different shape, try to normalize:
        const createdForState =
          created.store || created.store_name
            ? {
                key: created.id ? String(created.id) : created.key || Date.now().toString(),
                store: created.store || created.store_name || values.storeName,
                username: created.username || values.userName,
                email: created.email || values.email,
                phone: created.phone || values.phone,
                password: created.password || values.password,
                status: created.is_active ? (created.is_active ? "Active" : "Inactive") : (values.status ? "Active" : "Inactive"),
                products: created.products || [],
              }
            : created; // fallback

        setStores((prev) => [createdForState, ...prev]);
        message.success(`Store "${createdForState.store}" added successfully!`);
      } catch (err) {
        console.error("Create store failed:", err);
        message.error("Failed to add store. Please try again.");
      }
    }

    form.resetFields();
    setIsModalVisible(false);
    setIsEditMode(false);
  };

  // 🆕 Updated Delete Logic
  const openDeleteModal = (record) => {
    setDeleteStore(record);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setStores((prev) => prev.filter((s) => s.key !== deleteStore.key));
    message.success(`Store "${deleteStore?.store}" deleted successfully!`);
    setIsDeleteModalVisible(false);
    setDeleteStore(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteStore(null);
  };

  // COLUMNS
  const columns = [
    { title: "Store", dataIndex: "store", key: "store" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "Active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
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
            onClick={() => openDeleteModal(record)} // ✅ Updated to show confirmation modal
          />
        </Space>
      ),
    },
  ];

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="Active">Active</Menu.Item>
      <Menu.Item key="Inactive">Inactive</Menu.Item>
    </Menu>
  );

  const pageSizeMenu = (
    <Menu onClick={(e) => setPageSize(Number(e.key))}>
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
          <h2 className="text-xl font-semibold text-gray-800">Stores</h2>
          <p className="text-sm text-gray-500">Manage your Stores</p>
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
            icon={<IoReloadOutline color="#9333ea" size={18} />}
            onClick={handleRefresh}
            title="Refresh"
          />
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
            Add Store
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      {!filtersCollapsed && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <Input
            prefix={<SearchOutlined style={{ fontSize: "12px", color: "#999" }} />}
            placeholder="Search by store, username, or email"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 260 }}
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

      {/* Add/Edit Store Modal */}
      <Modal
        title={isEditMode ? "Edit Store" : "Add Store"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="storeName"
            label="Store Name"
            rules={[{ required: true, message: "Please enter store name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="userName"
            label="User Name"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password prefix={<LockOutlined />} />
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

          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Save Changes" : "Add Store"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Store Modal */}
      <Modal
        title="Store Details"
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
        {viewStore ? (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{viewStore.store}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-400">Username</p>
                <p className="text-sm">{viewStore.username}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm">{viewStore.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm">{viewStore.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Password</p>
                <p className="text-sm">{viewStore.password}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <Tag color={viewStore.status === "Active" ? "green" : "red"}>
                  {viewStore.status}
                </Tag>
              </div>
            </div>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">
              Product Details
            </h4>
            <Table
              dataSource={viewStore.products}
              columns={[
                { title: "Product Name", dataIndex: "name", key: "name" },
                { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                { title: "Price", dataIndex: "price", key: "price" },
              ]}
              pagination={false}
              bordered
              size="small"
              rowKey="id"
            />
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
          <h3 className="text-lg font-semibold mb-1">Delete Store</h3>
          <p className="text-gray-500 mb-5">
            Are you sure you want to delete store?
          </p>
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

export default Stores;
