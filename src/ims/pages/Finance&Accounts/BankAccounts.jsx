import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  Tag,
  Form,
  message,
} from "antd";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Option } = Select;

const BankAccounts = () => {
  const [activeTab, setActiveTab] = useState("bank");
  const [showForm, setShowForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeStatusFilter, setTypeStatusFilter] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [typeSortBy, setTypeSortBy] = useState(null);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState([
    {
      key: 1,
      accountHolderName: "Zephyr Indira",
      accountNo: "3298784309485",
      type: "Savings Account",
      openingBalance: "$200",
      notes: "Account for Business",
      status: "Active",
      selected: false,
    },
    {
      key: 2,
      accountHolderName: "Quillon Elysia",
      accountNo: "5475878970090",
      type: "Current Account",
      openingBalance: "$50",
      notes: "Account for Business",
      status: "Closed",
      selected: false,
    },
  ]);

  const [accountTypes, setAccountTypes] = useState([
    { key: 1, type: "Savings Account", createdDate: "24 Dec 2024", status: "Active", selected: false },
    { key: 2, type: "Current Account", createdDate: "10 Dec 2024", status: "Inactive", selected: false },
    { key: 3, type: "Salary Account", createdDate: "27 Nov 2024", status: "Active", selected: false },
  ]);

  const [newType, setNewType] = useState({
    type: "",
    createdDate: "",
    status: "Active",
  });

  // ✅ Add / Edit Account Form
  const handleAddOrEditAccount = (values) => {
    if (editingRecord) {
      const updated = formData.map((item) =>
        item.key === editingRecord.key
          ? {
              ...item,
              ...values,
              accountNo: values.accountNumber,
              type: values.accountType,
              openingBalance: "$" + values.openingBalance,
              notes: values.description,
              status: values.accountStatus,
            }
          : item
      );
      setFormData(updated);
      message.success("Account updated successfully!");
    } else {
      const newAccount = {
        key: Date.now(),
        accountHolderName: values.accountHolderName,
        accountNo: values.accountNumber,
        type: values.accountType,
        openingBalance: "$" + values.openingBalance,
        notes: values.description,
        status: values.accountStatus,
        selected: false,
      };
      setFormData([...formData, newAccount]);
      message.success("Account added successfully!");
    }

    setShowForm(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      accountHolderName: record.accountHolderName,
      accountNumber: record.accountNo,
      accountType: record.type,
      openingBalance: record.openingBalance.replace("$", ""),
      description: record.notes,
      accountStatus: record.status,
    });
    setShowForm(true);
  };

  const handleDelete = (key, from = "bank") => {
    if (from === "bank") {
      setFormData(formData.filter((item) => item.key !== key));
      message.success("Account deleted!");
    } else {
      setAccountTypes(accountTypes.filter((item) => item.key !== key));
      message.success("Account type deleted!");
    }
  };

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter(null);
    setSortBy(null);
    setTypeStatusFilter(null);
    setTypeSortBy(null);
    message.info("Refreshed!");
  };

  const filteredData = formData
    .filter((item) => {
      const matchSearch =
        item.accountHolderName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.accountNo.toLowerCase().includes(searchText.toLowerCase()) ||
        item.type.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter
        ? item.status === (statusFilter === "Inactive" ? "Closed" : "Active")
        : true;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "Ascending") return a.accountHolderName.localeCompare(b.accountHolderName);
      if (sortBy === "Descending") return b.accountHolderName.localeCompare(a.accountHolderName);
      return b.key - a.key;
    });

  const bankColumns = [
    {
      title: <input type="checkbox" checked={selectAll} onChange={() => {
        const toggled = !selectAll;
        setSelectAll(toggled);
        setFormData(prev => prev.map(i => ({ ...i, selected: toggled })));
      }} />,
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={!!record.selected}
          onChange={() =>
            setFormData((prev) =>
              prev.map((i) =>
                i.key === record.key ? { ...i, selected: !i.selected } : i
              )
            )
          }
        />
      ),
      width: 50,
    },
    { title: "Account Holder Name", dataIndex: "accountHolderName" },
    { title: "Account No", dataIndex: "accountNo" },
    { title: "Type", dataIndex: "type" },
    { title: "Opening Balance", dataIndex: "openingBalance" },
    { title: "Notes", dataIndex: "notes" },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          style={{
            backgroundColor: text === "Closed" ? "#F44336" : "#4CAF50",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key, "bank")} />
        </div>
      ),
    },
  ];

  const typeColumns = [
    {
      title: <input type="checkbox"
        checked={selectAll}
        onChange={() => {
          const toggled = !selectAll;
          setSelectAll(toggled);
          setAccountTypes(prev => prev.map(i => ({ ...i, selected: toggled })));
        }}
      />,
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={!!record.selected}
          onChange={() =>
            setAccountTypes((prev) =>
              prev.map((i) =>
                i.key === record.key ? { ...i, selected: !i.selected } : i
              )
            )
          }
        />
      ),
      width: 50,
    },
    { title: "Type", dataIndex: "type" },
    { title: "Created Date", dataIndex: "createdDate" },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          style={{
            backgroundColor: text === "Inactive" ? "#F44336" : "#4CAF50",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      render: (text, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => {
            setNewType({
              type: record.type,
              createdDate: record.createdDate,
              status: record.status,
            });
            setAccountTypes(prev => prev.filter(i => i.key !== record.key));
            setShowTypeForm(true);
          }} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key, "type")} />
        </div>
      ),
    },
  ];

  const handleAddType = () => {
    if (!newType.type || !newType.createdDate) {
      message.error("Please fill all required fields");
      return;
    }
    const newAccountType = {
      key: Date.now(),
      ...newType,
      selected: false,
    };
    setAccountTypes([...accountTypes, newAccountType]);
    setNewType({ type: "", createdDate: "", status: "Active" });
    setShowTypeForm(false);
    message.success("Account type added successfully!");
  };

  // Export PDF / Excel (same as before)
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Bank Accounts Report", 14, 22);
      doc.autoTable({
        head: [['Account Holder', 'Account No', 'Type', 'Opening Balance', 'Status', 'Notes']],
        body: filteredData.map(a => [a.accountHolderName, a.accountNo, a.type, a.openingBalance, a.status, a.notes]),
        startY: 40,
        headStyles: { fillColor: [139, 92, 246], textColor: 255 },
      });
      doc.save("bank-accounts-report.pdf");
      message.success("PDF exported successfully");
    } catch (error) {
      message.error(`Error exporting PDF: ${error.message}`);
    }
  };

  const handleExportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map(account => ({
          "Account Holder Name": account.accountHolderName,
          "Account Number": account.accountNo,
          "Account Type": account.type,
          "Opening Balance": account.openingBalance,
          "Status": account.status,
          "Notes": account.notes
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bank Accounts");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([excelBuffer]), "bank-accounts-report.xlsx");
      message.success("Excel exported successfully");
    } catch (error) {
      message.error("Error exporting Excel");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === "bank" ? "Bank Accounts" : "Accounts Type"}
          </h2>
          <p className="text-sm text-gray-500">
            {activeTab === "bank"
              ? "Manage your account list"
              : "Manage your account types"}
          </p>
        </div>

        {activeTab === "bank" && (
          <div className="flex items-center gap-2">
            <Button
              icon={<FilePdfOutlined />}
              onClick={handleExportPDF}
              style={{
                background: "#DC2626",
                color: "white",
                borderColor: "#DC2626",
                borderRadius: "10px",
              }}
            />
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleExportExcel}
              style={{
                background: "#16A34A",
                color: "white",
                borderColor: "#16A34A",
                borderRadius: "10px",
              }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              style={{ borderRadius: "8px" }}
            />
            <button
              className="flex items-center gap-1 bg-violet-500 text-white px-3 py-1.5 rounded-lg hover:bg-violet-600 transition text-sm"
              onClick={() => setShowForm(true)}
            >
              <Plus size={14} /> {editingRecord ? "Edit Account" : "Add Account"}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "bank" ? "bg-violet-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("bank")}
        >
          Bank Accounts
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "type" ? "bg-violet-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("type")}
        >
          Account Type
        </button>
      </div>

      {activeTab === "bank" && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
            <div className="flex-1 max-w-[180px]">
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                className="w-full h-8 rounded-md text-sm px-2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Select
                placeholder="Status"
                value={statusFilter}
                style={{ width: 130 }}
                onChange={(value) => setStatusFilter(value)}
                className="custom-select"
                allowClear
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
              <Select
                placeholder="Sort By"
                value={sortBy}
                style={{ width: 150 }}
                onChange={(value) => setSortBy(value)}
                className="custom-select"
                allowClear
              >
                <Option value="Latest">Latest</Option>
                <Option value="Ascending">Ascending</Option>
                <Option value="Descending">Descending</Option>
              </Select>
            </div>
          </div>
          <Table
            columns={bankColumns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            bordered={false}
            rowKey="key"
          />
        </div>
      )}

      {activeTab === "type" && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200 relative">
          <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
            <div className="flex-1 max-w-[300px]">
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                className="w-full h-8 rounded-md text-sm px-2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Select
                placeholder="Status"
                value={typeStatusFilter}
                style={{ width: 130 }}
                onChange={(value) => setTypeStatusFilter(value)}
                className="custom-select"
                allowClear
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                style={{ borderRadius: "8px" }}
              />
              <button
                className="flex items-center gap-1 bg-[#8b5cf6] text-white px-3 py-1.5 rounded-lg hover:opacity-95 transition text-sm"
                onClick={() => setShowTypeForm(true)}
              >
                <Plus size={14} /> Add Account Type
              </button>
            </div>
          </div>

          <Table
            columns={typeColumns}
            dataSource={accountTypes
              .filter((item) => {
                const matchStatus = typeStatusFilter ? item.status === typeStatusFilter : true;
                const matchSearch = searchText ? (item.type || "").toLowerCase().includes(searchText.toLowerCase()) : true;
                return matchStatus && matchSearch;
              })
              .sort((a, b) => {
                if (typeSortBy === "Ascending") return a.type.localeCompare(b.type);
                if (typeSortBy === "Descending") return b.type.localeCompare(a.type);
                return b.key - a.key;
              })}
            pagination={{ pageSize: 5 }}
            bordered={false}
            rowKey="key"
          />
        </div>
      )}

      <Modal
        title={editingRecord ? "Edit Account" : "Add Account"}
        open={showForm}
        onCancel={() => {
          setShowForm(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrEditAccount}>
          <Form.Item
            label="Account Holder Name"
            name="accountHolderName"
            rules={[{ required: true, message: "Please enter account holder name" }]}
          >
            <Input placeholder="Enter account holder name" />
          </Form.Item>
          <Form.Item
            label="Account Number"
            name="accountNumber"
            rules={[{ required: true, message: "Please enter account number" }]}
          >
            <Input placeholder="Enter account number" />
          </Form.Item>
          <Form.Item
            label="Account Type"
            name="accountType"
            rules={[{ required: true, message: "Please select account type" }]}
          >
            <Select placeholder="Select account type">
              <Option value="Savings Account">Savings Account</Option>
              <Option value="Current Account">Current Account</Option>
              <Option value="Salary Account">Salary Account</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Opening Balance"
            name="openingBalance"
            rules={[{ required: true, message: "Please enter opening balance" }]}
          >
            <Input prefix="$" placeholder="Enter opening balance" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Maximum 60 words" rows={3} />
          </Form.Item>
          <Form.Item
            label="Account Status"
            name="accountStatus"
            rules={[{ required: true, message: "Please select account status" }]}
          >
            <Select placeholder="Select account status">
              <Option value="Active">Active</Option>
              <Option value="Closed">Closed</Option>
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingRecord ? "Update Account" : "Add Account"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Add Account Type"
        open={showTypeForm}
        onCancel={() => {
          setShowTypeForm(false);
          setNewType({ type: "", createdDate: "", status: "Active" });
        }}
        onOk={handleAddType}
        okText="Add"
        cancelText="Cancel"
      >
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Type"
            value={newType.type}
            onChange={(e) => setNewType({ ...newType, type: e.target.value })}
          />
          <Input
            placeholder="Created Date"
            value={newType.createdDate}
            onChange={(e) => setNewType({ ...newType, createdDate: e.target.value })}
          />
          <Select
            value={newType.status}
            onChange={(val) => setNewType({ ...newType, status: val })}
          >
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default BankAccounts;
