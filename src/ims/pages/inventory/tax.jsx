import React, { useState, useMemo, useEffect } from "react";
import { Table, Input, Select, Button, Modal, Form, Switch, message } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import taxService from "./taxService.js";

const { Option } = Select;
const { TextArea } = Input;

const Tax = () => {
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [checked, setChecked] = useState(true);
  const [editRecord, setEditRecord] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [taxes, setTaxes] = useState([]);

  const [page, setPage] = useState(1)

  const [search, setSearch] = useState('');

  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch taxes from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await taxService.getTaxes(page, limit, search);
        console.log("API response:", res.data);
        const fetchedTaxes = res.data.rows || [];
        setTaxes(fetchedTaxes);
        setTotal(res.data.count || fetchedTaxes.length);
      } catch (err) {
        console.error("Failed to fetch taxes:", err);
        message.error(err.response?.data?.message || "Failed to fetch taxes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, limit, search]);

  // Client-side filtering for search and status
  const filteredData = useMemo(() => {
    let filtered = [...taxes];
    
    // Search filter
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.tax_name?.toLowerCase().includes(lowerSearch) ||
          item.tax_type?.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Status filter
    if (filterStatus) {
      const isActive = filterStatus.toLowerCase() === 'active';
      filtered = filtered.filter((item) => item.is_active === isActive);
    }
    
    return filtered;
  }, [searchText, filterStatus, taxes]);

  // Refetch taxes
  const refetchTaxes = async () => {
    try {
      setLoading(true);
      const res = await taxService.getTaxes();
      const fetchedTaxes = res.data.rows || [];
      setTaxes(fetchedTaxes);
      setTotal(res.data.count || fetchedTaxes.length);
    } catch (err) {
      console.error("Failed to refetch taxes:", err);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (ch) => {
    setChecked(ch);
    form.setFieldsValue({ is_active: ch });
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditRecord(null);
    setChecked(true);
    form.resetFields();
    form.setFieldsValue({
      tax_name: "",
      tax_percentage: "",
      tax_type: "exclusive",
      description: "",
      is_active: true,
    });
    setShowForm(true);
  };

  const handleAddTax = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        tax_name: values.tax_name,
        tax_percentage: parseFloat(values.tax_percentage),
        tax_type: values.tax_type,
        description: values.description || "",
        is_active: checked,
      };

      await taxService.createTax(payload);
      message.success("Tax added successfully");
      handleCloseModal();
      await refetchTaxes();
    } catch (err) {
      console.error("Failed to add tax:", err);
      message.error(err.response?.data?.message || "Failed to add tax");
    }
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    form.setFieldsValue({
      tax_name: record.tax_name,
      tax_percentage: record.tax_percentage,
      tax_type: record.tax_type,
      description: record.description,
      is_active: record.is_active,
    });
    setChecked(record.is_active);
    setShowForm(true);
  };

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();

      if (!editRecord) {
        message.error("No record selected for editing");
        return;
      }

      const updateTax = {
        tax_name: values.tax_name,
        tax_percentage: parseFloat(values.tax_percentage),
        tax_type: values.tax_type,
        description: values.description || "",
        is_active: checked,
      };

      await taxService.updateTax(editRecord.id, updateTax);
      message.success("Tax updated successfully");
      handleCloseModal();
      await refetchTaxes();
    } catch (err) {
      console.error("Failed to update tax:", err);
      message.error(err.response?.data?.message || "Failed to update tax");
    }
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await taxService.deleteTax(deleteRecord.id);
      message.success("Tax deleted successfully");
      setShowDeleteModal(false);
      setDeleteRecord(null);
      setSelectedRowKeys((prev) => prev.filter((k) => k !== deleteRecord.id));
      await refetchTaxes();
    } catch (err) {
      console.error("Failed to delete tax:", err);
      message.error(err.response?.data?.message || "Failed to delete tax");
      setShowDeleteModal(false);
      setDeleteRecord(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    setEditRecord(null);
    form.resetFields();
  };

  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
    setSelectedRowKeys([]);
    message.success("Refreshed");
  };

  const toggleFilters = () => {
    setFiltersCollapsed((prev) => !prev);
  };

  const handleExportCSV = () => {
    if (!taxes || !taxes.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredData.length ? filteredData : taxes;
    const headers = ["tax_name", "tax_percentage", "tax_type", "description", "is_active"];
    const csvRows = [];
    csvRows.push(headers.join(","));
    dataToExport.forEach((row) => {
      const values = headers.map((h) => `"${row[h] ?? ""}"`);
      csvRows.push(values.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `taxes_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("CSV exported successfully");
  };

  const handleExportPDF = () => {
    const dataToExport = filteredData.length ? filteredData : taxes;
    if (!dataToExport || !dataToExport.length) {
      message.info("No data to export");
      return;
    }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });
    doc.setFontSize(16);
    doc.setTextColor("#6C5CE7");
    doc.text("Taxes Report", 40, 40);

    const columns = [
      { header: "Tax Name", dataKey: "tax_name" },
      { header: "Percentage", dataKey: "tax_percentage" },
      { header: "Type", dataKey: "tax_type" },
      { header: "Description", dataKey: "description" },
      { header: "Status", dataKey: "is_active" },
    ];

    autoTable(doc, {
      startY: 60,
      columns,
      body: dataToExport,
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [108, 92, 231], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`taxes_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowKeys(taxes.map((item) => item.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedRowKeys((prev) =>
      prev.includes(id)
        ? prev.filter((k) => k !== id)
        : [...prev, id]
    );
  };

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectedRowKeys.length === taxes.length && taxes.length > 0}
          onChange={handleSelectAll}
          style={{ accentColor: "#6C5CE7", cursor: "pointer" }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(record.id)}
          onChange={() => handleSelectOne(record.id)}
          style={{ accentColor: "#6C5CE7", cursor: "pointer" }}
        />
      ),
      width: 50,
    },
    { title: "Tax Name", dataIndex: "tax_name", key: "tax_name" },
    { 
      title: "Percentage", 
      dataIndex: "tax_percentage", 
      key: "tax_percentage",
      render: (value) => `${value}%`
    },
    { 
      title: "Type", 
      dataIndex: "tax_type", 
      key: "tax_type",
      render: (value) => (
        <span style={{ textTransform: 'capitalize' }}>{value}</span>
      )
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <button
          style={{
            backgroundColor: is_active ? "#3EB780" : "#d63031",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            height: "22px",
            width: "46px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "default",
          }}
        >
          {is_active ? "Active" : "Inactive"}
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Taxes</h2>
          <p className="text-sm text-gray-500">Manage your taxes</p>
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
            icon={<IoReloadOutline color="#6C5CE7" size={18} />}
            onClick={handleRefresh}
            title="Refresh"
          />
          <Button
            icon={<FaAngleUp color="#6C5CE7" size={16} />}
            onClick={toggleFilters}
            title={filtersCollapsed ? "Expand filters" : "Collapse filters"}
            style={{
              transform: filtersCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
          <Button
            type="primary"
            onClick={openAddModal}
            style={{
              backgroundColor: "#6C5CE7",
              borderColor: "#6C5CE7",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <PlusOutlined />
            <span>Add Tax</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {!filtersCollapsed && (
        <div>
          <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
            <Input
              placeholder="Search by tax name or type"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
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
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: limit,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          className="bg-white"
          bordered={false}
          rowClassName={() => "hover:bg-gray-50"}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <span className="font-semibold">
            {isEditMode ? "Edit Tax" : "Add Tax"}
          </span>
        }
        open={showForm}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Tax Name
              </span>
            }
            name="tax_name"
            rules={[{ required: true, message: "Please enter tax name" }]}
            className="mb-3"
          >
            <Input placeholder="Enter tax name (e.g., GST, VAT)" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Tax Percentage
              </span>
            }
            name="tax_percentage"
            rules={[
              { required: true, message: "Please enter tax percentage" },
              { 
                pattern: /^\d+(\.\d{1,2})?$/, 
                message: "Please enter a valid percentage (e.g., 12.00)" 
              }
            ]}
            className="mb-3"
          >
            <Input 
              placeholder="Enter percentage (e.g., 12.00)" 
              type="number"
              step="0.01"
              min="0"
              max="100"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Tax Type
              </span>
            }
            name="tax_type"
            rules={[{ required: true, message: "Please select tax type" }]}
            className="mb-3"
          >
            <Select placeholder="Select tax type">
              <Option value="exclusive">Exclusive</Option>
              <Option value="inclusive">Inclusive</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Description
              </span>
            }
            name="description"
            className="mb-3"
          >
            <TextArea 
              placeholder="Enter description (optional)" 
              rows={3}
            />
          </Form.Item>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-gray-700">
              Status
            </span>
            <Form.Item name="is_active" valuePropName="checked" noStyle>
              <Switch
                size="small"
                checked={checked}
                onChange={(ch) => {
                  onChange(ch);
                  form.setFieldsValue({ is_active: ch });
                }}
                style={{
                  backgroundColor: checked ? "#3EB780" : "#ccc",
                }}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={handleCloseModal}
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
                backgroundColor: "#6C5CE7",
                borderColor: "#6C5CE7",
                color: "#fff",
              }}
              onClick={isEditMode ? handleSaveChanges : handleAddTax}
            >
              {isEditMode ? "Save Changes" : "Add Tax"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Delete Modal */}
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
            Delete Tax
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this tax?
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
                backgroundColor: "#6C5CE7",
                borderColor: "#6C5CE7",
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

export default Tax;
