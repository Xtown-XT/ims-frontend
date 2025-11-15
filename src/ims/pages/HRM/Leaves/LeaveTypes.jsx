import React, { useState } from "react";
import { Table, Button, Tag, Modal, Input, Form, message } from "antd";
import { FilePdfOutlined, FileExcelOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { Plus, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { confirm } = Modal;

const LeaveTypes = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  const [formValues, setFormValues] = useState({
    leaveType: "",
    leaveQuota: "",
    status: "Active",
  });

  const [leaveData, setLeaveData] = useState([
    {
      key: 1,
      leaveType: "Sick Leave",
      leaveQuota: "05",
      createdOn: "02 Aug 2023",
      status: "Active",
    },
    {
      key: 2,
      leaveType: "Maternity",
      leaveQuota: "05",
      createdOn: "03 Aug 2023",
      status: "Active",
    },
    {
      key: 3,
      leaveType: "Paternity",
      leaveQuota: "05",
      createdOn: "04 Aug 2023",
      status: "Active",
    },
    {
      key: 4,
      leaveType: "Casual Leave",
      leaveQuota: "05",
      createdOn: "07 Aug 2023",
      status: "Active",
    },
    {
      key: 5,
      leaveType: "Emergency",
      leaveQuota: "05",
      createdOn: "08 Aug 2023",
      status: "Active",
    },
    {
      key: 6,
      leaveType: "Vacation",
      leaveQuota: "05",
      createdOn: "10 Aug 2023",
      status: "Active",
    },
  ]);

  // Delete Confirmation
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this leave type?",
      icon: <AlertCircle color="#ff4d4f" />,
      content: `Leave Type: ${record.leaveType}`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk() {
        setLeaveData(leaveData.filter((item) => item.key !== record.key));
        message.success("Leave type deleted successfully");
      },
    });
  };

  // Handle Input
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
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

  // Refresh Handler
  const handleRefresh = () => {
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
      doc.text("Leave Types Report", 14, 22);

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      if (!leaveData || leaveData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("leave-types-report.pdf");
        return;
      }

      const tableData = leaveData.map(item => [
        item.leaveType || '',
        item.leaveQuota || '',
        item.createdOn || '',
        item.status || ''
      ]);

      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Leave Type', 'Leave Quota', 'Created On', 'Status']],
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

      doc.save("leave-types-report.pdf");
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
        leaveData.map((item) => ({
          "Leave Type": item.leaveType,
          "Leave Quota": item.leaveQuota,
          "Created On": item.createdOn,
          "Status": item.status,
        }))
      );

      const columnWidths = [
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Types");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, "leave-types-report.xlsx");
      message.success("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Error exporting Excel. Please try again.");
    }
  };

  // Add / Update Leave Type
  const handleAddLeaveType = () => {
    if (!formValues.leaveType || !formValues.leaveQuota) {
      message.warning("Please fill all required fields!");
      return;
    }

    if (editingRecord) {
      const updated = leaveData.map((item) =>
        item.key === editingRecord.key ? { ...item, ...formValues } : item
      );
      setLeaveData(updated);
      message.success("Leave type updated successfully");
    } else {
      const newEntry = {
        key: Date.now(),
        leaveType: formValues.leaveType,
        leaveQuota: formValues.leaveQuota,
        createdOn: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: formValues.status,
        selected: false,
      };
      setLeaveData([...leaveData, newEntry]);
      message.success("Leave type added successfully");
    }

    setFormValues({ leaveType: "", leaveQuota: "", status: "Active" });
    setEditingRecord(null);
    setShowForm(false);
  };

  // Edit Handler
  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormValues({
      leaveType: record.leaveType,
      leaveQuota: record.leaveQuota,
      status: record.status,
    });
    setShowForm(true);
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
      title: "Leave Type",
      dataIndex: "leaveType",
      key: "leaveType",
      align: "center",
    },
    {
      title: "Leave Quota",
      dataIndex: "leaveQuota",
      key: "leaveQuota",
      align: "center",
    },
    {
      title: "Created On",
      dataIndex: "createdOn",
      key: "createdOn",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag
          style={{
            borderRadius: "6px",
            padding: "2px 12px",
            color: "white",
            backgroundColor: status === "Active" ? "#3EB780" : "#d63031",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="text" />
          <Button icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)} type="text" />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Leave Type</h2>
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
          <button
            className="flex items-center gap-1 bg-purple-500 text-white px-3 py-1.5 rounded-lg hover:bg-purple-600 transition text-sm"
            onClick={() => setShowForm(true)}
          >
            <Plus size={14} /> Add Leave Type
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <Table
          columns={columns}
          dataSource={leaveData}
          pagination={{ pageSize: 10 }}
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
                {editingRecord ? "Edit Leave Type" : "Add Leave Type"}
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
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="leaveType"
                  value={formValues.leaveType}
                  onChange={handleInputChange}
                  placeholder="Enter leave type"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Leave Quota <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="leaveQuota"
                  value={formValues.leaveQuota}
                  onChange={handleInputChange}
                  placeholder="Enter leave quota"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formValues.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                onClick={handleAddLeaveType}
                className="px-5 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition"
              >
                {editingRecord ? "Save Changes" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTypes;
