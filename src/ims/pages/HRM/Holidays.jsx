import React, { useState } from "react";
import { Table, Button, Tag, Modal, Input, Select, message } from "antd";
import { 
  FilePdfOutlined, 
  FileExcelOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined 
} from "@ant-design/icons";
import { Plus, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { confirm } = Modal;
const { Option } = Select;

const Holidays = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  const [formValues, setFormValues] = useState({
    holiday: "",
    fromDate: "",
    toDate: "",
    noOfDays: "",
    description: "",
    status: true,
  });

  const [holidayData, setHolidayData] = useState([
    {
      key: 1,
      type: "New Year",
      date: "01 Jan 202",
      description: "First day of the new year",
      status: "Active",
    },
    {
      key: 2,
      type: "Martin Luther King Jr. Day",
      date: "15 Jan 2025",
      description: "Celebrating the civil rights leader",
      status: "Active",
    },
    {
      key: 3,
      type: "Presidents' Day",
      date: "19 Feb 2025",
      description: "Honoring past US Presidents",
      status: "Active",
    },
    {
      key: 4,
      type: "Good Friday",
      date: "28 Mar 2025",
      description: "Holiday before Easter",
      status: "Active",
    },
    {
      key: 5,
      type: "Easter Monday",
      date: "01 Apr 2025",
      description: "Holiday after Easter",
      status: "Active",
    },
    {
      key: 6,
      type: "Memorial Day",
      date: "27 May 2025",
      description: "Honors military personnel",
      status: "Active",
    },
    {
      key: 7,
      type: "Independence Day",
      date: "04 Jul 2025",
      description: "Celebrates Independence",
      status: "Active",
    },
    {
      key: 8,
      type: "Labour Day",
      date: "02 Sep 2025",
      description: "Honors working people",
      status: "Active",
    },
    {
      key: 9,
      type: "Veterans Day",
      date: "11 Nov 2025",
      description: "Honors working people",
      status: "Active",
    },
  ]);

  // Filter data
  const filteredData = holidayData.filter((item) => {
    const matchesSearch = 
      item.type.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Delete Confirmation
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this holiday?",
      icon: <AlertCircle color="#ff4d4f" />,
      content: `Holiday: ${record.type}`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk() {
        setHolidayData(holidayData.filter((item) => item.key !== record.key));
        message.success("Holiday deleted successfully");
      },
    });
  };

  // Handle Input
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Add / Update Holiday
  const handleAddHoliday = () => {
    if (!formValues.type || !formValues.date || !formValues.description) {
      message.warning("Please fill all required fields!");
      return;
    }

    if (editingRecord) {
      const updated = holidayData.map((item) =>
        item.key === editingRecord.key ? { ...item, ...formValues } : item
      );
      setHolidayData(updated);
      message.success("Holiday updated successfully");
    } else {
      const newEntry = {
        key: Date.now(),
        type: formValues.type,
        date: formValues.date,
        description: formValues.description,
        status: "Active",
      };
      setHolidayData([...holidayData, newEntry]);
      message.success("Holiday added successfully");
    }

    setFormValues({ type: "", date: "", description: "" });
    setEditingRecord(null);
    setShowForm(false);
  };

  // Edit Handler
  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormValues({
      holiday: record.type,
      fromDate: "",
      toDate: "",
      noOfDays: "",
      description: record.description,
      status: record.status === "Active",
    });
    setShowForm(true);
  };

  // Select All Checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setHolidayData(holidayData.map((item) => ({ ...item, selected: newSelectAll })));
  };

  // Individual Row Checkbox
  const handleRowCheck = (key) => {
    const updated = holidayData.map((item) =>
      item.key === key ? { ...item, selected: !item.selected } : item
    );
    setHolidayData(updated);
    setSelectAll(updated.every((i) => i.selected));
  };

  // Refresh Handler
  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
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
      doc.text("Holidays Report", 14, 22);

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("holidays-report.pdf");
        return;
      }

      const tableData = filteredData.map(item => [
        item.type || '',
        item.date || '',
        item.description || '',
        item.status || ''
      ]);

      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Type', 'Date', 'Description', 'Status']],
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

      doc.save("holidays-report.pdf");
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
          "Date": item.date,
          "Description": item.description,
          "Status": item.status,
        }))
      );

      const columnWidths = [
        { wch: 20 },
        { wch: 15 },
        { wch: 40 },
        { wch: 12 },
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Holidays");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, "holidays-report.xlsx");
      message.success("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Error exporting Excel. Please try again.");
    }
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
          <h2 className="text-xl font-semibold text-gray-800">Holiday</h2>
          <p className="text-sm text-gray-500">Manage your holidays</p>
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
            <Plus size={14} /> Add Holiday
          </button>
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
            <Select
              placeholder="Status"
              style={{ width: 150 }}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              allowClear
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          rowClassName={() => "hover:bg-gray-50"}
          style={{ border: "1px solid #e5e7eb" }}
        />
      </div>

      {/* Modal Form - Screenshot Style */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl relative">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Add Holiday</h3>
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

            {/* Form Content */}
            <div className="p-6 space-y-4">
              {/* Holiday Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Holiday <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="holiday"
                  value={formValues.holiday}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* From and To Date */}
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

              {/* No of Days */}
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

              {/* Description with Rich Text Editor Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-md">
                  <div className="border-b border-gray-300 px-3 py-2 bg-gray-50 flex items-center gap-2">
                    <select className="text-sm border-none bg-transparent">
                      <option>Normal</option>
                    </select>
                    <div className="flex gap-2 text-gray-600">
                      <button type="button" className="hover:text-gray-800 font-bold">B</button>
                      <button type="button" className="hover:text-gray-800 italic">I</button>
                      <button type="button" className="hover:text-gray-800 underline">U</button>
                      <button type="button" className="hover:text-gray-800">🔗</button>
                      <button type="button" className="hover:text-gray-800">≡</button>
                      <button type="button" className="hover:text-gray-800">≣</button>
                      <button type="button" className="hover:text-gray-800">Tx</button>
                    </div>
                  </div>
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-3 py-2 focus:outline-none"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formValues.status}
                    onChange={(e) => setFormValues({ ...formValues, status: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
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
                onClick={handleAddHoliday}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
              >
                Add Holiday
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Holidays;
