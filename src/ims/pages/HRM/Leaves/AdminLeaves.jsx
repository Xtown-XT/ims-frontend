import React, { useState } from "react";
import { Table, Input, Select, Tag, DatePicker, Button } from "antd";
import { SearchOutlined, CalendarOutlined, FilePdfOutlined, FileExcelOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;

const AdminLeaves = () => {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample leave data
  const [leaveData] = useState([
    {
      key: 1,
      id: "EMP003",
      name: "Robert Lamon",
      role: "Developer",
      image: "/api/placeholder/40/40",
      type: "Casual Leave",
      fromDate: "27 Nov 2024",
      toDate: "28 Nov 2024",
      days: "02 Day",
      appliedOn: "26 Nov 2024",
      shift: "Regular",
      status: "Approved",
    },
    {
      key: 2,
      id: "EMP006",
      name: "Marsha Betts",
      role: "Developer",
      image: "/api/placeholder/40/40",
      type: "Sick Leave",
      fromDate: "25 Oct 2024",
      toDate: "25 Oct 2024",
      days: "01 Days",
      appliedOn: "24 Oct 2024",
      shift: "Regular",
      status: "Rejected",
    },
    {
      key: 3,
      id: "EMP001",
      name: "Carl Evans",
      role: "Designer",
      image: "/api/placeholder/40/40",
      type: "Sick Leave",
      fromDate: "24 Dec 2024",
      toDate: "24 Dec 2024",
      days: "01 Day",
      appliedOn: "23 Dec 2024",
      shift: "Regular",
      status: "Approved",
    },
    {
      key: 4,
      id: "EMP009",
      name: "Richard Fralick",
      role: "Data Analyst",
      image: "/api/placeholder/40/40",
      type: "Sick Leave",
      fromDate: "20 Sep 2024",
      toDate: "21 Sep 2024",
      days: "07 Days",
      appliedOn: "19 Sep 2024",
      shift: "Regular",
      status: "Approved",
    },
    {
      key: 5,
      id: "EMP004",
      name: "Patricia Lewis",
      role: "HR Manager",
      image: "/api/placeholder/40/40",
      type: "Sick Leave",
      fromDate: "18 Nov 2024",
      toDate: "18 Nov 2024",
      days: "02 hrs",
      appliedOn: "18 Nov 2024",
      shift: "Regular",
      status: "Approved",
    },
    {
      key: 6,
      id: "EMP007",
      name: "Daniel Jude",
      role: "Administrator",
      image: "/api/placeholder/40/40",
      type: "Casual Leave",
      fromDate: "14 Oct 2024",
      toDate: "15 Oct 2024",
      days: "02 Days",
      appliedOn: "13 Oct 2024",
      shift: "Regular",
      status: "Approved",
    },
    {
      key: 7,
      id: "EMP010",
      name: "Michelle Robison",
      role: "HR Manager",
      image: "/api/placeholder/40/40",
      type: "Casual Leave",
      fromDate: "10 Sep 2024",
      toDate: "10 Sep 2024",
      days: "07 hrs",
      appliedOn: "09 Sep 2024",
      shift: "Regular",
      status: "Rejected",
    },
    {
      key: 8,
      id: "EMP002",
      name: "Minerva Rameriz",
      role: "Administrator",
      image: "/api/placeholder/40/40",
      type: "Casual Leave",
      fromDate: "10 Dec 2024",
      toDate: "10 Dec 2024",
      days: "01 Day",
      appliedOn: "09 Dec 2024",
      shift: "Regular",
      status: "Approved",
    },
  ]);

  // Filter data
  const filteredData = leaveData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.type.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    return status === "Approved" ? "success" : "error";
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Employee",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img 
            src={record.image} 
            alt={record.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium text-gray-800">{record.name}</div>
            <div className="text-xs text-gray-500">{record.role}</div>
          </div>
        </div>
      ),
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
      title: "Shift",
      dataIndex: "shift",
      key: "shift",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ borderRadius: "6px", padding: "2px 12px" }}>
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: () => (
        <Button 
          icon={<EditOutlined />} 
          type="text"
          style={{ color: "#6B7280" }}
        />
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
            type="primary"
            style={{
              background: "#7C3AED",
  
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
    </div>
  );
};

export default AdminLeaves;
