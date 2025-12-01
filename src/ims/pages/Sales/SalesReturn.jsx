import React, { useState } from "react";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  DownOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Table,
  Select,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Space,
  message,
} from "antd";
import dayjs from 'dayjs';
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import LenovoIdeaPad3 from "../Sales/assets/LenovoIdeaPad3.png";
import Bold from "../Sales/assets/Bold.png";
import NikeJordan from "../Sales/assets/NikeJordan.jpeg";
import AppleWatch from "../Sales/assets/AppleWatch.png";
import AmazonEchoDot from "../Sales/assets/AmazonEchoDot.png";
import LobarHandy from "../Sales/assets/LobarHandy.png";
import RedPremiunHandy from "../Sales/assets/RedPremiunHandy.png";
import Iphone14Pro from "../Sales/assets/Iphone14Pro.png";
import GamingChair from "../Sales/assets/GamingChair.png";
import BorealisBackpack from "../Sales/assets/BorealisBackpack.png";
import AlizaDuncan from "../Sales/assets/AlizaDuncan.jpeg";
import HenryBryant from "../Sales/assets/HenryBryant.jpeg";
import JadaRobinson from "../Sales/assets/JadaRobinson.jpeg";
import JamesHigham from "../Sales/assets/JamesHigham.jpeg";
import JennyEllis from "../Sales/assets/JennyEllis.jpeg";
import KarenGalvan from "../Sales/assets/KarenGalvan.jpeg";
import LeonBaxter from "../Sales/assets/LeonBaxter.jpeg";
import MichaelDawson from "../Sales/assets/MichaelDawson.jpeg";
import ThomasWard from "../Sales/assets/ThomasWard.jpeg";

const { Option } = Select;

