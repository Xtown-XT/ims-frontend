
import { useState, useMemo, useEffect } from "react";
import { Table, Input, Select, Button, Modal, Form, Switch, message, Checkbox } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";


import variantAttributesService from "./variantattributesService.js";

import autoTable from "jspdf-autotable";


const { Option } = Select;

const VariantAttributes = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [checked, setChecked] = useState(true);

  const [page] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // NEW: state for selected checkboxes (keys)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [formData, setFormData] = useState([]);

  // ✅ Fetch variant attributes from API
  useEffect(() => {
    const fetchData = async () => {
      if (loading) return; // Prevent multiple calls
      
      try {
        setLoading(true);
        const res = await variantAttributesService.getVariantAttributes(page, limit, search);
        console.log("API response:", res.data);
        
        // Transform API data to match component format
        const attributes = res.data?.data?.rows || res.data?.rows || [];
        const transformedData = attributes.map((item) => ({
          key: item.id,
          id: item.id,
          variant: item.variant_name,
          values: Array.isArray(item.values) ? item.values.join(", ") : item.values,
          createddate: new Date(item.createdAt).toLocaleDateString(),
          status: item.status ? "Active" : "Inactive",
        }));
        
        setFormData(transformedData);
        setTotal(res.data?.data?.count || res.data?.count || attributes.length);
      } catch (err) {
        console.error("Failed to fetch variant attributes:", err);
        message.error("Failed to load variant attributes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, search]);

  const [addVariantData, setAddVariantData] = useState({
    variant: "",
    values: "",
    status: true,
  });

  // ✅ Search + Filter logic
  const filteredData = useMemo(() => {
    let filtered = [...formData];
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.variant.toLowerCase().includes(lowerSearch) ||
          item.values.toLowerCase().includes(lowerSearch)
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }
    return filtered;
  }, [searchText, filterStatus, formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target || {};
    if (name) {
      setAddVariantData({ ...addVariantData, [name]: value });
    }
  };

  // ✅ Add Variant
  const handleAddVariant = async () => {
    if (!addVariantData.variant?.trim() || !addVariantData.values?.trim()) {
      message.warning("Please enter both Variant name and Values.");
      return;
    }

    try {
      const payload = {
        variant_name: addVariantData.variant.trim(),
        values: addVariantData.values.split(',').map(v => v.trim()),
        status: addVariantData.status,
      };

      await variantAttributesService.createVariantAttribute(payload);
      message.success("Variant attribute added successfully");
      handleCloseModal();
      
      // Refetch data
      const res = await variantAttributesService.getVariantAttributes(page, limit, search);
      const attributes = res.data?.data?.rows || res.data?.rows || [];
      const transformedData = attributes.map((item) => ({
        key: item.id,
        id: item.id,
        variant: item.variant_name,
        values: Array.isArray(item.values) ? item.values.join(", ") : item.values,
        createddate: new Date(item.createdAt).toLocaleDateString(),
        status: item.status ? "Active" : "Inactive",
      }));
      setFormData(transformedData);
      setTotal(res.data?.data?.count || res.data?.count || attributes.length);
    } catch (err) {
      console.error("Failed to add variant attribute:", err);
      message.error(err.response?.data?.message || "Failed to add variant attribute");
    }
  };

  // ✅ Edit Variant
  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    setAddVariantData({
      variant: record.variant,
      values: record.values,
      status: record.status === "Active",
    });
    setShowForm(true);
  };

  // ✅ Save Changes
  const handleSaveChanges = async () => {
    if (!addVariantData.variant?.trim() || !addVariantData.values?.trim()) {
      message.warning("Please enter both Variant name and Values.");
      return;
    }

    if (!editRecord) {
      message.error("No record selected for editing");
      return;
    }

    try {
      const payload = {
        variant_name: addVariantData.variant.trim(),
        values: addVariantData.values.split(',').map(v => v.trim()),
        status: addVariantData.status,
      };

      await variantAttributesService.updateVariantAttribute(editRecord.id, payload);
      message.success("Variant attribute updated successfully");
      handleCloseModal();
      
      // Refetch data
      const res = await variantAttributesService.getVariantAttributes(page, limit, search);
      const attributes = res.data?.data?.rows || res.data?.rows || [];
      const transformedData = attributes.map((item) => ({
        key: item.id,
        id: item.id,
        variant: item.variant_name,
        values: Array.isArray(item.values) ? item.values.join(", ") : item.values,
        createddate: new Date(item.createdAt).toLocaleDateString(),
        status: item.status ? "Active" : "Inactive",
      }));
      setFormData(transformedData);
      setTotal(res.data?.data?.count || res.data?.count || attributes.length);
    } catch (err) {
      console.error("Failed to update variant attribute:", err);
      message.error(err.response?.data?.message || "Failed to update variant attribute");
    }
  };

  // ✅ Delete Variant
  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await variantAttributesService.deleteVariantAttribute(deleteRecord.id);
      message.success("Variant attribute deleted successfully");
      setShowDeleteModal(false);
      setDeleteRecord(null);
      setSelectedRowKeys((prev) => prev.filter((k) => k !== deleteRecord.key));
      
      // Refetch data
      const res = await variantAttributesService.getVariantAttributes(page, limit, search);
      const attributes = res.data?.data?.rows || res.data?.rows || [];
      const transformedData = attributes.map((item) => ({
        key: item.id,
        id: item.id,
        variant: item.variant_name,
        values: Array.isArray(item.values) ? item.values.join(", ") : item.values,
        createddate: new Date(item.createdAt).toLocaleDateString(),
        status: item.status ? "Active" : "Inactive",
      }));
      setFormData(transformedData);
      setTotal(res.data?.data?.count || res.data?.count || attributes.length);
    } catch (err) {
      console.error("Failed to delete variant attribute:", err);
      message.error(err.response?.data?.message || "Failed to delete variant attribute");
      setShowDeleteModal(false);
      setDeleteRecord(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  // ✅ Close and Reset
  const handleCloseModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    setEditRecord(null);
    setAddVariantData({ variant: "", values: "", status: true });
  };

  // 🟣 Refresh
  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
    // also clear selection on refresh (keeps UX consistent)
    setSelectedRowKeys([]);
    message.success("Refreshed");
  };

  // 🟣 Toggle Filters
  const toggleFilters = () => setFiltersCollapsed((prev) => !prev);

  // 🟣 Export CSV
  const handleExportCSV = () => {
    if (!formData || !formData.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredData.length ? filteredData : formData;
    const headers = ["variant", "values", "createddate", "status"];
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
      `variantattributes_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("CSV exported successfully");
  };

  // 🟣 Export PDF
  const handleExportPDF = () => {
    const dataToExport = filteredData.length ? filteredData : formData;
    if (!dataToExport || !dataToExport.length) {
      message.info("No data to export");
      return;
    }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });
    doc.setFontSize(16);
    doc.setTextColor("#6C5CE7");
    doc.text("Variant Attributes Report", 40, 40);

    const columns = [
      { header: "Variant", dataKey: "variant" },
      { header: "Values", dataKey: "values" },
      { header: "Created Date", dataKey: "createddate" },
      { header: "Status", dataKey: "status" },
    ];

    autoTable(doc, {
      startY: 60,
      columns,
      body: dataToExport,
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [108, 92, 231], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`variantattributes_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // NEW: handlers and derived values for master/select-all checkbox
  const visibleRowKeys = filteredData.map((d) => d.key);
  const allVisibleSelected =
    visibleRowKeys.length > 0 &&
    visibleRowKeys.every((k) => selectedRowKeys.includes(k));
  const someVisibleSelected =
    selectedRowKeys.length > 0 &&
    visibleRowKeys.some((k) => selectedRowKeys.includes(k)) &&
    !allVisibleSelected;

  const onHeaderCheckboxChange = (e) => {
    if (e.target.checked) {
      // select all visible rows
      setSelectedRowKeys(visibleRowKeys);
    } else {
      // deselect all visible rows only (keep selections outside filter? user asked to select all visible; here we clear visible ones)
      // To keep it simple and expected: we'll clear all selections
      setSelectedRowKeys([]);
    }
  };

  const onRowCheckboxChange = (record, e) => {
    if (e.target.checked) {
      setSelectedRowKeys((prev) => {
        if (prev.includes(record.key)) return prev;
        return [...prev, record.key];
      });
    } else {
      setSelectedRowKeys((prev) => prev.filter((k) => k !== record.key));
    }
  };

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={someVisibleSelected}
          checked={allVisibleSelected}
          onChange={onHeaderCheckboxChange}
          // purple accent color
          style={{ accentColor: "#6C5CE7" }}
          title="Select all visible"
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => onRowCheckboxChange(record, e)}
          style={{ accentColor: "#6C5CE7" }} // purple when checked
        />
      ),
      width: 50,
    },
    { title: "Variant", dataIndex: "variant", key: "variant" },
    { title: "Values", dataIndex: "values", key: "values" },
    { title: "Created Date", dataIndex: "createddate", key: "createddate" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <button
          style={{
            backgroundColor:
              status.toLowerCase() === "active" ? "#3EB780" : "#d63031",
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
          {status}
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
          <h2 className="text-xl font-semibold text-gray-800">
            Variant Attributes
          </h2>
          <p className="text-sm text-gray-500">Manage your variant attributes</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* 🟣 Action Buttons */}
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
          {/* Add Variant Button */}
          <Button
            type="primary"
            onClick={() => {
              setIsEditMode(false);
              setAddVariantData({ variant: "", values: "", status: true });
              setShowForm(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#6C5CE7",
              borderColor: "#6C5CE7",
            }}
          >
            <PlusOutlined />
            <span>Add Variant</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {!filtersCollapsed && (
        <div>
          <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
            <Input
              placeholder="Search by variant or value"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setSearch(e.target.value);
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
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
        </div>
      )}

     {/* ✅ Table with smooth rounded corners */}
<div
  style={{
    border: "1px solid #e5e7eb",
    borderRadius: 12, // ✅ smooth rounded corners
    overflow: "hidden", // ✅ ensures corners apply to table content
    background: "#fff",
  }}
>
  <Table
    columns={columns}
    dataSource={filteredData}
    loading={loading}
    pagination={{ pageSize: 5 }}
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


      {/* 🟣 Add/Edit Variant Modal */}
      <Modal
        title={
          <span style={{ fontWeight: "600" }}>
            {isEditMode ? "Edit Variant" : "Add Variant"}
          </span>
        }
        open={showForm}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Variant" required style={{ marginBottom: "10px" }}>
            <Input
              placeholder="Enter variant name"
              name="variant"
              value={addVariantData.variant}
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item label="Values" required style={{ marginBottom: "6px" }}>
            <Input
              placeholder="Enter values (comma separated)"
              name="values"
              value={addVariantData.values}
              onChange={handleInputChange}
            />
          </Form.Item>

          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
            Enter value separated by comma
          </div>

          <Form.Item label="Status">
            <Switch
              checked={addVariantData.status}
              onChange={(checked) =>
                setAddVariantData({ ...addVariantData, status: checked })
              }
              style={{
                backgroundColor: addVariantData.status ? "#3EB780" : "#ccc",
              }}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
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
              onClick={isEditMode ? handleSaveChanges : handleAddVariant}
              style={{
                backgroundColor: "#6C5CE7",
                borderColor: "#6C5CE7",
              }}
            >
              {isEditMode ? "Save Changes" : "Add Variant"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 🟣 Delete Modal */}
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
            Delete Variant
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this variant?
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

export default VariantAttributes;