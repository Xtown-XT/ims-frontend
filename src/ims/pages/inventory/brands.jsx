import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Form,
  Upload,
  Switch,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Option } = Select;

const Brands = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // ✅ Track Add/Edit
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [status, setStatus] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // NEW: selected rows state
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // REF for header checkbox to set indeterminate state
  const headerCheckboxRef = useRef(null);

  const [formData, setFormData] = useState({
    image: "",
    brand: "",
    createddate: "",
    status: "",
  });

  const [brands, setBrands] = useState([
    {
      key: 1,
      image: "https://via.placeholder.com/80x80.png?text=L",
      brand: "Lenovo",
      createddate: "24 Dec 2024",
      status: "Active",
    },
    {
      key: 2,
      image: "https://via.placeholder.com/80x80.png?text=B",
      brand: "Beats",
      createddate: "20 Dec 2024",
      status: "Inactive",
    },
    {
      key: 3,
      image: "https://via.placeholder.com/80x80.png?text=N",
      brand: "Nike",
      createddate: "10 Dec 2024",
      status: "Active",
    },
    {
      key: 4,
      image: "https://via.placeholder.com/80x80.png?text=A",
      brand: "Apple",
      createddate: "02 Dec 2024",
      status: "Active",
    },
  ]);

  // ✅ Filter brands by search text
  const filteredBrands = useMemo(() => {
    if (!searchText.trim()) return brands;
    const lowerSearch = searchText.toLowerCase();
    return brands.filter((brand) =>
      brand.brand.toLowerCase().includes(lowerSearch)
    );
  }, [searchText, brands]);

  // Keep header checkbox indeterminate sync when filteredBrands or selectedRowKeys change
  useEffect(() => {
    const total = filteredBrands.length;
    const selectedCount = selectedRowKeys.filter((k) =>
      filteredBrands.some((b) => b.key === k)
    ).length;

    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        selectedCount > 0 && selectedCount < total;
    }
  }, [filteredBrands, selectedRowKeys]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (info) => {
    const file = info.file.originFileObj;
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
    setFormData({ ...formData, image: file });
  };

  // ✅ Add Brand
  const handleAddBrand = () => {
    const newBrand = {
      key: brands.length + 1,
      image: imageUrl,
      brand: formData.brand,
      createddate: new Date().toLocaleDateString(),
      status: status ? "Active" : "Inactive",
    };

    setBrands([...brands, newBrand]);
    handleCloseModal();
  };

  // ✅ Edit Brand
  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    setFormData({
      image: record.image,
      brand: record.brand,
      createddate: record.createddate,
      status: record.status,
    });
    setStatus(record.status === "Active");
    setImageUrl(record.image);
    setShowForm(true);
  };

  // ✅ Save Changes
  const handleSaveChanges = () => {
    const updatedData = brands.map((item) =>
      item.key === editRecord.key
        ? {
            ...item,
            brand: formData.brand,
            image: imageUrl,
            status: status ? "Active" : "Inactive",
          }
        : item
    );
    setBrands(updatedData);
    handleCloseModal();
  };

  // ✅ Delete Brand Logic
  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setBrands((prev) => prev.filter((item) => item.key !== deleteRecord.key));
    // Also clear selection if the deleted item was selected
    setSelectedRowKeys((prev) => prev.filter((k) => k !== deleteRecord.key));
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  // ✅ Close and Reset Form
  const handleCloseModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    setFormData({ image: "", brand: "", createddate: "", status: "" });
    setImageUrl(null);
    setEditRecord(null);
    setStatus(true);
  };

  // 🟣 Refresh handler
  const handleRefresh = () => {
    setSearchText("");
    setFilterCategory(null);
    setFilterBrand(null);
    setFilterStatus(null);
    // Also clear selection on refresh
    setSelectedRowKeys([]);
    message.success("Refreshed");
  };

  // 🟣 Toggle filters collapse
  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
  };

  // 🟣 Export CSV (Excel)
  const handleExportCSV = () => {
    if (!brands || !brands.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredBrands.length ? filteredBrands : brands;
    const headers = ["image", "brand", "createddate", "status"];

    const csvRows = [];
    csvRows.push(headers.join(","));
    dataToExport.forEach((row) => {
      const values = headers.map((h) => {
        let v = row[h] ?? "";
        // If image is an object (from upload) attempt to show a placeholder name, else uses URL/string
        if (h === "image" && typeof v === "object" && v?.name) v = v.name;
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
    const filename = `brands_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("CSV exported");
  };

  // 🟣 Export PDF
  const handleExportPDF = () => {
    const dataToExport = filteredBrands.length ? filteredBrands : brands;
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
    doc.text("Brands Report", 40, 40);

    const columns = [
      { header: "Image", dataKey: "image" },
      { header: "Brand", dataKey: "brand" },
      { header: "Created Date", dataKey: "createddate" },
      { header: "Status", dataKey: "status" },
    ];

    // Convert data rows: if image is object, use name or blank, if string use URL
    const body = dataToExport.map((r) => ({
      image: typeof r.image === "string" ? r.image : (r.image?.name ?? ""),
      brand: r.brand ?? "",
      createddate: r.createddate ?? "",
      status: r.status ?? "",
    }));

    autoTable(doc, {
      startY: 60,
      columns,
      body,
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [108, 92, 231], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`brands_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // NEW: toggle single row selection
  const toggleRowSelection = (key) => {
    setSelectedRowKeys((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // NEW: toggle select all for currently filteredBrands
  const handleHeaderCheckboxChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      // select all visible (filteredBrands)
      const visibleKeys = filteredBrands.map((b) => b.key);
      // Merge with existing selected keys (but keep only unique)
      const merged = Array.from(new Set([...selectedRowKeys, ...visibleKeys]));
      setSelectedRowKeys(merged);
    } else {
      // unselect all visible (filteredBrands)
      const visibleKeysSet = new Set(filteredBrands.map((b) => b.key));
      setSelectedRowKeys((prev) => prev.filter((k) => !visibleKeysSet.has(k)));
    }
  };

  const columns = [
    {
      // Header checkbox - controlled + indeterminate through ref
      title: (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          onChange={handleHeaderCheckboxChange}
          // header checkbox is checked only if all visible rows are selected
          checked={
            filteredBrands.length > 0 &&
            filteredBrands.every((b) => selectedRowKeys.includes(b.key))
          }
          // make checked color purple for modern browsers
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
            // make checked color purple for modern browsers
            style={{
              width: 16,
              height: 16,
              accentColor: "#6C5CE7",
              cursor: "pointer",
            }}
            title={`Select ${record.brand}`}
          />
        );
      },
      width: 50,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={record.image || "https://via.placeholder.com/40x40?text=Img"}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              objectFit: "cover",
            }}
            alt="brand"
          />
          <span>{text}</span>
        </div>
      ),
    },
    { title: "Created Date", dataIndex: "createddate", key: "createddate" },
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
          <h2 className="text-xl font-semibold text-gray-800">Brands</h2>
          <p className="text-sm text-gray-500">Manage your brands</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* 🟣 Export / Refresh / Collapse Icons */}
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
          {/* Add Brand */}
          <Button
            type="primary"
            onClick={() => {
              setIsEditMode(false);
              handleCloseModal();
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
            <span>Add Brand</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {!filtersCollapsed && (
        <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
          <Input
            placeholder="Search by brand name"
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <div className="flex gap-3">
            {/* ✅ Status Filter */}
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

            {/* ✅ Sort By Filter */}
            <Form.Item>
              <Select
                placeholder="Sort By : Latest"
                style={{ width: 150 }}
                onChange={(val) => {
                  if (val === "asc") {
                    setBrands([...brands].sort((a, b) => a.brand.localeCompare(b.brand)));
                  } else if (val === "desc") {
                    setBrands([...brands].sort((a, b) => b.brand.localeCompare(a.brand)));
                  } else if (val === "newest") {
                    setBrands([...brands].sort((a, b) => new Date(b.createddate) - new Date(a.createddate)));
                  } else if (val === "oldest") {
                    setBrands([...brands].sort((a, b) => new Date(a.createddate) - new Date(b.createddate)));
                  }
                }}
                allowClear
              >
                <Option value="latest">Latest</Option>
                <Option value="ascending">Ascending</Option>
                <Option value="desending">Desending</Option>

              </Select>
            </Form.Item>
          </div>
        </Form>
      )}

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
          dataSource={filteredBrands}
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

      {/* 🟣 Add/Edit Brand Modal */}
      <Modal
        title={
          <span style={{ fontWeight: "600" }}>
            {isEditMode ? "Edit Brand" : "Add Brand"}
          </span>
        }
        open={showForm}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        <Form layout="vertical" className="space-y-3">
          {/* Image Upload */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "20px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                border: "1px dashed #d9d9d9",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    icon={<CloseOutlined />}
                    size="small"
                    shape="circle"
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "white",
                      color: "red",
                      border: "none",
                    }}
                    onClick={() => {
                      setImageUrl(null);
                      setFormData({ ...formData, image: null });
                    }}
                  />
                </>
              ) : (
                <span style={{ color: "#999" }}>Add Image</span>
              )}
            </div>

            <div>
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleImageChange}
                accept="image/png, image/jpeg"
              >
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    backgroundColor: "#6C5CE7",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  {isEditMode ? "Change Image" : "Upload Image"}
                </Button>
              </Upload>
              <p style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
                JPEG, PNG up to 2 MB
              </p>
            </div>
          </div>

          {/* Brand Name */}
          <Form.Item label="Brand" required>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
            />
          </Form.Item>

          {/* Status Toggle */}
          <Form.Item label="Status">
            <Switch
              checked={status}
              onChange={(checked) => setStatus(checked)}
              style={{
                backgroundColor: status ? "#3EB780" : "#ccc",
              }}
            />
          </Form.Item>

          {/* Footer */}
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
              onClick={isEditMode ? handleSaveChanges : handleAddBrand}
              style={{
                backgroundColor: "#6C5CE7",
                borderColor: "#6C5CE7",
              }}
            >
              {isEditMode ? "Save Changes" : "Add Brand"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 🟣 Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onCancel={cancelDelete}
        footer={null}
        centered
      >
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
            Delete Brand
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this brand?
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

export default Brands;