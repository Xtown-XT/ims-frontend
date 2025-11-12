



import React, { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import {
  Modal,
  Select,
  Table,
  Button,
  Input,
  Form,
  message,
  Checkbox,
} from "antd";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Option } = Select;

const Expenses = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [editReference, setEditReference] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [expenses, setExpenses] = useState([
    {
      reference: "EX849",
      expensename: "Team Lunch",
      category: "Employee Benefits",
      description: "Team Lunch at Restaurant",
      date: "2024-12-24",
      amount: "$200",
      status: "Approved",
    },
    {
      reference: "EX848",
      expensename: "Stationery Purchase",
      category: "Office Supplies",
      description: "Stationery items for office",
      date: "2024-12-10",
      amount: "$50",
      status: "Pending",
    },
  ]);

  const [formData, setFormData] = useState({
    expense: "",
    description: "",
    category: "",
    date: "",
    amount: "",
    status: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (
      !formData.expense ||
      !formData.category ||
      !formData.date ||
      !formData.amount ||
      !formData.status
    ) {
      message.error("Please fill all required fields");
      return;
    }

    if (isEditMode) {
      const updated = expenses.map((item) =>
        item.reference === editReference
          ? { ...item, ...formData, expensename: formData.expense }
          : item
      );
      setExpenses(updated);
      message.success("Expense updated successfully");
    } else {
      const newExpense = {
        reference: "EX" + Math.floor(Math.random() * 1000),
        expensename: formData.expense,
        ...formData,
      };
      setExpenses([...expenses, newExpense]);
      message.success("Expense added successfully");
    }

    setModalVisible(false);
    setFormData({
      expense: "",
      description: "",
      category: "",
      date: "",
      amount: "",
      status: "",
    });
  };

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this expense?",
      icon: <AlertCircle color="#ff4d4f" />,
      content: `Expense: ${record.expensename}`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk() {
        setExpenses(expenses.filter((item) => item.reference !== record.reference));
        message.success("Deleted successfully");
      },
    });
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditReference(record.reference);
    setFormData({
      expense: record.expensename,
      description: record.description,
      category: record.category,
      date: record.date,
      amount: record.amount,
      status: record.status,
    });
    setModalVisible(true);
  };

  const handleView = (record) => {
    setViewData(record);
  };

  const handleRefresh = () => {
    setSearchText("");
    setFilterCategory(null);
    setFilterStatus(null);
    setSortBy(null);
    message.info("Refreshed!");
  };

  const filteredExpenses = expenses
    .filter(
      (item) =>
        item.expensename.toLowerCase().includes(searchText.toLowerCase()) &&
        (!filterCategory || item.category === filterCategory) &&
        (!filterStatus || item.status === filterStatus)
    )
    .sort((a, b) => {
      if (sortBy === "Ascending") return a.expensename.localeCompare(b.expensename);
      if (sortBy === "Descending") return b.expensename.localeCompare(a.expensename);
      return 0;
    });

  // ✅ PDF download using jsPDF
  const exportPDF = () => {
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
      doc.text("Expenses Report", 14, 22);

      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      // Check if we have data
      if (!filteredExpenses || filteredExpenses.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("expenses-report.pdf");
        return;
      }

      // Prepare table data
      const tableData = filteredExpenses.map(expense => [
        expense.reference || '',
        expense.expensename || '',
        expense.category || '',
        expense.description || '',
        expense.date || '',
        expense.amount || '',
        expense.status || ''
      ]);

      console.log("Table data prepared:", tableData);

      // Check if autoTable is available
      if (typeof doc.autoTable !== 'function') {
        console.error("autoTable is not available");
        // Fallback: create simple text-based PDF
        let yPosition = 50;
        doc.setFontSize(12);
        filteredExpenses.forEach((expense, index) => {
          doc.text(`${index + 1}. ${expense.expensename} - ${expense.reference} - ${expense.amount}`, 14, yPosition);
          yPosition += 10;
        });
      } else {
        // Add table using autoTable
        doc.autoTable({
          head: [['Reference', 'Expense Name', 'Category', 'Description', 'Date', 'Amount', 'Status']],
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
      doc.save("expenses-report.pdf");
      console.log("PDF exported successfully");
      message.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      message.error(`Error exporting PDF: ${error.message}`);
    }
  };

  // ✅ Excel download using xlsx
  const exportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredExpenses.map((item) => ({
          Reference: item.reference,
          "Expense Name": item.expensename,
          Category: item.category,
          Description: item.description,
          Date: item.date,
          Amount: item.amount,
          Status: item.status,
        }))
      );

      // Set column widths
      const columnWidths = [
        { wch: 15 }, // Reference
        { wch: 25 }, // Expense Name
        { wch: 20 }, // Category
        { wch: 30 }, // Description
        { wch: 12 }, // Date
        { wch: 12 }, // Amount
        { wch: 12 }, // Status
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, "expenses-report.xlsx");
      console.log("Excel exported successfully");
      message.success("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Error exporting Excel. Please try again.");
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={selectedRowKeys.length === filteredExpenses.length && filteredExpenses.length > 0}
          indeterminate={
            selectedRowKeys.length > 0 &&
            selectedRowKeys.length < filteredExpenses.length
          }
          onChange={(e) =>
            setSelectedRowKeys(e.target.checked ? filteredExpenses.map((item) => item.reference) : [])
          }
        />
      ),
      dataIndex: "checkbox",
      key: "checkbox",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.reference)}
          onChange={(e) =>
            setSelectedRowKeys(
              e.target.checked
                ? [...selectedRowKeys, record.reference]
                : selectedRowKeys.filter((key) => key !== record.reference)
            )
          }
        />
      ),
      width: 50,
    },
    { title: "Reference", dataIndex: "reference", key: "reference" },
    { title: "Expense Name", dataIndex: "expensename", key: "expensename" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Status",
      dataIndex: "status",
      width:46,
      key: "status",
      render: (status) => (
        <span
          style={{
            backgroundColor: status === "Approved" ? "#3EB780" : "#06AED4",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)} />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
          <p className="text-sm text-gray-500">Manage your Expenses</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            icon={<FilePdfOutlined />}
            onClick={exportPDF}
            style={{ background: "#DC2626", color: "white", borderRadius: "10px" }}
          />
          <Button
            icon={<FileExcelOutlined />}
            onClick={exportExcel}
            style={{ background: "#16A34A", color: "white", borderRadius: "8px" }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} style={{ borderRadius: "8px" }} />
          <button
            className="flex items-center gap-1 bg-violet-500 text-white px-3 py-1.5 rounded-lg hover:bg-violet-600 transition text-sm"
            onClick={() => {
              setIsEditMode(false);
              setFormData({
                expense: "",
                description: "",
                category: "",
                date: "",
                amount: "",
                status: "",
              });
              setModalVisible(true);
            }}
          >
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md py-4 rounded-lg">
        <div className="flex justify-between items-center mb-4 px-4 gap-3 flex-wrap">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="flex gap-3 flex-wrap">
            <Select
              placeholder="Category"
              style={{ width: 150 }}
              value={filterCategory}
              onChange={(val) => setFilterCategory(val)}
                            className="custom-select"

              allowClear
            >
              <Option value="Employee Benefits">Employee Benefits</Option>
              <Option value="Office Supplies">Office Supplies</Option>
            </Select>
            <Select
              placeholder="Status"
              style={{ width: 150 }}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
                            className="custom-select"

              allowClear
            >
              <Option value="Approved">Approved</Option>
              <Option value="Pending">Pending</Option>
            </Select>
            <Select
              placeholder="Sort By"
              style={{ width: 150 }}
              value={sortBy}
              onChange={(val) => setSortBy(val)}
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
          columns={columns}
          dataSource={filteredExpenses}
          pagination={{ pageSize: 5 }}
          rowKey="reference"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal title={isEditMode ? "Edit Expense" : "Add Expense"} open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        <Form layout="vertical">
          <Form.Item label="Expense" required>
            <Input name="expense" value={formData.expense} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea name="description" value={formData.description} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Category" required>
            <Select value={formData.category} onChange={(val) => setFormData({ ...formData, category: val })}>
              <Option value="Employee Benefits">Employee Benefits</Option>
              <Option value="Office Supplies">Office Supplies</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" required>
            <Input type="date" name="date" value={formData.date} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Amount" required>
            <Input name="amount" value={formData.amount} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Status" required>
            <Select value={formData.status} onChange={(val) => setFormData({ ...formData, status: val })}>
              <Option value="Approved">Approved</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" style={{ background: "#7C3AED" }} onClick={handleSave}>
              {isEditMode ? "Save Changes" : "Add Expense"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal title="View Expense" open={!!viewData} onCancel={() => setViewData(null)} footer={null}>
        {viewData && (
          <div className="space-y-2">
            <p><strong>Expense:</strong> {viewData.expensename}</p>
            <p><strong>Description:</strong> {viewData.description}</p>
            <p><strong>Category:</strong> {viewData.category}</p>
            <p><strong>Date:</strong> {viewData.date}</p>
            <p><strong>Amount:</strong> {viewData.amount}</p>
            <p><strong>Status:</strong> {viewData.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Expenses;
