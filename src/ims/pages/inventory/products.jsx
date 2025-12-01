import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Form,
  Upload,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import { HashLink as Link } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import productService from "./productService.js";

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const Products = () => {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [selectedKeys, setSelectedKeys] = useState([]);

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState([]);

  const initialDataRef = React.useRef(formData);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts();
      console.log("Products API response:", res.data);
      const fetchedProducts = res.data.data || [];
      console.log("Fetched products:", fetchedProducts);
      
      // Map the API data to table format
      const mappedData = fetchedProducts.map(item => {
        console.log("Mapping product:", item.product_name);
        console.log("SingleProduct:", item.SingleProduct);
        console.log("VariantProducts:", item.VariantProducts);
        
        // Calculate total quantity for variant products
        const variantTotalQty = item.VariantProducts?.length > 0
          ? item.VariantProducts.reduce((sum, v) => sum + (v.quantity || 0), 0)
          : 0;
        
        // Get tax data (handle both uppercase and lowercase)
        const taxData = item.SingleProduct?.Tax || item.SingleProduct?.tax;
        
        return {
          key: item.id,
          id: item.id,
          sku: item.sku,
          image: item.ProductImages?.[0]?.image_url || "",
          productname: item.product_name,
          category: item.Category?.category_name || "",
          brand: item.Brand?.brand_name || "",
          price: item.SingleProduct?.price || item.VariantProducts?.[0]?.price || "-",
          unit: item.Unit?.unit_name || "",
          quantity: item.SingleProduct?.quantity || variantTotalQty || "-",
          tax: taxData?.tax_name 
            ? `${taxData.tax_name} (${taxData.tax_percentage}%)` 
            : "-",
          createdby: "admin",
          is_active: item.is_active,
        };
      });
      
      setProducts(fetchedProducts);
      setFormData(mappedData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      message.error(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

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

  const confirmDelete = async () => {
    try {
      await productService.deleteProduct(deleteRecord.id);
      message.success("Product deleted successfully");
      
      // Remove from local state
      setFormData((prev) => prev.filter((item) => item.key !== deleteRecord.key));
      
      // Refresh the products list from API
      await fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      message.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setShowDeleteModal(false);
      setDeleteRecord(null);
    }
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
      "price",
      "unit",
      "quantity",
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
    const filename = `products_export_${new Date()
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
    doc.text("Products Report", 40, 40);

    const columns = [
      { header: "SKU", dataKey: "sku" },
      { header: "Product Name", dataKey: "productname" },
      { header: "Category", dataKey: "category" },
      { header: "Brand", dataKey: "brand" },
      { header: "Price", dataKey: "price" },
      { header: "Unit", dataKey: "unit" },
      { header: "Quantity", dataKey: "quantity" },
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

    doc.save(`products_${new Date().toISOString().slice(0, 10)}.pdf`);
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
      title: (
        <input
          type="checkbox"
          checked={selectedKeys.length === formData.length}
          onChange={handleSelectAll}
          style={{
            accentColor: "#9333ea",
            cursor: "pointer",
          }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedKeys.includes(record.key)}
          onChange={() => handleSelectOne(record.key)}
          style={{
            accentColor: "#9333ea",
            cursor: "pointer",
          }}
        />
      ),
      width: 50,
    },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    {
      title: "Product Name",
      dataIndex: "productname",
      key: "productname",
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
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Tax", dataIndex: "tax", key: "tax" },
    { title: "Created By", dataIndex: "createdby", key: "createdby" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div
          style={{ display: "flex", gap: "8px", justifyContent: "center" }}
        >
          <Button
            icon={<EyeOutlined />}
            style={{
              border: "1px solid #E5E7EB",
              background: "#fff",
              color: "#374151",
            }}
            onClick={() => handleView(record)}
          />
          <Button
            icon={<EditOutlined />}
            style={{
              border: "1px solid #E5E7EB",
              background: "#fff",
              color: "#374151",
            }}
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined style={{ color: "#000" }} />}
            onClick={() => handleDelete(record)}
            style={{
              border: "1px solid #E5E7EB",
              background: "#fff",
            }}
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
          <h2 className="text-xl font-semibold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500">Manage your Products</p>
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
          <Button
            type="primary"
            style={{
              background: "#9333ea",
              borderColor: "#9333ea",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onClick={handleAddProduct}
          >
            <PlusOutlined />
            <span>Add Product</span>
          </Button>

          <Button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid #9333ea",
              color: "#fff",
              background: "#9333ea",
              boxShadow: "none",
            }}
            onClick={() => setShowImportModal(true)}
          >
            <UploadOutlined />
            <span>Import Product</span>
          </Button>
        </div>
      </div>

      {!filtersCollapsed && (
        <div>
          <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
            <Input
              placeholder="Search by product name"
              prefix={<SearchOutlined />}
              style={{ width: 220 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <div className="flex gap-3">
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
              <Form.Item>
                <Select
                  placeholder="Brand"
                  style={{ width: 150 }}
                  value={filterBrand}
                  onChange={(val) => setFilterBrand(val)}
                  allowClear
                >
                  <Option value="Lenovo">Lenovo</Option>
                  <Option value="Beats">Beats</Option>
                  <Option value="Nike">Nike</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
        </div>
      )}

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
          bordered={false}
          rowClassName={() => "hover:bg-gray-50"}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
          scroll={{ x: 'max-content' }}
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

export default Products;
