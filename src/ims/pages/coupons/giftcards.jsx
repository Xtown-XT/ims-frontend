import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Avatar,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Switch,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  UpOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Option } = Select;

const GiftCards = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filters, setFilters] = useState({
    status: null,
    sortBy: "Last 7 Days",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingCard, setViewingCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [form] = Form.useForm();
  const [filteredData, setFilteredData] = useState([]);

  

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      const mockData = [
        {
          key: "1",
          giftCard: "GFT1110",
          customer: "Carl Evans",
          customerImage: "https://i.pravatar.cc/150?img=12",
          issuedDate: "24 Dec 2024",
          expiryDate: "24 Jan 2025",
          amount: 200,
          balance: 100,
          status: "Active",
        },
        {
          key: "2",
          giftCard: "GFT1109",
          customer: "Minerva Rameriz",
          customerImage: "https://i.pravatar.cc/150?img=45",
          issuedDate: "10 Dec 2024",
          expiryDate: "10 Jan 2025",
          amount: 300,
          balance: 200,
          status: "Active",
        },
        {
          key: "3",
          giftCard: "GFT1108",
          customer: "Robert Lamon",
          customerImage: "https://i.pravatar.cc/150?img=33",
          issuedDate: "27 Nov 2024",
          expiryDate: "27 Dec 2024",
          amount: 200,
          balance: 150,
          status: "Active",
        },
        {
          key: "4",
          giftCard: "GFT1107",
          customer: "Patricia Lewis",
          customerImage: "https://i.pravatar.cc/150?img=20",
          issuedDate: "18 Nov 2024",
          expiryDate: "18 Dec 2024",
          amount: 120,
          balance: 0,
          status: "Redeemed",
        },
      ];
      setGiftCards(mockData);
      setFilteredData(mockData);
      setPagination((p) => ({ ...p, total: mockData.length }));
    } catch (error) {
      console.error("Error fetching gift cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => setPagination(newPagination);
  const handleSearch = (value) => setSearchTerm(value);
  const handleFilterChange = (filterName, value) =>
    setFilters({ ...filters, [filterName]: value });
  const handleRefresh = () => fetchGiftCards();

  const handleAddGiftCard = () => {
    setEditingCard(null);
    form.resetFields();
    form.setFieldsValue({
      giftCard: `GFT${Math.floor(Math.random() * 10000)}`,
      balance: 0,
      status: true,
    });
    setIsModalVisible(true);
  };

  const handleEditGiftCard = (record) => {
    setEditingCard(record);
    form.setFieldsValue({
      giftCard: record.giftCard,
      customer: record.customer,
      amount: record.amount,
      balance: record.balance,
      issuedDate: null,
      expiryDate: null,
      status: record.status === "Active",
    });
    setIsModalVisible(true);
  };

  const handleViewGiftCard = (record) => {
    setViewingCard(record);
    setIsViewModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCard(null);
  };

  const handleSubmit = (values) => {
    const newStatus = values.status ? "Active" : "Inactive";

    if (editingCard) {
      const updatedList = giftCards.map((card) =>
        card.key === editingCard.key
          ? {
              ...card,
              giftCard: values.giftCard,
              customer: values.customer,
              amount: values.amount,
              balance: values.balance,
              issuedDate: values.issuedDate?.format("DD MMM YYYY"),
              expiryDate: values.expiryDate?.format("DD MMM YYYY"),
              status: newStatus,
            }
          : card
      );
      setGiftCards(updatedList);
      setFilteredData(updatedList);
    } else {
      const newCard = {
        key: Date.now().toString(),
        giftCard: values.giftCard,
        customer: values.customer,
        customerImage: "https://i.pravatar.cc/150?img=60",
        issuedDate: values.issuedDate?.format("DD MMM YYYY"),
        expiryDate: values.expiryDate?.format("DD MMM YYYY"),
        amount: values.amount,
        balance: values.balance,
        status: newStatus,
      };
      const updated = [...giftCards, newCard];
      setGiftCards(updated);
      setFilteredData(updated);
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingCard(null);
  };

  const getStatusTag = (status) => {
    const statusColors = {
      Active: { background: "#71d98d", color: "#fff" },
      Inactive: { background: "#ff9999", color: "#fff" },
      Redeemed: { background: "#ff9999", color: "#fff" },
      Expired: { background: "#ff9999", color: "#fff" },
    };
    const colors = statusColors[status] || {
      background: "#71d98d",
      color: "#fff",
    };

    return (
      <span
        style={{
          backgroundColor: colors.background,
          color: colors.color,
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "500",
          display: "inline-block",
          textAlign: "center",
          width: "70px",
          height: "20px"
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
    { title: "Gift Card", dataIndex: "giftCard", key: "giftCard" },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => (
        <Space size={10}>
          <Avatar size={32} src={record.customerImage} />
          <span>{text}</span>
        </Space>
      ),
    },
    { title: "Issued Date", dataIndex: "issuedDate", key: "issuedDate" },
    { title: "Expiry Date", dataIndex: "expiryDate", key: "expiryDate" },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (a) => `$${a}`,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (b) => `$${b}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => getStatusTag(s),
    },
    {
      title: "",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size={8}>
          {/* 👁 View */}
          <div
            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
            onClick={() => handleViewGiftCard(record)}
          >
            <EyeOutlined className="text-gray-500 text-base" />
          </div>
          {/* ✏ Edit */}
          <div
            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
            onClick={() => handleEditGiftCard(record)}
          >
            <EditOutlined className="text-gray-500 text-base" />
          </div>
          {/* 🗑 Delete */}
          <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-red-50 cursor-pointer">
            <DeleteOutlined className="text-red-500 text-base" />
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Gift Cards
          </h1>
          <p className="text-sm text-gray-500">Manage your gift cards</p>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            icon={<FilePdfOutlined />}
            style={{ backgroundColor: "#ef4444", color: "white", border: "none" }}
          />
          <Button
            icon={<FileExcelOutlined />}
            style={{ backgroundColor: "#10b981", color: "white", border: "none" }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
          <Button icon={<UpOutlined />} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddGiftCard}
            style={{ backgroundColor: "#8b5cf6", border: "none" }}
          >
            Add Gift Card
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={false}
        rowSelection={rowSelection}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold text-gray-800">
            {editingCard ? "Edit Gift Card" : "Add Gift Card"}
          </span>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Gift Card"
              name="giftCard"
              rules={[{ required: true, message: "Please enter gift card ID" }]}
            >
              <Input placeholder="Enter Gift Card ID" />
            </Form.Item>

            <Form.Item
              label={
                <div className="flex justify-between items-center">
                  <span>Customer</span>
                  <span className="text-purple-500 text-sm cursor-pointer">
                    + Add New
                  </span>
                </div>
              }
              name="customer"
              rules={[{ required: true, message: "Please select a customer" }]}
            >
              <Select placeholder="Select Customer">
                <Option value="Carl Evans">Carl Evans</Option>
                <Option value="Minerva Rameriz">Minerva Rameriz</Option>
                <Option value="Robert Lamon">Robert Lamon</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Issued Date"
              name="issuedDate"
              rules={[{ required: true, message: "Please select issued date" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Expiry Date"
              name="expiryDate"
              rules={[{ required: true, message: "Please select expiry date" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <InputNumber placeholder="Enter Amount" style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item
              label="Balance"
              name="balance"
              rules={[{ required: true, message: "Please enter balance" }]}
            >
              <InputNumber placeholder="Enter Balance" style={{ width: "100%" }} min={0} />
            </Form.Item>
          </div>

          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#8b5cf6", border: "none" }}
            >
              {editingCard ? "Save Changes" : "Add Gift Card"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 👁 View Modal */}
      <Modal
        title="Gift Card Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {viewingCard && (
          <div className="space-y-3 mt-3 text-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
              <p><b>Gift Card:</b> {viewingCard.giftCard}</p>
              <p><b>Amount:</b> ${viewingCard.amount}</p>
              <p><b>Balance:</b> ${viewingCard.balance}</p>
              <p><b>Issued Date:</b> {viewingCard.issuedDate}</p>
              <p><b>Expiry Date:</b> {viewingCard.expiryDate}</p>
              <p><b>Issued By:</b> Admin</p>
              <div className="flex items-center gap-2">
                <Avatar size={32} src={viewingCard.customerImage} />
                <p><b>{viewingCard.customer}</b></p>
              </div>
              <p><b>Status:</b> {getStatusTag(viewingCard.status)}</p>
            </div>

            <h3 className="text-md font-semibold mb-2">Transaction Details</h3>
            <Table
              bordered
              pagination={false}
              size="small"
              dataSource={[
                { key: 1, date: "04 Jan 2025", type: "Refund", store: "Online", amount: "$25", balance: "$175" },
                { key: 2, date: "16 Jan 2025", type: "Purchase", store: "Electro Mart", amount: "$75", balance: "$100" },
                { key: 3, date: "26 Dec 2024", type: "Purchase", store: "Gadget World", amount: "$50", balance: "$150" },
              ]}
              columns={[
                { title: "Date", dataIndex: "date" },
                { title: "Transaction Type", dataIndex: "type" },
                { title: "Store", dataIndex: "store" },
                { title: "Amount", dataIndex: "amount" },
                { title: "Balance", dataIndex: "balance" },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GiftCards;