const SalesReturn = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    customer: null,
    status: null,
    paymentStatus: null,
    sortBy: 'Last 7 Days',
  });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Modal & Form state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Sample Data
  const salesData = [
    {
      key: "1",
      productImg: LenovoIdeaPad3,
      product: "Lenovo IdeaPad 3",
      date: "19 Nov 2022",
      customerImg: AlizaDuncan,
      customer: "Carl Evans",
      status: "Received",
      total: "$1000",
      paid: "$1000",
      due: "$0.00",
      paymentStatus: "Paid",
      reference: "REF001",
    },
    {
      key: "2",
      productImg: AppleWatch,
      product: "Apple Watch",
      date: "19 Nov 2022",
      customerImg: HenryBryant,
      customer: "Minerva Rameriz",
      status: "Pending",
      total: "$1500",
      paid: "$0.00",
      due: "$1500",
      paymentStatus: "Unpaid",
      reference: "REF002",
    },
    {
      key: "3",
      productImg: Bold,
      product: "Head phone",
      date: "19 Nov 2022",
      customerImg: JadaRobinson,
      customer: "Robert Lamon",
      status: "Received",
      total: "$2000",
      paid: "$1000",
      due: "$1000",
      paymentStatus: "Overdue",
      reference: "REF003",
    },
    {
      key: "4",
      productImg: NikeJordan,
      product: "Nike Jordan",
      date: "19 Nov 2022",
      customerImg: JamesHigham,
      customer: "Mark Joslyn",
      status: "Received",
      total: "$1500",
      paid: "$1500",
      due: "$0.00",
      paymentStatus: "Paid",
      reference: "REF004",
    },
    {
      key: "5",
      productImg: AmazonEchoDot,
      product: "Amazon Echo Dot",
      date: "19 Nov 2022",
      customerImg: JennyEllis,
      customer: "Patricia Lewis",
      status: "Received",
      total: "$800",
      paid: "$800",
      due: "$0.00",
      paymentStatus: "Paid",
      reference: "REF005",
    },
    {
      key: "6",
      productImg: RedPremiunHandy,
      product: "Red Premium Handy",
      date: "19 Nov 2022",
      customerImg: LeonBaxter,
      customer: "Marsha Betts",
      status: "Pending",
      total: "$750",
      paid: "$0.00",
      due: "$750",
      paymentStatus: "Unpaid",
      reference: "REF006",
    },
    {
      key: "7",
      productImg: Iphone14Pro,
      product: "iPhone 14 Pro",
      date: "19 Nov 2022",
      customerImg: KarenGalvan,
      customer: "Emma Bates",
      status: "Received",
      total: "$1100",
      paid: "$1100",
      due: "$0.00",
      paymentStatus: "Paid",
      reference: "REF007",
    },
    {
      key: "8",
      productImg: GamingChair,
      product: "Gaming Chair",
      date: "19 Nov 2022",
      customerImg: MichaelDawson,
      customer: "Michael Dawson",
      status: "Pending",
      total: "$2300",
      paid: "$2300",
      due: "$0.00",
      paymentStatus: "Paid",
      reference: "REF008",
    },
    {
      key: "9",
      productImg: BorealisBackpack,
      product: "Borealis Backpack",
      date: "19 Nov 2022",
      customerImg: ThomasWard,
      customer: "Thomas Ward",
      status: "Pending",
      total: "$1700",
      paid: "$1700",
      due: "$0.00",
      paymentStatus: "Paid",
      reference: "REF009",
    },
  ];

  // Filter and search functionality
  const applyFilters = () => {
    let filtered = [...salesData];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.customer) {
      filtered = filtered.filter(item => item.customer === filters.customer);
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.paymentStatus) {
      filtered = filtered.filter(item => item.paymentStatus === filters.paymentStatus);
    }

    setFilteredData(filtered);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setFilters({
      customer: null,
      status: null,
      paymentStatus: null,
      sortBy: 'Last 7 Days',
    });
    setSelectedRowKeys([]);
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

  const handleView = (record) => {
    Modal.info({
      title: 'Sales Return Details',
      content: (
        <div>
          <p><strong>Product:</strong> {record.product}</p>
          <p><strong>Customer:</strong> {record.customer}</p>
          <p><strong>Date:</strong> {record.date}</p>
          <p><strong>Status:</strong> {record.status}</p>
          <p><strong>Total:</strong> {record.total}</p>
          <p><strong>Paid:</strong> {record.paid}</p>
          <p><strong>Due:</strong> {record.due}</p>
          <p><strong>Payment Status:</strong> {record.paymentStatus}</p>
        </div>
      ),
      width: 500,
    });
  };

  const handleEdit = (record) => {
    console.log('Edit button clicked - record:', record);
    console.log('Setting modal visible to true');
    
    // Force modal to show immediately
    setIsModalVisible(true);
    setIsEditMode(true);
    setEditingRecord(record);
    
    // Pre-populate form after a short delay
    setTimeout(() => {
      console.log('Setting form values');
      form.setFieldsValue({
        customer: record.customer,
        product: record.product,
        status: record.status,
        grandTotal: parseFloat(record.total.replace('$', '').replace(',', '')),
        paid: parseFloat(record.paid.replace('$', '').replace(',', '')),
        due: parseFloat(record.due.replace('$', '').replace(',', '')),
        paymentStatus: record.paymentStatus,
        reference: record.reference || '',
        date: record.date ? dayjs(record.date, 'DD MMM YYYY') : null,
        orderTax: 0,
        discount: 0,
        shipping: 0,
      });
    }, 200);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete Sales Return',
      content: `Are you sure you want to delete sales return for ${record.product}?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        const updatedReturns = filteredData.filter(item => item.key !== record.key);
        setFilteredData(updatedReturns);
        message.success(`Sales return for ${record.product} deleted successfully`);
      },
    });
  };

  React.useEffect(() => {
    setFilteredData(salesData);
  }, []);

  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, filters]);

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      width: 200,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.productImg}
            alt={text}
            className="w-10 h-10 object-cover rounded"
          />
          <span className="font-medium text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 120,
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      width: 180,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.customerImg}
            alt={text}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-gray-800 font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (status) => {
        const statusColors = {
          Received: { background: "#71d98d", color: "#fff" }, // lighter green
          Pending: { background: "#5bc0de", color: "#fff" }, // lighter blue
          Ordered: { background: "#ffd966", color: "#000" }, // lighter yellow
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
      title: "Total",
      dataIndex: "total",
      width: 100,
      render: (text) => <span className="text-gray-800 font-semibold">{text}</span>,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      width: 100,
      render: (text) => <span className="text-gray-800 font-semibold">{text}</span>,
    },
    {
      title: "Due",
      dataIndex: "due",
      width: 100,
      render: (text) => <span className="text-gray-800 font-semibold">{text}</span>,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      width: 140,
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
      title: "",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-1">
         <Button 
                    icon={<EyeOutlined />} 
                    size="small"
                    onClick={() => handleView(record)}
                    className="w-8 h-8 flex items-center justify-center border-gray-300 text-gray-500 hover:text-blue-500 hover:border-blue-300"
                    title="View User"
                  />
           <Button 
                     icon={<EditOutlined />} 
                     size="small"
                     onClick={() => handleEdit(record)}
                     className="w-8 h-8 flex items-center justify-center border-gray-300 text-gray-500 hover:text-purple-500 hover:border-purple-300"
                     title="Edit User"
                   />
                   <Button 
                     icon={<DeleteOutlined />} 
                     size="small"
                     onClick={() => handleDelete(record)}
                     className="w-8 h-8 flex items-center justify-center border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-300"
                     title="Delete User"
                   />
        </div>
      ),
    },
  ];

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("Sales Return Report", 14, 22);
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      
      const tableData = filteredData.map(item => [
        item.product || '',
        item.date || '',
        item.customer || '',
        item.status || '',
        item.total || '',
        item.paid || '',
        item.due || '',
        item.paymentStatus || ''
      ]);
      
      doc.autoTable({
        head: [['Product', 'Date', 'Customer', 'Status', 'Total', 'Paid', 'Due', 'Payment Status']],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 9,
          cellPadding: 4,
          overflow: 'linebreak',
          halign: 'left',
        },
        headStyles: {
          fillColor: [139, 92, 246],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 40 },
      });
      
      doc.save("sales-return-report.pdf");
      message.success("PDF exported successfully");
    } catch (error) {
      message.error("Error exporting PDF");
    }
  };

  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map(item => ({
          "Product": item.product,
          "Date": item.date,
          "Customer": item.customer,
          "Status": item.status,
          "Total": item.total,
          "Paid": item.paid,
          "Due": item.due,
          "Payment Status": item.paymentStatus
        }))
      );
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Return");
      
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "sales-return-report.xlsx");
      
      message.success("Excel exported successfully");
    } catch (error) {
      message.error("Error exporting Excel");
    }
  };

  const showModal = () => {
    setIsEditMode(false);
    setEditingRecord(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (isEditMode) {
      const updatedReturns = filteredData.map(returnItem => {
        if (returnItem.key === editingRecord.key) {
          return {
            ...returnItem,
            customer: values.customer,
            product: values.product,
            status: values.status,
            total: `$${values.grandTotal}`,
            paid: `$${values.paid}`,
            due: `$${values.due}`,
            paymentStatus: values.paymentStatus,
            reference: values.reference,
            date: values.date,
          };
        }
        return returnItem;
      });
      
      setFilteredData(updatedReturns);
      message.success('Sales return updated successfully');
    } else {
      const newReturn = {
        key: Date.now().toString(),
        customer: values.customer,
        product: values.product,
        status: values.status,
        total: `$${values.grandTotal || 0}`,
        paid: `$${values.paid || 0}`,
        due: `$${values.due || 0}`,
        paymentStatus: values.paymentStatus || 'Unpaid',
        reference: values.reference,
        date: values.date,
      };
      
      setFilteredData([...filteredData, newReturn]);
      message.success('Sales return added successfully');
    }
    
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingRecord(null);
    form.resetFields();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Sales Return
          </h1>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Manage your returns
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <Button 
            icon={<FilePdfOutlined />} 
            onClick={exportToPDF}
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}
            title="Export to PDF"
          />
          <Button 
            icon={<FileExcelOutlined />} 
            onClick={exportToExcel}
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: '#28a745', color: 'white', border: 'none' }}
            title="Export to Excel"
          />
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: '#6c757d', color: 'white', border: 'none' }}
            title="Refresh"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="h-9 px-4 rounded-lg font-medium"
            onClick={showModal}
            style={{ backgroundColor: '#8b5cf6', color: 'white', border: 'none', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Add Sales Return
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
          onChange={(value) => setFilters({ ...filters, customer: value })}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          suffixIcon={<DownOutlined className="text-gray-400" />}
          allowClear
        >
          <Option value="Carl Evans">Carl Evans</Option>
          <Option value="Minerva Rameriz">Minerva Rameriz</Option>
          <Option value="Robert Lamon">Robert Lamon</Option>
          <Option value="Mark Joslyn">Mark Joslyn</Option>
          <Option value="Patricia Lewis">Patricia Lewis</Option>
          <Option value="Marsha Betts">Marsha Betts</Option>
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
          <Option value="Received">Received</Option>
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

      <div className="bg-white rounded-lg" style={{ overflowX: 'auto' }}>
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          rowKey="key"
          rowSelection={{
            selectedRowKeys,
            onSelectAll: handleSelectAll,
            onSelect: handleSelectRow,
            checkStrictly: false,
          }}
          scroll={{ x: 'max-content' }}
          className="custom-table [&_.ant-checkbox-wrapper]:accent-purple-600"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
          components={{
            header: {
              cell: (props) => (
                <th 
                  {...props} 
                  style={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #f1f5f9',
                    padding: '12px 16px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#374151',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    ...props.style
                  }}
                />
              ),
            },
            body: {
              row: (props) => (
                <tr 
                  {...props} 
                  style={{
                    borderBottom: '1px solid #f9fafb',
                    backgroundColor: '#ffffff',
                    ...props.style
                  }}
                  className="hover:bg-gray-50"
                />
              ),
              cell: (props) => (
                <td 
                  {...props} 
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #f9fafb',
                    border: 'none',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    ...props.style
                  }}
                />
              ),
            },
          }}
        />
      </div>

      <Modal
        title={
          <div className="flex justify-between items-center w-full">
            <span className="text-lg font-semibold text-gray-800">
              {isEditMode ? "Edit Sales Return" : "Add Sales Return"}
            </span>
            <Button 
              icon={<CloseOutlined />} 
              onClick={handleCancel}
              size="small"
              className="w-8 h-8 flex items-center justify-center rounded"
              style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none' }}
            />
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        closable={false}
        destroyOnHidden={false}
        maskClosable={false}
        keyboard={false}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{ orderTax: 0, discount: 0, shipping: 0 }}
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Form.Item
              label="Customer Name"
              name="customer"
              rules={[{ required: true, message: "Please choose customer" }]}
            >
              <Select placeholder="Choose Customer">
                <Option value="Carl Evans">Carl Evans</Option>
                <Option value="Minerva Rameriz">Minerva Rameriz</Option>
                <Option value="Robert Lamon">Robert Lamon</Option>
                <Option value="Mark Joslyn">Mark Joslyn</Option>
                <Option value="Patricia Lewis">Patricia Lewis</Option>
                <Option value="Marsha Betts">Marsha Betts</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please choose date" }]}
            >
              <DatePicker style={{ width: "100%" }} placeholder="Choose" />
            </Form.Item>

            <Form.Item
              label="Reference"
              name="reference"
              rules={[{ required: true, message: "Please enter reference" }]}
            >
              <Input placeholder="Reference" />
            </Form.Item>
          </div>

          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true, message: "Please enter product" }]}
          >
            <Input placeholder="Please type product code and select" />
          </Form.Item>

          <div className="bg-gray-50 p-3 grid grid-cols-7 gap-4 text-sm text-gray-600 font-medium rounded-t border">
            <div>Product Name</div>
            <div>Net Unit Price($)</div>
            <div>Stock</div>
            <div>QTY</div>
            <div>Discount($)</div>
            <div>Tax %</div>
            <div>Subtotal ($)</div>
          </div>

          <div className="border-l border-r border-b p-8 text-center text-gray-400 rounded-b">
            No products added yet.
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-80 bg-white border rounded">
              <div className="divide-y">
                <div className="p-3 flex justify-between">
                  <span>Order Tax</span>
                  <span>$ 0.00</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span>Discount</span>
                  <span>$ 0.00</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span>Shipping</span>
                  <span>$ 0.00</span>
                </div>
                <div className="p-3 flex justify-between font-semibold">
                  <span>Grand Total</span>
                  <span>$ 0.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            <Form.Item
              label="Order Tax"
              name="orderTax"
            >
              <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
            >
              <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
            </Form.Item>
            <Form.Item
              label="Shipping"
              name="shipping"
            >
              <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select">
                <Option value="Received">Received</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Form.Item>
          </div>

          {isEditMode && (
            <div className="mt-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Form.Item
                  label="Grand Total"
                  name="grandTotal"
                  rules={[{ required: true, message: "Please enter grand total" }]}
                >
                  <InputNumber 
                    style={{ width: "100%" }} 
                    min={0}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>

                <Form.Item
                  label="Paid Amount"
                  name="paid"
                  rules={[{ required: true, message: "Please enter paid amount" }]}
                >
                  <InputNumber 
                    style={{ width: "100%" }} 
                    min={0}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>

                <Form.Item
                  label="Due Amount"
                  name="due"
                  rules={[{ required: true, message: "Please enter due amount" }]}
                >
                  <InputNumber 
                    style={{ width: "100%" }} 
                    min={0}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Payment Status"
                name="paymentStatus"
                rules={[{ required: true, message: "Please select payment status" }]}
              >
                <Select placeholder="Select Payment Status">
                  <Option value="Paid">Paid</Option>
                  <Option value="Unpaid">Unpaid</Option>
                  <Option value="Overdue">Overdue</Option>
                </Select>
              </Form.Item>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              onClick={handleCancel} 
              className="px-6"
              style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="px-6"
              style={{ backgroundColor: '#28a745', color: '#fff', border: 'none' }}
            >
              {isEditMode ? "Update Return" : "Submit"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesReturn;