


import { useState } from "react";
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

const Shifts = () => {
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("shiftInfo");


  const [formValues, setFormValues] = useState({
    ShiftName: "",
    Timing: "",
    FromTime: "",
    ToTime: "",
    WeekOff: "",
    CreatedOn: "",
    Status: "",
  });

  const [formData, setFormData] = useState([
    {
      key: 1,
      ShiftName: "Fixed",
      Timing: "09:00 AM - 6:00 PM",
      WeekOff: "Sunday, Monday",
      CreatedOn: "04 Aug 2024",
      Status: "Active",
    },
    {
      key: 2,
      ShiftName: "Rotating",
      Timing: "06:00 AM - 3:00 PM",
      WeekOff: "Saturday, Sunday",
      CreatedOn: "21 July 2024",
      Status: "Active",
    },
  ]);

  // ✅ Filter + Sort (fixed)
  let filteredData = formData.filter((item) => {
    const matchesSearch =
      item.ShiftName?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.Timing?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.WeekOff?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.Status?.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory = filterCategory ? item.ShiftName === filterCategory : true;
    const matchesStatus = filterStatus ? item.Status === filterStatus : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // ✅ Sorting logic (fixed)
  if (sortBy) {
    filteredData.sort((a, b) => {
      if (sortBy === "Recently Added") {
        return new Date(b.CreatedOn) - new Date(a.CreatedOn);
      }
      if (sortBy === "Ascending") {
        return a.ShiftName.localeCompare(b.ShiftName);
      }
      if (sortBy === "Descending") {
        return b.ShiftName.localeCompare(a.ShiftName);
      }
      if (sortBy === "Last Month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return new Date(a.CreatedOn) >= oneMonthAgo ? -1 : 1;
      }
      if (sortBy === "Last 7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(a.CreatedOn) >= sevenDaysAgo ? -1 : 1;
      }
      return 0;
    });
  }

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

  // ✅ Delete Confirmation (fixed)
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this shift?",
      icon: <AlertCircle color="#ff4d4f" />,
      content: `Shift: ${record.ShiftName}`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk() {
        setFormData(formData.filter((item) => item.key !== record.key));
        message.success("Shift deleted successfully");
      },
    });
  };

  // ✅ Handle Input
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // ✅ Add / Update Shift
  const handleAddCategory = () => {
    if (!formValues.ShiftName || !formValues.FromTime || !formValues.ToTime) {
      message.warning("Please fill all required fields!");
      return;
    }

    const timing = `${formValues.FromTime} - ${formValues.ToTime}`;

    if (editingRecord) {
      const updated = formData.map((item) =>
        item.key === editingRecord.key ? { 
          ...item, 
          ShiftName: formValues.ShiftName,
          Timing: timing,
          WeekOff: formValues.WeekOff,
          Status: formValues.Status || "Active"
        } : item
      );
      setFormData(updated);
      message.success("Shift updated successfully");
    } else {
      const newEntry = {
        key: Date.now(),
        ShiftName: formValues.ShiftName,
        Timing: timing,
        WeekOff: formValues.WeekOff,
        CreatedOn: new Date().toLocaleDateString(),
        Status: "Active",
      };
      setFormData([...formData, newEntry]);
      message.success("Shift added successfully");
    }

    setFormValues({ ShiftName: "", Timing: "", FromTime: "", ToTime: "", WeekOff: "", CreatedOn: "", Status: "" });
    setEditingRecord(null);
    setActiveTab("shiftInfo");
    setShowForm(false);
  };

  // ✅ Edit Handler
  const handleEdit = (record) => {
    setEditingRecord(record);
    
    // Parse timing to get FromTime and ToTime
    const timingParts = record.Timing.split(' - ');
    
    setFormValues({
      ShiftName: record.ShiftName,
      Timing: record.Timing,
      FromTime: timingParts[0] || "",
      ToTime: timingParts[1] || "",
      WeekOff: record.WeekOff,
      CreatedOn: record.CreatedOn,
      Status: record.Status,
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

  // ✅ Export PDF
  const exportPDF = () => {
    try {
      if (!jsPDF) {
        alert("PDF library not loaded. Please refresh the page and try again.");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("Shifts Report", 14, 22);

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("shifts-report.pdf");
        return;
      }

      const tableData = filteredData.map(item => [
        item.ShiftName || '',
        item.Timing || '',
        item.WeekOff || '',
        item.CreatedOn || '',
        item.Status || ''
      ]);

      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Shift Name', 'Timing', 'Week Off', 'Created On', 'Status']],
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

      doc.save("shifts-report.pdf");
      message.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      message.error(`Error exporting PDF: ${error.message}`);
    }
  };

  // ✅ Export Excel
  const exportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map((item) => ({
          "Shift Name": item.ShiftName,
          "Timing": item.Timing,
          "Week Off": item.WeekOff,
          "Created On": item.CreatedOn,
          "Status": item.Status,
        }))
      );

      const columnWidths = [
        { wch: 20 },
        { wch: 25 },
        { wch: 20 },
        { wch: 15 },
        { wch: 12 },
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Shifts");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, "shifts-report.xlsx");
      message.success("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Error exporting Excel. Please try again.");
    }
  };

  // ✅ Export PDF and Excel remain same

  // ✅ Table Columns (fixed titles to match data)
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
    { title: "Shift Name", dataIndex: "ShiftName", key: "ShiftName", align: "center" },
    { title: "Timing", dataIndex: "Timing", key: "Timing", align: "center" },
    { title: "Week Off", dataIndex: "WeekOff", key: "WeekOff", align: "center" },
    { title: "Created On", dataIndex: "CreatedOn", key: "CreatedOn", align: "center" },
{
  title: "Status",
  dataIndex: "Status",
  key: "Status",
  width:46,
  render: (text) => (
    <span
      style={{
        backgroundColor: text === "Active" ? "#06AED4" : "#3EB780",
        color: "#fff",
         padding: "2px 8px",
        borderRadius: "6px",
        fontSize:"12px",
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
          <h2 className="text-xl font-semibold text-gray-800">Shift</h2>
          <p className="text-sm text-gray-500">Manage your Shifts</p>
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
            onClick={() => setShowForm(true)}
          >
            <Plus size={14} /> Add Shift
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
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
                placeholder=" Select Status"
                style={{ width: 150 }}
                value={filterStatus}
                onChange={(val) => setFilterStatus(val)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative">
            {/* X Close Button */}
            <button
              onClick={() => {
                setShowForm(false);
                setActiveTab("shiftInfo");
                setEditingRecord(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition z-10"
            >
              ✕
            </button>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("shiftInfo")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "shiftInfo"
                    ? "text-purple-600 border-b-2 border-purple-500"
                    : "text-gray-500"
                }`}
              >
                Shift Info
              </button>
              <button
                onClick={() => setActiveTab("breakTimings")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "breakTimings"
                    ? "text-purple-600 border-b-2 border-purple-500"
                    : "text-gray-500"
                }`}
              >
                Break Timings
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Shift Info Tab Content */}
              {activeTab === "shiftInfo" && (
                <>
              {/* Shift Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ShiftName"
                  value={formValues.ShiftName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter shift name"
                />


              </div>

              {/* From and To Time */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="FromTime"
                    value={formValues.FromTime || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="ToTime"
                    value={formValues.ToTime || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Weekoff */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekoff <span className="text-red-500">*</span>
                </label>
                <select 
                  name="WeekOff"
                  value={formValues.WeekOff}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option>Select</option>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
              </div>

              {/* Weekdays Definition */}
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Weekdays Definiton</h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-6 gap-2 mb-2 text-sm font-medium text-gray-600">
                    <div>Days</div>
                    <div className="text-center">All</div>
                    <div className="text-center">1st</div>
                    <div className="text-center">2nd</div>
                    <div className="text-center">3rd</div>
                    <div className="text-center">4th</div>
                  </div>
                  
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <div key={day} className="grid grid-cols-6 gap-2 items-center py-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={index === 0} />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                        <span className="text-sm text-gray-700">{day}</span>
                      </div>
                      <div className="text-center">
                        <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                      </div>
                      <div className="text-center">
                        <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                      </div>
                      <div className="text-center">
                        <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                      </div>
                      <div className="text-center">
                        <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                      </div>
                      <div className="text-center">
                        <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recurring Shift */}
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                <label className="text-sm text-gray-700">Recurring Shift</label>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-6">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
                </>
              )}

              {/* Break Timings Tab Content */}
              {activeTab === "breakTimings" && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm mb-4">Configure break timings for this shift</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Break Start Time
                      </label>
                      <input
                        type="time"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Break End Time
                      </label>
                      <input
                        type="time"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      placeholder="30"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Break Type
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
                      <option>Lunch Break</option>
                      <option>Tea Break</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 bg-white px-6 py-3">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setActiveTab("shiftInfo");
                    setEditingRecord(null);
                    setFormValues({ ShiftName: "", Timing: "", WeekOff: "", CreatedOn: "", Status: "" });
                  }}
                  className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                >
                  {editingRecord ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shifts;
