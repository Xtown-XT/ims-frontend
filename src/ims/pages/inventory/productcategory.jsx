import React, { useState, useMemo } from "react";
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

const { Option } = Select;

const ProductCategory = () => {
  const [form] = Form.useForm();

  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(true);
  const [checked, setChecked] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // ✅ Checkbox selection state
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [categories, setCategories] = useState([
    {
      key: 1,
      category: "Computers",
      categoryslug: "computers",
      createdon: "",
      status: "Active",
    },
    {
      key: 2,
      category: "Electronics",
      categoryslug: "electronics",
      createdon: "",
      status: "Inactive",
    },
    {
      key: 3,
      category: "Home Appliances",
      categoryslug: "home-appliances",
      createdon: "",
      status: "Active",
    },
  ]);

  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter((item) =>
        item.category.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    return filtered;
  }, [searchText, filterStatus, categories]);

  const onChange = (ch) => {
    setChecked(ch);
    form.setFieldsValue({ status: ch ? "Active" : "Inactive" });
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditRecord(null);
    setChecked(true);
    form.resetFields();
    form.setFieldsValue({
      category: "",
      categoryslug: "",
      createdon: "",
      status: "Active",
    });
    setShowForm(true);
  };

  const handleAddCategory = async () => {
    try {
      const values = await form.validateFields();
      const newCategory = {
        key: Date.now(),
        category: values.category,
        categoryslug: values.categoryslug,
        createdon: values.createdon || new Date().toISOString().slice(0, 10),
        status: values.status || (checked ? "Active" : "Inactive"),
      };
      setCategories((prev) => [newCategory, ...prev]);
      setShowForm(false);
      form.resetFields();
      setIsEditMode(false);
      setEditRecord(null);
      message.success("Category added");
    } catch (err) {}
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    form.setFieldsValue({
      category: record.category,
      categoryslug: record.categoryslug,
      createdon: record.createdon || "",
      status: record.status || "Inactive",
    });
    setChecked(record.status === "Active");
    setShowForm(true);
  };

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();
      if (!editRecord) {
        message.error("No record selected for editing");
        return;
      }
      setCategories((prev) =>
        prev.map((item) =>
          item.key === editRecord.key
            ? {
                ...item,
                category: values.category,
                categoryslug: values.categoryslug,
                createdon:
                  values.createdon ||
                  editRecord.createdon ||
                  new Date().toISOString().slice(0, 10),
                status: values.status || (checked ? "Active" : "Inactive"),
              }
            : item
        )
      );
      setShowForm(false);
      setIsEditMode(false);
      setEditRecord(null);
      form.resetFields();
      message.success("Changes saved");
    } catch (err) {}
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setCategories((prev) => prev.filter((item) => item.key !== deleteRecord.key));
    setShowDeleteModal(false);
    setDeleteRecord(null);
    message.success("Category deleted");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
  };

  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
    message.success("Refreshed");
  };

  const handleExportCSV = () => {
    if (!categories || !categories.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredCategories.length
      ? filteredCategories
      : categories;
    const headers = ["category", "categoryslug", "status"];

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
    const filename = `categories_export_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("CSV exported");
  };

  const handleExportPDF = () => {
    const dataToExport = filteredCategories.length
      ? filteredCategories
      : categories;
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
    doc.text("Category Report", 40, 40);

    const columns = [
      { header: "Category", dataKey: "category" },
      { header: "Category Slug", dataKey: "categoryslug" },
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

    doc.save(`categories_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // ✅ Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedKeys(categories.map((item) => item.key));
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
          checked={selectedKeys.length === categories.length}
          onChange={handleSelectAll}
          style={{ accentColor: "#7E57C2", cursor: "pointer" }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedKeys.includes(record.key)}
          onChange={() => handleSelectOne(record.key)}
          style={{ accentColor: "#7E57C2", cursor: "pointer" }}
        />
      ),
      width: 50,
    },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Category Slug", dataIndex: "categoryslug", key: "categoryslug" },
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
            fontSize: "11px",
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
          <h2 className="text-xl font-semibold text-gray-800">Category</h2>
          <p className="text-sm text-gray-500">Manage your category</p>
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
              <span>Add Category</span>
            </div>
          </Button>
        </div>
      </div>

      {!filtersCollapsed && (
        <div>
          <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
            <Input
              placeholder="Search category..."
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
          dataSource={filteredCategories}
          pagination={{ pageSize: 5 }}
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

      {/* 🟣 Add/Edit Category Modal */}
      <Modal
        title={
          <span className="font-semibold">
            {isEditMode ? "Edit Category" : "Add Category"}
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
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </span>
            }
            name="category"
            rules={[{ required: true, message: "Please enter category" }]}
            className="mb-3"
          >
            <Input placeholder="Category" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Category Slug <span className="text-red-500">*</span>
              </span>
            }
            name="categoryslug"
            rules={[{ required: true, message: "Please enter category slug" }]}
            className="mb-3"
          >
            <Input placeholder="Category Slug" />
          </Form.Item>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </span>
            <Form.Item name="status" valuePropName="checked" noStyle>
              <Switch
                size="small"
                checked={checked}
                onChange={(ch) => {
                  onChange(ch);
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
              onClick={isEditMode ? handleSaveChanges : handleAddCategory}
            >
              {isEditMode ? "Save Changes" : "Add Category"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 🟣 Delete Confirmation Modal */}
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
            Delete Category
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this category?
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

export default ProductCategory;
