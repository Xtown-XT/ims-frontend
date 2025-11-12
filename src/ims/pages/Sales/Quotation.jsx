import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Avatar,
  Modal,
  DatePicker,
  InputNumber,
  Form,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  SearchOutlined,
  PlusOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  ExpandOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Option } = Select;

// ✅ Correct image imports
import lenovoImg from "../Sales/assets/LenovoideaPad3.png";
import boldImg from "../Sales/assets/Bold.png";
import iphoneImg from "../Sales/assets/iphone14Pro.png";
import watchImg from "../Sales/assets/AppleWatch.png";
import echoImg from "../Sales/assets/AmazonEchoDot.png";

const Quotation = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filters, setFilters] = useState({
    product: null,
    customer: null,
    status: null,
    sortBy: "Last 7 Days",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchQuotations();
  }, []);

  useEffect(() => {
    applyFilters(searchTerm, filters);
  }, [quotations]);

  // Trigger filtering when filters or search term change
  useEffect(() => {
    if (quotations.length > 0) {
      applyFilters(searchTerm, filters);
    }
  }, [searchTerm, filters]);

  // ✅ Sample data
  const fetchQuotations = async () => {
    setLoading(true);
    setQuotations([
      {
        key: "1",
        productName: "Lenovo 3rd Generation",
        productImage: lenovoImg,
        customer: "Carl Evans",
        customerImage: "https://i.pravatar.cc/150?img=12",
        status: "Sent",
        total: 550,
      },
      {
        key: "2",
        productName: "Bold V3.2",
        productImage: boldImg,
        customer: "Minerva Rameriz",
        customerImage: "https://i.pravatar.cc/150?img=45",
        status: "Sent",
        total: 430,
      },
      {
        key: "3",
        productName: "iPhone 14 Pro",
        productImage: iphoneImg,
        customer: "Robert Lamon",
        customerImage: "https://i.pravatar.cc/150?img=33",
        status: "Ordered",
        total: 260,
      },
      {
        key: "4",
        productName: "Apple Series 5 Watch",
        productImage: watchImg,
        customer: "Mark Joslyn",
        customerImage: "https://i.pravatar.cc/150?img=13",
        status: "Sent",
        total: 470,
      },
      {
        key: "5",
        productName: "Amazon Echo Dot",
        productImage: echoImg,
        customer: "Patricia Lewis",
        customerImage: "https://i.pravatar.cc/150?img=20",
        status: "Pending",
        total: 380,
      },
    ]);
    setFilteredData([
      {
        key: "1",
        productName: "Lenovo 3rd Generation",
        productImage: lenovoImg,
        customer: "Carl Evans",
        customerImage: "https://i.pravatar.cc/150?img=12",
        status: "Sent",
        total: 550,
      },
      {
        key: "2",
        productName: "Bold V3.2",
        productImage: boldImg,
        customer: "Minerva Rameriz",
        customerImage: "https://i.pravatar.cc/150?img=45",
        status: "Sent",
        total: 430,
      },
      {
        key: "3",
        productName: "iPhone 14 Pro",
        productImage: iphoneImg,
        customer: "Robert Lamon",
        customerImage: "https://i.pravatar.cc/150?img=33",
        status: "Ordered",
        total: 260,
      },
      {
        key: "4",
        productName: "Apple Series 5 Watch",
        productImage: watchImg,
        customer: "Mark Joslyn",
        customerImage: "https://i.pravatar.cc/150?img=13",
        status: "Sent",
        total: 470,
      },
      {
        key: "5",
        productName: "Amazon Echo Dot",
        productImage: echoImg,
        customer: "Patricia Lewis",
        customerImage: "https://i.pravatar.cc/150?img=20",
        status: "Pending",
        total: 380,
      },
    ]);
    setLoading(false);
  };

  // Export to PDF function
  const exportToPDF = () => {
    try {
      console.log("Starting PDF export...");
      
      // Check if jsPDF is available
      if (!jsPDF) {
        console.error("jsPDF is not available");
        alert("PDF library not loaded. Please refresh the page and try again.");
        return;
      }
      
      const doc = new jsPDF();
      console.log("jsPDF instance created");
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("Quotations Report", 14, 22);
      
      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      
      // Check if we have data
      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("quotations-report.pdf");
        return;
      }
      
      // Prepare table data
      const tableData = filteredData.map(quotation => [
        quotation.productName || '',
        quotation.customer || '',
        quotation.status || '',
        `$${quotation.total}` || ''
      ]);
      
      console.log("Table data prepared:", tableData);
      
      // Check if autoTable is available
      if (typeof doc.autoTable !== 'function') {
        console.error("autoTable is not available");
        // Fallback: create simple text-based PDF
        let yPosition = 50;
        doc.setFontSize(12);
        filteredData.forEach((quotation, index) => {
          doc.text(`${index + 1}. ${quotation.productName} - ${quotation.customer} - $${quotation.total}`, 14, yPosition);
          yPosition += 10;
        });
      } else {
        // Add table using autoTable
        doc.autoTable({
          head: [['Product Name', 'Customer', 'Status', 'Total']],
          body: tableData,
          startY: 40,
          styles: {
            fontSize: 9,
            cellPadding: 4,
            overflow: 'linebreak',
            halign: 'left',
          },
          headStyles: {
            fillColor: [139, 92, 246], // Purple color for quotations
            textColor: 255,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { top: 40 },
        });
      }
      
      // Save the PDF
      doc.save("quotations-report.pdf");
      console.log("PDF exported successfully");
      
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert(`Error exporting PDF: ${error.message}`);
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map(quotation => ({
          "Product Name": quotation.productName,
          "Customer": quotation.customer,
          "Status": quotation.status,
          "Total": `$${quotation.total}`
        }))
      );
      
      // Set column widths
      const columnWidths = [
        { wch: 25 }, // Product Name
        { wch: 20 }, // Customer
        { wch: 12 }, // Status
        { wch: 12 }, // Total
      ];
      worksheet['!cols'] = columnWidths;
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations");
      
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "quotations-report.xlsx");
      
      console.log("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Error exporting Excel. Please try again.");
    }
  };

  const handleTableChange = (newPagination) => setPagination(newPagination);
  
  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filters);
  };
  
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    applyFilters(searchTerm, newFilters);
  };

  const applyFilters = (search, currentFilters) => {
    let filtered = [...quotations];

    // Search filter
    if (search) {
      filtered = filtered.filter(quotation =>
        quotation.productName.toLowerCase().includes(search.toLowerCase()) ||
        quotation.customer.toLowerCase().includes(search.toLowerCase()) ||
        quotation.status.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Customer filter
    if (currentFilters.customer) {
      filtered = filtered.filter(quotation => quotation.customer === currentFilters.customer);
    }

    // Status filter
    if (currentFilters.status) {
      filtered = filtered.filter(quotation => quotation.status === currentFilters.status);
    }

    setFilteredData(filtered);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setFilters({
      customer: null,
      status: null,
      sortBy: 'Last 7 Days',
    });
    fetchQuotations();
  };

  // Action button handlers
  const handleView = (record) => {
    console.log('Viewing quotation:', record);
    Modal.info({
      title: 'Quotation Details',
      content: (
        <div>
          <p><strong>Product:</strong> {record.productName}</p>
          <p><strong>Customer:</strong> {record.customer}</p>
          <p><strong>Status:</strong> {record.status}</p>
          <p><strong>Total:</strong> ${record.total}</p>
        </div>
      ),
      width: 500,
    });
  };

  const handleEdit = (record) => {
  console.log("Editing quotation:", record);
  setEditingRecord(record);
  setIsModalOpen(true);
  setIsEditModalOpen(false);

  // 🧩 Adjust keys based on your record structure
  form.setFieldsValue({
    customerName: record.customerName || record.customer || "",
    productName: record.productName || "",
    status: record.status || "",
    total: record.total || record.totalAmount || "",
    reference: record.reference || `QT-${record.key}`,
    date: record.date ? dayjs(record.date) : null,
    priority: record.priority || "",
    description: record.description || "",
  });
};



  const handleDelete = (record) => {
    console.log('Deleting quotation:', record);
    Modal.confirm({
      title: 'Delete Quotation',
      content: `Are you sure you want to delete quotation for ${record.productName}?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        // Remove quotation from filtered data
        const updatedQuotations = filteredData.filter(quotation => quotation.key !== record.key);
        setFilteredData(updatedQuotations);
        console.log(`Quotation for ${record.productName} deleted successfully`);
      },
    });
  };

  const handleMoveToInvoice = (record) => {
    console.log('Move to Invoice button clicked!');
    console.log('Moving quotation to invoice:', record);
    
    // Create invoice data from quotation
    const invoiceData = {
      id: Date.now(), // Generate unique ID
      invoiceNo: `INV-${record.key}-${Date.now()}`,
      customer: record.customer,
      customerImage: record.customerImage,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 30 days from now
      amount: record.total,
      paid: 0,
      amountDue: record.total,
      status: 'Unpaid',
      productName: record.productName,
      productImage: record.productImage,
      quotationRef: `QT-${record.key}`,
      createdFrom: 'quotation'
    };

    // Store invoice data in localStorage to pass to invoice page
    const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    existingInvoices.push(invoiceData);
    localStorage.setItem('invoices', JSON.stringify(existingInvoices));

    // Show success message and navigate
    Modal.success({
      title: 'Quotation Converted to Invoice',
      content: `Quotation for ${record.productName} has been successfully converted to invoice ${invoiceData.invoiceNo}`,
      onOk() {
        navigate('/ims/invoice');
      },
    });
  };

  const handleExpand = () => {
    console.log('Expand functionality');
    Modal.info({
      title: 'Expand',
      content: 'Expand functionality will be implemented here.',
    });
  };

  const handleAddQuotation = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingRecord(null);
    editForm.resetFields();
  };

  const handleSubmit = (values) => {
    console.log("Form Values:", values);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleEditSubmit = (values) => {
    console.log("Edit Form Values:", values);
    
    // Update the quotation in the data
    const updatedQuotations = filteredData.map(quotation => {
      if (quotation.key === editingRecord.key) {
        return {
          ...quotation,
          customer: values.customerName,
          productName: values.productName,
          status: values.status,
          total: values.total,
        };
      }
      return quotation;
    });
    
    setFilteredData(updatedQuotations);
    setQuotations(updatedQuotations);
    setIsEditModalOpen(false);
    setEditingRecord(null);
    editForm.resetFields();
    console.log('Quotation updated successfully');
  };



  const getStatusTag = (status) => {
    const statusColors = {
     Received: { background: "#71d98d", color: "#fff" }, // lighter green
    Pending: { background: "#5bc0de", color: "#fff" }, // lighter blue
    Ordered: { background: "#ffd966", color: "#000" }, // lighter yellow
      Sent: { background: "#71d98d", color: "#fff" }, // lighter green
    };
    
    const colors = statusColors[status] || { background: "#8b5cf6", color: "#fff" };
    
    return (
      <span 
        style={{ 
          backgroundColor: colors.background,
          color: colors.color,
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500',
          display: 'inline-block',
          border: 'none',
          textAlign: 'center',
          minWidth: '70px'
        }}
      >
        {status}
      </span>
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: "30%",
      render: (text, record) => (
        <Space size={10} align="center">
          <img
            src={record.productImage}
            alt={record.productName}
            className="w-9 h-9 object-contain rounded"
          />
          <span className="text-sm text-[#5E5873] font-normal">{text}</span>
        </Space>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "customer",
      key: "customer",
      width: "25%",
      render: (text, record) => (
        <Space size={10} align="center">
          <Avatar
            size={32}
            src={record.customerImage}
            className="border border-gray-200"
          />
          <span className="text-sm text-[#5E5873] font-normal">{text}</span>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "10%",
      render: (amount) => (
        <span className="text-sm text-[#5E5873] font-normal">${amount}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: "25%",
      align: "center",
      render: (_, record) => (
        <Space size={4} direction="vertical">
          <Space size={4}>
            <div 
              className="w-7 h-7 border border-[#D8D6DE] rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
              onClick={() => handleView(record)}
              title="View Quotation"
            >
              <EyeOutlined className="text-[#6E6B7B] text-sm" />
            </div>
            <div 
              className="w-7 h-7 border border-[#D8D6DE] rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
              onClick={() => handleEdit(record)}
              title="Edit Quotation"
            >
              <EditOutlined className="text-[#6E6B7B] text-sm" />
            </div>
            <div 
              className="w-7 h-7 border border-[#D8D6DE] rounded flex items-center justify-center hover:bg-red-50 cursor-pointer"
              onClick={() => handleDelete(record)}
              title="Delete Quotation"
            >
              <DeleteOutlined className="text-[#EA5455] text-sm" />
            </div>
          </Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleMoveToInvoice(record)}
            className="bg-blue-500 hover:bg-blue-600 border-blue-500 text-white text-xs px-2 py-1 h-6"
            style={{ fontSize: '11px', fontWeight: '500' }}
          >
            Move to Invoice
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Quotation List
            </h1>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Manage Your Quotation
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Button 
              icon={<FilePdfOutlined />} 
              onClick={() => {
                console.log("PDF button clicked");
                console.log("Filtered data:", filteredData);
                exportToPDF();
              }}
              className="w-9 h-9 flex items-center justify-center rounded-lg"
              title="Export to PDF"
              style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
            />
            <Button 
              icon={<FileExcelOutlined />} 
              onClick={exportToExcel}
              className="w-9 h-9 flex items-center justify-center rounded-lg"
              title="Export to Excel"
              style={{ backgroundColor: '#10b981', color: 'white', border: 'none' }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
              title="Refresh"
            />
            <Button
              icon={<ExpandOutlined />}
              onClick={handleExpand}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
              title="Expand"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="h-9 px-4 rounded-lg font-medium"
              onClick={handleAddQuotation}
              style={{ backgroundColor: '#8b5cf6', border: 'none', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Add Quotation
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3 mb-6">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64 h-10 rounded-lg border-gray-300"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
          
          <Select
            placeholder="Customer"
            className="w-36 h-10"
            value={filters.customer}
            onChange={(value) => handleFilterChange("customer", value)}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            suffixIcon={<DownOutlined className="text-gray-400" />}
            allowClear
          >
            <Option value="Carl Evans">Carl Evans</Option>
            <Option value="Minerva Rameriz">Minerva Rameriz</Option>
            <Option value="Robert Lamon">Robert Lamon</Option>
            <Option value="Mark Joslyn">Mark Joslyn</Option>
            <Option value="Patricia Lewis">Patricia Lewis</Option>
          </Select>
          
          <Select
            placeholder="Status"
            className="w-32 h-10"
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            suffixIcon={<DownOutlined className="text-gray-400" />}
            allowClear
          >
            <Option value="Sent">Sent</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Ordered">Ordered</Option>
          </Select>
          
          <Select
            placeholder="Payment Status"
            className="w-40 h-10"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            suffixIcon={<DownOutlined className="text-gray-400" />}
            allowClear
          >
            <Option value="paid">Paid</Option>
            <Option value="unpaid">Unpaid</Option>
            <Option value="overdue">Overdue</Option>
          </Select>
          
          <Select
            defaultValue="Last 7 Days"
            className="w-48 h-10"
            value={filters.sortBy}
            onChange={(value) => handleFilterChange("sortBy", value)}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            suffixIcon={<DownOutlined className="text-gray-400" />}
          >
            <Option value="Last 7 Days">Sort By : Last 7 Days</Option>
            <Option value="Last 30 Days">Sort By : Last 30 Days</Option>
            <Option value="Last 90 Days">Sort By : Last 90 Days</Option>
          </Select>
        </div>

        {/* Table with Horizontal Scrollbar */}
        <div 
          className="bg-white rounded-lg shadow-sm overflow-x-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 #F7FAFC'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              height: 8px;
            }
            div::-webkit-scrollbar-track {
              background: #F7FAFC;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: #CBD5E0;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #A0AEC0;
            }
          `}</style>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={false}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            scroll={{ x: 'max-content' }}
          />
        </div>

     {/* Add / Edit Quotation Modal (Combined) */}
<Modal
  title={
    <span className="text-xl font-semibold text-[#5E5873]">
      {editingRecord ? "Edit Quotation" : "Add Quotation"}
    </span>
  }
  open={isModalOpen}
  onCancel={() => {
    form.resetFields();
    setIsModalOpen(false);
    setEditingRecord(null);
  }}
  footer={null}
  width={1100}
>
  <Form
    form={form}
    layout="vertical"
    onFinish={handleSubmit}
  >
    {/* Top Form Fields */}
    <div className="grid grid-cols-3 gap-4">
      <Form.Item
        name="customerName"
        label="Customer Name"
        rules={[{ required: true, message: "Please select a customer" }]}
      >
        <Select placeholder="Select Customer" size="large">
          <Option value="Carl Evans">Carl Evans</Option>
          <Option value="Minerva Rameriz">Minerva Rameriz</Option>
          <Option value="Robert Lamon">Robert Lamon</Option>
          <Option value="Mark Joslyn">Mark Joslyn</Option>
          <Option value="Patricia Lewis">Patricia Lewis</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: "Please select date" }]}
      >
        <DatePicker size="large" className="w-full" />
      </Form.Item>

      <Form.Item
        name="reference"
        label="Reference"
        rules={[{ required: true, message: "Please enter reference" }]}
      >
        <Input placeholder="Enter reference" size="large" />
      </Form.Item>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Form.Item
        name="productName"
        label="Product Name"
        rules={[{ required: true, message: "Please enter product name" }]}
      >
        <Input placeholder="Enter product name" size="large" />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select status" }]}
      >
        <Select placeholder="Select Status" size="large">
          <Option value="Sent">Sent</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Ordered">Ordered</Option>
        </Select>
      </Form.Item>

      <Form.Item name="priority" label="Priority">
        <Select placeholder="Select Priority" size="large">
          <Option value="High">High</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Low">Low</Option>
        </Select>
      </Form.Item>
    </div>

    {/* Product Table Section */}
    <div className="border border-gray-200 rounded-lg p-4 mt-2">
      <Table
        bordered
        pagination={false}
        dataSource={[
          {
            key: 1,
            product: "Lenovo 3rd Generation",
            quantity: 1,
            price: 550,
            discount: 0,
            tax: 0,
          },
        ]}
        columns={[
          {
            title: "Product",
            dataIndex: "product",
            key: "product",
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: () => <InputNumber min={1} placeholder="Qty" />,
          },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (value) => `$${value}`,
          },
          {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
            render: () => <InputNumber min={0} formatter={(v) => `${v}%`} />,
          },
          {
            title: "Tax",
            dataIndex: "tax",
            key: "tax",
            render: () => <InputNumber min={0} formatter={(v) => `${v}%`} />,
          },
          {
            title: "Subtotal",
            key: "subtotal",
            render: (_, record) => (
              <span>${record.price * record.quantity}</span>
            ),
          },
        ]}
      />
    </div>

    {/* Bottom Summary Section */}
    <div className="grid grid-cols-3 gap-4 mt-4">
      <Form.Item name="orderTax" label="Order Tax (%)">
        <InputNumber
          size="large"
          min={0}
          className="w-full"
          placeholder="Enter tax"
        />
      </Form.Item>
      <Form.Item name="discount" label="Discount (%)">
        <InputNumber
          size="large"
          min={0}
          className="w-full"
          placeholder="Enter discount"
        />
      </Form.Item>
      <Form.Item name="shipping" label="Shipping">
        <InputNumber
          size="large"
          min={0}
          className="w-full"
          placeholder="Enter shipping"
        />
      </Form.Item>
    </div>

    <Form.Item name="description" label="Description">
      <TextArea rows={4} placeholder="Enter description..." />
    </Form.Item>

    <div className="flex justify-end gap-3 mt-6">
      <Button
        onClick={() => {
          form.resetFields();
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        size="large"
        className="px-6"
      >
        Cancel
      </Button>

      <Button
        type="primary"
        htmlType="submit"
        className="bg-[#8b5cf6] hover:bg-[#8b5cf6] border-0 px-6"
        size="large"
      >
        {editingRecord ? "Update Quotation" : "Submit"}
      </Button>
    </div>
  </Form>
</Modal>

    </div>
  );
};

export default Quotation;
