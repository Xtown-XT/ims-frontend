



import React, { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import {
  Modal,
  Select,
  Table,
  Button,
  Input,
  DatePicker,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { confirm } = Modal;
const { Option } = Select;

const Income = () => {
  const [showForm, setShowForm] = useState(false);
  const [filterSelectStore, setFilterSelectStore] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState([
    {
      key: "1",
      reference: "IN102",
      store: "Main Branch",
      category: "Product Sales",
      notes: "Sold electronics",
      date: "2024-10-15",
      amount: "$1200",
      account: "Bank",
      selected: false,
    },
    {
      key: "2",
      reference: "IN101",
      store: "Online Store",
      category: "Service Income",
      notes: "Website Design Project",
      date: "2024-10-10",
      amount: "$800",
      account: "Cash",
      selected: false,
    },
  ]);

  const [newIncome, setNewIncome] = useState({
    date: "",
    category: "",
    store: "",
    amount: "",
    account: "",
    notes: "",
  });

  // ✅ Refresh handler
  const handleRefresh = () => {
    setSearchText("");
    setFilterSelectStore(null);
    setFilterDate(null);
    setSortBy(null);
    message.info("Refreshed!");
  };

const filteredData = formData
  .filter((item) => {
    const matchStore = filterSelectStore ? item.store === filterSelectStore : true;
    const matchDate = filterDate ? item.date === filterDate : true;
    const lowerSearch = searchText.trim().toLowerCase();
    const matchSearch =
      !lowerSearch ||
      item.reference.toLowerCase().includes(lowerSearch) ||
      item.category.toLowerCase().includes(lowerSearch) ||
      item.store.toLowerCase().includes(lowerSearch);
    return matchStore && matchDate && matchSearch;
  })
  .sort((a, b) => {
    if (sortBy === "Ascending") return a.reference.localeCompare(b.reference);
    if (sortBy === "Descending") return b.reference.localeCompare(a.reference);
    return 0;
  });


  // ✅ Select All Checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setFormData(formData.map((item) => ({ ...item, selected: newSelectAll })));
  };

  const handleRowCheck = (key) => {
    const updatedData = formData.map((item) =>
      item.key === key ? { ...item, selected: !item.selected } : item
    );
    setFormData(updatedData);
    setSelectAll(updatedData.every((item) => item.selected));
  };

  // ✅ Delete Confirmation
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this income record?",
      icon: <AlertCircle color="#ff4d4f" />,
      content: `Reference: ${record.reference}`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk() {
        setFormData(formData.filter((item) => item.reference !== record.reference));
      },
    });
  };

  // ✅ Add / Update Handler
  const handleAddIncome = () => {
    if (!newIncome.amount || !newIncome.category || !newIncome.store || !newIncome.date) {
      alert("Please fill all required fields!");
      return;
    }

    if (editIndex !== null) {
      const updatedData = [...formData];
      updatedData[editIndex] = {
        ...newIncome,
        key: updatedData[editIndex].key,
      };
      setFormData(updatedData);
      setEditIndex(null);
    } else {
      setFormData([
        ...formData,
        {
          ...newIncome,
          key: Date.now().toString(),
          reference: `IN${100 + formData.length + 1}`,
          selected: false,
        },
      ]);
    }

    setNewIncome({
      date: "",
      category: "",
      store: "",
      amount: "",
      account: "",
      notes: "",
    });
    setShowForm(false);
  };

  // ✅ Edit Handler
  const handleEdit = (record, index) => {
    setNewIncome(record);
    setEditIndex(index);
    setShowForm(true);
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
      doc.text("Income Report", 14, 22);

      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      // Check if we have data
      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("income-report.pdf");
        return;
      }

      // Prepare table data
      const tableData = filteredData.map(item => [
        item.date || '',
        item.reference || '',
        item.store || '',
        item.category || '',
        item.notes || '',
        item.amount || ''
      ]);

      console.log("Table data prepared:", tableData);

      // Check if autoTable is available
      if (typeof doc.autoTable !== 'function') {
        console.error("autoTable is not available");
        // Fallback: create simple text-based PDF
        let yPosition = 50;
        doc.setFontSize(12);
        filteredData.forEach((item, index) => {
          doc.text(`${index + 1}. ${item.reference} - ${item.store} - ${item.amount}`, 14, yPosition);
          yPosition += 10;
        });
      } else {
        // Add table using autoTable
        doc.autoTable({
          head: [['Date', 'Reference', 'Store', 'Category', 'Notes', 'Amount']],
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
      doc.save("income-report.pdf");
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
          Date: item.date,
          Reference: item.reference,
          Store: item.store,
          Category: item.category,
          Notes: item.notes,
          Amount: item.amount,
        }))
      );

      // Set column widths
      const columnWidths = [
        { wch: 12 }, // Date
        { wch: 15 }, // Reference
        { wch: 20 }, // Store
        { wch: 20 }, // Category
        { wch: 30 }, // Notes
        { wch: 12 }, // Amount
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Income");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, "income-report.xlsx");
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
          checked={record.selected}
          onChange={() => handleRowCheck(record.key)}
        />
      ),
      width: 50,
    },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Reference", dataIndex: "reference", key: "reference" },
    { title: "Store", dataIndex: "store", key: "store" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Notes", dataIndex: "notes", key: "notes" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "",
      key: "",
      render: (_, record, index) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record, index)} />
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
          <h2 className="text-xl font-semibold text-gray-800">Income</h2>
          <p className="text-sm text-gray-500">Manage your income records</p>
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
            onClick={() => {
              setNewIncome({
                date: "",
                category: "",
                store: "",
                amount: "",
                account: "",
                notes: "",
              });
              setEditIndex(null);
              setShowForm(true);
            }}
          >
            <Plus size={14} /> Add Income
          </button>
        </div>
      </div>

      {/* Filters + Table */}
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
            <DatePicker
              placeholder="Select Date"
              format="YYYY-MM-DD"
              style={{ width: 150 }}
              value={filterDate ? dayjs(filterDate) : null}
              onChange={(date, dateString) => setFilterDate(dateString)}
            />
            <Select
              placeholder="Select Store"
              style={{ width: 180 }}
              value={filterSelectStore}
              onChange={(val) => setFilterSelectStore(val)}
              className="custom-select"
              allowClear
            >
              <Option value="Main Branch">Main Branch</Option>
              <Option value="Online Store">Online Store</Option>
              <Option value="Warehouse">Warehouse</Option>
            </Select>
           
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          bordered={false}
          rowClassName={() => "hover:bg-gray-50"}
          style={{ border: "1px solid #e5e7eb" }}
        />
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editIndex !== null ? "Edit Income" : "Add Income"}
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
                <label className="text-sm text-gray-700 mb-1 block">Date</label>
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select Date"
                  format="YYYY-MM-DD"
                  value={newIncome.date ? dayjs(newIncome.date) : null}
                  onChange={(date, dateString) =>
                    setNewIncome({ ...newIncome, date: dateString })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">Category</label>
                <Select
                  placeholder="Select"
                  style={{ width: "100%" }}
                  value={newIncome.category}
                  onChange={(value) => setNewIncome({ ...newIncome, category: value })}
                >
                  <Option value="Product Sales">Product Sales</Option>
                  <Option value="Service Income">Service Income</Option>
                  <Option value="Commission">Commission</Option>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">Store</label>
                <Select
                  placeholder="Select"
                  style={{ width: "100%" }}
                  value={newIncome.store}
                  onChange={(value) => setNewIncome({ ...newIncome, store: value })}
                >
                  <Option value="Main Branch">Main Branch</Option>
                  <Option value="Online Store">Online Store</Option>
                  <Option value="Warehouse">Warehouse</Option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Amount</label>
                  <Input
                    placeholder="$200"
                    value={newIncome.amount}
                    onChange={(e) =>
                      setNewIncome({ ...newIncome, amount: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Account</label>
                  <Select
                    placeholder="Select"
                    style={{ width: "100%" }}
                    value={newIncome.account}
                    onChange={(value) =>
                      setNewIncome({ ...newIncome, account: value })
                    }
                  >
                    <Option value="Cash">Cash</Option>
                    <Option value="Bank">Bank</Option>
                    <Option value="Online Payment">Online Payment</Option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">Description</label>
                <textarea
                  name="notes"
                  value={newIncome.notes}
                  onChange={(e) =>
                    setNewIncome({ ...newIncome, notes: e.target.value })
                  }
                  placeholder="Enter description..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-md bg-[#0b365a] text-white hover:opacity-95 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIncome}
                className="px-5 py-2 rounded-md bg-violet-500 text-white hover:bg-violet-600 transition"
              >
                {editIndex !== null ? "Update Income" : "Add Income"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
