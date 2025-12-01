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
import brandService from "./brandsService.js";

const { Option } = Select;

// Use the same base URL as the API
const API_BASE_URL = "http://192.168.1.17:3000";

const Brands = () => {
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const headerCheckboxRef = useRef(null);

  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [brands, setBrands] = useState([]);

  // Fetch brands from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await brandService.getBrands();
        console.log("API response:", res.data);
        // Backend returns { rows: [...], count, page, limit, totalPages }
        const fetchedBrands = res.data.rows || [];
        console.log("Fetched brands:", fetchedBrands);
        if (fetchedBrands.length > 0) {
          console.log("First brand image field:", fetchedBrands[0].image);
          console.log("First brand full data:", fetchedBrands[0]);
        }
        setBrands(fetchedBrands);
        setTotal(res.data.count || fetchedBrands.length);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
        message.error(err.response?.data?.message || "Failed to fetch brands");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Client-side filtering for search and status
  const filteredBrands = useMemo(() => {
    let filtered = [...brands];

    // Search filter
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.brand_name?.toLowerCase().includes(lowerSearch)
      );
    }

    // Status filter
    if (filterStatus) {
      const isActive = filterStatus.toLowerCase() === 'active';
      filtered = filtered.filter((item) => item.is_active === isActive);
    }

    return filtered;
  }, [searchText, filterStatus, brands]);

  // Keep header checkbox indeterminate sync when filteredBrands or selectedRowKeys change
  useEffect(() => {
    const total = filteredBrands.length;
    const selectedCount = selectedRowKeys.filter((k) =>
      filteredBrands.some((b) => b.id === k)
    ).length;

    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        selectedCount > 0 && selectedCount < total;
    }
  }, [filteredBrands, selectedRowKeys]);

  const handleImageChange = (info) => {
    console.log("Upload info:", info);
    const file = info.file.originFileObj || info.file;
    console.log("Selected file:", file);
    
    if (file) {
      // Check if it's a valid image file
      if (!file.type || !file.type.startsWith('image/')) {
        message.error('Please select a valid image file (JPEG or PNG)');
        return;
      }
      
      try {
        const imageUrl = URL.createObjectURL(file);
        console.log("Created image URL:", imageUrl);
        setImageUrl(imageUrl);
        setImageFile(file);
        message.success('Image selected successfully');
      } catch (error) {
        console.error("Error creating image URL:", error);
        message.error('Failed to load image preview');
      }
    } else {
      console.error("No file found in upload info");
    }
  };

  // Refetch brands
  const refetchBrands = async () => {
    try {
      setLoading(true);
      const res = await brandService.getBrands();
      console.log("Refetch response:", res.data);
      // Backend returns { rows: [...], count, page, limit, totalPages }
      const fetchedBrands = res.data.rows || [];
      console.log("Fetched brands count:", fetchedBrands.length);
      console.log("First brand:", fetchedBrands[0]);
      setBrands(fetchedBrands);
      setTotal(res.data.count || fetchedBrands.length);
    } catch (err) {
      console.error("Failed to refetch brands:", err);
      console.error("Error details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Add Brand
  const handleAddBrand = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('brand_name', values.brand_name);
      formData.append('is_active', status ? 'true' : 'false');
      if (imageFile) {
        formData.append('image', imageFile);
        console.log("Image file to upload:", imageFile.name, imageFile.type);
      }

      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await brandService.createBrand(formData);
      console.log("Create brand response:", res.data);
      message.success("Brand added successfully");
      handleCloseModal();
      form.resetFields();
      setImageUrl(null);
      setImageFile(null);
      // Refetch to get the latest data from server
      await refetchBrands();
    } catch (err) {
      console.error("Failed to add brand:", err);
      console.error("Error response:", err.response?.data);
      message.error(err.response?.data?.message || "Failed to add brand");
    }
  };

  // Edit Brand
  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    form.setFieldsValue({
      brand_name: record.brand_name,
      is_active: record.is_active,
    });
    setStatus(record.is_active);
    setImageUrl(record.image);
    setImageFile(null);
    setShowForm(true);
  };

  // Save Changes
  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();

      if (!editRecord) {
        message.error("No record selected for editing");
        return;
      }

      const formData = new FormData();
      formData.append('brand_name', values.brand_name);
      formData.append('is_active', status ? 'true' : 'false');
      if (imageFile) {
        formData.append('image', imageFile);
        console.log("New image file to upload:", imageFile.name, imageFile.type);
      }

      console.log("Update FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await brandService.updateBrand(editRecord.id, formData);
      console.log("Update brand response:", res.data);
      message.success("Brand updated successfully");
      handleCloseModal();
      form.resetFields();
      setImageUrl(null);
      setImageFile(null);
      // Refetch to get the latest data from server
      await refetchBrands();
    } catch (err) {
      console.error("Failed to update brand:", err);
      console.error("Error response:", err.response?.data);
      message.error(err.response?.data?.message || "Failed to update brand");
    }
  };

  // Delete Brand
  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await brandService.deleteBrand(deleteRecord.id);
      message.success("Brand deleted successfully");
      setShowDeleteModal(false);
      setDeleteRecord(null);
      setSelectedRowKeys((prev) => prev.filter((k) => k !== deleteRecord.id));
      // Refetch to get the latest data from server
      await refetchBrands();
    } catch (err) {
      console.error("Failed to delete brand:", err);
      message.error(err.response?.data?.message || "Failed to delete brand");
      setShowDeleteModal(false);
      setDeleteRecord(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  // Close and Reset Form
  const handleCloseModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    form.resetFields();
    setImageUrl(null);
    setImageFile(null);
    setEditRecord(null);
    setStatus(true);
  };

  // Refresh handler
  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
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

  // Toggle single row selection
  const toggleRowSelection = (id) => {
    setSelectedRowKeys((prev) => {
      if (prev.includes(id)) {
        return prev.filter((k) => k !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Toggle select all for currently filteredBrands
  const handleHeaderCheckboxChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      const visibleKeys = filteredBrands.map((b) => b.id);
      const merged = Array.from(new Set([...selectedRowKeys, ...visibleKeys]));
      setSelectedRowKeys(merged);
    } else {
      const visibleKeysSet = new Set(filteredBrands.map((b) => b.id));
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
            filteredBrands.length > 0 &&
            filteredBrands.every((b) => selectedRowKeys.includes(b.id))
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
        const checked = selectedRowKeys.includes(record.id);
        return (
          <input
            type="checkbox"
            checked={checked}
            onChange={() => toggleRowSelection(record.id)}
            style={{
              width: 16,
              height: 16,
              accentColor: "#6C5CE7",
              cursor: "pointer",
            }}
            title={`Select ${record.brand_name}`}
          />
        );
      },
      width: 50,
    },
    {
      title: "Brand",
      dataIndex: "brand_name",
      key: "brand_name",
      render: (text, record) => {
        // Handle different possible image field names and formats
        const imageUrl = record.image || record.brand_image || record.imageUrl;
        const fullImageUrl = imageUrl 
          ? (imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`)
          : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23999'%3EImg%3C/text%3E%3C/svg%3E";
        
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={fullImageUrl}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                objectFit: "cover",
                backgroundColor: "#f0f0f0",
              }}
              alt="brand"
              onError={(e) => {
                console.error("Failed to load image:", fullImageUrl);
                console.error("Check if backend is serving static files from /uploads folder");
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23999'%3EImg%3C/text%3E%3C/svg%3E";
              }}
            />
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        if (!date) return '';
        // If date is already formatted as "DD MMM YYYY", return as is
        if (typeof date === 'string' && date.includes(' ') && !date.includes('T')) return date;
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

      {/* Table with smooth rounded corners */}
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
          dataSource={filteredBrands}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: limit,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 'max-content' }}
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

      {/* Add/Edit Brand Modal */}
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
        <Form layout="vertical" form={form} className="space-y-3">
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
                    src={imageUrl.startsWith('blob:') || imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", imageUrl);
                      e.target.src = "https://via.placeholder.com/120x120?text=Error";
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
                      setImageFile(null);
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
          <Form.Item
            label="Brand Name"
            name="brand_name"
            rules={[{ required: true, message: "Please enter brand name" }]}
          >
            <Input placeholder="Enter brand name" />
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