<<<<<<< HEAD


=======
>>>>>>> 3fbe18b2f3be4a4ef66ef580865500f50c713a42
import { useState, useMemo, useEffect } from "react";
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
import warrantyService from "./warrantyService.js";

const { Option } = Select;

const Warranties = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [status , setStatus] = useState(true)
  const [page] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState([]);

  const [addWarrantyData, setAddWarrantyData] = useState({
    warranty: "",
    duration: "",
    period: "",
    description: "",
    status: true,
  });

  // New: selection state for checkboxes
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // ✅ Fetch warranties from API
  useEffect(() => {
    const fetchData = async () => {
      if (loading) return; // Prevent multiple calls
      
      try {
        setLoading(true);
        const res = await warrantyService.getWarranties(page, limit, search);
        console.log("API response:", res.data);
        
        // Handle response structure: {data: {rows: [], count: 3, page: 1, limit: 5, totalPages: 1}}
        const warranties = res.data?.data?.rows || res.data?.rows || [];
        
        // Transform API data to match component format
        const transformedData = warranties.map((item) => ({
          key: item.id,
          id: item.id,
          warranty: item.warranty_name,
          description: item.description,
          duration: `${item.duration} ${item.period}`,
          durationValue: item.duration,
          period: item.period,
          status: item.status ? "Active" : "Inactive",
        }));
        
        setFormData(transformedData);
        setTotal(res.data?.data?.count || res.data?.count || warranties.length);
      } catch (err) {
        console.error("Failed to fetch warranties:", err);
        message.error("Failed to load warranties");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, search]);

  // ✅ Search + Filter logic
  const filteredData = useMemo(() => {
    let filtered = [...formData];

    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.warranty.toLowerCase().includes(lowerSearch) ||
          item.description.toLowerCase().includes(lowerSearch) ||
          item.duration.toLowerCase().includes(lowerSearch)
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
    const { name, value } = e.target;
    setAddWarrantyData({ ...addWarrantyData, [name]: value });
  };

  // ✅ Add Warranty
  const handleAddWarranty = async () => {
    if (
      !addWarrantyData.warranty.trim() ||
      !addWarrantyData.duration.trim() ||
      !addWarrantyData.period.trim() ||
      !addWarrantyData.description.trim()
    ) {
      message.warning("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        warranty_name: addWarrantyData.warranty,
        duration: parseInt(addWarrantyData.duration),
        period: addWarrantyData.period,
        description: addWarrantyData.description,
        status: addWarrantyData.status,
      };

      const res = await warrantyService.createWarranty(payload);

      // Transform response to match table format - same as ProductCategory
      const createdWarranty = res.data.data;
      const newWarranty = {
        key: createdWarranty.id,
        id: createdWarranty.id,
        warranty: createdWarranty.warranty_name,
        description: createdWarranty.description,
        duration: `${createdWarranty.duration} ${createdWarranty.period}`,
        durationValue: createdWarranty.duration,
        period: createdWarranty.period,
        status: createdWarranty.status ? "Active" : "Inactive",
      };

      setFormData([newWarranty, ...formData]);
      handleCloseModal();
      message.success("Warranty added");
    } catch (err) {
      console.log("Failed to add warranty", err);
      console.log("Error response:", err.response?.data);
      console.log("Error status:", err.response?.status);
      message.error(err.response?.data?.message || "Failed to add warranty");
    }
  };

  // ✅ Edit Warranty
  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);

    setAddWarrantyData({
      warranty: record.warranty,
      duration: record.durationValue || "",
      period: record.period || "",
      description: record.description,
      status: record.status === "Active",
    });

    setShowForm(true);
  };

  // ✅ Save Changes
  const handleSaveChanges = async () => {
    if (!editRecord) {
      message.error("No record selected for editing");
      return;
    }

    try {
      const payload = {
        warranty_name: addWarrantyData.warranty,
        duration: parseInt(addWarrantyData.duration),
        period: addWarrantyData.period,
        description: addWarrantyData.description,
        status: addWarrantyData.status,
      };

      const res = await warrantyService.updateWarranty(editRecord.id, payload);
      console.log("Warranty updated:", res.data);

      // Update local state
      const updatedData = formData.map((item) =>
        item.id === editRecord.id
          ? {
              ...item,
              warranty: addWarrantyData.warranty,
              description: addWarrantyData.description,
              duration: `${addWarrantyData.duration} ${addWarrantyData.period}`,
              durationValue: addWarrantyData.duration,
              period: addWarrantyData.period,
              status: addWarrantyData.status ? "Active" : "Inactive",
            }
          : item
      );
      
      setFormData(updatedData);
      handleCloseModal();
      message.success("Warranty updated successfully");
    } catch (err) {
      console.error("Failed to update warranty:", err);
      message.error("Failed to update warranty");
    }
  };

  // ✅ Delete Warranty
  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await warrantyService.deleteWarranty(recordToDelete.id);
      console.log("Warranty deleted");

      setFormData(formData.filter((item) => item.id !== recordToDelete.id));
      setDeleteModalVisible(false);
      setRecordToDelete(null);
      message.success("Warranty deleted successfully");

      // also remove from selectedRowKeys if present
      setSelectedRowKeys((prev) => prev.filter((k) => k !== recordToDelete.key));
    } catch (err) {
      console.error("Failed to delete warranty:", err);
      message.error("Failed to delete warranty");
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  // ✅ Close and Reset
  const handleCloseModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    setEditRecord(null);
    setAddWarrantyData({
      warranty: "",
      duration: "",
      period: "",
      description: "",
      status: true,
    });
  };

  // 🟣 Refresh handler (clears search/filters)
  const handleRefresh = () => {
    setSearchText("");
    setSearch("");
    setFilterStatus(null);
    message.success("Refreshed");

    // optional: also clear selection on refresh
    setSelectedRowKeys([]);
  };

  // 🟣 Toggle filters collapse
  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
  };

  // 🟣 Export CSV (Excel)
  const handleExportCSV = () => {
    if (!formData || !formData.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredData.length ? filteredData : formData;
    const headers = ["warranty", "description", "duration", "status"];

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
    const filename = `warranties_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("CSV exported");
  };

  // 🟣 Export PDF
  const handleExportPDF = () => {
    const dataToExport = filteredData.length ? filteredData : formData;
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
    doc.setTextColor("#6C5CE7");
    doc.text("Variant Attributes Report", 40, 40);

    const columns = [
      { header: "Warranty", dataKey: "warranty" },
      { header: "Description", dataKey: "description" },
      { header: "Duration", dataKey: "duration" },
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

    doc.save(`warranties_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // New: toggle select all for filteredData
  const handleToggleSelectAll = (checked) => {
    if (checked) {
      const keys = filteredData.map((d) => d.key);
      setSelectedRowKeys(keys);
    } else {
      setSelectedRowKeys([]);
    }
  };

  // New: toggle single row selection
  const handleToggleRow = (key, checked) => {
    setSelectedRowKeys((prev) => {
      if (checked) {
        // add
        if (!prev.includes(key)) return [...prev, key];
        return prev;
      } else {
        // remove
        return prev.filter((k) => k !== key);
      }
    });
  };

  const columns = [
    {
      title: (
        // Controlled master checkbox that selects/deselects all visible rows (filteredData)
        <input
          type="checkbox"
          aria-label="select all"
          checked={
            filteredData.length > 0 &&
            selectedRowKeys.length === filteredData.length
          }
          ref={(el) => {
            if (!el) return;
            // set indeterminate if some (but not all) filtered rows are selected
            const someSelected =
              selectedRowKeys.length > 0 &&
              selectedRowKeys.length < filteredData.length;
            el.indeterminate = someSelected;
          }}
          onChange={(e) => handleToggleSelectAll(e.target.checked)}
          style={{
            accentColor: "#6C5CE7", // purple when checked
            width: 16,
            height: 16,
            cursor: "pointer",
          }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          aria-label={`select row ${record.key}`}
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => handleToggleRow(record.key, e.target.checked)}
          style={{
            accentColor: "#6C5CE7", // purple when checked
            width: 16,
            height: 16,
            cursor: "pointer",
          }}
        />
      ),
      width: 50,
    },
    { title: "Warranty", dataIndex: "warranty", key: "warranty" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
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
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Warranties</h2>
          <p className="text-sm text-gray-500">Manage your product warranties</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* 🟣 Action Buttons placed before Add Warranty */}
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

          {/* Add Warranty Button */}
          <Button
            type="primary"
            onClick={() => {
              setIsEditMode(false);
              setAddWarrantyData({
                warranty: "",
                duration: "",
                period: "",
                description: "",
                status: true,
              });
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
            <span>Add Warranty</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {!filtersCollapsed && (
        <div>
          <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
            <Input
              placeholder="Search by warranty, description or duration"
              prefix={<SearchOutlined />}
              style={{ width: 280 }}
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

      {/* Table */}
      {/* ✅ Table with smooth rounded corners */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12, // ✅ smooth rounded corners
          overflow: "hidden", // ✅ ensures corners apply to the table content
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

      {/* 🟣 Add/Edit Warranty Modal */}
      <Modal
        title={
          <span style={{ fontWeight: "600" }}>
            {isEditMode ? "Edit Warranty" : "Add Warranty"}
          </span>
        }
        open={showForm}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Warranty" required style={{ marginBottom: "10px" }}>
            <Input
              placeholder="Enter warranty name"
              name="warranty"
              value={addWarrantyData.warranty}
              onChange={handleInputChange}
            />
          </Form.Item>

          {/* Duration and Period Row */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "10px",
            }}
          >
            <Form.Item label="Duration" required style={{ flex: 1 }}>
              <Input
                placeholder="Enter duration"
                name="duration"
                value={addWarrantyData.duration}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item label="Period" required style={{ flex: 1 }}>
              <Select
                placeholder="Select"
                value={addWarrantyData.period}
                onChange={(val) =>
                  setAddWarrantyData({ ...addWarrantyData, period: val })
                }
              >
                <Option value="Days">Days</Option>
                <Option value="Months">Months</Option>
                <Option value="Years">Years</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Description */}
          <Form.Item
            label="Description"
            required
            style={{ marginBottom: "10px" }}
          >
            <Input.TextArea
              placeholder="Enter warranty description"
              rows={3}
              name="description"
              value={addWarrantyData.description}
              onChange={handleInputChange}
            />
          </Form.Item>

          {/* Status */}
          <Form.Item label="Status">
            <Switch
              checked={addWarrantyData.status}
              onChange={(checked) =>
                setAddWarrantyData({ ...addWarrantyData, status: checked })
              }
              style={{
                backgroundColor: addWarrantyData.status ? "#3EB780" : "#ccc",
              }}
            />
          </Form.Item>

          {/* Footer Buttons */}
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
              onClick={isEditMode ? handleSaveChanges : handleAddWarranty}
              style={{
                backgroundColor: "#6C5CE7",
                borderColor: "#6C5CE7",
              }}
            >
              {isEditMode ? "Save Changes" : "Add Warranty"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 🟣 Delete Confirmation Modal */}
      <Modal
        open={deleteModalVisible}
        onCancel={handleCancelDelete}
        footer={null}
        centered
      >
        <div className="text-center">
          <div
            style={{
              backgroundColor: "#F4F1FF",
              width: "60px",
              height: "60px",
              margin: "0 auto",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteOutlined style={{ fontSize: "28px", color: "#6C5CE7" }} />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Delete Warranty</h3>
          <p className="text-gray-500 mt-1">
            Are you sure you want to delete warranty?
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <Button
              onClick={handleCancelDelete}
              style={{
                backgroundColor: "#0A2540",
                color: "#fff",
                border: "none",
                minWidth: "90px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              style={{
                backgroundColor: "#6C5CE7",
                color: "#fff",
                border: "none",
                minWidth: "100px",
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


export default Warranties;

