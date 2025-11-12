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
  Image,
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  InputNumber,
  message,
} from "antd";
import {
  PlusOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// ✅ React Icons (updated icons)
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";

import dayjs from "dayjs";

// 📄 PDF + CSV Export Libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 🖼️ Imported Product Images
import LenovoIdeaPad3 from "./assets/LenovoIdeaPad3.png";
import Bold from "./assets/Bold.png";
import NikeJordan from "./assets/NikeJordan.png";
import AppleWatch from "./assets/AppleWatch.png";
import AmazonEchoDot from "./assets/AmazonEchoDot.png";
import LobarHandy from "./assets/LobarHandy.png";
import RedPremiunHandy from "./assets/RedPremiunHandy.png";
import Iphone14Pro from "./assets/Iphone14Pro.png";
import GamingChair from "./assets/GamingChair.png";
import BorealisBackpack from "./assets/BorealisBackpack.png";

const { Option } = Select;
const { TextArea } = Input;

const PurchaseReturn = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);

  // 🔍 Search State
  const [searchText, setSearchText] = useState("");

  // ✅ Collapse Filters
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // ✅ NEW: Add/Edit mode state
  const [formMode, setFormMode] = useState("add");
  const [currentEditRecord, setCurrentEditRecord] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ NEW: checkbox selection states
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Show / Hide Modal
  const showModal = () => {
    setFormMode("add");
    setCurrentEditRecord(null);
    setPreviewImage(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setPreviewImage(null);
  };

  // ---------------------
  // Make data editable by putting it into state
  // ---------------------
  const [data, setData] = useState([
    {
      key: "1",
      image: LenovoIdeaPad3,
      product: "Lenovo IdeaPad 3",
      date: "24 Dec 2024",
      supplier: "Electro Mart",
      reference: "PR001",
      status: "Received",
      total: "$1000",
      paid: "$1000",
      due: "$0.00",
      paymentStatus: "Paid",
    },
    {
      key: "2",
      image: Bold,
      product: "Beats Pro",
      date: "10 Dec 2024",
      supplier: "Quantum Gadgets",
      reference: "PR002",
      status: "Pending",
      total: "$1500",
      paid: "$0.00",
      due: "$1500",
      paymentStatus: "Unpaid",
    },
    {
      key: "3",
      image: NikeJordan,
      product: "Nike Jordan",
      date: "27 Nov 2024",
      supplier: "Prime Bazaar",
      reference: "PR003",
      status: "Received",
      total: "$1500",
      paid: "$1500",
      due: "$0.00",
      paymentStatus: "Paid",
    },
    {
      key: "4",
      image: AppleWatch,
      product: "Apple Series 5 Watch",
      date: "18 Nov 2024",
      supplier: "Gadget World",
      reference: "PR004",
      status: "Received",
      total: "$2000",
      paid: "$1000",
      due: "$1000",
      paymentStatus: "Overdue",
    },
    {
      key: "5",
      image: AmazonEchoDot,
      product: "Amazon Echo Dot",
      date: "06 Nov 2024",
      supplier: "Volt Vault",
      reference: "PR005",
      status: "Pending",
      total: "$800",
      paid: "$400",
      due: "$400",
      paymentStatus: "Unpaid",
    },
    {
      key: "6",
      image: LobarHandy,
      product: "Sanford Chair Sofa",
      date: "25 Oct 2024",
      supplier: "Elite Retail",
      reference: "PR006",
      status: "Received",
      total: "$750",
      paid: "$750",
      due: "$0.00",
      paymentStatus: "Paid",
    },
    {
      key: "7",
      image: RedPremiunHandy,
      product: "Red Premium Satchel",
      date: "14 Oct 2024",
      supplier: "Prime Mart",
      reference: "PR007",
      status: "Received",
      total: "$1300",
      paid: "$1300",
      due: "$0.00",
      paymentStatus: "Paid",
    },
    {
      key: "8",
      image: Iphone14Pro,
      product: "Iphone 14 Pro",
      date: "10 Oct 2024",
      supplier: "NeoTech Store",
      reference: "PR008",
      status: "Pending",
      total: "$1100",
      paid: "$0.00",
      due: "$1100",
      paymentStatus: "Unpaid",
    },
    {
      key: "9",
      image: GamingChair,
      product: "Gaming Chair",
      date: "20 Sep 2024",
      supplier: "Urban Mart",
      reference: "PR009",
      status: "Received",
      total: "$2300",
      paid: "$2300",
      due: "$0.00",
      paymentStatus: "Paid",
    },
    {
      key: "10",
      image: BorealisBackpack,
      product: "Borealis Backpack",
      date: "10 Sep 2024",
      supplier: "Travel Mart",
      reference: "PR010",
      status: "Pending",
      total: "$1700",
      paid: "$0.00",
      due: "$1700",
      paymentStatus: "Unpaid",
    },
  ]);

  // ---------------------
  // handle form submit (add or edit)
  // ---------------------
  const handleSubmit = (values) => {
    // values.date is a dayjs object (or undefined)
    const formattedDate = values.date ? dayjs(values.date).format("DD MMM YYYY") : "";

    if (formMode === "add") {
      // Create a new record (mock). Keep consistent fields used in data.
      const newKey = Date.now().toString();
      const newRecord = {
        key: newKey,
        image: previewImage || LenovoIdeaPad3, // fallback image
        product: values.product || "New Product",
        date: formattedDate || dayjs().format("DD MMM YYYY"),
        supplier: values.supplier || "",
        reference: values.reference || `PR${newKey}`,
        status: values.status || "Pending",
        total: values.total || "$0.00",
        paid: values.paid || "$0.00",
        due: values.due || "$0.00",
        paymentStatus: values.paymentStatus || "Unpaid",
        description: values.description || "",
      };
      setData((prev) => [newRecord, ...prev]);
      message.success("Purchase Return Added (mock)");
    } else {
      // Update existing record in state
      if (!currentEditRecord) {
        message.error("No record selected for editing");
        return;
      }
      const updated = {
        ...currentEditRecord,
        supplier: values.supplier,
        reference: values.reference,
        product: values.product,
        status: values.status,
        date: formattedDate || currentEditRecord.date,
        orderTax: values.orderTax,
        discount: values.discount,
        shipping: values.shipping,
        description: values.description,
      };
      setData((prev) => prev.map((row) => (row.key === currentEditRecord.key ? updated : row)));
      message.success("Purchase Return Updated (mock)");
    }

    setIsModalVisible(false);
    form.resetFields();
    setPreviewImage(null);
    setCurrentEditRecord(null);
    setFormMode("add");
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
  };

  // 🔍 Filter Data by Search Text
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;
    const lowerSearch = searchText.toLowerCase();
    return data.filter((item) =>
      item.product.toLowerCase().includes(lowerSearch)
    );
  }, [searchText, data]);

  // ✅ Status Tag
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

  // ✅ PDF, CSV, Refresh, Collapse
  const handleExportPDF = () => {
    if (!filteredData.length) {
      message.info("No data to export");
      return;
    }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });
    doc.setFontSize(16);
    doc.setTextColor("#9333ea");
    doc.text("Purchase Return Report", 40, 40);

    const columns = [
      { header: "Product", dataKey: "product" },
      { header: "Supplier", dataKey: "supplier" },
      { header: "Reference", dataKey: "reference" },
      { header: "Date", dataKey: "date" },
      { header: "Status", dataKey: "status" },
      { header: "Total", dataKey: "total" },
      { header: "Paid", dataKey: "paid" },
      { header: "Due", dataKey: "due" },
      { header: "Payment Status", dataKey: "paymentStatus" },
    ];
    autoTable(doc, {
      startY: 60,
      columns,
      body: filteredData,
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    doc.save(`purchase_return_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF exported successfully");
  };

  const handleExportCSV = () => {
    if (!filteredData.length) {
      message.info("No data to export");
      return;
    }
    const headers = [
      "product",
      "supplier",
      "reference",
      "date",
      "status",
      "total",
      "paid",
      "due",
      "paymentStatus",
    ];
    const csvRows = [headers.join(",")];
    filteredData.forEach((row) => {
      const values = headers.map((h) => `"${String(row[h] || "").replace(/"/g, '""')}"`);
      csvRows.push(values.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchase_return_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success("CSV exported successfully");
  };

  const handleRefresh = () => {
    setSearchText("");
    message.success("Page refreshed");
  };

  const toggleFilters = () => {
    setFiltersCollapsed((prev) => !prev);
    message.info(filtersCollapsed ? "Filters expanded" : "Filters collapsed");
  };

  // ✅ Checkbox handlers
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      // select currently filtered items
      setSelectedKeys(filteredData.map((item) => item.key));
    } else {
      setSelectedKeys([]);
    }
  };

  const handleRowCheckboxChange = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // 🧩 Table Columns
  const columns = [
    {
      title: <input type="checkbox" style={{ accentColor: "#9333ea" }} checked={selectAll} onChange={handleSelectAll} />,
      dataIndex: "checkbox",
      key: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          style={{ accentColor: "#9333ea" }}
          checked={selectedKeys.includes(record.key)}
          onChange={() => handleRowCheckboxChange(record.key)}
        />
      ),
      width: 50,
    },
    {
      title: "Product Image",
      dataIndex: "image",
      key: "image",
      render: (src) => (
        <Image
          src={src}
          alt="product"
          width={40}
          height={40}
          style={{ borderRadius: 8, objectFit: "cover" }}
          preview={false}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "product",
      key: "product",
      render: (text) => <span>{text}</span>,
    },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Supplier Name", dataIndex: "supplier", key: "supplier" },
    { title: "Reference", dataIndex: "reference", key: "reference" },
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
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                // Populate modal for editing
                setFormMode("edit");
                setCurrentEditRecord(record);

                // Set date as dayjs object for DatePicker (assuming format 'DD MMM YYYY')
                let dateValue = null;
                try {
                  dateValue = record.date ? dayjs(record.date, "DD MMM YYYY") : null;
                } catch (e) {
                  dateValue = null;
                }

                form.setFieldsValue({
                  supplier: record.supplier,
                  reference: record.reference,
                  product: record.product,
                  status: record.status,
                  date: dateValue,
                  orderTax: record.orderTax,
                  discount: record.discount,
                  shipping: record.shipping,
                  description: record.description,
                });
                setPreviewImage(record.image);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => {
                setData((prev) => prev.filter((r) => r.key !== record.key));
                message.success("Deleted (mock)");
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const statusMenu = { items: [{ key: "1", label: "Paid" }, { key: "2", label: "Unpaid" }] };
  const sortMenu = {
    items: [
      { key: "1", label: "Recently Added" },
      { key: "2", label: "Ascending" },
      { key: "3", label: "Descending" },
      { key: "4", label: "Last Month" },
      { key: "5", label: "Last 7 Days" },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
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
          <h2 style={{ marginBottom: 0 }}>Purchase Returns</h2>
          <p style={{ color: "#888" }}>Manage your purchase return</p>
        </div>
        <Space>
          <Button icon={<FaFilePdf color="red" size={16} />} onClick={handleExportPDF} />
          <Button icon={<FaFileExcel color="green" size={16} />} onClick={handleExportCSV} />
          <Button icon={<IoReloadOutline color="#9333ea" size={18} />} onClick={handleRefresh} />
          <Button
            icon={<FaAngleUp color="#9333ea" size={16} />}
            onClick={toggleFilters}
            style={{
              transform: filtersCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
          <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{
              background: "#9333ea",
              borderColor: "#9333ea",
            }}
            onClick={showModal}
          >
            Add Purchase Return
          </Button>
        </Space>
      </div>

      {/* Search + Filters */}
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
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Space>
            <Dropdown menu={statusMenu} placement="bottomRight" arrow>
              <Button>
                Status <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown menu={sortMenu} placement="bottomRight" arrow>
              <Button>
                Sort By : Recently Added <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        </div>
      )}

      {/* Table */}
      <Table columns={columns} dataSource={filteredData} pagination={false} rowKey="key" />

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Row Per Page</span>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: 80 }}
            options={[
              { value: 10, label: "10" },
              { value: 25, label: "25" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
            ]}
          />
          <span>Entries</span>
        </div>
        <Pagination current={1} total={filteredData.length} pageSize={pageSize} />
      </div>

      {/* ✅ Unified Add/Edit Modal */}
      <Modal
        title={
          <h3 style={{ margin: 0 }}>
            {formMode === "add" ? "Add Purchase Return" : "Edit Purchase Return"}
          </h3>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Optional Preview Image for Edit Mode */}
          {previewImage && (
            <div style={{ textAlign: "center", marginBottom: 15 }}>
              <Image
                src={previewImage}
                alt="Preview"
                width={80}
                height={80}
                style={{ borderRadius: 10 }}
              />
            </div>
          )}

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="supplier"
                label="Supplier Name"
                rules={[{ required: true, message: "Please select supplier" }]}
              >
                <Select placeholder="Select" suffixIcon={<PlusCircleOutlined />}>
                  <Option value="Electro Mart">Electro Mart</Option>
                  <Option value="Prime Bazaar">Prime Bazaar</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="reference"
                label="Reference"
                rules={[{ required: true, message: "Please enter reference" }]}
              >
                <Input placeholder="Enter reference" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="product"
            label="Product"
            rules={[{ required: true, message: "Please search product" }]}
          >
            <Input placeholder="Search Product" />
          </Form.Item>

          <div
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: "10px",
              background: "#f9fafc",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            <Table columns={columns} dataSource={[]} pagination={false} scroll={{ x: true }} />
          </div>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="orderTax"
                label="Order Tax"
                rules={[{ required: true, message: "Please enter order tax" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="discount"
                label="Discount"
                rules={[{ required: true, message: "Please enter discount" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="shipping"
                label="Shipping"
                rules={[{ required: true, message: "Please enter shipping" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select placeholder="Select">
                  <Option value="Pending">Pending</Option>
                  <Option value="Returned">Returned</Option>
                  <Option value="Cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Type your message" showCount maxLength={300} />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button
              onClick={handleCancel}
              style={{ background: "#001529", color: "#fff" }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "#6C5CE7", borderColor: "#6C5CE7" }}
            >
              {formMode === "add" ? "Submit" : "Update"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseReturn;
