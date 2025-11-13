import React, { useState } from "react";
import { Table, Input, Select, Tag, DatePicker, Button } from "antd";
import { 
  SearchOutlined, 
  CalendarOutlined, 
  FilePdfOutlined, 
  FileExcelOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ClockCircleOutlined 
} from "@ant-design/icons";

const { Option } = Select;

const EmployeeLeaves = () => {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample leave data for employee
  const [leaveData] = useState([
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
        return "processing";
      default:
        return "default";
    }
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
            type="text"
            style={{ color: "#6B7280" }}
          />
          <Button 
            icon={<DeleteOutlined />} 
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
              background: "#FF9800",
              borderColor: "#FF9800",
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
    </div>
  );
};

export default EmployeeLeaves;
