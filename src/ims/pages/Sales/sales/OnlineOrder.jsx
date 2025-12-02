import React, { useState, useEffect } from 'react';
import {
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  UpOutlined,
  PlusOutlined,
  CloseOutlined,
  CalendarOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DollarOutlined,
  DownloadOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Table,
  Tag,
  Dropdown,
  Menu,
  Pagination,
  Select,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Card,
} from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;

const OnlineOrders = () => {
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const tableRef = React.useRef(null);
  const [filters, setFilters] = useState({
    customer: null,
    status: null,
    paymentStatus: null,
    sortBy: 'Last 7 Days',
  });

  // Sample avatar images
  const avatarImages = {
    'Carl Evans': 'https://i.pravatar.cc/150?img=12',
    'Minerva Rameriz': 'https://i.pravatar.cc/150?img=47',
    'Robert Lamon': 'https://i.pravatar.cc/150?img=13',
    'Patricia Lewis': 'https://i.pravatar.cc/150?img=45',
    'Marsha Betts': 'https://i.pravatar.cc/150?img=20',
    'Daniel Jude': 'https://i.pravatar.cc/150?img=14',
    'Emma Bates': 'https://i.pravatar.cc/150?img=25',
    'Richard Fralick': 'https://i.pravatar.cc/150?img=16',
    'Michelle Robinson': 'https://i.pravatar.cc/150?img=30',
  };

  // Orders data
  const ordersData = [
    {
      key: "1",
      customer: "Carl Evans",
      reference: "SL001",
      date: "24 Dec 2024",
      status: "Completed",
      grandTotal: "$1000",
      paid: "$1000",
      due: "$0.00",
      paymentStatus: "Paid",
      biller: "Admin",
    },
    {
      key: "2",
      customer: "Minerva Rameriz",
      reference: "SL002",
      date: "10 Dec 2024",
      status: "Pending",
      grandTotal: "$1500",
      paid: "$0.00",
      due: "$1500",
      paymentStatus: "Unpaid",
      biller: "Admin",
    },
    {
      key: "3",
      customer: "Robert Lamon",
      reference: "SL003",
      date: "08 Feb 2023",
      status: "Completed",
      grandTotal: "$1500",
      paid: "$0.00",
      due: "$1500",
      paymentStatus: "Paid",
      biller: "Admin",
    },
    {
      key: "4",
      customer: "Patricia Lewis",
      reference: "SL004",
      date: "12 Feb 2023",
      status: "Completed",
      grandTotal: "$2000",
      paid: "$1000",
      due: "$1000",
      paymentStatus: "Overdue",
      biller: "Admin",
    },
    {
      key: "5",
      customer: "Marsha Betts",
      reference: "SL006",
      date: "24 Mar 2023",
      status: "Pending",
      grandTotal: "$750",
      paid: "$0.00",
      due: "$750",
      paymentStatus: "Unpaid",
      biller: "Admin",
    },
    {
      key: "6",
      customer: "Daniel Jude",
      reference: "SL007",
      date: "06 Apr 2023",
      status: "Completed",
      grandTotal: "$1300",
      paid: "$1300",
      due: "$0.00",
      paymentStatus: "Paid",
      biller: "Admin",
    },
    {
      key: "7",
      customer: "Emma Bates",
      reference: "SL008",
      date: "16 Apr 2023",
      status: "Completed",
      grandTotal: "$1100",
      paid: "$1100",
      due: "$0.00",
      paymentStatus: "Paid",
      biller: "Admin",
    },
    {
      key: "8",
      customer: "Richard Fralick",
      reference: "SL009",
      date: "04 May 2023",
      status: "Pending",
      grandTotal: "$2300",
      paid: "$2300",
      due: "$0.00",
      paymentStatus: "Paid",
      biller: "Admin",
    },
    {
      key: "9",
      customer: "Michelle Robinson",
      reference: "SL010",
      date: "29 May 2023",
      status: "Pending",
      grandTotal: "$1700",
      paid: "$1700",
      due: "$0.00",
      paymentStatus: "Paid",
      biller: "Admin",
    },
  ];

  // Initialize filtered data
  React.useEffect(() => {
    setFilteredData(ordersData);
  }, []);

  // Comprehensive filtering functionality
  const applyFilters = () => {
    console.log('Applying filters:', { searchText, filters });
    let filtered = [...ordersData];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(order =>
        order.customer.toLowerCase().includes(searchText.toLowerCase()) ||
        order.reference.toLowerCase().includes(searchText.toLowerCase()) ||
        order.status.toLowerCase().includes(searchText.toLowerCase()) ||
        order.paymentStatus.toLowerCase().includes(searchText.toLowerCase()) ||
        order.date.includes(searchText)
      );
      console.log('After search filter:', filtered.length);
    }

    // Customer filter
    if (filters.customer) {
      filtered = filtered.filter(order => order.customer === filters.customer);
      console.log('After customer filter:', filtered.length, 'filtering by:', filters.customer);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
      console.log('After status filter:', filtered.length, 'filtering by:', filters.status);
    }

    // Payment Status filter
    if (filters.paymentStatus) {
      filtered = filtered.filter(order => order.paymentStatus === filters.paymentStatus);
      console.log('After payment status filter:', filtered.length, 'filtering by:', filters.paymentStatus);
    }

    // Sort by date
    if (filters.sortBy && filters.sortBy !== 'All' && filters.sortBy !== 'Last 7 Days') {
      const now = dayjs();
      filtered = filtered.filter(order => {
        const orderDate = dayjs(order.date, 'DD MMM YYYY');
        if (!orderDate.isValid()) {
          return true;
        }
        
        switch (filters.sortBy) {
          case 'Last 30 Days':
            return now.diff(orderDate, 'day') <= 30;
          case 'Last 3 Months':
            return now.diff(orderDate, 'month') <= 3;
          case 'Last 6 Months':
            return now.diff(orderDate, 'month') <= 6;
          case 'Last Year':
            return now.diff(orderDate, 'year') <= 1;
          default:
            return true;
        }
      });
      console.log('After date filter:', filtered.length, 'filtering by:', filters.sortBy);
    }

    console.log('Final filtered data:', filtered.length);
    setFilteredData(filtered);
    setCurrent(1);
  };

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Trigger filtering when search text or filters change
  React.useEffect(() => {
    applyFilters();
  }, [searchText, filters]);

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
      doc.text("Sales Orders Report", 14, 22);
      
      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      
      // Check if we have data
      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("sales-orders-report.pdf");
        return;
      }
      
      // Prepare table data
      const tableData = filteredData.map(order => [
        order.customer || '',
        order.reference || '',
        order.date || '',
        order.status || '',
        order.grandTotal || '',
        order.paid || '',
        order.due || '',
        order.paymentStatus || '',
        order.biller || ''
      ]);
      
      console.log("Table data prepared:", tableData);
      
      // Check if autoTable is available
      if (typeof doc.autoTable !== 'function') {
        console.error("autoTable is not available");
        // Fallback: create simple text-based PDF
        let yPosition = 50;
        doc.setFontSize(12);
        filteredData.forEach((order, index) => {
          doc.text(`${index + 1}. ${order.customer} - ${order.reference} - ${order.grandTotal}`, 14, yPosition);
          yPosition += 10;
        });
      } else {
        // Add table using autoTable
        doc.autoTable({
          head: [['Customer', 'Reference', 'Date', 'Status', 'Grand Total', 'Paid', 'Due', 'Payment Status', 'Biller']],
          body: tableData,
          startY: 40,
          styles: {
            fontSize: 9,
            cellPadding: 4,
            overflow: 'linebreak',
            halign: 'left',
          },
          headStyles: {
            fillColor: [124, 58, 237], // Purple color
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
      doc.save("sales-orders-report.pdf");
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
        filteredData.map(order => ({
          "Customer": order.customer,
          "Reference": order.reference,
          "Date": order.date,
          "Status": order.status,
          "Grand Total": order.grandTotal,
          "Paid": order.paid,
          "Due": order.due,
          "Payment Status": order.paymentStatus,
          "Biller": order.biller
        }))
      );
      
      // Set column widths
      const columnWidths = [
        { wch: 20 }, // Customer
        { wch: 12 }, // Reference
        { wch: 15 }, // Date
        { wch: 12 }, // Status
        { wch: 15 }, // Grand Total
        { wch: 12 }, // Paid
        { wch: 12 }, // Due
        { wch: 18 }, // Payment Status
        { wch: 12 }, // Biller
      ];
      worksheet['!cols'] = columnWidths;
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Orders");
      
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "sales-orders-report.xlsx");
      
      console.log("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Error exporting Excel. Please try again.");
    }
  };

  // Refresh function
  const handleRefresh = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRefreshing(true);
    setSearchText("");
    setFilters({
      customer: null,
      status: null,
      paymentStatus: null,
      sortBy: 'Last 7 Days',
    });
    setCurrent(1);
    setSelectedRowKeys([]);
    setRefreshKey(prev => prev + 1);
    setFilteredData([]);
    
    setTimeout(() => {
      setFilteredData([...ordersData]);
      setIsRefreshing(false);
    }, 500);
  };

  // Scroll to top function
  const handleScrollToTop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // Horizontal scroll functions
  const checkScrollButtons = () => {
    if (tableRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [filteredData]);

  // Modal handlers
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingRecord(null);
    editForm.resetFields();
  };

  const handleAddSales = () => {
    form.validateFields().then((values) => {
      console.log("Sales Added:", values);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleEditSubmit = () => {
    editForm.validateFields().then((values) => {
      console.log("Edit Sales:", values);
      
      // Update the order in the data
      const updatedOrders = filteredData.map(order => {
        if (order.key === editingRecord.key) {
          return {
            ...order,
            customer: values.customerName,
            reference: values.reference,
            status: values.status,
            grandTotal: `$${values.grandTotal}`,
            paid: `$${values.paid}`,
            due: `$${values.due}`,
            paymentStatus: values.paymentStatus,
            biller: values.biller,
          };
        }
        return order;
      });
      
      setFilteredData(updatedOrders);
      setIsEditModalVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      console.log('Order updated successfully');
    });
  };

  // Pagination handler
  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  // Checkbox selection handlers
  const handleSelectAll = (selected, selectedRows, changeRows) => {
    if (selected) {
      setSelectedRowKeys(filteredData.map(item => item.key));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectRow = (record, selected, selectedRows) => {
    if (selected) {
      setSelectedRowKeys([...selectedRowKeys, record.key]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.key));
    }
  };

  // Action handlers - Layout only, no navigation
  const handleSaleDetail = (record) => {
    // Layout only - no navigation
    console.log("Sale Detail clicked for:", record.reference);
  };

  const handleEditSale = (record) => {
    console.log("Edit Sale clicked for:", record.reference);
    setEditingRecord(record);
    setIsEditModalVisible(true);
    
    // Pre-populate form with existing data
    editForm.setFieldsValue({
      customerName: record.customer,
      reference: record.reference,
      status: record.status,
      grandTotal: parseFloat(record.grandTotal.replace('$', '')),
      paid: parseFloat(record.paid.replace('$', '')),
      due: parseFloat(record.due.replace('$', '')),
      paymentStatus: record.paymentStatus,
      biller: record.biller,
    });
  };

  const handleShowPayments = (record) => {
    console.log("Show Payments clicked for:", record.reference);
    Modal.info({
      title: 'Payment History',
      content: (
        <div>
          <p><strong>Order:</strong> {record.reference}</p>
          <p><strong>Customer:</strong> {record.customer}</p>
          <p><strong>Grand Total:</strong> {record.grandTotal}</p>
          <p><strong>Paid:</strong> {record.paid}</p>
          <p><strong>Due:</strong> {record.due}</p>
          <p><strong>Payment Status:</strong> {record.paymentStatus}</p>
        </div>
      ),
      width: 500,
    });
  };

  const handleCreatePayment = (record) => {
    console.log("Create Payment clicked for:", record.reference);
    Modal.info({
      title: 'Create Payment',
      content: `Create payment functionality for order ${record.reference} will be implemented here.`,
    });
  };

  const handleDownloadPdf = (record) => {
    console.log("Download PDF clicked for:", record.reference);
    Modal.info({
      title: 'Download PDF',
      content: `PDF download for order ${record.reference} will be implemented here.`,
    });
  };

  const handleDeleteSale = (record) => {
    console.log("Delete Sale clicked for:", record.reference);
    Modal.confirm({
      title: 'Delete Sale',
      content: `Are you sure you want to delete sale ${record.reference}?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        // Remove sale from filtered data
        const updatedOrders = filteredData.filter(order => order.key !== record.key);
        setFilteredData(updatedOrders);
        console.log(`Sale ${record.reference} deleted successfully`);
      },
    });
  };

  // Actions menu for each row - Layout only
  const getActionsMenu = (record) => {
    const items = [
      {
        key: 'detail',
        icon: <EyeOutlined />,
        label: 'Sale Detail',
        onClick: () => handleSaleDetail(record),
      },
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit Sale',
        onClick: () => handleEditSale(record),
      },
      {
        key: 'payments',
        icon: <DollarOutlined />,
        label: <span style={{ color: '#8b5cf6' }}>Show Payments</span>,
        onClick: () => handleShowPayments(record),
      },
      {
        key: 'create-payment',
        icon: <PlusOutlined />,
        label: 'Create Payment',
        onClick: () => handleCreatePayment(record),
      },
      {
        key: 'download',
        icon: <DownloadOutlined />,
        label: 'Download pdf',
        onClick: () => handleDownloadPdf(record),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete Sale',
        danger: true,
        onClick: () => handleDeleteSale(record),
      },
    ];
    
    return { items };
  };

  // Filter menus - Layout only
  const customerMenu = {
    items: [
      { key: '1', label: 'All Customers' },
      { key: '2', label: 'Carl Evans' },
      { key: '3', label: 'Minerva Rameriz' },
      { key: '4', label: 'Robert Lamon' },
      { key: '5', label: 'Patricia Lewis' },
    ]
  };

  const statusMenu = {
    items: [
      { key: '1', label: 'All Status' },
      { key: '2', label: 'Completed' },
      { key: '3', label: 'Pending' },
      { key: '4', label: 'Draft' },
    ]
  };

  const paymentStatusMenu = {
    items: [
      { key: '1', label: 'All Payment Status' },
      { key: '2', label: 'Paid' },
      { key: '3', label: 'Unpaid' },
      { key: '4', label: 'Overdue' },
    ]
  };

  // Table columns
  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={avatarImages[record.customer] || 'https://i.pravatar.cc/150?img=1'}
            alt={record.customer}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-gray-800">{record.customer}</span>
        </div>
      ),
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "order-status",
      render: (status) => {
        const statusColors = {
          Received: { background: "#71d98d", color: "#fff" }, // lighter green
          Pending: { background: "#5bc0de", color: "#fff" }, // lighter blue
          Ordered: { background: "#ffd966", color: "#000" }, // lighter yellow
          Completed: { background: "#71d98d", color: "#fff" }, // lighter green
        };
        
        const colors = statusColors[status] || { background: "#ef4444", color: "#fff" };
        
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
      },
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Due",
      dataIndex: "due",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      render: (status) => {
        const paymentStatusColors = {
          Paid: { background: "#e9f7ec", color: "#1e6b2d", dotColor: "#55d27d" },
          Unpaid: { background: "#fdeced", color: "#8a2c32", dotColor: "#ef646e" },
          Overdue: { background: "#fff9e0", color: "#9a7a12", dotColor: "#ffd84d" },
        };
        
        const colors = paymentStatusColors[status] || { 
          background: "#f3f4f6", 
          color: "#6b7280", 
          dotColor: "#6b7280" 
        };
        
        return (
          <span style={{ 
            backgroundColor: colors.background,
            color: colors.color,
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            border: 'none',
            textAlign: 'center',
            minWidth: '50px',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: colors.dotColor,
              flexShrink: 0
            }}></span>
            {status}
          </span>
        );
      },
    },
    {
      title: "Biller",
      dataIndex: "biller",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "",
      width: 50,
      render: (_, record) => (
        <Dropdown menu={getActionsMenu(record)} placement="bottomRight">
          <Button 
            icon={<MoreOutlined />} 
            className="border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Sales
          </h1>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Manage Your Sales
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
            loading={isRefreshing}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
            title="Refresh"
          />
          <Button 
            icon={<UpOutlined />} 
            onClick={handleScrollToTop}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
            title="Scroll to Top"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="h-9 px-4 rounded-lg font-medium"
            onClick={showModal}
            style={{ backgroundColor: '#8b5cf6', border: 'none', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Add Sales
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 mb-6">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-48 h-10 rounded-lg border-gray-300"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        />
        
        <Select
          placeholder="Customer"
          className="w-36 h-10"
          value={filters.customer}
          onChange={(value) => setFilters({ ...filters, customer: value })}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          suffixIcon={<DownOutlined className="text-gray-400" />}
          allowClear
        >
          <Option value="Carl Evans">Carl Evans</Option>
          <Option value="Minerva Rameriz">Minerva Rameriz</Option>
          <Option value="Robert Lamon">Robert Lamon</Option>
          <Option value="Patricia Lewis">Patricia Lewis</Option>
          <Option value="Marsha Betts">Marsha Betts</Option>
          <Option value="Daniel Jude">Daniel Jude</Option>
          <Option value="Emma Bates">Emma Bates</Option>
          <Option value="Richard Fralick">Richard Fralick</Option>
          <Option value="Michelle Robinson">Michelle Robinson</Option>
        </Select>
        
        <Select
          placeholder="Status"
          className="w-32 h-10"
          value={filters.status}
          onChange={(value) => setFilters({ ...filters, status: value })}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          suffixIcon={<DownOutlined className="text-gray-400" />}
          allowClear
        >
          <Option value="Completed">Completed</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
        
        <Select
          placeholder="Payment Status"
          className="w-40 h-10"
          value={filters.paymentStatus}
          onChange={(value) => setFilters({ ...filters, paymentStatus: value })}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          suffixIcon={<DownOutlined className="text-gray-400" />}
          allowClear
        >
          <Option value="Paid">Paid</Option>
          <Option value="Unpaid">Unpaid</Option>
          <Option value="Overdue">Overdue</Option>
        </Select>
        
        <Select
          placeholder="Sort By"
          className="w-48 h-10"
          value={filters.sortBy}
          onChange={(value) => setFilters({ ...filters, sortBy: value })}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          suffixIcon={<DownOutlined className="text-gray-400" />}
        >
          <Option value="Last 7 Days">Sort By : Last 7 Days</Option>
          <Option value="Last 30 Days">Sort By : Last 30 Days</Option>
          <Option value="Last 3 Months">Sort By : Last 3 Months</Option>
          <Option value="Last 6 Months">Sort By : Last 6 Months</Option>
          <Option value="Last Year">Sort By : Last Year</Option>
        </Select>
      </div>

      {/* Table with Horizontal Scroll */}
      <div className="relative">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <Button
            icon={<LeftOutlined />}
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 shadow-md hover:bg-gray-50"
            style={{ borderRadius: '50%' }}
          />
        )}

        {/* Scroll Right Button */}
        {canScrollRight && (
          <Button
            icon={<RightOutlined />}
            onClick={scrollRight}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 shadow-md hover:bg-gray-50"
            style={{ borderRadius: '50%' }}
          />
        )}

        <div 
          ref={tableRef}
          className="border border-gray-200 rounded-lg overflow-x-auto overflow-y-hidden"
          key={refreshKey}
          onScroll={checkScrollButtons}
        >
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={false}
            rowKey="key"
            scroll={{ x: 'max-content' }}
            rowSelection={{
              selectedRowKeys,
              onSelectAll: handleSelectAll,
              onSelect: handleSelectRow,
              checkStrictly: false,
            }}
            className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-gray-200 [&_.ant-table-thead>tr>th]:font-medium [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-thead>tr>th]:py-4 [&_.ant-table-tbody>tr>td]:border-b [&_.ant-table-tbody>tr>td]:border-gray-100 [&_.ant-table-tbody>tr>td]:py-4 [&_.ant-table-tbody>tr:hover>td]:bg-gray-50 [&_.ant-checkbox-wrapper]:accent-purple-600"
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Row Per Page</span>
          <Select
            value={pageSize}
            onChange={(value) => setPageSize(value)}
            className="w-20 ml-2"
            size="small"
          >
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={30}>30</Option>
          </Select>
          <span className="ml-2">Entries</span>
        </div>

        <Pagination
          current={current}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          className="[&_.ant-pagination-item-active]:bg-purple-600 [&_.ant-pagination-item-active]:border-purple-600 [&_.ant-pagination-item-active>a]:text-white"
        />
      </div>

      {/* Add Sales Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between w-full">
            <span className="text-lg font-semibold text-gray-800">Add Sales</span>
            <Button 
              icon={<CloseOutlined />} 
              onClick={handleCancel}
              className="border-0 text-red-500 hover:bg-red-50"
            />
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        closable={false}
      >
        <Form
          layout="vertical"
          form={form}
          className="mt-4"
          onFinish={handleAddSales}
        >
          {/* Product Table Header */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <Row gutter={16} className="font-medium text-gray-700">
              <Col span={3}>Product</Col>
              <Col span={2}>Qty</Col>
              <Col span={3}>Purchase Price($)</Col>
              <Col span={3}>Discount($)</Col>
              <Col span={2}>Tax(%)</Col>
              <Col span={3}>Tax Amount($)</Col>
              <Col span={3}>Unit Cost($)</Col>
              <Col span={3}>Total Cost(%)</Col>
            </Row>
          </div>

          {/* Form Fields Row 1 */}
          <Row gutter={16} className="mb-4">
            <Col span={6}>
              <Form.Item label="Customer Name" name="customerName" rules={[{ required: true, message: "Please select customer" }]}>
                <Select placeholder="Select">
                  <Option value="Carl Evans">Carl Evans</Option>
                  <Option value="Minerva Rameriz">Minerva Rameriz</Option>
                  <Option value="Robert Lamon">Robert Lamon</Option>
                  <Option value="Patricia Lewis">Patricia Lewis</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Date" name="date" rules={[{ required: true, message: "Please select date" }]}>
                <DatePicker 
                  className="w-full" 
                  placeholder="Choose"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Supplier" name="supplier" rules={[{ required: true, message: "Please select supplier" }]}>
                <Select placeholder="Select">
                  <Option value="Supplier 1">Supplier 1</Option>
                  <Option value="Supplier 2">Supplier 2</Option>
                  <Option value="Supplier 3">Supplier 3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Biller" name="biller" rules={[{ required: true, message: "Please select biller" }]}>
                <Select placeholder="Select">
                  <Option value="Admin">Admin</Option>
                  <Option value="Manager">Manager</Option>
                  <Option value="Sales Rep">Sales Rep</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Product Input */}
          <Form.Item label="Product" name="product" rules={[{ required: true }]}>
            <Input placeholder="Please type product code and select" />
          </Form.Item>

          {/* Order Summary */}
          <Card className="mb-4">
            <Row gutter={16}>
              <Col span={12}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Order Tax</span>
                    <span>$ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>$ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$ 0.00</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Grand Total</span>
                    <span>$ 0.00</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Form Fields Row 2 */}
          <Row gutter={16} className="mb-4">
            <Col span={6}>
              <Form.Item label="Order Tax" name="orderTax" initialValue={0}>
                <InputNumber 
                  className="w-full" 
                  placeholder="0" 
                  min={0}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Discount" name="discount" initialValue={0}>
                <InputNumber 
                  className="w-full" 
                  placeholder="0" 
                  min={0}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Shipping" name="shipping" initialValue={0}>
                <InputNumber 
                  className="w-full" 
                  placeholder="0" 
                  min={0}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Status" name="status" rules={[{ required: true, message: "Please select status" }]}>
                <Select placeholder="Select">
                  <Option value="Completed">Completed</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Draft">Draft</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCancel} className="px-6">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-purple-600 hover:bg-purple-700 border-none text-white px-6"
              style={{ backgroundColor: '#7c3aed', border: 'none' }}
            >
              Add Sales
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Sales Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between w-full">
            <span className="text-lg font-semibold text-gray-800">Edit Sales Order</span>
            <Button 
              icon={<CloseOutlined />} 
              onClick={handleEditCancel}
              className="border-0 text-red-500 hover:bg-red-50"
            />
          </div>
        }
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        width={900}
        closable={false}
      >
        <Form
          layout="vertical"
          form={editForm}
          className="mt-4"
          onFinish={handleEditSubmit}
        >
          {/* Form Fields Row 1 */}
          <Row gutter={16} className="mb-4">
            <Col span={6}>
              <Form.Item label="Customer Name" name="customerName" rules={[{ required: true, message: "Please select customer" }]}>
                <Select placeholder="Select">
                  <Option value="Carl Evans">Carl Evans</Option>
                  <Option value="Minerva Rameriz">Minerva Rameriz</Option>
                  <Option value="Robert Lamon">Robert Lamon</Option>
                  <Option value="Patricia Lewis">Patricia Lewis</Option>
                  <Option value="Marsha Betts">Marsha Betts</Option>
                  <Option value="Daniel Jude">Daniel Jude</Option>
                  <Option value="Emma Bates">Emma Bates</Option>
                  <Option value="Richard Fralick">Richard Fralick</Option>
                  <Option value="Michelle Robinson">Michelle Robinson</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Reference" name="reference" rules={[{ required: true, message: "Please enter reference" }]}>
                <Input placeholder="Enter reference" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Status" name="status" rules={[{ required: true, message: "Please select status" }]}>
                <Select placeholder="Select">
                  <Option value="Completed">Completed</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Draft">Draft</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Biller" name="biller" rules={[{ required: true, message: "Please select biller" }]}>
                <Select placeholder="Select">
                  <Option value="Admin">Admin</Option>
                  <Option value="Manager">Manager</Option>
                  <Option value="Sales Rep">Sales Rep</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Financial Fields */}
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <Form.Item label="Grand Total" name="grandTotal" rules={[{ required: true, message: "Please enter grand total" }]}>
                <InputNumber 
                  className="w-full" 
                  placeholder="0" 
                  min={0}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Paid Amount" name="paid" rules={[{ required: true, message: "Please enter paid amount" }]}>
                <InputNumber 
                  className="w-full" 
                  placeholder="0" 
                  min={0}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Due Amount" name="due" rules={[{ required: true, message: "Please enter due amount" }]}>
                <InputNumber 
                  className="w-full" 
                  placeholder="0" 
                  min={0}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Payment Status */}
          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <Form.Item label="Payment Status" name="paymentStatus" rules={[{ required: true, message: "Please select payment status" }]}>
                <Select placeholder="Select Payment Status">
                  <Option value="Paid">Paid</Option>
                  <Option value="Unpaid">Unpaid</Option>
                  <Option value="Overdue">Overdue</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date" name="date">
                <DatePicker 
                  className="w-full" 
                  placeholder="Choose"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleEditCancel} className="px-6">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-purple-600 hover:bg-purple-700 border-none text-white px-6"
              style={{ backgroundColor: '#7c3aed', border: 'none' }}
            >
              Update Order
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OnlineOrders;
