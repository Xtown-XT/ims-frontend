

import React, { useState } from "react";
import { Search, Plus, AlertCircle } from "lucide-react";
import { Modal, Select, Table, Button, Input, Form, message, Switch } from "antd";
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

const { confirm } = Modal;
const { Option } = Select;

const ExpenseCategory = () => {
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [statusToggle, setStatusToggle] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [data, setData] = useState([
    { key: "1", category: "Employee Benefits", description: "Team Lunch", status: "Active" },
    { key: "2", category: "Office Supplies", description: "Stationery items", status: "Inactive" },
  ]);

  const [formData, setFormData] = useState({
    key: "",
    category: "",
    description: "",
    status: "",
  });

  // ✅ Refresh handler
  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
    setSortBy(null);
    message.info("Refreshed!");
  };

  // ✅ Filter and sort data
  const filteredData = data
    .filter((item) => {
      const matchesSearch =
        item.category.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = filterStatus ? item.status === filterStatus : true;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "Ascending") return a.category.localeCompare(b.category);
      if (sortBy === "Descending") return b.category.localeCompare(a.category);
      return 0;
    });

  const onSelectChange = (newSelectedKeys) => setSelectedRowKeys(newSelectedKeys);
  const rowSelection = { selectedRowKeys, onChange: onSelectChange };

  // ✅ Columns
  const columns = [
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width:46,
      render: (status) => (
        <span
          style={{
            backgroundColor: status === "Active" ? "#3EB780" : "#d63031 ",
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
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)} />
        </div>
      ),
    },
  ];

  // ✅ Delete confirmation
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this category?",
      icon: <AlertCircle color="#ff4d4f" />,
      content: `Category: ${record.category}`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk() {
        setData((prev) => prev.filter((item) => item.key !== record.key));
      },
    });
  };

  // ✅ Add or Update
  const handleAddCategory = () => {
    if (!formData.category.trim()) {
      message.error("Please enter category name");
      return;
    }

    if (editMode) {
      setData((prev) =>
        prev.map((item) =>
          item.key === formData.key
            ? {
                ...formData,
                category:
                  formData.category.charAt(0).toUpperCase() +
                  formData.category.slice(1),
                status: statusToggle ? "Active" : "Inactive",
              }
            : item
        )
      );
      message.success("Category updated successfully");
    } else {
      const newItem = {
        key: Date.now().toString(),
        category:
          formData.category.charAt(0).toUpperCase() +
          formData.category.slice(1),
        description: formData.description,
        status: statusToggle ? "Active" : "Inactive",
      };
      setData([...data, newItem]);
      message.success("Category added successfully");
    }

    // reset
    setShowForm(false);
    setEditMode(false);
    setFormData({ key: "", category: "", description: "", status: "" });
    setStatusToggle(true);
  };

  // ✅ Open Add Form
  const handleOpenAddForm = () => {
    setEditMode(false);
    setFormData({ key: "", category: "", description: "", status: "" });
    setStatusToggle(true);
    setShowForm(true);
  };

  // ✅ Edit Form
  const handleEdit = (record) => {
    setEditMode(true);
    setFormData(record);
    setStatusToggle(record.status === "Active");
    setShowForm(true);
  };

  // ✅ PDF Export using jsPDF
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
      doc.text("Expense Category Report", 14, 22);

      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      // Check if we have data
      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("expense-category-report.pdf");
        return;
      }

      // Prepare table data
      const tableData = filteredData.map(item => [
        item.category || '',
        item.description || '',
        item.status || ''
      ]);

      console.log("Table data prepared:", tableData);

      // Check if autoTable is available
      if (typeof doc.autoTable !== 'function') {
        console.error("autoTable is not available");
        // Fallback: create simple text-based PDF
        let yPosition = 50;
        doc.setFontSize(12);
        filteredData.forEach((item, index) => {
          doc.text(`${index + 1}. ${item.category} - ${item.description} - ${item.status}`, 14, yPosition);
          yPosition += 10;
        });
      } else {
        // Add table using autoTable
        doc.autoTable({
          head: [['Category', 'Description', 'Status']],
          body: tableData,
          startY: 40,
          styles: {
            fontSize: 10,
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
      doc.save("expense-category-report.pdf");
      console.log("PDF exported successfully");
      message.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      message.error(`Error exporting PDF: ${error.message}`);
    }
  };

  // ✅ Excel Export using xlsx
  const exportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map((item) => ({
          Category: item.category,
          Description: item.description,
          Status: item.status,
        }))
      );

      // Set column widths
      const columnWidths = [
        { wch: 25 }, // Category
        { wch: 40 }, // Description
        { wch: 12 }, // Status
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Expense Categories");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, "expense-category-report.xlsx");
      console.log("Excel exported successfully");
      message.success("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Error exporting Excel. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      {/* ✅ Header with right-aligned buttons */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Expense Category</h2>
          <p className="text-sm text-gray-500">Manage your Expense Categories</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            icon={<FilePdfOutlined />}
            onClick={exportPDF}
            style={{
              background: "#DC2626",
              color: "white",
              borderColor: "#DC2626",
              borderRadius: "10px",
            }}
          />
          <Button
            icon={<FileExcelOutlined />}
            onClick={exportExcel}
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
            onClick={handleOpenAddForm}
          >
            <Plus size={14} /> Add Expense Category
          </button>
        </div>
      </div>

      {/* Search & Filter */}
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
              placeholder="Status"
              style={{ width: 150 }}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              className="custom-select"
              allowClear
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>

          </div>
        </div>

        {/* Table */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          className="bg-white"
          bordered={false}
          rowClassName={() => "hover:bg-gray-50"}
          style={{ border: "1px solid #e5e7eb" }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showForm}
        title={editMode ? "Edit Expense Category" : "Add Expense Category"}
        onCancel={() => setShowForm(false)}
        onOk={handleAddCategory}
        okText={editMode ? "Update Category" : "Add Expense Category"}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Category" required tooltip="Enter expense category name">
            <Input
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="Enter category name"
            />
          </Form.Item>

          <Form.Item label="Description">
            <Input.TextArea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter description"
            />
          </Form.Item>

          <div className="flex items-center justify-between mt-2">
            <label className="text-sm text-gray-700">Status</label>
            <Switch
              checked={statusToggle}
              onChange={(checked) => setStatusToggle(checked)}
              checkedChildren=""
              unCheckedChildren=""
              style={{
                backgroundColor: statusToggle ? "#3EB780" : "#d9d9d9",
              }}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpenseCategory;
