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
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [status, setStatus] = useState(true);
  const [editRecord, setEditRecord] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const headerCheckboxRef = useRef(null);

  const [formData, setFormData] = useState([]);

  const [addUnitData, setAddUnitData] = useState({
    unit: "",
    shortname: "",
    status: true,
  });
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const filteredData = useMemo(() => {
    let filtered = [...formData];
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.unit.toLowerCase().includes(lowerSearch) ||
          item.shortname.toLowerCase().includes(lowerSearch)
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }
    return filtered;
  }, [searchText, filterStatus, formData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await unitService.getUnits(page, limit, search);
        console.log("API response:", res.data.data.rows);
        setUnits(res.data.data.rows)
        setTotal(res.data.total);
      } catch (err) {
        console.error("Failed to fetch Units:", err);
      }
    };
    fetchData();
  }, [page, search]);

  // ✅ Handle checkbox header indeterminate state
  useEffect(() => {
    const total = filteredData.length;
    const selectedCount = selectedRowKeys.filter((k) =>
      filteredData.some((b) => b.key === k)
    ).length;

    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        selectedCount > 0 && selectedCount < total;
    }
  }, [filteredData, selectedRowKeys]);

  const handleInputChange = (e) => {
    setAddUnitData({ ...addUnitData, [e.target.name]: e.target.value });
  };

  const handleAddUnit = () => {
    const newUnit = {
      key: formData.length + 1,
      unit: addUnitData.unit,
      shortname: addUnitData.shortname,
      noofproducts: Math.floor(Math.random() * 50),
      createddate: new Date().toLocaleDateString(),
      status: addUnitData.status ? "Active" : "Inactive",
    };
    setFormData([...formData, newUnit]);
    handleCloseModal();
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    setAddUnitData({
      unit: record.unit,
      shortname: record.shortname,
      status: record.status === "Active",
    });
    setShowForm(true);
  };

  const handleSaveChanges = () => {
    const updated = formData.map((item) =>
      item.key === editRecord.key
        ? {
          ...item,
          unit: addUnitData.unit,
          shortname: addUnitData.shortname,
          status: addUnitData.status ? "Active" : "Inactive",
        }
        : item
    );
    setFormData(updated);
    handleCloseModal();
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setFormData((prev) => prev.filter((item) => item.key !== deleteRecord.key));
    setSelectedRowKeys((prev) => prev.filter((k) => k !== deleteRecord.key));
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    setEditRecord(null);
    setAddUnitData({ unit: "", shortname: "", status: true });
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
      { header: "Unit", dataKey: "unit" },
      { header: "Short Name", dataKey: "shortname" },
      { header: "No of Products", dataKey: "noofproducts" },
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

    doc.save(`units_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // ✅ Checkbox handlers
  const toggleRowSelection = (key) => {
    setSelectedRowKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const handleHeaderCheckboxChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      const visibleKeys = filteredData.map((b) => b.key);
      const merged = Array.from(new Set([...selectedRowKeys, ...visibleKeys]));
      setSelectedRowKeys(merged);
    } else {
      const visibleKeysSet = new Set(filteredData.map((b) => b.key));
      setSelectedRowKeys((prev) => prev.filter((k) => !visibleKeysSet.has(k)));
    }
  };

  const columns = [
    {
      title: (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          onChange={handleHeaderCheckboxChange}
          checked={
            filteredData.length > 0 &&
            filteredData.every((b) => selectedRowKeys.includes(b.key))
          }
          style={{
            width: 16,
            height: 16,
            accentColor: "#6C5CE7",
            cursor: "pointer",
          }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => {
        const checked = selectedRowKeys.includes(record.key);
        return (
          <input
            type="checkbox"
            checked={checked}
            onChange={() => toggleRowSelection(record.key)}
            style={{
              width: 16,
              height: 16,
              accentColor: "#6C5CE7",
              cursor: "pointer",
            }}
          />
        );
      },
      width: 50,
    },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Short Name", dataIndex: "shortname", key: "shortname" },
    { title: "No of Products", dataIndex: "noofproducts", key: "noofproducts" },
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
            onClick={() => {
              setIsEditMode(false);
              setAddUnitData({ unit: "", shortname: "", status: true });
              setShowForm(true);
            }}
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

      {/* Add/Edit Modal */}
      <Modal
        title={
          <span style={{ fontWeight: "600" }}>
            {isEditMode ? "Edit Unit" : "Add Unit"}
          </span>
        }
        open={showForm}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Unit" required>
            <Input
              placeholder="Enter unit name"
              name="unit"
              value={addUnitData.unit}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Short Name" required>
            <Input
              placeholder="Enter short name"
              name="shortname"
              value={addUnitData.shortname}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Status">
            <Switch
              checked={addUnitData.status}
              onChange={(checked) =>
                setAddUnitData({ ...addUnitData, status: checked })
              }
              style={{
                backgroundColor: addUnitData.status ? "#3EB780" : "#ccc",
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
              onClick={isEditMode ? handleSaveChanges : handleAddUnit}
              style={{
                backgroundColor: "#6C5CE7",
                borderColor: "#6C5CE7",
              }}
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
