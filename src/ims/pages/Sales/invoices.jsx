import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Avatar,
  Modal,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  UpOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

const { Option } = Select;
const { confirm } = Modal;

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filters, setFilters] = useState({
    customer: null,
    status: null,
    sortBy: "Last 7 Days",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const tableRef = React.useRef(null);

  // Comprehensive filtering functionality
  const applyFilters = () => {
    console.log('Applying filters:', { searchTerm, filters, invoicesCount: invoices.length });
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('After search filter:', filtered.length);
    }

    // Customer filter
    if (filters.customer) {
      filtered = filtered.filter(invoice => invoice.customer === filters.customer);
      console.log('After customer filter:', filtered.length, 'filtering by:', filters.customer);
    }

    // Status filter (payment status)
    if (filters.status) {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
      console.log('After status filter:', filtered.length, 'filtering by:', filters.status);
    }

    // Sort by date
    if (filters.sortBy && filters.sortBy !== 'All' && filters.sortBy !== 'Last 7 Days') {
      const now = dayjs();
      filtered = filtered.filter(invoice => {
        const invoiceDate = dayjs(invoice.dueDate, 'DD MMM YYYY');
        if (!invoiceDate.isValid()) {
          return true;
        }
        
        switch (filters.sortBy) {
          case 'Last 30 Days':
            return now.diff(invoiceDate, 'day') <= 30;
          case 'Last 3 Months':
            return now.diff(invoiceDate, 'month') <= 3;
          case 'Last 6 Months':
            return now.diff(invoiceDate, 'month') <= 6;
          case 'Last Year':
            return now.diff(invoiceDate, 'year') <= 1;
          default:
            return true;
        }
      });
      console.log('After date filter:', filtered.length, 'filtering by:', filters.sortBy);
    }

    console.log('Final filtered data:', filtered.length);
    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchInvoices();
    
    // Listen for storage changes to refresh invoices when new ones are added from quotations
    const handleStorageChange = (e) => {
      if (e.key === 'invoices') {
        fetchInvoices();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Initialize filtered data when invoices are loaded and trigger filtering when search term or filters change
  useEffect(() => {
    if (invoices.length > 0) {
      applyFilters();
    } else {
      setFilteredData([]);
    }
  }, [invoices, searchTerm, filters]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      // Default invoices
      const defaultInvoices = [
        {
          key: "1",
          invoiceNo: "INV001",
          customer: "Carl Evans",
          customerImage: "https://i.pravatar.cc/150?img=12",
          dueDate: "24 Dec 2024",
          amount: 1000,
          paid: 1000,
          amountDue: 0.0,
          status: "Paid",
        },
        {
          key: "2",
          invoiceNo: "INV002",
          customer: "Minerva Rameriz",
          customerImage: "https://i.pravatar.cc/150?img=45",
          dueDate: "24 Dec 2024",
          amount: 1500,
          paid: 0.0,
          amountDue: 1500,
          status: "Unpaid",
        },
        {
          key: "3",
          invoiceNo: "INV003",
          customer: "Robert Lamon",
          customerImage: "https://i.pravatar.cc/150?img=33",
          dueDate: "24 Dec 2024",
          amount: 1500,
          paid: 0.0,
          amountDue: 1500,
          status: "Unpaid",
        },
        {
          key: "4",
          invoiceNo: "INV004",
          customer: "Patricia Lewis",
          customerImage: "https://i.pravatar.cc/150?img=20",
          dueDate: "24 Dec 2024",
          amount: 2000,
          paid: 1000,
          amountDue: 1000,
          status: "Overdue",
        },
        {
          key: "5",
          invoiceNo: "INV005",
          customer: "Mark Joslyn",
          customerImage: "https://i.pravatar.cc/150?img=13",
          dueDate: "24 Dec 2024",
          amount: 800,
          paid: 800,
          amountDue: 0.0,
          status: "Paid",
        },
        {
          key: "6",
          invoiceNo: "INV006",
          customer: "Marsha Betts",
          customerImage: "https://i.pravatar.cc/150?img=25",
          dueDate: "24 Dec 2024",
          amount: 750,
          paid: 0.0,
          amountDue: 750,
          status: "Unpaid",
        },
      ];

      // Get invoices from quotations (localStorage)
      const quotationInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      
      // Combine default invoices with quotation-generated invoices
      const allInvoices = [...defaultInvoices, ...quotationInvoices.map(invoice => ({
        ...invoice,
        key: invoice.id.toString(),
      }))];

      setInvoices(allInvoices);
      setFilteredData([
        {
          key: "1",
          invoiceNo: "INV001",
          customer: "Carl Evans",
          customerImage: "https://i.pravatar.cc/150?img=12",
          dueDate: "24 Dec 2024",
          amount: 1000,
          paid: 1000,
          amountDue: 0.0,
          status: "Paid",
        },
        {
          key: "2",
          invoiceNo: "INV002",
          customer: "Minerva Rameriz",
          customerImage: "https://i.pravatar.cc/150?img=45",
          dueDate: "24 Dec 2024",
          amount: 1500,
          paid: 0.0,
          amountDue: 1500,
          status: "Unpaid",
        },
        {
          key: "3",
          invoiceNo: "INV003",
          customer: "Robert Lamon",
          customerImage: "https://i.pravatar.cc/150?img=33",
          dueDate: "24 Dec 2024",
          amount: 1500,
          paid: 0.0,
          amountDue: 1500,
          status: "Unpaid",
        },
        {
          key: "4",
          invoiceNo: "INV004",
          customer: "Patricia Lewis",
          customerImage: "https://i.pravatar.cc/150?img=20",
          dueDate: "24 Dec 2024",
          amount: 2000,
          paid: 1000,
          amountDue: 1000,
          status: "Overdue",
        },
        {
          key: "5",
          invoiceNo: "INV005",
          customer: "Mark Joslyn",
          customerImage: "https://i.pravatar.cc/150?img=13",
          dueDate: "24 Dec 2024",
          amount: 800,
          paid: 800,
          amountDue: 0.0,
          status: "Paid",
        },
        {
          key: "6",
          invoiceNo: "INV006",
          customer: "Marsha Betts",
          customerImage: "https://i.pravatar.cc/150?img=25",
          dueDate: "24 Dec 2024",
          amount: 750,
          paid: 0.0,
          amountDue: 750,
          status: "Unpaid",
        },
      ]);
      setPagination((p) => ({ ...p, total: 6 }));
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
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
      doc.text("Invoices Report", 14, 22);
      
      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      
      // Check if we have data
      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("invoices-report.pdf");
        return;
      }
      
      // Prepare table data
      const tableData = filteredData.map(invoice => [
        invoice.invoiceNo || '',
        invoice.customer || '',
        invoice.dueDate || '',
        `$${invoice.amount}` || '',
        `$${invoice.paid}` || '',
        `$${invoice.amountDue.toFixed(2)}` || '',
        invoice.status || ''
      ]);
      
      console.log("Table data prepared:", tableData);
      
      // Check if autoTable is available
      if (typeof doc.autoTable !== 'function') {
        console.error("autoTable is not available");
        // Fallback: create simple text-based PDF
        let yPosition = 50;
        doc.setFontSize(12);
        filteredData.forEach((invoice, index) => {
          doc.text(`${index + 1}. ${invoice.invoiceNo} - ${invoice.customer} - $${invoice.amount}`, 14, yPosition);
          yPosition += 10;
        });
      } else {
        // Add table using autoTable
        doc.autoTable({
          head: [['Invoice No', 'Customer', 'Due Date', 'Amount', 'Paid', 'Amount Due', 'Status']],
          body: tableData,
          startY: 40,
          styles: {
            fontSize: 9,
            cellPadding: 4,
            overflow: 'linebreak',
            halign: 'left',
          },
          headStyles: {
            fillColor: [94, 88, 115], // Invoice theme color
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
      doc.save("invoices-report.pdf");
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
        filteredData.map(invoice => ({
          "Invoice No": invoice.invoiceNo,
          "Customer": invoice.customer,
          "Due Date": invoice.dueDate,
          "Amount": `$${invoice.amount}`,
          "Paid": `$${invoice.paid}`,
          "Amount Due": `$${invoice.amountDue.toFixed(2)}`,
          "Status": invoice.status
        }))
      );
      
      // Set column widths
      const columnWidths = [
        { wch: 15 }, // Invoice No
        { wch: 20 }, // Customer
        { wch: 15 }, // Due Date
        { wch: 12 }, // Amount
        { wch: 12 }, // Paid
        { wch: 15 }, // Amount Due
        { wch: 12 }, // Status
      ];
      worksheet['!cols'] = columnWidths;
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
      
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "invoices-report.xlsx");
      
      console.log("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Error exporting Excel. Please try again.");
    }
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setFilters({
      customer: null,
      status: null,
      sortBy: 'Last 7 Days',
    });
    fetchInvoices();
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

  const handleView = (record) => {
    setSelectedInvoice(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log('Editing invoice:', record);
    setEditingInvoice(record);
    setEditModalVisible(true);
  };

  const handleDelete = (record) => {
    confirm({
      title: "Delete invoice",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete invoice ${record.invoiceNo}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        // Update both invoices and filteredData
        setInvoices((prev) => prev.filter((inv) => inv.key !== record.key));
        setFilteredData((prev) => prev.filter((inv) => inv.key !== record.key));
        console.log(`Invoice ${record.invoiceNo} deleted successfully`);
      },
    });
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
    setSelectedInvoice(null);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingInvoice(null);
  };

  const handleEditSubmit = (updatedData) => {
    // Update the invoice in the data
    const updatedInvoices = filteredData.map(invoice => {
      if (invoice.key === editingInvoice.key) {
        return {
          ...invoice,
          ...updatedData,
          amountDue: updatedData.amount - updatedData.paid,
        };
      }
      return invoice;
    });
    
    setFilteredData(updatedInvoices);
    setInvoices(updatedInvoices);
    closeEditModal();
    console.log('Invoice updated successfully');
  };

  const getStatusTag = (status) => {
    let textColor = "#10b981"; // Green for Paid
    
    if (status === "Unpaid") {
      textColor = "#ef4444"; // Red for Unpaid
    }
    if (status === "Overdue") {
      textColor = "#f97316"; // Orange for Overdue
    }
    
    let backgroundColor = "#f0fdf4"; // Very light green for Paid
    
    if (status === "Unpaid") {
      backgroundColor = "#fef2f2"; // Very light red for Unpaid
    }
    if (status === "Overdue") {
      backgroundColor = "#fffbeb"; // Very light orange for Overdue
    }
    
    return (
      <span style={{ 
        backgroundColor: backgroundColor,
        color: textColor,
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
          backgroundColor: textColor,
          flexShrink: 0
        }}></span>
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
      title: "Invoice No",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      width: "12%",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#5E5873] font-normal">{text}</span>
          {record.createdFrom === 'quotation' && (
            <span 
              className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium"
              title={`Converted from quotation: ${record.quotationRef}`}
            >
              From Quote
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      width: "20%",
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
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: "15%",
      render: (text) => (
        <span className="text-sm text-[#5E5873] font-normal">{text}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "12%",
      render: (amount) => (
        <span className="text-sm text-[#5E5873] font-normal">${amount}</span>
      ),
    },
    {
      title: "Paid",
      dataIndex: "paid",
      key: "paid",
      width: "12%",
      render: (amount) => (
        <span className="text-sm text-[#5E5873] font-normal">${amount}</span>
      ),
    },
    {
      title: "Amount Due",
      dataIndex: "amountDue",
      key: "amountDue",
      width: "13%",
      render: (amount) => (
        <span className="text-sm text-[#5E5873] font-normal">
          ${amount.toFixed(2)}
        </span>
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
      title: "",
      key: "actions",
      width: "8%",
      align: "center",
      render: (_, record) => (
        <Space size={8}>
          <div 
            className="w-8 h-8 border border-[#D8D6DE] rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
            onClick={() => handleView(record)}
            title="View Invoice"
          >
            <EyeOutlined className="text-[#6E6B7B] text-base" />
          </div>
          <div 
            className="w-8 h-8 border border-[#D8D6DE] rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
            onClick={() => handleEdit(record)}
            title="Edit Invoice"
          >
            <EditOutlined className="text-[#6E6B7B] text-base" />
          </div>
          <div 
            className="w-8 h-8 border border-[#D8D6DE] rounded flex items-center justify-center hover:bg-red-50 cursor-pointer"
            onClick={() => handleDelete(record)}
            title="Delete Invoice"
          >
            <DeleteOutlined className="text-[#EA5455] text-base" />
          </div>
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
              Invoices
            </h1>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Manage your stock invoices
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
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
              onClick={handleRefresh}
            />
            <Button
              icon={<UpOutlined />}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
            />
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
            onChange={(value) => handleFilterChange("status", value)}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            suffixIcon={<DownOutlined className="text-gray-400" />}
            allowClear
          >
            <Option value="Paid">Paid</Option>
            <Option value="Unpaid">Unpaid</Option>
            <Option value="Overdue">Overdue</Option>
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
            onScroll={checkScrollButtons}
          >
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              pagination={false}
              onChange={handleTableChange}
              rowSelection={rowSelection}
              scroll={{ x: 'max-content' }}
              className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-gray-200 [&_.ant-table-thead>tr>th]:font-medium [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-thead>tr>th]:py-4 [&_.ant-table-tbody>tr>td]:border-b [&_.ant-table-tbody>tr>td]:border-gray-100 [&_.ant-table-tbody>tr>td]:py-4 [&_.ant-table-tbody>tr:hover>td]:bg-gray-50"
            />
          </div>
        </div>

      {/* View Modal */}
      <Modal
        open={viewModalVisible}
        title={
          <span className="text-xl font-semibold text-[#5E5873]">
            {selectedInvoice ? `Invoice ${selectedInvoice.invoiceNo}` : "Invoice Details"}
          </span>
        }
        onCancel={closeViewModal}
        footer={[
          <Button key="close" onClick={closeViewModal} size="large" className="px-6">
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedInvoice && (
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-semibold text-[#5E5873]">Invoice No:</span>
              <span className="text-sm text-[#6E6B7B]">{selectedInvoice.invoiceNo}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-semibold text-[#5E5873]">Customer:</span>
              <span className="text-sm text-[#6E6B7B]">{selectedInvoice.customer}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-semibold text-[#5E5873]">Due Date:</span>
              <span className="text-sm text-[#6E6B7B]">{selectedInvoice.dueDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-semibold text-[#5E5873]">Amount:</span>
              <span className="text-sm text-[#6E6B7B]">${selectedInvoice.amount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-semibold text-[#5E5873]">Paid:</span>
              <span className="text-sm text-[#6E6B7B]">${selectedInvoice.paid}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-semibold text-[#5E5873]">Amount Due:</span>
              <span className="text-sm text-[#6E6B7B]">${selectedInvoice.amountDue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-semibold text-[#5E5873]">Status:</span>
              <span className="text-sm">{getStatusTag(selectedInvoice.status)}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalVisible}
        title={
          <span className="text-xl font-semibold text-[#5E5873]">
            Edit Invoice {editingInvoice ? editingInvoice.invoiceNo : ""}
          </span>
        }
        onCancel={closeEditModal}
        footer={null}
        width={700}
      >
        {editingInvoice && (
          <EditInvoiceForm 
            invoice={editingInvoice} 
            onSubmit={handleEditSubmit}
            onCancel={closeEditModal}
          />
        )}
      </Modal>
    </div>
  );
};

// Edit Invoice Form Component
const EditInvoiceForm = ({ invoice, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: invoice.customer,
    dueDate: invoice.dueDate,
    amount: invoice.amount,
    paid: invoice.paid,
    status: invoice.status,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
          <Select
            value={formData.customer}
            onChange={(value) => handleInputChange('customer', value)}
            className="w-full"
            size="large"
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <Input
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            size="large"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            size="large"
            prefix="$"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Paid Amount</label>
          <Input
            type="number"
            value={formData.paid}
            onChange={(e) => handleInputChange('paid', parseFloat(e.target.value) || 0)}
            size="large"
            prefix="$"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <Select
          value={formData.status}
          onChange={(value) => handleInputChange('status', value)}
          className="w-full"
          size="large"
        >
          <Option value="Paid">Paid</Option>
          <Option value="Unpaid">Unpaid</Option>
          <Option value="Overdue">Overdue</Option>
        </Select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={onCancel} size="large" className="px-6">
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          className="bg-[#8b5cf6] hover:bg-[#8b5cf6] border-0 px-6"
          size="large"
        >
          Update Invoice
        </Button>
      </div>
    </div>
  );
};

export default Invoices;