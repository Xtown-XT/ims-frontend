import React, { useState } from "react";
import { Table, Button, Tag, Modal, Input, Select, message, DatePicker } from "antd";
import { 
  FilePdfOutlined, 
  FileExcelOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined 
} from "@ant-design/icons";
import { Plus, AlertCircle } from "lucide-react";

const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

const Holidays = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);

  const [formValues, setFormValues] = useState({
    type: "",
    date: "",
    description: "",
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
      type: record.type,
      date: record.date,
      description: record.description,
    });
    setShowForm(true);
  };

  // Refresh Handler
  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
    message.info("Refreshed!");
  };

  // Table columns
  const columns = [
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
        <Tag color="success" style={{ borderRadius: "6px", padding: "2px 12px" }}>
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
            style={{
              background: "#DC2626",
              color: "white",
              borderColor: "#DC2626",
              borderRadius: "8px",
            }}
          />
          <Button
            icon={<FileExcelOutlined />}
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
            className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition text-sm"
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

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingRecord ? "Edit Holiday" : "Add Holiday"}
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
                  Holiday Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="type"
                  value={formValues.type}
                  onChange={handleInputChange}
                  placeholder="Enter holiday type"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="date"
                  value={formValues.date}
                  onChange={handleInputChange}
                  placeholder="DD MMM YYYY"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <TextArea
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                onClick={handleAddHoliday}
                className="px-5 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                {editingRecord ? "Update Holiday" : "Add Holiday"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Holidays;
