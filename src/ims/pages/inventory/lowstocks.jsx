import React, { useState, useMemo } from "react";
import { Table, Input, Select, Button, Modal, Form, message } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { MdOutlineEmail } from "react-icons/md";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Option } = Select;

const LowStocks = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState(null);
  const [filterStore, setFilterStore] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);

  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // ✅ Checkbox selection state
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [formData, setFormData] = useState([
    {
      key: 1,
      warhouse: "EX849",
      store: "EX849",
      image: "",
      productname: "Electricity Payment",
      category: "Computers",
      sku: "Electricity Bill",
      qty: "200",
      qtyalert: "Unit",
      createdby: "admin",
    },
    {
      key: 2,
      warhouse: "EX849",
      store: "EX849",
      productname: "Water Bill Payment",
      category: "Electronics",
      sku: "Water Bill",
      qty: "150",
      qtyalert: "Unit",
    },
    {
      key: 3,
      warhouse: "EX850",
      store: "EX850",
      productname: "Internet Recharge",
      category: "Shoes",
      sku: "INT900",
      qty: "100",
      qtyalert: "Unit",
    },
  ]);

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return formData;
    const lowerSearch = searchText.toLowerCase();
    return formData.filter((item) =>
      item.productname.toLowerCase().includes(lowerSearch)
    );
  }, [searchText, formData]);

  const handleSendEmail = () => {
    setShowSuccess(true);
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setShowForm(true);
  };

  const handleSaveChanges = () => {
    setShowForm(false);
    setEditRecord(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditRecord(null);
  };

  const handleRefresh = () => {
    message.success("Refreshed");
  };

  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
  };

  const handleExportCSV = () => {
    if (!formData || !formData.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredData.length ? filteredData : formData;
    const headers = [
      "warhouse",
      "store",
      "productname",
      "category",
      "sku",
      "qty",
      "qtyalert",
      "createdby",
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
    const filename = `lowstocks_export_${new Date()
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
    doc.setTextColor("#9333ea");
    doc.text("Low Stocks Report", 40, 40);

    const columns = [
      { header: "Warehouse", dataKey: "warhouse" },
      { header: "Store", dataKey: "store" },
      { header: "Product Name", dataKey: "productname" },
      { header: "Category", dataKey: "category" },
      { header: "SKU", dataKey: "sku" },
      { header: "Qty", dataKey: "qty" },
      { header: "Qty Alert", dataKey: "qtyalert" },
      { header: "Created By", dataKey: "createdby" },
    ];

    autoTable(doc, {
      startY: 60,
      columns,
      body: dataToExport,
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`lowstocks_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setFormData((prev) => prev.filter((item) => item.key !== deleteRecord.key));
    setShowDeleteModal(false);
    setDeleteRecord(null);
    message.success("Product deleted successfully");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  // ✅ Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedKeys(formData.map((item) => item.key));
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
          checked={selectedKeys.length === formData.length}
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
    { title: "Warehouse", dataIndex: "warhouse", key: "warhouse" },
    { title: "Store", dataIndex: "store", key: "store" },
    { title: "Product Name", dataIndex: "productname", key: "productname" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Sku", dataIndex: "sku", key: "sku" },
    { title: "Qty", dataIndex: "qty", key: "qty" },
    { title: "Qty Alert", dataIndex: "qtyalert", key: "qtyalert" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined style={{ color: "#000" }} />}
            onClick={() => handleDelete(record)}
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
          <h2 className="text-xl font-semibold text-gray-800">Low Stocks</h2>
          <p className="text-sm text-gray-500">Manage your low stocks</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          <Button type="primary" onClick={handleSendEmail}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>
                <MdOutlineEmail style={{ color: "#fff" }} />
              </span>
              <span>Send Email</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div>
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
                placeholder="WareHouse"
                style={{ width: 150 }}
                value={filterWarehouse}
                onChange={(val) => setFilterWarehouse(val)}
                allowClear
              >
                <Option value="Lenovo IdeaPad 3">Lenovo IdeaPad 3</Option>
                <Option value="Beats Pro">Beats Pro</Option>
                <Option value="Nike Jordan">Nike Jordan</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Select
                placeholder="Store"
                style={{ width: 150 }}
                value={filterStore}
                onChange={(val) => setFilterStore(val)}
                allowClear
              >
                <Option value="James Kirwin">James Kirwin</Option>
                <Option value="Francis Chang">Francis Chang</Option>
                <Option value="Leo kelly">Leo kelly</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Select
                placeholder="Category"
                style={{ width: 150 }}
                value={filterCategory}
                onChange={(val) => setFilterCategory(val)}
                allowClear
              >
                <Option value="Computers">Computers</Option>
                <Option value="Electronics">Electronics</Option>
                <Option value="Shoes">Shoes</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </div>

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
              backgroundColor: "#F4F1FF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 15px",
            }}
          >
            <DeleteOutlined style={{ fontSize: 30, color: "#000" }} />
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
            Are you sure you want to delete product from low stock?
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

      {/* ✅ Success Modal */}
      <Modal
        open={showSuccess}
        footer={null}
        closable={false}
        centered
        onCancel={() => setShowSuccess(false)}
      >
        <div className="text-center py-4">
          <div
            style={{
              backgroundColor: "#E6F9EE",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34C759"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mt-3">Success</h2>
          <p className="text-gray-600 mt-1">Email Sent Successfully</p>
          <Button
            type="primary"
            style={{
              backgroundColor: "#7E57C2",
              borderColor: "#7E57C2",
              marginTop: "16px",
            }}
            onClick={() => setShowSuccess(false)}
          >
            Close
          </Button>
        </div>
      </Modal>

      {/* 🟣 Edit Low Stocks Modal */}
      <Modal
        title={<span style={{ fontWeight: "600" }}>Edit Low Stocks</span>}
        open={showForm}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Warehouse" required>
              <Select defaultValue="Lavish Warehouse">
                <Option value="Lavish Warehouse">Lavish Warehouse</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Store" required>
              <Select defaultValue="Electro Mart">
                <Option value="Electro Mart">Electro Mart</Option>
              </Select>
            </Form.Item>
            <Form.Item label="SKU" required>
              <Input defaultValue="PT001" />
            </Form.Item>
            <Form.Item label="Category" required>
              <Select defaultValue="Laptop">
                <Option value="Laptop">Laptop</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Product Name" required>
              <Input defaultValue="Lenevo 3rd Gen" />
            </Form.Item>
            <Form.Item label="Qty" required>
              <Input defaultValue="15" />
            </Form.Item>
            <Form.Item label="Qty Alert" required>
              <Input defaultValue="10" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={handleCancel}
              style={{
                backgroundColor: "#0A2540",
                color: "#fff",
                border: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              style={{
                backgroundColor: "#7E57C2",
                color: "#fff",
                border: "none",
              }}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default LowStocks;
