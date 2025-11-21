import React, { useState, useMemo, useEffect } from "react";
import { Switch, Table, Input, Select, Button, Modal, Form, message } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import storesService from "./StoresService.js";

const { Option } = Select;

const Stores = () => {
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false);
  const [checked, setChecked] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      
      try {
        setLoading(true);
        const res = await storesService.getStores(page, limit, search);
        console.log("API response:", res);
        
        // Backend returns array directly
        const storeData = Array.isArray(res) ? res : [];
        
        console.log("Store data:", storeData);
        console.log("Total:", storeData.length);
        
        setStores(storeData);
        setTotal(storeData.length);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
        message.error(err.response?.data?.message || "Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, search]);

  const filteredStores = useMemo(() => {
    let filtered = [...stores];

    if (filterStatus) {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    return filtered;
  }, [filterStatus, stores]);

  const onChange = (ch) => {
    setChecked(ch);
    form.setFieldsValue({ status: ch ? "active" : "inactive" });
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditRecord(null);
    setChecked(true);
    form.resetFields();
    form.setFieldsValue({
      store_name: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      status: "active",
    });
    setShowForm(true);
  };

  const handleAddStore = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        store_name: values.store_name,
        username: values.username,
        password: values.password,
        email: values.email,
        phone: values.phone,
        status: checked ? "active" : "inactive",
      };

      console.log("Payload sending to backend:", payload);
      const response = await storesService.createStore(payload);
      console.log("Create response:", response);
      message.success("Store added successfully");
      setShowForm(false);
      form.resetFields();
      setIsEditMode(false);
      setEditRecord(null);
      
      // Refetch data
      const res = await storesService.getStores(page, limit, search);
      const storeData = Array.isArray(res) ? res : [];
      setStores(storeData);
      setTotal(storeData.length);
    } catch (err) {
      console.error("Failed to add store:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      console.error("Validation errors:", err.response?.data?.errors);
      message.error(err.response?.data?.message || err.message || "Failed to add store");
    }
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    form.setFieldsValue({
      store_name: record.store_name,
      username: record.username,
      email: record.email,
      phone: record.phone,
      status: record.status,
    });
    setChecked(record.status?.toLowerCase() === "active");
    setShowForm(true);
  };

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();

      if (!editRecord) {
        message.error("No record selected for editing");
        return;
      }

      const updateStore = {
        store_name: values.store_name,
        username: values.username,
        email: values.email,
        phone: values.phone,
        status: checked ? "active" : "inactive",
      };

      // Only include password if it's provided
      if (values.password) {
        updateStore.password = values.password;
      }

      await storesService.updateStore(editRecord.id, updateStore);
      message.success("Store updated successfully");
      setShowForm(false);
      setIsEditMode(false);
      setEditRecord(null);
      form.resetFields();
      
      // Refetch data
      const res = await storesService.getStores(page, limit, search);
      const storeData = Array.isArray(res) ? res : [];
      setStores(storeData);
      setTotal(storeData.length);
    } catch (err) {
      console.error("Failed to update store:", err);
      message.error(err.response?.data?.message || "Failed to update store");
    }
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await storesService.deleteStore(deleteRecord.id);
      message.success("Store deleted successfully");
      setShowDeleteModal(false);
      setDeleteRecord(null);
      
      // Refetch data
      const res = await storesService.getStores(page, limit, search);
      const storeData = Array.isArray(res) ? res : [];
      setStores(storeData);
      setTotal(storeData.length);
    } catch (err) {
      console.error("Failed to delete store:", err);
      message.error(err.response?.data?.message || "Failed to delete store");
      setShowDeleteModal(false);
      setDeleteRecord(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
  };

  const handleRefresh = () => {
    setSearch("");
    setFilterStatus(null);
    setPage(1);
    message.success("Refreshed");
  };

  const handleExportCSV = () => {
    if (!stores || !stores.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredStores.length ? filteredStores : stores;
    const headers = ["store_name", "username", "email", "phone", "status"];
    const csvRows = [];
    csvRows.push(headers.join(","));
    dataToExport.forEach((row) => {
      const values = headers.map((h) => {
        const v = row[h] ?? "";
        const safe = String(v).replace(/"/g, '""');
        return `"${safe}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `stores_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("CSV exported");
  };

  const handleExportPDF = () => {
    const dataToExport = filteredStores.length ? filteredStores : stores;
    if (!dataToExport || !dataToExport.length) {
      message.info("No data to export");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });
    doc.setFontSize(16);
    doc.setTextColor("#9333ea");
    doc.text("Stores Report", 40, 40);

    const columns = [
      { header: "Store Name", dataKey: "store_name" },
      { header: "Username", dataKey: "username" },
      { header: "Email", dataKey: "email" },
      { header: "Phone", dataKey: "phone" },
      { header: "Status", dataKey: "status" },
    ];

    autoTable(doc, {
      startY: 60,
      columns,
      body: dataToExport,
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`stores_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedKeys(stores.map((item) => item.id));
    } else {
      setSelectedKeys([]);
    }
  };

  const handleSelectOne = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectedKeys.length === stores.length && stores.length > 0}
          onChange={handleSelectAll}
          style={{ accentColor: "#7E57C2", cursor: "pointer" }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedKeys.includes(record.id)}
          onChange={() => handleSelectOne(record.id)}
          style={{ accentColor: "#7E57C2", cursor: "pointer" }}
        />
      ),
      width: 50,
    },
    { title: "Store Name", dataIndex: "store_name", key: "store_name" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <button
          style={{
            backgroundColor: record?.status?.toLowerCase() === "active" ? "#3EB780" : "#d63031",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            height: "22px",
            width: "46px",
            fontSize: "11px",
            fontWeight: "500",
            cursor: "default",
            textTransform: "capitalize",
          }}
        >
          {record?.status}
        </button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Stores</h2>
          <p className="text-sm text-gray-500">Manage your stores</p>
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
            icon={<FaAngleUp color="#9333ea" size={16} />}
            onClick={toggleFilters}
            title={filtersCollapsed ? "Expand filters" : "Collapse filters"}
            style={{
              transform: filtersCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
          <Button type="primary" onClick={openAddModal}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <PlusCircleOutlined style={{ color: "#fff" }} />
              <span>Add Store</span>
            </div>
          </Button>
        </div>
      </div>

      {!filtersCollapsed && (
        <div>
          <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
            <Input
              placeholder="Search store..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
            />
            <div className="flex gap-3">
              <Form.Item>
                <Select
                  placeholder="Status"
                  style={{ width: 150 }}
                  value={filterStatus}
                  onChange={(val) => setFilterStatus(val)}
                  allowClear
                >
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
        </div>
      )}

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
          dataSource={filteredStores}
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            onChange: (newPage) => setPage(newPage),
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          rowKey="id"
          className="bg-white"
          bordered={false}
          rowClassName={() => "hover:bg-gray-50"}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  className="bg-gray-100 text-gray-600 font-bold text-sm px-6 py-3"
                />
              ),
            },
            body: {
              cell: (props) => (
                <td {...props} className="px-6 py-3" />
              ),
              row: (props) => (
                <tr
                  {...props}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                />
              ),
            },
          }}
        />
      </div>

      <Modal
        title={
          <span className="font-semibold">
            {isEditMode ? "Edit Store" : "Add Store"}
          </span>
        }
        open={showForm}
        onCancel={() => {
          setShowForm(false);
          setIsEditMode(false);
          form.resetFields();
        }}
        footer={null}
        centered
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Store Name</span>}
            name="store_name"
            rules={[{ required: true, message: "Please enter store name" }]}
            className="mb-3"
          >
            <Input placeholder="Store Name" />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Username</span>}
            name="username"
            rules={[{ required: true, message: "Please enter username" }]}
            className="mb-3"
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Password</span>}
            name="password"
            rules={[
              { required: !isEditMode, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
            className="mb-3"
          >
            <Input.Password placeholder={isEditMode ? "Leave blank to keep current password" : "Password"} />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" }
            ]}
            className="mb-3"
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Phone</span>}
            name="phone"
            rules={[{ required: true, message: "Please enter phone" }]}
            className="mb-3"
          >
            <Input placeholder="Phone" maxLength={10} />
          </Form.Item>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <Form.Item name="status" valuePropName="checked" noStyle>
              <Switch
                size="small"
                checked={checked}
                onChange={(ch) => {
                  onChange(ch);
                  form.setFieldsValue({ status: ch ? "active" : "inactive" });
                }}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => {
                setShowForm(false);
                setIsEditMode(false);
                form.resetFields();
              }}
              style={{
                backgroundColor: "#0A2540",
                color: "#fff",
                border: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: "#7E57C2",
                borderColor: "#7E57C2",
                color: "#fff",
              }}
              onClick={isEditMode ? handleSaveChanges : handleAddStore}
            >
              {isEditMode ? "Save Changes" : "Add Store"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal open={showDeleteModal} onCancel={cancelDelete} footer={null} centered>
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#FEE2E2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 15px",
            }}
          >
            <DeleteOutlined style={{ fontSize: 30, color: "#EF4444" }} />
          </div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#1F2937",
              marginBottom: 10,
            }}
          >
            Delete Store
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this store?
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginTop: 10,
            }}
          >
            <Button
              onClick={cancelDelete}
              style={{
                backgroundColor: "#0A2540",
                color: "#fff",
                border: "none",
                height: 38,
                width: 100,
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={confirmDelete}
              style={{
                backgroundColor: "#7E57C2",
                borderColor: "#7E57C2",
                color: "#fff",
                height: 38,
                width: 120,
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
