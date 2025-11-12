import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Dropdown,
  Pagination,
  Tooltip,
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import {
  SearchOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  PlusOutlined,
  ImportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  ReloadOutlined,
  VerticalAlignTopOutlined,
  InboxOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const Purchases = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);

  // NEW: search text state
  const [searchText, setSearchText] = useState("");

  // Keep original data in state so we can filter without losing it
  const [originalData, setOriginalData] = useState([
    {
      key: "1",
      supplier: "Electro Mart",
      reference: "PT001",
      date: "24 Dec 2024",
      status: "Received",
      total: "$1000",
      paid: "$1000",
      due: "$0.00",
      paymentStatus: "Paid",
      // NEW: products included for search
      products: ["Laptop", "HDMI Cable", "Mouse"],
    },
    {
      key: "2",
      supplier: "Quantum Gadgets",
      reference: "PT002",
      date: "10 Dec 2024",
      status: "Pending",
      total: "$1500",
      paid: "$0.00",
      due: "$1500",
      paymentStatus: "Unpaid",
      // NEW: products included for search
      products: ["Smartphone", "Charger"],
    },
    // Add more rows as needed; make sure each object can include products array
  ]);

  // FILTERS COLLAPSE - from Products
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // NEW: mode = 'add' | 'edit'
  const [formMode, setFormMode] = useState("add");
  // NEW: current editing row key
  const [currentEditKey, setCurrentEditKey] = useState(null);
  // NEW: optional uploaded image (for the "one condition" you mentioned)
  const [modalImagePreview, setModalImagePreview] = useState(null);
  // Keep upload file list if needed
  const [uploadFileList, setUploadFileList] = useState([]);

  // NEW: View modal state and record
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);

  const showAddModal = () => {
    setFormMode("add");
    setCurrentEditKey(null);
    form.resetFields();
    setModalImagePreview(null);
    setUploadFileList([]);
    setIsAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
    setModalImagePreview(null);
    setUploadFileList([]);
  };

  const showImportModal = () => setIsImportModalVisible(true);
  const handleImportCancel = () => {
    setIsImportModalVisible(false);
    form.resetFields();
  };

  const handleAddPurchase = (values) => {
    // If edit mode -> update
    if (formMode === "edit" && currentEditKey) {
      setOriginalData((prev) =>
        prev.map((r) => {
          if (r.key === currentEditKey) {
            return {
              ...r,
              supplier: values.supplier || r.supplier,
              reference:
                values.reference ||
                r.reference ||
                `PT${String(currentEditKey).padStart(3, "0")}`,
              date: values.date ? values.date.format("DD MMM YYYY") : r.date,
              status: values.status || r.status,
              total: values.total || r.total,
              paid: values.paid || r.paid,
              due: values.due || r.due,
              paymentStatus: values.paymentStatus || r.paymentStatus,
              products:
                typeof values.product === "string"
                  ? values.product
                      .split(",")
                      .map((p) => p.trim())
                      .filter(Boolean)
                  : values.product
                  ? Array.isArray(values.product)
                    ? values.product
                    : [values.product]
                  : r.products || [],
              // keep other fields unchanged
            };
          }
          return r;
        })
      );

      message.success("Purchase updated (mock)");
    } else {
      // add mode -> insert new
      const newKey = String(originalData.length + 1);
      const newRow = {
        key: newKey,
        supplier: values.supplier || "Unknown",
        reference: values.reference || `PT${newKey.padStart(3, "0")}`,
        date: values.date ? values.date.format("DD MMM YYYY") : "",
        status: values.status || "Pending",
        total: values.total || "$0.00",
        paid: values.paid || "$0.00",
        due: values.due || "$0.00",
        paymentStatus: values.paymentStatus || "Unpaid",
        products:
          typeof values.product === "string"
            ? values.product.split(",").map((p) => p.trim()).filter(Boolean)
            : values.product
            ? Array.isArray(values.product)
              ? values.product
              : [values.product]
            : [],
      };

      setOriginalData((prev) => [newRow, ...prev]);
      message.success("Purchase added (mock)");
    }

    setIsAddModalVisible(false);
    form.resetFields();
    setModalImagePreview(null);
    setUploadFileList([]);
  };

  const handleImportPurchase = (values) => {
    console.log("Import Purchase values:", values);
    setIsImportModalVisible(false);
    form.resetFields();
    message.success("Import processed (mock)");
  };

  const handlePageSizeChange = (value) => setPageSize(value);

  // ✅ Status Tag (LIGHTER COLORS)
  const getStatusTag = (status) => {
    const styles = {
      Received: { background: "#71d98d", color: "#fff" }, // lighter green
      Pending: { background: "#5bc0de", color: "#fff" }, // lighter blue
      Ordered: { background: "#ffd966", color: "#000" }, // lighter yellow
    };
    const current = styles[status] || styles.Pending;
    return (
      <Tag
        style={{
          background: current.background,
          color: current.color,
          borderRadius: "4px",
          fontWeight: 500,
          fontSize: "11px",
          padding: "1px 8px",
          height: "22px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          width: "auto",
        }}
      >
        {status}
      </Tag>
    );
  };

  // ✅ Payment Status Tag
  const getPaymentTag = (status) => {
    const styles = {
      Paid: { background: "#e9f7ec", color: "#1e6b2d", dotColor: "#55d27d" },
      Unpaid: { background: "#fdeced", color: "#8a2c32", dotColor: "#ef646e" },
      Overdue: { background: "#fff9e0", color: "#9a7a12", dotColor: "#ffd84d" },
    };
    const current = styles[status] || styles.Paid;
    return (
      <Tag
        style={{
          background: current.background,
          color: current.color,
          borderRadius: "4px",
          fontWeight: 500,
          fontSize: "10.5px",
          padding: "1px 6px",
          height: "22px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          width: "auto",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: current.dotColor,
            display: "inline-block",
            marginRight: "4px",
          }}
        ></span>
        {status}
      </Tag>
    );
  };

  const columns = [
    { title: "Supplier Name", dataIndex: "supplier", key: "supplier" },

    // NEW: Product column to show products (and to make filtering visible)
    {
      title: "Product",
      dataIndex: "products",
      key: "products",
      render: (products) => {
        if (!products || products.length === 0) return "-";
        // show up to 2 products then +n to keep table tidy
        if (products.length <= 2) return products.join(", ");
        return `${products.slice(0, 2).join(", ")} +${products.length - 2}`;
      },
    },

    { title: "Reference", dataIndex: "reference", key: "reference" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => getStatusTag(text),
    },
    { title: "Total", dataIndex: "total", key: "total" },
    { title: "Paid", dataIndex: "paid", key: "paid" },
    { title: "Due", dataIndex: "due", key: "due" },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (text) => getPaymentTag(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                // OPEN View modal and populate viewRecord
                setViewRecord(record);
                setIsViewModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                // open modal in edit mode and populate fields
                setFormMode("edit");
                setCurrentEditKey(record.key);
                // prefill form values
                form.setFieldsValue({
                  supplier: record.supplier,
                  reference: record.reference,
                  date: record.date ? moment(record.date, "DD MMM YYYY") : null,
                  status: record.status,
                  total: record.total,
                  paid: record.paid,
                  due: record.due,
                  paymentStatus: record.paymentStatus,
                  product: (record.products || []).join(", "),
                  // other fields can be added as needed
                });
                // if record has an image link (not present in current mock), set it
                if (record.image) {
                  setModalImagePreview(record.image);
                } else {
                  setModalImagePreview(null);
                }
                setIsAddModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: "Are you sure you want to delete this purchase?",
                  onOk: () => {
                    setOriginalData((prev) =>
                      prev.filter((r) => r.key !== record.key)
                    );
                    message.success("Deleted (mock)");
                  },
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const menuItems = [
    { key: "1", label: "Paid" },
    { key: "2", label: "Unpaid" },
    { key: "3", label: "Overdue" },
  ];

  // Filter logic: if searchText is empty => show all, else show rows where any product matches
  const displayedData = useMemo(() => {
    const search = (searchText || "").trim().toLowerCase();
    if (!search) return originalData;
    return originalData.filter((row) => {
      const products = row.products || [];
      // If product names present, check if any product includes the search term
      const matchedInProducts = products.some((p) =>
        p.toLowerCase().includes(search)
      );
      // Also check supplier or reference optionally (helps user if they typed supplier)
      const matchedInSupplier = row.supplier
        ? row.supplier.toLowerCase().includes(search)
        : false;
      const matchedInReference = row.reference
        ? row.reference.toLowerCase().includes(search)
        : false;

      return matchedInProducts || matchedInSupplier || matchedInReference;
    });
  }, [originalData, searchText]);

  // Search input change handler
  const onSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // ---------- Functions ported/bound from Products ----------
  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
    message.info(filtersCollapsed ? "Filters expanded" : "Filters collapsed");
  };

  const handleRefresh = () => {
    setSearchText("");
    form.resetFields();
    // restore original data (if needed)
    // here originalDataRef concept not required; we just keep originalData as base
    message.success("Refreshed");
  };

  const handleExportCSV = () => {
    if (!displayedData || !displayedData.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = displayedData;
    const headers = [
      "supplier",
      "product",
      "reference",
      "date",
      "status",
      "total",
      "paid",
      "due",
      "paymentStatus",
    ];

    const csvRows = [];
    csvRows.push(headers.join(","));
    dataToExport.forEach((row) => {
      const values = headers.map((h) => {
        let v;
        if (h === "product") v = (row.products || []).join("; ");
        else v = row[h] ?? "";
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
    const filename = `purchases_export_${new Date()
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
    const dataToExport = displayedData;
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
    doc.text("Purchases Report", 40, 40);

    const columnsForPDF = [
      { header: "Supplier", dataKey: "supplier" },
      { header: "Product(s)", dataKey: "products" },
      { header: "Reference", dataKey: "reference" },
      { header: "Date", dataKey: "date" },
      { header: "Status", dataKey: "status" },
      { header: "Total", dataKey: "total" },
      { header: "Paid", dataKey: "paid" },
      { header: "Due", dataKey: "due" },
      { header: "Payment Status", dataKey: "paymentStatus" },
    ];

    // Build body with products as joined string
    const body = dataToExport.map((row) => ({
      supplier: row.supplier || "",
      products: (row.products || []).join(", "),
      reference: row.reference || "",
      date: row.date || "",
      status: row.status || "",
      total: row.total || "",
      paid: row.paid || "",
      due: row.due || "",
      paymentStatus: row.paymentStatus || "",
    }));

    autoTable(doc, {
      startY: 60,
      columns: columnsForPDF,
      body,
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`purchases_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // Upload props for modal image uploader
  const uploadProps = {
    name: "file",
    multiple: false,
    accept: "image/*",
    fileList: uploadFileList,
    beforeUpload: (file) => {
      // prevent auto upload, just preview
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files for the modal preview.");
        return Upload.LIST_IGNORE;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setModalImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setUploadFileList([file]);
      return Upload.LIST_IGNORE; // prevent auto upload
    },
    onRemove: () => {
      setModalImagePreview(null);
      setUploadFileList([]);
    },
  };

  // View modal cancel
  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setViewRecord(null);
  };

  // ---------------------------------------------------------

  // Row selection object for table checkboxes
  const rowSelection = {
    // you can track selected rows if needed; keeping minimal to avoid changes elsewhere
    onChange: (selectedRowKeys, selectedRows) => {
      // no-op currently; you can extend this if required
      // console.log("Selected Row Keys: ", selectedRowKeys, selectedRows);
    },
    selections: true,
  };

  return (
    <div style={{ padding: "20px" }} className="antd-custom">
      {/* Inject CSS to style checkboxes purple (keeps everything else unchanged) */}
      <style>{`
        /* Purple color used across this component (#9333ea) to match header/icon accents */
        .antd-custom .ant-table .ant-checkbox-inner {
          border-radius: 4px;
        }

        /* When checkbox is checked: purple background and purple border */
        .antd-custom .ant-checkbox-checked .ant-checkbox-inner,
        .antd-custom .ant-checkbox-checked .ant-checkbox-inner::after {
          background: #9333ea;
          border-color: #9333ea;
        }

        /* Ensure the tick mark (the inner pseudo-element) is visible as white */
        .antd-custom .ant-checkbox-checked .ant-checkbox-inner::after {
          border-color: #fff;
        }

        /* Hover/focus states - subtle purple glow */
        .antd-custom .ant-checkbox-wrapper:hover .ant-checkbox-inner,
        .antd-custom .ant-checkbox:hover .ant-checkbox-inner,
        .antd-custom .ant-checkbox-input:focus + .ant-checkbox-inner {
          box-shadow: 0 0 0 3px rgba(147,51,234,0.08);
        }

        /* Make the row selection column a bit narrower to match the template look */
        .antd-custom .ant-table-selection-column {
          width: 48px;
        }

        /* If you use header checkbox, style it too */
        .antd-custom .ant-table-selection .ant-checkbox-checked .ant-checkbox-inner {
          background: #9333ea;
          border-color: #9333ea;
        }

        /* Keep label and spacing consistent */
        .antd-custom .ant-checkbox-inner {
          width: 18px;
          height: 18px;
        }

        /* Ensure disabled checkboxes remain gray (no change) */
        .antd-custom .ant-checkbox-disabled .ant-checkbox-inner {
          background: #f5f5f5;
          border-color: #d9d9d9;
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ marginBottom: 0 }}>Purchase</h2>
          <p style={{ color: "#888" }}>Manage your purchases</p>
        </div>

        <Space>
          {/* Bound icons from Products */}
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

          {/* Existing purchase buttons preserved */}
          <Button icon={<PlusOutlined />} type="primary" onClick={showAddModal}>
            Add Purchase
          </Button>
          <Button
            icon={<ImportOutlined />}
            style={{ background: "#001529", color: "white" }}
            onClick={showImportModal}
          >
            Import Purchase
          </Button>
        </Space>
      </div>

      {/* Search & Filter - collapsible using filtersCollapsed */}
      {!filtersCollapsed && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by product name"
            style={{ width: "250px" }}
            value={searchText}
            onChange={onSearchChange}
            allowClear
          />
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
            <Button>
              Payment Status <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={displayedData}
        pagination={false}
        rowKey="key"
        rowSelection={rowSelection}
      />

      {/* View Purchase Modal */}
      <Modal
        title="Purchase Details"
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            Close
          </Button>,
        ]}
        width={800}
        centered
      >
        {viewRecord ? (
          <div>
            <Row gutter={[16, 12]}>
              <Col span={12}>
                <div style={{ fontSize: 13, color: "#555" }}>
                  <strong>Supplier:</strong> {viewRecord.supplier || "-"}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ fontSize: 13, color: "#555" }}>
                  <strong>Reference:</strong> {viewRecord.reference || "-"}
                </div>
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>
                  <strong>Date:</strong> {viewRecord.date || "-"}
                </div>
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>
                  <strong>Status:</strong>{" "}
                  {viewRecord.status ? getStatusTag(viewRecord.status) : "-"}
                </div>
              </Col>

              <Col span={8} style={{ marginTop: 10 }}>
                <div style={{ fontSize: 13, color: "#555" }}>
                  <strong>Total:</strong> {viewRecord.total || "-"}
                </div>
              </Col>
              <Col span={8} style={{ marginTop: 10 }}>
                <div style={{ fontSize: 13, color: "#555" }}>
                  <strong>Paid:</strong> {viewRecord.paid || "-"}
                </div>
              </Col>
              <Col span={8} style={{ marginTop: 10 }}>
                <div style={{ fontSize: 13, color: "#555" }}>
                  <strong>Due:</strong> {viewRecord.due || "-"}
                </div>
              </Col>

              <Col span={24} style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, color: "#555" }}>
                  <strong>Payment Status:</strong>{" "}
                  {viewRecord.paymentStatus
                    ? getPaymentTag(viewRecord.paymentStatus)
                    : "-"}
                </div>
              </Col>

              <Col span={24} style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: 14 }}>Products</strong>
                </div>

                {/* If more detailed product info is available in record.productDetails, show it as a table.
                    Otherwise just list product names */}
                {viewRecord.productDetails && Array.isArray(viewRecord.productDetails) && viewRecord.productDetails.length > 0 ? (
                  <Table
                    size="small"
                    columns={[
                      { title: "Product", dataIndex: "name", key: "name" },
                      { title: "Qty", dataIndex: "qty", key: "qty" },
                      { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
                      { title: "Discount", dataIndex: "discount", key: "discount" },
                      { title: "Tax", dataIndex: "tax", key: "tax" },
                      { title: "Total", dataIndex: "total", key: "total" },
                    ]}
                    dataSource={viewRecord.productDetails.map((p, idx) => ({
                      key: p.id || idx,
                      name: p.name || "-",
                      qty: p.qty ?? "-",
                      unitPrice: p.unitPrice ?? "-",
                      discount: p.discount ?? "-",
                      tax: p.tax ?? "-",
                      total: p.total ?? "-",
                    }))}
                    pagination={false}
                  />
                ) : (
                  <>
                    {viewRecord.products && viewRecord.products.length > 0 ? (
                      <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                        {viewRecord.products.map((p, i) => (
                          <li key={i} style={{ marginBottom: 6 }}>
                            <span style={{ fontWeight: 500 }}>{p}</span>
                            {/* If you later add detailed info per product, this is a good place to render it. */}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ color: "#888", marginTop: 6 }}>
                        No product details available.
                      </div>
                    )}
                  </>
                )}
              </Col>
            </Row>
          </div>
        ) : (
          <div>No record selected</div>
        )}
      </Modal>

      {/* ✅ Add/Edit Purchase Modal - SINGLE FORM FOR BOTH */}
      <Modal
        title={
          formMode === "add"
            ? "Add Purchase"
            : modalImagePreview
            ? "Edit Purchase — Image Preview"
            : "Edit Purchase"
        }
        open={isAddModalVisible}
        onCancel={handleAddCancel}
        footer={null}
        width={1000}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddPurchase}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Supplier Name"
                name="supplier"
                rules={[{ required: true, message: "Please select supplier" }]}
              >
                <Select placeholder="Select">
                  <Option value="Electro Mart">Electro Mart</Option>
                  <Option value="Prime Mart">Prime Mart</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Reference"
                name="reference"
                rules={[{ required: true, message: "Please enter reference" }]}
              >
                <Input placeholder="Enter Reference" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={formMode === "add" ? "Product" : "Product(s)"}
            name="product"
            rules={[{ required: true, message: "Please select product" }]}
          >
            <Input placeholder="Search Product (comma-separated for multiple)" />
          </Form.Item>

          <div
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            <Table
              size="small"
              columns={[
                { title: "Product", dataIndex: "product" },
                { title: "Qty", dataIndex: "qty" },
                { title: "Purchase Price($)", dataIndex: "price" },
                { title: "Discount($)", dataIndex: "discount" },
                { title: "Tax(%)", dataIndex: "tax" },
                { title: "Tax Amount($)", dataIndex: "taxAmount" },
                { title: "Unit Cost($)", dataIndex: "unitCost" },
                { title: "Total Cost(%)", dataIndex: "totalCost" },
              ]}
              dataSource={[]}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
              }}
            />
          </div>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Order Tax"
                name="orderTax"
                rules={[{ required: true, message: "Enter order tax" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Discount"
                name="discount"
                rules={[{ required: true, message: "Enter discount" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Shipping"
                name="shipping"
                rules={[{ required: true, message: "Enter shipping" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Select status" }]}
              >
                <Select placeholder="Select">
                  <Option value="Ordered">Ordered</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Received">Received</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          {/* NEW: Image uploader inside the modal to satisfy the "image condition" you mentioned */}
          <Form.Item label="Upload/Edit Form Image (optional)">
            <Upload {...uploadProps} showUploadList={{ showRemoveIcon: true }}>
              <Button icon={<InboxOutlined />}>Upload an image</Button>
            </Upload>

            {modalImagePreview && (
              <div style={{ marginTop: 12 }}>
                <img
                  src={modalImagePreview}
                  alt="Preview"
                  style={{ maxWidth: "180px", maxHeight: "120px", borderRadius: 4 }}
                />
                <div style={{ marginTop: 6 }}>
                  <Button
                    size="small"
                    onClick={() => {
                      // If an image is present and user wants to switch to "image edit" layout,
                      // we already display a title variant above. Further behaviour can be added.
                      message.info("Image attached to modal (preview shown).");
                    }}
                  >
                    Use image preview
                  </Button>
                  <Button
                    size="small"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      setModalImagePreview(null);
                      setUploadFileList([]);
                    }}
                  >
                    Remove image
                  </Button>
                </div>
              </div>
            )}
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Button onClick={handleAddCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {formMode === "add" ? "Submit" : "Update"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ✅ Import Purchase Modal */}
      <Modal
        title="Import Purchase"
        open={isImportModalVisible}
        onCancel={handleImportCancel}
        footer={null}
        width={700}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleImportPurchase}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Supplier Name"
                name="supplier"
                rules={[{ required: true, message: "Please select supplier" }]}
              >
                <Select placeholder="Select Supplier">
                  <Option value="Electro Mart">Electro Mart</Option>
                  <Option value="Prime Mart">Prime Mart</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select placeholder="Select Status">
                  <Option value="Ordered">Ordered</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Received">Received</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* 🔹 Changed button color from orange (#ff9f43) to purple (#6f42c1) */}
          <Button
            icon={<DownloadOutlined />}
            type="default"
            style={{
              background: "#6f42c1",
              color: "#fff",
              marginBottom: "15px",
            }}
          >
            Download Sample File
          </Button>

          <Form.Item
            label="Upload CSV File"
            name="file"
            rules={[{ required: true, message: "Please upload a file" }]}
          >
            <Dragger
              name="file"
              multiple={false}
              accept=".csv"
              style={{
                padding: "10px 0",
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#6f42c1" }} />
              </p>
              <p className="ant-upload-text" style={{ color: "gray" }}>
                Drag and drop a file to upload
              </p>
            </Dragger>
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Order Tax"
                name="orderTax"
                rules={[{ required: true, message: "Enter order tax" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Discount"
                name="discount"
                rules={[{ required: true, message: "Enter discount" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Shipping"
                name="shipping"
                rules={[{ required: true, message: "Enter shipping" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Button onClick={handleImportCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Purchases;
