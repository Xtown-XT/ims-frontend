import React, { useState, useMemo, useEffect, useRef } from "react";
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
import unitService from "./unitService.js";

const { Option } = Select;

const Units = () => {
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
  const headerCheckboxRef = useRef(null);

  const [units, setUnits] = useState([]);

  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await unitService.getUnits();
        console.log("API response:", res.data);
        const fetchedUnits = res.data.data?.rows || res.data.data || [];
        setUnits(fetchedUnits);
        setTotal(fetchedUnits.length);
      } catch (error) {
        console.error("Failed to fetch Units:", error);
        message.error(error.response?.data?.message || "Failed to fetch units");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Client-side filtering for search and status
  const filteredData = useMemo(() => {
    let filtered = [...units];
    
    // Search filter
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.unit_name?.toLowerCase().includes(lowerSearch) ||
          item.short_name?.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Status filter
    if (filterStatus) {
      const isActive = filterStatus.toLowerCase() === 'active';
      filtered = filtered.filter((item) => item.is_active === isActive);
    }
    
    return filtered;
  }, [searchText, filterStatus, units]);

  // Handle checkbox header indeterminate state
  useEffect(() => {
    const total = filteredData.length;
    const selectedCount = selectedRowKeys.filter((k) =>
      filteredData.some((b) => b.id === k)
    ).length;

    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        selectedCount > 0 && selectedCount < total;
    }
  }, [filteredData, selectedRowKeys]);

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
      unit_name: "",
      short_name: "",
      is_active: true,
    });
    setShowForm(true);
  };

  const handleAddUnit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        unit_name: values.unit_name,
        short_name: values.short_name,
        is_active: checked,
      };

      const res = await unitService.createUnit(payload);
      const newUnit = res.data.data || res.data;
      setUnits((prev) => [newUnit, ...prev]);
      setTotal((prev) => prev + 1);
      console.log("Saved:", res.data);
      message.success("Unit added successfully");
      handleCloseModal();
      form.resetFields();
    } catch (err) {
      console.error("Failed to add unit:", err);
      message.error(err.response?.data?.message || "Failed to add unit");
    }
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    form.setFieldsValue({
      unit_name: record.unit_name,
      short_name: record.short_name,
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

      const updateUnit = {
        unit_name: values.unit_name,
        short_name: values.short_name,
        is_active: checked,
      };

      const res = await unitService.updateUnit(editRecord.id, updateUnit);
      console.log("Updated:", res.data);

      setUnits((prev) =>
        prev.map((item) =>
          item.id === editRecord.id ? { ...item, ...updateUnit } : item
        )
      );
      message.success("Unit updated successfully");
      handleCloseModal();
      form.resetFields();
    } catch (err) {
      console.error("Failed to update unit:", err);
      message.error(err.response?.data?.message || "Failed to update unit");
    }
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await unitService.deleteUnit(deleteRecord.id);
      setUnits((prev) => prev.filter((item) => item.id !== deleteRecord.id));
      setSelectedRowKeys((prev) => prev.filter((k) => k !== deleteRecord.id));
      setTotal((prev) => prev - 1);
      message.success("Unit deleted successfully");
      setShowDeleteModal(false);
      setDeleteRecord(null);
      console.log("Unit deleted");
    } catch (err) {
      console.error("Failed to delete unit:", err);
      message.error(err.response?.data?.message || "Failed to delete unit");
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
    if (!formData || !formData.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredData.length ? filteredData : formData;
    const headers = ["unit", "shortname", "noofproducts", "createddate", "status"];
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
      `units_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("CSV exported successfully");
  };

  const handleExportPDF = () => {
    const dataToExport = filteredData.length ? filteredData : formData;
    if (!dataToExport || !dataToExport.length) {
      message.info("No data to export");
      return;
    }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });
    doc.setFontSize(16);
    doc.setTextColor("#6C5CE7");
    doc.text("Units Report", 40, 40);

    const columns = [
      { header: "Unit", dataKey: "unit_name" },
      { header: "Short Name", dataKey: "short_name" },
      // { header: "No of Products", dataKey: "noofproducts" },
      { header: "Created Date", dataKey: "createdAt" },
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

    doc.save(`units_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowKeys(units.map((item) => item.id));
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
          checked={selectedRowKeys.length === units.length && units.length > 0}
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
    { title: "Unit", dataIndex: "unit_name", key: "unit_name" },
    { title: "Short Name", dataIndex: "short_name", key: "short_name" },
    { 
      title: "Created Date", 
      dataIndex: "createdAt", 
      key: "createdAt",
      render: (date) => {
        if (!date) return '';
        // If date is already formatted as "DD MMM YYYY", return as is
        if (typeof date === 'string' && date.includes(' ')) return date;
        // Otherwise format the date
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        });
      }
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <button
          style={{
            backgroundColor:
              is_active ? "#3EB780" : "#d63031",
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
          <h2 className="text-xl font-semibold text-gray-800">Units</h2>
          <p className="text-sm text-gray-500">Manage your units</p>
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
            <span>Add Unit</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {!filtersCollapsed && (
        <div>
          <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
            <Input
              placeholder="Search by unit or short name"
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

      {/* ✅ Table */}
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
            {isEditMode ? "Edit Unit" : "Add Unit"}
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
                Unit Name
              </span>
            }
            name="unit_name"
            rules={[{ required: true, message: "Please enter unit name" }]}
            className="mb-3"
          >
            <Input placeholder="Enter unit name" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Short Name
              </span>
            }
            name="short_name"
            rules={[{ required: true, message: "Please enter short name" }]}
            className="mb-3"
          >
            <Input placeholder="Enter short name" />
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
              onClick={isEditMode ? handleSaveChanges : handleAddUnit}
            >
              {isEditMode ? "Save Changes" : "Add Unit"}
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
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1F2937", marginBottom: 10 }}>
            Delete Unit
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this unit?
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10 }}>
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

export default Units;
