import React, { useState, useMemo, useEffect } from "react";
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
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import subcategoriesService from "./subcategoriesService.js";
import categoryService from "./productCategoryService.js";

const { Option } = Select;

// Use the same base URL as the API
const API_BASE_URL = "http://192.168.1.10:3000";

const ProductSubCategory = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [status, setStatus] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // ✅ New selection state for checkboxes
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [formData, setFormData] = useState([]);

  const [addSubCategoryData, setAddSubCategoryData] = useState({
    category: "",
    subcategory: "",
    categorycode: "",
    description: "",
    status: true,
    image: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchSubcategories();
    };
    fetchData();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      
      // Ensure categories are loaded first
      let categoriesList = categories;
      if (categoriesList.length === 0) {
        categoriesList = await fetchCategories();
      }
      
      const res = await subcategoriesService.getSubcategories();
      console.log("Subcategories API response:", res.data);
      const fetchedData = res.data.data?.subcategories || res.data.subcategories || [];
      
      const mappedData = fetchedData.map(item => {
        // Find the category name from categories array using category_id
        const category = categoriesList.find(cat => cat.id === item.category_id);
        const categoryName = category ? (category.category_name || category.name) : item.category_name || '';
        
        return {
          key: item.id,
          id: item.id,
          subcategory: item.subcategory_name || item.name,
          category: categoryName,
          categoryId: item.category_id,
          categorycode: item.category_code || item.code,
          description: item.description,
          status: item.is_active ? "Active" : "Inactive",
          image: item.image,
        };
      });
      
      console.log("Mapped subcategories data:", mappedData);
      setFormData(mappedData);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      message.error(err.response?.data?.message || "Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      console.log("Categories API response:", res.data);
      const fetchedCategories = res.data.data?.rows || res.data.rows || [];
      setCategories(fetchedCategories);
      return fetchedCategories;
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      message.error("Failed to fetch categories");
      return [];
    }
  };

  // ✅ Search + Status filter logic
  const filteredData = useMemo(() => {
    let filtered = [...formData];
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.subcategory.toLowerCase().includes(lowerSearch) ||
          item.category.toLowerCase().includes(lowerSearch)
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }
    return filtered;
  }, [searchText, filterStatus, formData]);

  // When filteredData changes, ensure selectedKeys remains consistent:
  useEffect(() => {
    // Remove any selected keys that are not in current filteredData
    const filteredKeys = filteredData.map((d) => d.key);
    setSelectedKeys((prev) => prev.filter((k) => filteredKeys.includes(k)));
  }, [filteredData]);

  const handleInputChange = (e) => {
    setAddSubCategoryData({
      ...addSubCategoryData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleAddSubCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('subcategory_name', addSubCategoryData.subcategory);
      formData.append('category_id', addSubCategoryData.category);
      formData.append('category_code', addSubCategoryData.categorycode);
      formData.append('description', addSubCategoryData.description);
      formData.append('is_active', addSubCategoryData.status ? 'true' : 'false');
      
      // Only append image if imageFile exists
      if (imageFile) {
        formData.append('image', imageFile);
        console.log("Image file to upload:", imageFile.name, imageFile.type);
      }

      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await subcategoriesService.createSubcategory(formData);
      console.log("Create subcategory response:", res.data);
      message.success("Subcategory added successfully");
      setShowForm(false);
      resetForm();
      await fetchSubcategories();
    } catch (err) {
      console.error("Failed to add subcategory:", err);
      console.error("Error response:", err.response?.data);
      message.error(err.response?.data?.message || "Failed to add subcategory");
    }
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    setAddSubCategoryData({
      category: record.categoryId,
      subcategory: record.subcategory,
      categorycode: record.categorycode,
      description: record.description,
      status: record.status === "Active",
      image: record.image,
    });
    setImageUrl(record.image);
    setImageFile(null); // Reset imageFile when editing
    setShowForm(true);
  };

  const handleSaveChanges = async () => {
    try {
      if (!editRecord) {
        message.error("No record selected for editing");
        return;
      }

      const formData = new FormData();
      formData.append('subcategory_name', addSubCategoryData.subcategory);
      formData.append('category_id', addSubCategoryData.category);
      formData.append('category_code', addSubCategoryData.categorycode);
      formData.append('description', addSubCategoryData.description);
      formData.append('is_active', addSubCategoryData.status ? 'true' : 'false');
      
      // Only append image if imageFile exists (new upload)
      if (imageFile) {
        formData.append('image', imageFile);
        console.log("New image file to upload:", imageFile.name, imageFile.type);
      }

      console.log("Update FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await subcategoriesService.updateSubcategory(editRecord.id, formData);
      console.log("Update subcategory response:", res.data);
      message.success("Subcategory updated successfully");
      setShowForm(false);
      setIsEditMode(false);
      setEditRecord(null);
      resetForm();
      await fetchSubcategories();
    } catch (err) {
      console.error("Failed to update subcategory:", err);
      console.error("Error response:", err.response?.data);
      message.error(err.response?.data?.message || "Failed to update subcategory");
    }
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await subcategoriesService.deleteSubcategory(deleteRecord.id);
      message.success("Subcategory deleted successfully");
      setShowDeleteModal(false);
      setDeleteRecord(null);
      setSelectedKeys((prev) => prev.filter((k) => k !== deleteRecord.key));
      fetchSubcategories();
    } catch (err) {
      console.error("Failed to delete subcategory:", err);
      message.error(err.response?.data?.message || "Failed to delete subcategory");
      setShowDeleteModal(false);
      setDeleteRecord(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  const resetForm = () => {
    setAddSubCategoryData({
      category: "",
      subcategory: "",
      categorycode: "",
      description: "",
      status: true,
      image: null,
    });
    setImageUrl(null);
    setImageFile(null);
  };

  // 🟣 Refresh handler
  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
    message.success("Refreshed");
  };

  // 🟣 Toggle filters collapse
  const toggleFilters = () => {
    setFiltersCollapsed((prev) => !prev);
  };

  // 🟣 Export CSV
  const handleExportCSV = () => {
    if (!formData || !formData.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredData.length ? filteredData : formData;
    const headers = [
      "subcategory",
      "category",
      "categorycode",
      "description",
      "status",
    ];

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
    const filename = `subcategories_export_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
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
    doc.text("Sub Category Report", 40, 40);

    const columns = [
      { header: "Sub Category", dataKey: "subcategory" },
      { header: "Category", dataKey: "category" },
      { header: "Category Code", dataKey: "categorycode" },
      { header: "Description", dataKey: "description" },
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

    doc.save(`subcategories_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // ✅ Checkbox handlers
  const onToggleRow = (key, checked) => {
    setSelectedKeys((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, key]));
      } else {
        return prev.filter((k) => k !== key);
      }
    });
  };

  // Click header checkbox to toggle select all on **visible** rows (filteredData)
  const onToggleSelectAllVisible = (checked) => {
    if (checked) {
      const keys = filteredData.map((d) => d.key);
      setSelectedKeys((prev) => {
        // keep other selections that might be outside filteredData? requirement was to select all visible.
        // To strictly follow "select all visible" we replace any keys of visible rows.
        // We'll merge unique union of prev + visible keys to avoid losing other selections on other pages.
        const merged = Array.from(new Set([...prev.filter(k => !filteredData.some(d => d.key === k)), ...keys]));
        return merged;
      });
    } else {
      // Remove visible rows' keys from selection:
      setSelectedKeys((prev) => prev.filter((k) => !filteredData.some((d) => d.key === k)));
    }
  };

  // compute header checkbox states
  const visibleKeys = filteredData.map((d) => d.key);
  const numVisible = visibleKeys.length;
  const numSelectedVisible = visibleKeys.filter((k) => selectedKeys.includes(k)).length;
  const headerChecked = numVisible > 0 && numSelectedVisible === numVisible;
  const headerIndeterminate = numSelectedVisible > 0 && numSelectedVisible < numVisible;

  const columns = [
    {
      title: (
        // header checkbox controls selecting all visible rows
        <Checkbox
          checked={headerChecked}
          indeterminate={headerIndeterminate}
          onChange={(e) => onToggleSelectAllVisible(e.target.checked)}
          style={{ marginLeft: 6 }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Checkbox
            checked={selectedKeys.includes(record.key)}
            onChange={(e) => onToggleRow(record.key, e.target.checked)}
          />
        </div>
      ),
      width: 60,
    },
    {
      title: "Images",
      dataIndex: "image",
      key: "image",
      render: (image) => {
        const fullImageUrl = image 
          ? (image.startsWith('http') ? image : `${API_BASE_URL}${image}`)
          : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23999'%3EImg%3C/text%3E%3C/svg%3E";
        
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={fullImageUrl}
              alt="sub-category"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                objectFit: "cover",
                backgroundColor: "#f0f0f0",
              }}
              onError={(e) => {
                console.error("Failed to load image:", fullImageUrl);
                console.error("Check if backend is serving static files from /uploads folder");
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23999'%3EImg%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        );
      },
    },
    { title: "Sub Category", dataIndex: "subcategory", key: "subcategory" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Category Code", dataIndex: "categorycode", key: "categorycode" },
    { title: "Description", dataIndex: "description", key: "description" },
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
            width: "70px",
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
      {/* Style overrides for checkbox purple theme (keeps default look but makes checked color purple) */}
      <style>{`
        /* antd checkbox overrides */
        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #6C5CE7 !important;
          border-color: #6C5CE7 !important;
        }
        .ant-checkbox-inner {
          border-radius: 4px;
        }
        /* keep hover state a little nicer */
        .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner {
          border-color: #6C5CE7 !important;
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Sub Category</h2>
          <p className="text-sm text-gray-500">Manage your sub category</p>
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

          {/* Add Sub Category Button */}
          <Button
            type="primary"
            onClick={() => {
              setIsEditMode(false);
              resetForm();
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
            <PlusCircleOutlined style={{ color: "#fff" }} />
            <span>Add Sub Category</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {!filtersCollapsed && (
        <div>
          <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
            <Input
              placeholder="Search sub category..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <div className="flex gap-3 items-center">
              <Form.Item>
                <Select 
                  placeholder="Category" 
                  name="category" 
                  style={{ width: 180 }}
                  allowClear
                >
                  {categories.map(cat => (
                    <Option key={cat.id} value={cat.category_name || cat.name}>
                      {cat.category_name || cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
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
          borderRadius: 12, // ✅ smooth round corners
          overflow: "hidden", // ✅ ensures rounded corners apply to content
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
          scroll={{ x: "max-content"}}
        />
      </div>

      {/* 🟣 Add/Edit Sub Category Modal */}
      <Modal
        title={
          <span style={{ fontWeight: "600" }}>
            {isEditMode ? "Edit Sub Category" : "Add Sub Category"}
          </span>
        }
        open={showForm}
        onCancel={() => {
          setShowForm(false);
          setIsEditMode(false);
        }}
        footer={null}
        centered
      >
        <Form layout="vertical" className="space-y-3">
          {/* Image Upload Section */}
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
                      setAddSubCategoryData({
                        ...addSubCategoryData,
                        image: null,
                      });
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

          {/* Category */}
          <Form.Item label="Category" required>
            <Select
              name="category"
              value={addSubCategoryData.category}
              onChange={(val) =>
                setAddSubCategoryData({
                  ...addSubCategoryData,
                  category: val,
                })
              }
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>
                  {cat.category_name || cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Sub Category */}
          <Form.Item label="Sub Category" required>
            <Input
              name="subcategory"
              value={addSubCategoryData.subcategory}
              onChange={handleInputChange}
            />
          </Form.Item>

          {/* Category Code */}
          <Form.Item label="Category Code" required>
            <Input
              name="categorycode"
              value={addSubCategoryData.categorycode}
              onChange={handleInputChange}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item label="Description" required>
            <Input.TextArea
              rows={3}
              name="description"
              value={addSubCategoryData.description}
              onChange={handleInputChange}
            />
          </Form.Item>

          {/* Status */}
          <Form.Item label="Status">
            <Switch
              checked={addSubCategoryData.status}
              onChange={(checked) =>
                setAddSubCategoryData({
                  ...addSubCategoryData,
                  status: checked,
                })
              }
              style={{
                backgroundColor: addSubCategoryData.status ? "#3EB780" : "#ccc",
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
              onClick={() => setShowForm(false)}
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
              onClick={isEditMode ? handleSaveChanges : handleAddSubCategory}
              style={{
                backgroundColor: "#6C5CE7",
                borderColor: "#6C5CE7",
              }}
            >
              {isEditMode ? "Save Changes" : "Add Sub Category"}
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
            Delete Sub Category
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this sub category?
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

export default ProductSubCategory;
