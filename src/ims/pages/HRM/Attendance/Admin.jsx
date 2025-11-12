import React, { useState } from "react";
import { Table, Input, Select, Tag, DatePicker, Button } from "antd";
import { SearchOutlined, CalendarOutlined, FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";

const { Option } = Select;

const Admin = () => {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample attendance data with employee images
  const [attendanceData] = useState([
    {
      key: 1,
      name: "Carl Evans",
      role: "Designer",
      image: "/api/placeholder/40/40", // Replace with actual image path
      status: "Present",
      clockIn: "09:00 AM",
      clockOut: "07:15 PM",
      production: "09h 00m",
      break: "0h 45m",
      overtime: "0h 20m",
      totalHours: "09h 20m",
    },
    {
      key: 2,
      name: "Daniel Jude",
      role: "Administrator",
      image: "/api/placeholder/40/40",
      status: "Absent",
      clockIn: "-",
      clockOut: "-",
      production: "-",
      break: "-",
      overtime: "-",
      totalHours: "-",
    },
    {
      key: 3,
      name: "Emma Bates",
      role: "HR Assistant",
      image: "/api/placeholder/40/40",
      status: "Present",
      clockIn: "09:47 AM",
      clockOut: "07:20 PM",
      production: "09h 17m",
      break: "01h 00m",
      overtime: "00h 17m",
      totalHours: "09h 17m",
    },
    {
      key: 4,
      name: "Mark Joslyn",
      role: "Designer",
      image: "/api/placeholder/40/40",
      status: "Absent",
      clockIn: "-",
      clockOut: "-",
      production: "-",
      break: "-",
      overtime: "-",
      totalHours: "-",
    },
    {
      key: 5,
      name: "Marsha Betts",
      role: "Developer",
      image: "/api/placeholder/40/40",
      status: "Present",
      clockIn: "09:17 AM",
      clockOut: "07:34 PM",
      production: "09h 26m",
      break: "01h 20m",
      overtime: "00h 26m",
      totalHours: "09h 26m",
    },
    {
      key: 6,
      name: "Michelle Robinson",
      role: "HR Manager",
      image: "/api/placeholder/40/40",
      status: "Present",
      clockIn: "09:30 AM",
      clockOut: "08:10 PM",
      production: "09h 00m",
      break: "00h 34m",
      overtime: "00h 20m",
      totalHours: "09h 20m",
    },
    {
      key: 7,
      name: "Minerva Rameriz",
      role: "Administrator",
      image: "/api/placeholder/40/40",
      status: "Present",
      clockIn: "09:16 AM",
      clockOut: "07:12 PM",
      production: "09h 00m",
      break: "01h 15m",
      overtime: "0h 17m",
      totalHours: "09h 12m",
    },
    {
      key: 8,
      name: "Patricia Lewis",
      role: "Developer",
      image: "/api/placeholder/40/40",
      status: "Present",
      clockIn: "09:46 AM",
      clockOut: "08:10 PM",
      production: "09h 12m",
      break: "00h 50m",
      overtime: "00 14m",
      totalHours: "09h 14m",
    },
  ]);

  // Filter data
  const filteredData = attendanceData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.role.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    return status === "Present" ? "success" : "error";
  };

  // Table columns
  const columns = [
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
     title: "Status",
     dataIndex: "status",
     key: "status",
     align: "center",
     render: (status) => {
       let color = "";
       if (status === "Present") color = "#3EB780";
       else if (status === "Absent") color = "#d63031";

   
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
      title: "Clock In",
      dataIndex: "clockIn",
      key: "clockIn",
      align: "center",
    },
    {
      title: "Clock Out",
      dataIndex: "clockOut",
      key: "clockOut",
      align: "center",
    },
    {
      title: "Production",
      dataIndex: "production",
      key: "production",
      align: "center",
    },
    {
      title: "Break",
      dataIndex: "break",
      key: "break",
      align: "center",
    },
    {
      title: "Overtime",
      dataIndex: "overtime",
      key: "overtime",
      align: "center",
    },
    {
      title: "Total Hours",
      dataIndex: "totalHours",
      key: "totalHours",
      align: "center",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Attendance</h2>
          <p className="text-sm text-gray-500">Manage your Attendance</p>
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
              <Option value="Present">Present</Option>
              <Option value="Absent">Absent</Option>
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

export default Admin;
