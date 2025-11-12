


import React, { useState } from "react";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Plus, AlertCircle } from "lucide-react";
import { Modal, Select, Table, Button, Input, Form, message } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { confirm } = Modal;
const { Option } = Select;

const IncomeCategory = () => {
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [formValues, setFormValues] = useState({
    code: "",
    category: "",
    AddedDate: "",
  });

  const [formData, setFormData] = useState([
    {
      key: 1,
      code: "INCA849",
      category: "Foreign investment",
      AddedDate: "24 Dec 2025",
      status: "Active",
    },
    {
      key: 2,
      code: "INCA48",
      category: "Product Export",
      AddedDate: "29 Dec 2025",
      status: "Inactive",
    },
  ]);

  // ✅ Filtered Data
  let filteredData = formData.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filterCategory ? item.category === filterCategory : true;
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // ✅ Apply Sorting
  filteredData = filteredData.sort((a, b) => {
    const dateA = new Date(a.AddedDate);
    const dateB = new Date(b.AddedDate);
    switch (sortBy) {
      case "Recently Added":
        return dateB - dateA;
      case "Ascending":
        return a.category.localeCompare(b.category);
      case "Descending":
        return b.category.localeCompare(a.category);
      case "Last Month": {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return dateA >= oneMonthAgo ? -1 : 1;
      }
      case "Last 7 Days": {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return dateA >= sevenDaysAgo ? -1 : 1;
      }
      default:
        return 0;
    }
  });

  // ✅ Select All Checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setFormData(formData.map((item) => ({ ...item, selected: newSelectAll })));
  };

  const handleRowCheck = (key) => {
    const updated = formData.map((item) =>
      item.key === key ? { ...item, selected: !item.selected } : item
    );
    setFormData(updated);
    setSelectAll(updated.every((i) => i.selected));
  };

  // ✅ Delete Confirmation
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this category?",
      icon: <AlertCircle color="#ff4d4f" />,
      content: `Category: ${record.category}`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk() {
        setFormData(formData.filter((item) => item.key !== record.key));
        message.success("Category deleted successfully");
      },
    });
  };

  // ✅ Handle Input
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // ✅ Add / Update Category
  const handleAddCategory = () => {
    if (!formValues.category || !formValues.code) {
      message.warning("Please fill all required fields!");
      return;
    }

    if (editingRecord) {
      const updated = formData.map((item) =>
        item.key === editingRecord.key ? { ...item, ...formValues } : item
      );
      setFormData(updated);
      message.success("Category updated successfully");
    } else {
      const newEntry = {
        key: Date.now(),
        code: formValues.code,
        category: formValues.category,
        AddedDate: new Date().toLocaleDateString(),
        status: "Active",
      };
      setFormData([...formData, newEntry]);
      message.success("Category added successfully");
    }

    setFormValues({ code: "", category: "", AddedDate: "" });
    setEditingRecord(null);
    setShowForm(false);
  };

  // ✅ Generate Code
  const handleGenerateCode = () => {
    const randomCode = "INCA" + Math.floor(Math.random() * 1000 + 100);
    setFormValues({ ...formValues, code: randomCode });
  };

  // ✅ Edit Handler
  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormValues({
      code: record.code,
      category: record.category,
      AddedDate: record.AddedDate,
    });
    setShowForm(true);
  };

  // ✅ Refresh Table
  const handleRefresh = () => {
    setFilterCategory(null);
    setFilterStatus(null);
    setSortBy(null);
    setSearchText("");
    message.info("Refreshed!");
  };

  // ✅ Export PDF using jsPDF
  const exportPDF = () => {
    try {
      console.log("Starting PDF export...");
      
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
      doc.text("Income Categories Report", 14, 22);

      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      // Check if we have data
      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("income-categories-report.pdf");
        return;
      }

      // Prepare table data
      const tableData = filteredData.map(item => [
        item.code || '',
        item.category || '',
        item.AddedDate || '',
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
          doc.text(`${index + 1}. ${item.code} - ${item.category} - ${item.status}`, 14, yPosition);
          yPosition += 10;
        });
      } else {
        // Add table using autoTable
        doc.autoTable({
          head: [['Code', 'Category', 'Added Date', 'Status']],
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
      doc.save("income-categories-report.pdf");
      console.log("PDF exported successfully");
      message.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      message.error(`Error exporting PDF: ${error.message}`);
    }
  };

  // ✅ Export Excel using xlsx
  const exportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map((item) => ({
          Code: item.code,
          Category: item.category,
          "Added Date": item.AddedDate,
          Status: item.status,
        }))
      );

      // Set column widths
      const columnWidths = [
        { wch: 15 }, // Code
        { wch: 30 }, // Category
        { wch: 15 }, // Added Date
        { wch: 12 }, // Status
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Income Categories");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, "income-categories-report.xlsx");
      console.log("Excel exported successfully");
      message.success("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Error exporting Excel. Please try again.");
    }
  };

  // ✅ Table Columns
  const columns = [
    {
      title: <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />,
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={record.selected || false}
          onChange={() => handleRowCheck(record.key)}
        />
      ),
      width: 50,
    },
    { title: "Code", dataIndex: "code", key: "code", align: "center" },
    { title: "Category", dataIndex: "category", key: "category", align: "center" },
    { title: "Added Date", dataIndex: "AddedDate", key: "AddedDate", align: "center" },
    {
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)} />
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Income Category</h2>
          <p className="text-sm text-gray-500">Manage your Income Categories</p>
        </div>

        {/* Right Buttons */}
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
            onClick={() => setShowForm(true)}
          >
            <Plus size={14} /> Add Category
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        {/* Search + Filters */}
        <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
          <div className="flex-1 max-w-[180px]">
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              className="w-full h-8 rounded-md text-sm px-2"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex gap-3 items-center justify-center flex-row">
            <Form.Item className="!mb-0">
              <Select
                placeholder="Category"
                style={{ width: 150 }}
                value={filterCategory}
                onChange={(val) => setFilterCategory(val)}
                className="custom-select"
                allowClear
              >
                <Option value="Foreign investment">Foreign investment</Option>
                <Option value="Product Export">Product Export</Option>
              </Select>
            </Form.Item>

            <Form.Item className="!mb-0">
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
            </Form.Item>

            <Form.Item className="!mb-0">
              <Select
                placeholder="Sort By"
                style={{ width: 150 }}
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                className="custom-select"
                allowClear
              >
                <Option value="Recently Added">Recently Added</Option>
                <Option value="Ascending">Ascending</Option>
                <Option value="Descending">Descending</Option>
                <Option value="Last Month">Last Month</Option>
                <Option value="Last 7 Days">Last 7 Days</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          rowClassName={() => "hover:bg-gray-50"}
          style={{ border: "1px solid #e5e7eb" }}
        />
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingRecord ? "Edit Income Category" : "Add Income Category"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white hover:opacity-90"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Code <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="code"
                    value={formValues.code}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    onClick={handleGenerateCode}
                    className="px-3 py-1 bg-violet-500 text-white rounded-md text-sm hover:bg-violet-600 transition"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Enter Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formValues.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-md bg-gray-400 text-white hover:opacity-95 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-5 py-2 rounded-md bg-violet-500 text-white hover:bg-violet-600 transition"
              >
                {editingRecord ? "Update Category" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeCategory;
