

import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Form,
  Upload,
  message,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined
} from "@ant-design/icons";

import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import { HashLink as Link } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;
const { RangePicker } = DatePicker;

const SalesReport = () => {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [selectedKeys, setSelectedKeys] = useState([]);

  const [formData, setFormData] = useState([
    {
      key: 1,
      sku: "PT001",
      productname: "Lenovo IdeaPad 3",
      category: "Computers",
      brand: "Lenovo",
      soldqty: "05",
      soldamount: "$3000",
      instockqty: "100",
    },
    {
      key: 2,
      sku: "PT002",
      productname: "Beats Pro",
      category: "Electronics",
      brand: "Beats",
      soldqty: "10",
      soldamount: "$1600",
      instockqty: "140",
    },
  ]);

  const initialDataRef = React.useRef(formData);

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return formData;
    const lower = searchText.toLowerCase();
    return formData.filter((item) =>
      item.productname.toLowerCase().includes(lower)
    );
  }, [searchText, formData]);

  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const [showImportModal, setShowImportModal] = useState(false);
  const [importFileList, setImportFileList] = useState([]);
  const [importForm] = Form.useForm();

  const handleImportBeforeUpload = (file) => {
    const isCsv =
      file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");
    if (!isCsv) {
      message.error("Please upload a CSV file.");
      return Upload.LIST_IGNORE;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const fileObj = {
        uid: file.uid || Date.now(),
        name: file.name,
        status: "done",
        url: reader.result,
      };
      setImportFileList((prev) => [...prev, fileObj]);
    });
    reader.readAsDataURL(file);
    return false;
  };

  const handleImportRemove = (file) => {
    setImportFileList((prev) =>
      prev.filter((f) => f.uid !== file.uid && f.name !== file.name)
    );
  };

  const handlePrint = () => {
    const tableSection = document.querySelector('.ant-table-container')?.closest('div');
    const tableContent = tableSection?.outerHTML;

    if (!tableContent) {
      message.warning('No table content found to print');
      return;
    }

    const originalContent = document.body.innerHTML;

    // Set body to only the table content
    document.body.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="text-align: center; margin-bottom: 20px; color: #333;">Sales Report</h2>
      ${tableContent}
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        Generated on ${new Date().toLocaleDateString()}
      </div>
    </div>
  `;

    window.print();
    document.body.innerHTML = originalContent;
  };

  const handleImportSubmit = () => {
    if (!importFileList.length) {
      message.error("Please upload a CSV file to import.");
      return;
    }
    message.success(
      "Import processed (mock). Close or implement CSV parsing as needed."
    );
    setShowImportModal(false);
    importForm.resetFields();
    setImportFileList([]);
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

  const handleView = (record) => {
    navigate("/ims/inventory/productdetails", { state: { product: record } });
  };

  const handleEdit = (record) => {
    navigate("/ims/inventory/Createproducts", {
      state: { mode: "edit", productData: record },
    });
  };

  const handleAddProduct = () => {
    navigate("/ims/inventory/Createproducts", {
      state: { mode: "add" },
    });
  };

  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
  };

  const handleRefresh = () => {
    setSearchText("");
    setFilterCategory(null);
    setFilterBrand(null);
    form.resetFields();
    if (initialDataRef.current) {
      setFormData(initialDataRef.current);
    }
    message.success("Refreshed");
  };

  const handleExportCSV = () => {
    if (!formData || !formData.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredData.length ? filteredData : formData;
    const headers = [
      "sku",
      "productname",
      "category",
      "brand",
      "soldqty",
      "soldamount",
      "instockqty",
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
    const filename = `sales_report_${new Date()
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
    doc.text("Sales Report", 40, 40);

    const columns = [
      { header: "SKU", dataKey: "sku" },
      { header: "Product Name", dataKey: "productname" },
      { header: "Brand", dataKey: "brand" },
      { header: "Category", dataKey: "category" },
      { header: "Sold Qty", dataKey: "soldqty" },
      { header: "Sold Amount", dataKey: "soldamount" },
      { header: "In Stock Qty", dataKey: "instockqty" },
    ];

    autoTable(doc, {
      startY: 60,
      columns,
      body: dataToExport,
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`sales_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

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
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      align: "left"
    },
    {
      title: "Product Name",
      dataIndex: "productname",
      key: "productname",
      align: "left",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={record.image || "https://via.placeholder.com/40"}
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
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      align: "left"
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "left"
    },
    {
      title: "Sold Qty",
      dataIndex: "soldqty",
      key: "soldqty",
      align: "left"
    },
    {
      title: "Sold Amount",
      dataIndex: "soldamount",
      key: "soldamount",
      align: "left"
    },
    {
      title: "Instock Qty",
      dataIndex: "instockqty",
      key: "instockqty",
      align: "left"
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Sales Report</h2>
          <p className="text-sm text-gray-500">Manage your Sales report</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#10B981]">
          <div className="flex justify-start items-center gap-4">
            <div>
              <DollarOutlined style={{ fontSize: '24px', color: '#10B981' }} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-800">$4,50,000</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-[p#3B82F6]">
          <div className="flex justify-start items-center gap-4">
            <div>
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#3B82F6' }} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-gray-800">$2,50,35</p>
            </div>

          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#F59E0B]">
          <div className="flex justify-start items-center gap-4">
            <div>
              <ClockCircleOutlined style={{ fontSize: '24px', color: '#F59E0B' }} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Unpaid</p>
              <p className="text-2xl font-bold text-gray-800">$1,50,35</p>
            </div>

          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EF4444]">
          <div className="flex justify-start items-center gap-4">
            <div>
              <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#EF4444' }} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-gray-800">$2,52,10</p>
            </div>

          </div>
        </div>
      </div>

      {/* Filters Section */}

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose Date
            </label>
            <RangePicker
              defaultValue={[dayjs('2025-11-06'), dayjs('2025-11-12')]}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store
            </label>
            <Select
              defaultValue="All"
              className="w-full"
            >
              <Option value="All">All</Option>
              <Option value="Store1">Store 1</Option>
              <Option value="Store2">Store 2</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Products
            </label>
            <Select
              defaultValue="All"
              className="w-full"
            >
              <Option value="All">All</Option>
              <Option value="Product1">Product 1</Option>
              <Option value="Product2">Product 2</Option>
            </Select>
          </div>

          <div>
            <Button
              type="primary"
              className="w-full"
              style={{
                background: "#9333ea",
                borderColor: "#9333ea",
                height: 38,
              }}
            >
              Generate Report
            </Button>
          </div>
        </div>
      </div>


      {/* Table */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div className="flex justify-between items-center m-5 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Sales Report</h3>
          </div>
          <div className="flex items-center gap-2">
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
              icon={<PrinterOutlined color="black" size={16} />}
              onClick={handlePrint}
              title="Print"
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          bordered={false}
          rowClassName={() => "hover:bg-gray-50"}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
        />
      </div>

      {/* Delete Modal */}
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
            <DeleteOutlined style={{ fontSize: 30, color: "#6C5CE7" }} />
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

      {/* Import Modal */}
      <Modal
        title="Import Product"
        open={showImportModal}
        onCancel={() => {
          setShowImportModal(false);
          importForm.resetFields();
          setImportFileList([]);
        }}
        width={700}
        footer={[
          <Button
            key="cancelImport"
            onClick={() => {
              setShowImportModal(false);
              importForm.resetFields();
              setImportFileList([]);
            }}
            style={{
              backgroundColor: "#0A2540",
              color: "#fff",
              border: "none",
              height: 38,
              minWidth: 100,
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submitImport"
            type="primary"
            onClick={() => {
              importForm.submit();
            }}
            style={{
              background: "#9333ea",
              borderColor: "#9333ea",
              color: "#fff",
              boxShadow: "none",
              height: 38,
              minWidth: 100,
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Form form={importForm} layout="vertical" onFinish={handleImportSubmit}>
          <Form.Item label="Product" name="product">
            <Select placeholder="Select">
              <Option value="all">All Products</Option>
              <Option value="some">Some Category</Option>
            </Select>
          </Form.Item>

          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item style={{ flex: 1 }} label="Category" name="category">
              <Select placeholder="Select">
                <Option value="Utilities">Utilities</Option>
                <Option value="Electronics">Electronics</Option>
              </Select>
            </Form.Item>

            <Form.Item
              style={{ flex: 1 }}
              label="Sub Category"
              name="subcategory"
            >
              <Select placeholder="Select">
                <Option value="sub1">Sub 1</Option>
                <Option value="sub2">Sub 2</Option>
              </Select>
            </Form.Item>
          </div>

          <div
            style={{
              marginBottom: 12,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                const sampleContent =
                  "sku,productname,category,brand,price,unit,quantity,createdby\n";
                const blob = new Blob([sampleContent], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "sample_products.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              style={{
                background: "#9333ea",
                borderColor: "#9333ea",
                color: "#fff",
                boxShadow: "none",
                marginBottom: 8,
                height: 38,
                borderRadius: 6,
              }}
            >
              Download Sample File
            </Button>
          </div>

          <Form.Item label="Upload CSV File" required>
            <Dragger
              multiple={false}
              accept=".csv,text/csv"
              beforeUpload={handleImportBeforeUpload}
              fileList={importFileList}
              onRemove={handleImportRemove}
              showUploadList={{
                showPreviewIcon: false,
                showDownloadIcon: false,
              }}
              style={{
                border: "1px dashed #d1d5db",
                padding: 18,
                borderRadius: 6,
                background: "#ffffff",
                minHeight: 150,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ padding: 20, textAlign: "center", width: "100%" }}>
                <div style={{ fontSize: 64, lineHeight: 1 }}>
                  <span style={{ color: "#9333ea", display: "inline-block" }}>
                    ☁️
                  </span>
                </div>
                <p
                  style={{
                    margin: "12px 0 0",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: 16,
                  }}
                >
                  Drag and drop a{" "}
                  <span style={{ color: "#9333ea" }}>file to upload</span>
                </p>
                <p style={{ marginTop: 6, color: "#6b7280" }}>
                  or click to select a CSV file
                </p>
              </div>
            </Dragger>
          </Form.Item>

          <Form.Item label="Created by" name="createdby">
            <Input placeholder="Created by" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea
              rows={3}
              placeholder="Add a short description (optional)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesReport;