import React, { useState, useMemo } from "react";
import { Table, Input, Select, Button, Modal, Form, DatePicker, message } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Option } = Select;

const ExpiredProducts = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // ✅ Checkbox selection state
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [formData, setFormData] = useState({
    sku: "",
    productname: "",
    manufactureddate: null,
    expirydate: null,
  });

  const [products, setProducts] = useState([
    {
      key: 1,
      sku: "PT001",
      image: "",
      productname: "Lenovo 3rd Generation",
      manufactureddate: "2024-12-24",
      expirydate: "2026-12-20",
    },
    {
      key: 2,
      sku: "PT002",
      image: "",
      productname: "HP Pavilion",
      manufactureddate: "2023-08-10",
      expirydate: "2025-08-10",
    },
    {
      key: 3,
      sku: "PT003",
      image: "",
      productname: "Dell Inspiron",
      manufactureddate: "2023-10-05",
      expirydate: "2025-10-05",
    },
  ]);

  const filteredProducts = useMemo(() => {
    const q = String(searchText || "").trim().toLowerCase();
    if (!q) {
      return products;
    }

    return products.filter((item) => {
      const sku = String(item.sku ?? "").toLowerCase();
      if (sku.includes(q)) return true;

      const pname = String(item.productname ?? "").toLowerCase();
      if (pname.includes(q)) return true;

      const mDateRaw = item.manufactureddate ?? "";
      const mDateFormatted = mDateRaw ? dayjs(mDateRaw).format("DD MMM YYYY").toLowerCase() : "";
      if (mDateFormatted.includes(q)) return true;

      const eDateRaw = item.expirydate ?? "";
      const eDateFormatted = eDateRaw ? dayjs(eDateRaw).format("DD MMM YYYY").toLowerCase() : "";
      if (eDateFormatted.includes(q)) return true;

      const rawCombined = `${sku} ${pname} ${String(mDateRaw).toLowerCase()} ${String(eDateRaw).toLowerCase()}`;
      if (rawCombined.includes(q)) return true;

      return false;
    });
  }, [searchText, products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddProduct = () => {
    if (
      !formData.sku ||
      !formData.productname ||
      !formData.manufactureddate ||
      !formData.expirydate
    ) {
      alert("Please fill all fields");
      return;
    }

    const newProduct = {
      key: products.length + 1,
      sku: formData.sku,
      productname: formData.productname,
      manufactureddate: formData.manufactureddate.format("YYYY-MM-DD"),
      expirydate: formData.expirydate.format("YYYY-MM-DD"),
    };

    setProducts([...products, newProduct]);
    handleCloseModal();
    message.success("Product added");
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    setFormData({
      sku: record.sku,
      productname: record.productname,
      manufactureddate: dayjs(record.manufactureddate),
      expirydate: dayjs(record.expirydate),
    });
    setShowForm(true);
  };

  const handleSaveChanges = () => {
    const updatedData = products.map((item) =>
      item.key === editRecord.key
        ? {
            ...item,
            sku: formData.sku,
            productname: formData.productname,
            manufactureddate: formData.manufactureddate.format("YYYY-MM-DD"),
            expirydate: formData.expirydate.format("YYYY-MM-DD"),
          }
        : item
    );
    setProducts(updatedData);
    handleCloseModal();
    message.success("Product updated");
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setProducts((prev) => prev.filter((item) => item.key !== deleteRecord.key));
    setShowDeleteModal(false);
    setDeleteRecord(null);
    message.success("Product deleted");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    setEditRecord(null);
    setFormData({
      sku: "",
      productname: "",
      manufactureddate: null,
      expirydate: null,
    });
  };

  const handleRefresh = () => {
    setSearchText("");
    setFilterCategory(null);
    setFilterBrand(null);
    message.success("Refreshed");
  };

  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
  };

  const handleExportCSV = () => {
    if (!products || !products.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredProducts.length ? filteredProducts : products;
    const headers = ["sku", "productname", "manufactureddate", "expirydate"];

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
    const filename = `expired_products_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("CSV exported");
  };

  const handleExportPDF = () => {
    const dataToExport = filteredProducts.length ? filteredProducts : products;
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
    doc.text("Expired Products Report", 40, 40);

    const columns = [
      { header: "SKU", dataKey: "sku" },
      { header: "Product", dataKey: "productname" },
      { header: "Manufactured Date", dataKey: "manufactureddate" },
      { header: "Expired Date", dataKey: "expirydate" },
    ];

    const body = dataToExport.map((r) => ({
      sku: r.sku ?? "",
      productname: r.productname ?? "",
      manufactureddate: r.manufactureddate ? dayjs(r.manufactureddate).format("DD MMM YYYY") : "",
      expirydate: r.expirydate ? dayjs(r.expirydate).format("DD MMM YYYY") : "",
    }));

    autoTable(doc, {
      startY: 60,
      columns,
      body,
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [108, 92, 231], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`expired_products_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // ✅ Checkbox selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedKeys(products.map((item) => item.key));
    } else {
      setSelectedKeys([]);
    }
  };

  const handleSelectOne = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectedKeys.length === products.length}
          onChange={handleSelectAll}
          style={{ accentColor: "#6C5CE7", cursor: "pointer" }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedKeys.includes(record.key)}
          onChange={() => handleSelectOne(record.key)}
          style={{ accentColor: "#6C5CE7", cursor: "pointer" }}
        />
      ),
      width: 50,
    },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    {
      title: "Product",
      dataIndex: "productname",
      key: "productname",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={record.image || "https://via.placeholder.com/40x40?text=Img"}
            alt={text}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Manufacturer Date",
      dataIndex: "manufactureddate",
      key: "manufactureddate",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Expired Date",
      dataIndex: "expirydate",
      key: "expirydate",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
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
            Expired Products
          </h2>
          <p className="text-sm text-gray-500">Manage your expired products</p>
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
        </div>
      </div>

      {/* Filters */}
      {!filtersCollapsed && (
        <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
          <Input
            placeholder="Search by product name"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <div className="flex gap-3">
            <Form.Item>
              <Select
                placeholder="Product"
                style={{ width: 150 }}
                value={filterCategory}
                onChange={(val) => setFilterCategory(val)}
                allowClear
              >
                <Option value="all">Lenovo 3rd Generation</Option>
                <Option value="lenovo">HP Pavilion</Option>
                <Option value="beats">Dell Inspiron</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Select
                placeholder="Sort By : Last 7 Days"
                style={{ width: 190 }}
                value={filterBrand}
                onChange={(val) => setFilterBrand(val)}
                allowClear
              >
                <Option value="last7">Recently Added</Option>
                <Option value="last30">Ascending</Option>
                <Option value="all">Desending</Option>
                <Option value="all">Last month</Option>
                <Option value="all">Last 7 Days</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      )}

      {/* ✅ Table with smooth rounded edges */}
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
          dataSource={filteredProducts}
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
              cell: (props) => <td {...props} className="px-6 py-3" />,
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

      {/* 🟣 Add/Edit Modal */}
      <Modal
        title={
          <span style={{ fontWeight: "600" }}>
            {isEditMode ? "Edit Expired Product" : "Add Expired Product"}
          </span>
        }
        open={showForm}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="SKU" required style={{ marginBottom: "10px" }}>
            <Input
              placeholder="Enter SKU"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item
            label="Product Name"
            required
            style={{ marginBottom: "10px" }}
          >
            <Select
              placeholder="Select Product"
              value={formData.productname}
              onChange={(val) => setFormData({ ...formData, productname: val })}
            >
              <Option value="Lenovo 3rd Generation">Lenovo 3rd Generation</Option>
              <Option value="HP Pavilion">HP Pavilion</Option>
              <Option value="Dell Inspiron">Dell Inspiron</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Manufacturer Date"
            required
            style={{ marginBottom: "10px" }}
          >
            <DatePicker
              value={formData.manufactureddate}
              onChange={(date) =>
                setFormData({ ...formData, manufactureddate: date })
              }
              style={{ width: "100%" }}
              format="DD MMM YYYY"
            />
          </Form.Item>

          <Form.Item label="Expiry Date" required style={{ marginBottom: "10px" }}>
            <DatePicker
              value={formData.expirydate}
              onChange={(date) =>
                setFormData({ ...formData, expirydate: date })
              }
              style={{ width: "100%" }}
              format="DD MMM YYYY"
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
              onClick={isEditMode ? handleSaveChanges : handleAddProduct}
              style={{
                backgroundColor: "#6C5CE7",
                borderColor: "#6C5CE7",
              }}
            >
              {isEditMode ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 🟣 Delete Modal */}
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
            Delete Product
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete product?
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

export default ExpiredProducts;
