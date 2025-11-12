import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Avatar,
  Dropdown,
  Menu,
  Modal,
  Form,
  InputNumber,
  DatePicker,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  ExpandOutlined,
  MoreOutlined,
  UserOutlined,
  CloseOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  EyeOutlined,
  EditOutlined,
  DollarOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { POSOrdersService } from './POSOrdersservice';
import dayjs from 'dayjs';

const { Option } = Select;

const POSOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    customer: null,
    status: null,
    paymentStatus: null,
    sortBy: 'Last 7 Days',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCashRegisterModalVisible, setIsCashRegisterModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const tableRef = React.useRef(null);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editSelectedProducts, setEditSelectedProducts] = useState([]);
  const [orderTax, setOrderTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [editOrderTax, setEditOrderTax] = useState(0);
  const [editDiscount, setEditDiscount] = useState(0);
  const [editShipping, setEditShipping] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  // Cash Register Data
  const [cashRegisterData, setCashRegisterData] = useState({
    cashInHand: 45689,
    totalSaleAmount: 565597.88,
    totalPayment: 566867.97,
    cashPayment: 3355.84,
    totalSaleReturn: 1959,
    totalExpense: 0,
    totalCash: 587130.97,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and search functionality
  const applyFilters = () => {
    console.log('Applying filters:', { searchTerm, filters, ordersCount: orders.length });
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
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
        // Parse date in format "DD MMM YYYY"
        const orderDate = dayjs(order.date, 'DD MMM YYYY');
        if (!orderDate.isValid()) {
          return true; // Keep invalid dates
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
  };

  // Trigger filtering when filters or search term change
  useEffect(() => {
    if (orders.length > 0) {
      applyFilters();
    }
  }, [searchTerm, filters, orders]);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Handle refresh
  const handleRefresh = () => {
    setSearchTerm('');
    setFilters({
      customer: null,
      status: null,
      paymentStatus: null,
      sortBy: 'Last 7 Days',
    });
    fetchOrders();
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      customer: null,
      status: null,
      paymentStatus: null,
      sortBy: 'Last 7 Days',
    });
  };

  // Action button handlers
  const handleView = (record) => {
    console.log('Viewing order:', record);
    Modal.info({
      title: 'Order Details',
      content: (
        <div>
          <p><strong>Customer:</strong> {record.customer}</p>
          <p><strong>Reference:</strong> {record.reference}</p>
          <p><strong>Date:</strong> {record.date}</p>
          <p><strong>Status:</strong> {record.status}</p>
          <p><strong>Grand Total:</strong> ${record.grandTotal}</p>
          <p><strong>Paid:</strong> ${record.paid}</p>
          <p><strong>Due:</strong> ${record.due}</p>
          <p><strong>Payment Status:</strong> {record.paymentStatus}</p>
        </div>
      ),
      width: 500,
    });
  };

  const handleEdit = (record) => {
    console.log('Editing order:', record);
    setEditingRecord(record);
    setIsEditModalVisible(true);
    
    // Pre-populate form with existing data
    editForm.setFieldsValue({
      customerId: record.customer,
      date: record.date,
      status: record.status,
      reference: record.reference,
    });
    
    // Set initial values for calculations
    setEditOrderTax(0);
    setEditDiscount(0);
    setEditShipping(0);
    
    // Mock product data for editing
    setEditSelectedProducts([
      {
        key: 1,
        productName: 'Sample Product',
        qty: 1,
        purchasePrice: record.grandTotal || 100,
        discount: 0,
        tax: 0,
        taxAmount: 0,
        unitCost: record.grandTotal || 100,
        totalCost: record.grandTotal || 100,
      }
    ]);
  };

  const handleDelete = (record) => {
    console.log('Deleting order:', record);
    Modal.confirm({
      title: 'Delete Order',
      content: `Are you sure you want to delete order ${record.reference}?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        // Remove order from filtered data
        const updatedOrders = filteredData.filter(order => order.key !== record.key);
        setFilteredData(updatedOrders);
        console.log(`Order ${record.reference} deleted successfully`);
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

  const handleCashRegister = () => {
    setIsCashRegisterModalVisible(true);
  };

  const handleCashRegisterClose = () => {
    setIsCashRegisterModalVisible(false);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = [
        {
          key: '1',
          customer: 'Carl Evans',
          reference: 'SL001',
          date: '24 Dec 2024',
          status: 'Completed',
          grandTotal: 1000,
          paid: 1000,
          due: 0.0,
          paymentStatus: 'Paid',
          biller: 'Admin',
        },
        {
          key: '2',
          customer: 'Minerva Rameriz',
          reference: 'SL002',
          date: '10 Dec 2024',
          status: 'Pending',
          grandTotal: 1500,
          paid: 0.0,
          due: 1500,
          paymentStatus: 'Unpaid',
          biller: 'Admin',
        },
        {
          key: '3',
          customer: 'Robert Lamon',
          reference: 'SL003',
          date: '08 Feb 2023',
          status: 'Completed',
          grandTotal: 1500,
          paid: 0.0,
          due: 1500,
          paymentStatus: 'Paid',
          biller: 'Admin',
        },
        {
          key: '4',
          customer: 'Patricia Lewis',
          reference: 'SL004',
          date: '12 Feb 2023',
          status: 'Completed',
          grandTotal: 2000,
          paid: 1000,
          due: 1000,
          paymentStatus: 'Overdue',
          biller: 'Admin',
        },
      ];
      
      setOrders(ordersData);
      setFilteredData(ordersData); // Initialize filtered data
      
      // Extract unique customers from orders data
      const uniqueCustomers = [...new Set(ordersData.map(order => order.customer))];
      setCustomers(uniqueCustomers.map((name, index) => ({ id: index + 1, name })));
      
      setSuppliers([
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Supplier 1' },
      ]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
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

  // Checkbox selection handlers
  const handleSelectAll = (selected, selectedRows, changeRows) => {
    if (selected) {
      setSelectedRowKeys(orders.map(item => item.key));
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

  React.useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [orders]);

  const handleAddSales = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedProducts([]);
    setOrderTax(0);
    setDiscount(0);
    setShipping(0);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setEditingRecord(null);
    editForm.resetFields();
    setEditSelectedProducts([]);
    setEditOrderTax(0);
    setEditDiscount(0);
    setEditShipping(0);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      handleModalClose();
      fetchOrders();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      console.log('Edit form values:', values);
      
      // Update the order in the data
      const updatedOrders = filteredData.map(order => {
        if (order.key === editingRecord.key) {
          const editTotals = calculateEditTotals();
          return {
            ...order,
            customer: values.customerId,
            date: values.date,
            status: values.status,
            reference: values.reference,
            grandTotal: editTotals.grandTotal,
            paid: values.status === 'Completed' ? editTotals.grandTotal : order.paid,
            due: values.status === 'Completed' ? 0 : editTotals.grandTotal - order.paid,
            paymentStatus: values.status === 'Completed' ? 'Paid' : order.paymentStatus,
          };
        }
        return order;
      });
      
      setFilteredData(updatedOrders);
      setOrders(updatedOrders);
      handleEditModalClose();
      console.log('Order updated successfully');
    } catch (error) {
      console.error('Edit validation failed:', error);
    }
  };

  const handleAddProduct = (productCode) => {
    if (!productCode) return;
    const mockProduct = {
      key: Date.now(),
      productName: `Product ${productCode}`,
      qty: 1,
      purchasePrice: 100,
      discount: 0,
      tax: 0,
      taxAmount: 0,
      unitCost: 100,
      totalCost: 100,
    };
    setSelectedProducts([...selectedProducts, mockProduct]);
  };

  const handleDeleteProduct = (key) => {
    setSelectedProducts(selectedProducts.filter((item) => item.key !== key));
  };

  const handleEditDeleteProduct = (key) => {
    setEditSelectedProducts(editSelectedProducts.filter((item) => item.key !== key));
  };

  const handleEditAddProduct = (productCode) => {
    if (!productCode) return;
    const mockProduct = {
      key: Date.now(),
      productName: `Product ${productCode}`,
      qty: 1,
      purchasePrice: 100,
      discount: 0,
      tax: 0,
      taxAmount: 0,
      unitCost: 100,
      totalCost: 100,
    };
    setEditSelectedProducts([...editSelectedProducts, mockProduct]);
  };

  const handleProductChange = (key, field, value) => {
    const updatedProducts = selectedProducts.map((item) => {
      if (item.key === key) {
        const updated = { ...item, [field]: value };
        const subtotal = updated.purchasePrice * updated.qty;
        const discountAmount = (subtotal * updated.discount) / 100;
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = (afterDiscount * updated.tax) / 100;
        updated.taxAmount = taxAmount;
        updated.unitCost =
          updated.purchasePrice - (updated.purchasePrice * updated.discount) / 100;
        updated.totalCost = afterDiscount + taxAmount;
        return updated;
      }
      return item;
    });
    setSelectedProducts(updatedProducts);
  };

  const handleEditProductChange = (key, field, value) => {
    const updatedProducts = editSelectedProducts.map((item) => {
      if (item.key === key) {
        const updated = { ...item, [field]: value };
        const subtotal = updated.purchasePrice * updated.qty;
        const discountAmount = (subtotal * updated.discount) / 100;
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = (afterDiscount * updated.tax) / 100;
        updated.taxAmount = taxAmount;
        updated.unitCost =
          updated.purchasePrice - (updated.purchasePrice * updated.discount) / 100;
        updated.totalCost = afterDiscount + taxAmount;
        return updated;
      }
      return item;
    });
    setEditSelectedProducts(updatedProducts);
  };

  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + (item.totalCost || 0),
      0
    );
    const orderTaxAmount = (subtotal * orderTax) / 100;
    const discountAmount = (subtotal * discount) / 100;
    const grandTotal =
      subtotal + orderTaxAmount - discountAmount + parseFloat(shipping || 0);
    return { subtotal, orderTaxAmount, discountAmount, grandTotal };
  };

  const calculateEditTotals = () => {
    const subtotal = editSelectedProducts.reduce(
      (sum, item) => sum + (item.totalCost || 0),
      0
    );
    const orderTaxAmount = (subtotal * editOrderTax) / 100;
    const discountAmount = (subtotal * editDiscount) / 100;
    const grandTotal =
      subtotal + orderTaxAmount - discountAmount + parseFloat(editShipping || 0);
    return { subtotal, orderTaxAmount, discountAmount, grandTotal };
  };

  const totals = calculateTotals();
  const editTotals = calculateEditTotals();

  const productColumns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 80,
      render: (value, record) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(val) => handleProductChange(record.key, 'qty', val)}
          className="w-full"
        />
      ),
    },
    {
      title: 'Purchase Price($)',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: 130,
      render: (value, record) => (
        <InputNumber
          min={0}
          value={value}
          onChange={(val) => handleProductChange(record.key, 'purchasePrice', val)}
          className="w-full"
        />
      ),
    },
    {
      title: 'Discount(%)',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      render: (value, record) => (
        <InputNumber
          min={0}
          max={100}
          value={value}
          onChange={(val) => handleProductChange(record.key, 'discount', val)}
          className="w-full"
        />
      ),
    },
    {
      title: 'Tax(%)',
      dataIndex: 'tax',
      key: 'tax',
      width: 80,
      render: (value, record) => (
        <InputNumber
          min={0}
          max={100}
          value={value}
          onChange={(val) => handleProductChange(record.key, 'tax', val)}
          className="w-full"
        />
      ),
    },
    {
      title: 'Tax Amount($)',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      render: (value) => `$ ${value?.toFixed(2) || '0.00'}`,
      width: 120,
    },
    {
      title: 'Unit Cost($)',
      dataIndex: 'unitCost',
      key: 'unitCost',
      render: (value) => `$ ${value?.toFixed(2) || '0.00'}`,
      width: 100,
    },
    {
      title: 'Total Cost($)',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (value) => `$ ${value?.toFixed(2) || '0.00'}`,
      width: 120,
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteProduct(record.key)}
        />
      ),
    },
  ];

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar 
            icon={<UserOutlined />} 
            size={36}
            style={{ backgroundColor: '#e5e7eb', color: '#9ca3af' }}
          />
          <span style={{ fontWeight: 400, color: '#1f2937', fontSize: '14px' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      render: (text) => <span style={{ color: '#1f2937', fontSize: '14px' }}>{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <span style={{ color: '#1f2937', fontSize: '14px' }}>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusColors = {
          received: { background: "#71d98d", color: "#fff" }, // lighter green
          pending: { background: "#5bc0de", color: "#fff" }, // lighter blue
          ordered: { background: "#ffd966", color: "#000" }, // lighter yellow
          completed: { background: "#71d98d", color: "#fff" }, // lighter green
          cancelled: { background: "#ef4444", color: "#fff" }, // red
        };
        
        const colors = statusColors[status.toLowerCase()] || { background: "#ef4444", color: "#fff" };
        
        return (
          <span
            style={{
              backgroundColor: colors.background,
              color: colors.color,
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              display: 'inline-block',
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (value) => <span style={{ color: '#1f2937', fontSize: '14px' }}>${value}</span>,
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      render: (value) => <span style={{ color: '#1f2937', fontSize: '14px' }}>${value}</span>,
    },
    {
      title: 'Due',
      dataIndex: 'due',
      key: 'due',
      render: (value) => <span style={{ color: '#1f2937', fontSize: '14px' }}>${value.toFixed(2)}</span>,
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
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
      title: 'Biller',
      dataIndex: 'biller',
      key: 'biller',
      render: (text) => <span style={{ color: '#1f2937', fontSize: '14px' }}>{text}</span>,
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'detail',
                icon: <EyeOutlined />,
                label: 'Sale Detail',
                onClick: () => handleView(record),
              },
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Edit Sale',
                onClick: () => handleEdit(record),
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
                onClick: () => handleDelete(record),
              },
            ]
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button 
            type="text" 
            icon={<MoreOutlined style={{ fontSize: '18px', color: '#6b7280' }} />} 
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
            title="Actions"
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
            POS Orders
          </h1>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Manage Your pos orders
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <Button 
            icon={<FilePdfOutlined />} 
            onClick={() => {
              console.log("PDF export functionality");
              Modal.info({
                title: 'Export to PDF',
                content: 'PDF export functionality will be implemented here.',
              });
            }}
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            title="Export to PDF"
            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
          />
          <Button 
            icon={<FileExcelOutlined />} 
            onClick={() => {
              console.log("Excel export functionality");
              Modal.info({
                title: 'Export to Excel',
                content: 'Excel export functionality will be implemented here.',
              });
            }}
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
            onClick={handleCashRegister}
            className="h-9 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Cash Register
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddSales}
            className="h-9 px-4 rounded-lg font-medium"
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          {customers.map((c) => (
            <Option key={c.id} value={c.name}>
              {c.name}
            </Option>
          ))}
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
          defaultValue="Last 7 Days"
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
          className="bg-white rounded-lg border border-gray-200 overflow-x-auto overflow-y-hidden"
          onScroll={checkScrollButtons}
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              ...pagination,
              style: { marginTop: '16px' }
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
            rowSelection={{
              selectedRowKeys,
              onSelectAll: handleSelectAll,
              onSelect: handleSelectRow,
              checkStrictly: false,
            }}
            className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-gray-200 [&_.ant-table-thead>tr>th]:font-medium [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-thead>tr>th]:py-4 [&_.ant-table-tbody>tr>td]:border-b [&_.ant-table-tbody>tr>td]:border-gray-100 [&_.ant-table-tbody>tr>td]:py-4 [&_.ant-table-tbody>tr:hover>td]:bg-gray-50"
          />
        </div>
      </div>



      {/* Add Sales Modal */}
      <Modal
        title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Add Sales</span>}
        open={isModalVisible}
        onCancel={handleModalClose}
        width={1000}
        footer={null}
        bodyStyle={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '12px',
        }}
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Form.Item
              name="customerId"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select placeholder="Select Customer">
                {customers.map((c) => (
                  <Option key={c.id}>{c.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Select a date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="supplierId"
              label="Supplier"
              rules={[{ required: true, message: 'Please select supplier' }]}
            >
              <Select placeholder="Select Supplier">
                {suppliers.map((s) => (
                  <Option key={s.id}>{s.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Product">
            <Input
              placeholder="Please type product code and select"
              onPressEnter={(e) => {
                handleAddProduct(e.target.value);
                e.target.value = '';
              }}
              suffix={<PlusOutlined />}
            />
          </Form.Item>

          <Table
            columns={productColumns}
            dataSource={selectedProducts}
            pagination={false}
            size="small"
            style={{ border: '1px solid #e5e7eb', marginBottom: '24px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item label="Order Tax">
                <InputNumber min={0} max={100} value={orderTax} onChange={setOrderTax} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Discount">
                <InputNumber min={0} max={100} value={discount} onChange={setDiscount} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Shipping">
                <InputNumber min={0} value={shipping} onChange={setShipping} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Select status' }]}
              >
                <Select>
                  <Option value="Pending">Pending</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Order Tax:</span>
                <span>$ {totals.orderTaxAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Discount:</span>
                <span>$ {totals.discountAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Shipping:</span>
                <span>$ {shipping.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '8px', paddingTop: '8px', fontWeight: 600, fontSize: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Grand Total</span>
                <span>$ {totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button 
              onClick={handleModalClose}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 20px',
                height: 'auto',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              type="primary"
              style={{
                backgroundColor: '#8b5cf6',
                borderColor: '#8b5cf6',
                borderRadius: '6px',
                padding: '8px 20px',
                height: 'auto',
              }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Sales Modal */}
      <Modal
        title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Edit Sales Order</span>}
        open={isEditModalVisible}
        onCancel={handleEditModalClose}
        width={1000}
        footer={null}
        bodyStyle={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '12px',
        }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Form.Item
              name="customerId"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select placeholder="Select Customer">
                {customers.map((c) => (
                  <Option key={c.id}>{c.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Select a date' }]}
            >
              <Input placeholder="Date" />
            </Form.Item>

            <Form.Item
              name="reference"
              label="Reference"
              rules={[{ required: true, message: 'Please enter reference' }]}
            >
              <Input placeholder="Reference" />
            </Form.Item>
          </div>

          <Form.Item label="Product">
            <Input
              placeholder="Please type product code and select"
              onPressEnter={(e) => {
                handleEditAddProduct(e.target.value);
                e.target.value = '';
              }}
              suffix={<PlusOutlined />}
            />
          </Form.Item>

          <Table
            columns={[
              {
                title: 'Product',
                dataIndex: 'productName',
                key: 'productName',
                width: 150,
              },
              {
                title: 'Qty',
                dataIndex: 'qty',
                key: 'qty',
                width: 80,
                render: (value, record) => (
                  <InputNumber
                    min={1}
                    value={value}
                    onChange={(val) => handleEditProductChange(record.key, 'qty', val)}
                    className="w-full"
                  />
                ),
              },
              {
                title: 'Purchase Price($)',
                dataIndex: 'purchasePrice',
                key: 'purchasePrice',
                width: 130,
                render: (value, record) => (
                  <InputNumber
                    min={0}
                    value={value}
                    onChange={(val) => handleEditProductChange(record.key, 'purchasePrice', val)}
                    className="w-full"
                  />
                ),
              },
              {
                title: 'Discount(%)',
                dataIndex: 'discount',
                key: 'discount',
                width: 100,
                render: (value, record) => (
                  <InputNumber
                    min={0}
                    max={100}
                    value={value}
                    onChange={(val) => handleEditProductChange(record.key, 'discount', val)}
                    className="w-full"
                  />
                ),
              },
              {
                title: 'Tax(%)',
                dataIndex: 'tax',
                key: 'tax',
                width: 80,
                render: (value, record) => (
                  <InputNumber
                    min={0}
                    max={100}
                    value={value}
                    onChange={(val) => handleEditProductChange(record.key, 'tax', val)}
                    className="w-full"
                  />
                ),
              },
              {
                title: 'Tax Amount($)',
                dataIndex: 'taxAmount',
                key: 'taxAmount',
                render: (value) => `$ ${value?.toFixed(2) || '0.00'}`,
                width: 120,
              },
              {
                title: 'Unit Cost($)',
                dataIndex: 'unitCost',
                key: 'unitCost',
                render: (value) => `$ ${value?.toFixed(2) || '0.00'}`,
                width: 100,
              },
              {
                title: 'Total Cost($)',
                dataIndex: 'totalCost',
                key: 'totalCost',
                render: (value) => `$ ${value?.toFixed(2) || '0.00'}`,
                width: 120,
              },
              {
                title: '',
                key: 'action',
                width: 50,
                render: (_, record) => (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleEditDeleteProduct(record.key)}
                  />
                ),
              },
            ]}
            dataSource={editSelectedProducts}
            pagination={false}
            size="small"
            style={{ border: '1px solid #e5e7eb', marginBottom: '24px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item label="Order Tax">
                <InputNumber min={0} max={100} value={editOrderTax} onChange={setEditOrderTax} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Discount">
                <InputNumber min={0} max={100} value={editDiscount} onChange={setEditDiscount} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Shipping">
                <InputNumber min={0} value={editShipping} onChange={setEditShipping} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Select status' }]}
              >
                <Select>
                  <Option value="Pending">Pending</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Order Tax:</span>
                <span>$ {editTotals.orderTaxAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Discount:</span>
                <span>$ {editTotals.discountAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Shipping:</span>
                <span>$ {editShipping.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '8px', paddingTop: '8px', fontWeight: 600, fontSize: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Grand Total</span>
                <span>$ {editTotals.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button 
              onClick={handleEditModalClose}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 20px',
                height: 'auto',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              type="primary"
              style={{
                backgroundColor: '#8b5cf6',
                borderColor: '#8b5cf6',
                borderRadius: '6px',
                padding: '8px 20px',
                height: 'auto',
              }}
            >
              Update Order
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Cash Register Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#374151' }}>Cash Register Details</span>
            <Button 
              icon={<CloseOutlined />} 
              onClick={handleCashRegisterClose}
              style={{ border: 'none', background: 'transparent', color: '#ef4444' }}
            />
          </div>
        }
        open={isCashRegisterModalVisible}
        onCancel={handleCashRegisterClose}
        width={500}
        footer={null}
        closable={false}
        bodyStyle={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '12px',
        }}
      >
        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '20px' }}>
          {/* Cash Register Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Cash in Hand</span>
              <span style={{ color: '#374151', fontSize: '14px', fontWeight: 600 }}>${cashRegisterData.cashInHand.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Total Sale Amount</span>
              <span style={{ color: '#374151', fontSize: '14px', fontWeight: 600 }}>${cashRegisterData.totalSaleAmount.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Total Payment</span>
              <span style={{ color: '#374151', fontSize: '14px', fontWeight: 600 }}>${cashRegisterData.totalPayment.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Cash Payment</span>
              <span style={{ color: '#374151', fontSize: '14px', fontWeight: 600 }}>${cashRegisterData.cashPayment.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Total Sale Return</span>
              <span style={{ color: '#374151', fontSize: '14px', fontWeight: 600 }}>${cashRegisterData.totalSaleReturn.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Total Expense</span>
              <span style={{ color: '#374151', fontSize: '14px', fontWeight: 600 }}>${cashRegisterData.totalExpense.toLocaleString()}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 0', 
              borderTop: '2px solid #e5e7eb',
              marginTop: '8px'
            }}>
              <span style={{ color: '#374151', fontSize: '16px', fontWeight: 700 }}>Total Cash</span>
              <span style={{ color: '#374151', fontSize: '16px', fontWeight: 700 }}>${cashRegisterData.totalCash.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Cancel Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button 
              onClick={handleCashRegisterClose}
              style={{
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 24px',
                height: 'auto',
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default POSOrders;