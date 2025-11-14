import React, { useState } from "react";
import { Table, Input, Select, Tag, DatePicker, Button, message, Modal } from "antd";
import { 
  SearchOutlined, 
  CalendarOutlined, 
  FilePdfOutlined, 
  FileExcelOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ClockCircleOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { confirm } = Modal;

const { Option } = Select;

const EmployeeLeaves = () => {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [formValues, setFormValues] = useState({
    employee: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    noOfDays: "",
    remainingLeaves: "",
    reason: "",
  });

  const [leaveData, setLeaveData] = useState([
    {
      key: 1,
      type: "Sick Leave",
      fromDate: "24 Dec 2024",
      toDate: "24 Dec 2024",
      days: "01 Day",
      appliedOn: "23 Dec 2024",
      status: "Approved",
    },
    {
      key: 2,
      type: "Casual Leave",
      fromDate: "10 Dec 2024",
      toDate: "10 Dec 2024",
      days: "01 Day",
      appliedOn: "09 Dec 2024",
      status: "Approved",
    },
    {
      key: 3,
      type: "Sick Leave",
      fromDate: "25 Oct 2024",
      toDate: "25 Oct 2024",
      days: "01 Day",
      appliedOn: "24 Oct 2024",
      status: "Rejected",
    },
    {
      key: 4,
      type: "Casual Leave",
      fromDate: "03 Oct 2024",
      toDate: "03 Oct 2024",
      days: "01 Day",
      appliedOn: "02 Oct 2024",
      status: "Applied",
    },
    {
      key: 5,
      type: "Casual Leave",
      fromDate: "27 Nov 2024",
      toDate: "28 Nov 2024",
      days: "02 Day",
      appliedOn: "26 Nov 2024",
      status: "Applied",
    },
    {
      key: 6,
      type: "Casual Leave",
      fromDate: "14 Oct 2024",
      toDate: "15 Oct 2024",
      days: "02 Day",
      appliedOn: "13 Oct 2024",
      status: "Approved",
    },
    {
      key: 7,
      type: "Sick Leave",
      fromDate: "20 Sep 2024",
      toDate: "21 Sep 2024",
      days: "02 Day",
      appliedOn: "19 Sep 2024",
      status: "Approved",
    },
    {
      key: 8,
      type: "Sick Leave",
      fromDate: "18 Nov 2024",
      toDate: "18 Nov 2024",
      days: "02 hrs",
      appliedOn: "18 Nov 2024",
      status: "Approved",
    },
    {
      key: 9,
      type: "Casual Leave",
      fromDate: "10 Sep 2024",
      toDate: "10 Sep 2024",
      days: "02 hrs",
      appliedOn: "09 Sep 2024",
      status: "Rejected",
    },
  ]);

  // Filter data
  const filteredData = leaveData.filter((item) => {
    const matchesSearch = 
      item.type.toLowerCase().includes(searchText.toLowerCase()) ||
      item.fromDate.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Applied":
        return "purple";
      default:
        return "default";
    }
  };

  // Select All Checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setLeaveData(leaveData.map((item) => ({ ...item, selected: newSelectAll })));
  };

  // Individual Row Checkbox
  const handleRowCheck = (key) => {
    const updated = leaveData.map((item) =>
      item.key === key ? { ...item, selected: !item.selected } : item
    );
    setLeaveData(updated);
    setSelectAll(updated.every((i) => i.selected));
  };

  // Delete Confirmation
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this leave?",
      icon: <AlertCircle color="#ff4d4f" />,
      content: `Leave Type: ${record.type}`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk() {
        setLeaveData(leaveData.filter((item) => item.key !== record.key));
        message.success("Leave deleted successfully");
      },
    });
  };

  // Refresh Handler
  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
    setSelectedDate(null);
    message.info("Refreshed!");
  };

  // Export PDF
  const exportPDF = () => {
    try {
      if (!jsPDF) {
        alert("PDF library not loaded. Please refresh the page and try again.");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("Employee Leaves Report", 14, 22);

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("employee-leaves-report.pdf");
        return;
      }

      const tableData = filteredData.map(item => [
        item.type || '',
        item.fromDate || '',
        item.toDate || '',
        item.days || '',
        item.appliedOn || '',
        item.status || ''
      ]);

      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Type', 'From Date', 'To Date', 'Days/Hours', 'Applied On', 'Status']],
          body: tableData,
          startY: 40,
          styles: {
            fontSize: 10,
            cellPadding: 4,
            overflow: 'linebreak',
            halign: 'left',
          },
          headStyles: {
            fillColor: [124, 58, 237],
            textColor: 255,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { top: 40 },
        });
      }

      doc.save("employee-leaves-report.pdf");
      message.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      message.error(`Error exporting PDF: ${error.message}`);
    }
  };

  // Export Excel
  const exportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map((item) => ({
          "Type": item.type,
          "From Date": item.fromDate,
          "To Date": item.toDate,
          "Days/Hours": item.days,
          "Applied On": item.appliedOn,
          "Status": item.status,
        }))
      );

      const columnWidths = [
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 15 },
        { wch: 12 },
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Leaves");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, "employee-leaves-report.xlsx");
      message.success("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Error exporting Excel. Please try again.");
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Handle Edit
  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormValues({
      employee: "Current Employee",
      leaveType: record.type,
      fromDate: record.fromDate,
      toDate: record.toDate,
      noOfDays: record.days,
      remainingLeaves: "",
      reason: "",
    });
    setShowForm(true);
  };

  // Handle Submit
  const handleSubmit = () => {
    if (!formValues.leaveType || !formValues.fromDate || !formValues.toDate) {
      message.warning("Please fill all required fields!");
      return;
    }
    message.success(editingRecord ? "Leave updated successfully" : "Leave applied successfully");
    setShowForm(false);
    setEditingRecord(null);
    setFormValues({
      employee: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      noOfDays: "",
      remainingLeaves: "",
      reason: "",
    });
  };

  // Table columns
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
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      key: "fromDate",
      align: "center",
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      key: "toDate",
      align: "center",
    },
    {
      title: "Days/Hours",
      dataIndex: "days",
      key: "days",
      align: "center",
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      key: "appliedOn",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "";
        if (status === "Approved") color = "#3EB780";
        else if (status === "Rejected") color = "#d63031";
        else if (status === "Applied") color = "#7C3AED";

        return (
          <Tag
            style={{
              borderRadius: "6px",
              padding: "2px 12px",
              color: "white",
              backgroundColor: color,
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          {record.status === "Applied" && (
            <Button 
              icon={<ClockCircleOutlined />} 
              type="text"
              style={{ color: "#6B7280" }}
            />
          )}
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            type="text"
            style={{ color: "#6B7280" }}
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => showDeleteConfirm(record)}
            type="text"
            style={{ color: "#6B7280" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Leaves</h2>
          <p className="text-sm text-gray-500">Manage your Leaves</p>
        </div>
        <div className="flex gap-2">
          <Button
            icon={<FilePdfOutlined />}
            onClick={exportPDF}
            style={{
              background: "#DC2626",
              color: "white",
              borderColor: "#DC2626",
              borderRadius: "8px",
            }}
          />
          <Button
            icon={<FileExcelOutlined />}
            onClick={exportExcel}
            style={{
              background: "#16A34A",
              color: "white",
              borderColor: "#16A34A",
              borderRadius: "8px",
            }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            style={{ borderRadius: "8px" }}
          />
          <Button
            type="primary"
            onClick={() => setShowForm(true)}
            style={{
              background: "#7C3AED",
              borderColor: "#7C3AED",
              borderRadius: "8px",
            }}
          >
            Apply Leave
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        {/* Search + Filters */}
        <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
          <div className="flex-1 max-w-[200px]">
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              className="w-full h-9 rounded-md"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <DatePicker
              placeholder="Select Date"
              suffixIcon={<CalendarOutlined />}
              style={{ width: 150 }}
              onChange={(date) => setSelectedDate(date)}
            />
            
            <Select
              placeholder="Select Status"
              style={{ width: 150 }}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              allowClear
            >
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
              <Option value="Applied">Applied</Option>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          rowClassName={() => "hover:bg-gray-50"}
          style={{ border: "1px solid #e5e7eb" }}
        />
      </div>

      {/* Apply Leave Form Modal - Same as AdminLeaves */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl relative">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Apply Leave</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRecord(null);
                }}
                className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"
              >
                ✕
              </button>
            </div>

            {/* Form Content - Same as AdminLeaves */}
            <div className="p-6 space-y-4">
              {/* Leave Type (No Employee field for employee view) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="leaveType"
                  value={formValues.leaveType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Select</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              {/* From and To Date - First Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formValues.fromDate}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy"
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={formValues.toDate}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy"
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Second row with date and select */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    placeholder="dd/mm/yyyy"
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Select</option>
                  </select>
                </div>
              </div>

              {/* No of Days and Remaining Leaves */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No of Days
                  </label>
                  <input
                    type="text"
                    name="noOfDays"
                    value={formValues.noOfDays}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remaining Leaves
                  </label>
                  <input
                    type="text"
                    name="remainingLeaves"
                    value={formValues.remainingLeaves}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Reason with Rich Text Editor Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <div className="border border-gray-300 rounded-md">
                  <div className="border-b border-gray-300 px-3 py-2 bg-gray-50 flex items-center gap-2">
                    <select className="text-sm border-none bg-transparent">
                      <option>Normal</option>
                    </select>
                    <div className="flex gap-2 text-gray-600">
                      <button type="button" className="hover:text-gray-800">B</button>
                      <button type="button" className="hover:text-gray-800 italic">I</button>
                      <button type="button" className="hover:text-gray-800 underline">U</button>
                      <button type="button" className="hover:text-gray-800">🔗</button>
                      <button type="button" className="hover:text-gray-800">≡</button>
                      <button type="button" className="hover:text-gray-800">≣</button>
                      <button type="button" className="hover:text-gray-800">Tx</button>
                    </div>
                  </div>
                  <textarea
                    name="reason"
                    value={formValues.reason}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-3 py-2 focus:outline-none"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRecord(null);
                }}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaves;
