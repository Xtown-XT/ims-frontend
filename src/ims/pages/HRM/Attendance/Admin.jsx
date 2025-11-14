import React, { useState } from "react";
import { Table, Input, Select, Tag, DatePicker, Button, message } from "antd";
import { SearchOutlined, CalendarOutlined, FilePdfOutlined, FileExcelOutlined, ReloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
      doc.text("Admin Attendance Report", 14, 22);

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("admin-attendance-report.pdf");
        return;
      }

      const tableData = filteredData.map(item => [
        item.name || '',
        item.role || '',
        item.status || '',
        item.clockIn || '',
        item.clockOut || '',
        item.production || '',
        item.break || '',
        item.overtime || '',
        item.totalHours || ''
      ]);

      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Employee', 'Role', 'Status', 'Clock In', 'Clock Out', 'Production', 'Break', 'Overtime', 'Total Hours']],
          body: tableData,
          startY: 40,
          styles: {
            fontSize: 8,
            cellPadding: 3,
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

      doc.save("admin-attendance-report.pdf");
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
          "Employee": item.name,
          "Role": item.role,
          "Status": item.status,
          "Clock In": item.clockIn,
          "Clock Out": item.clockOut,
          "Production": item.production,
          "Break": item.break,
          "Overtime": item.overtime,
          "Total Hours": item.totalHours,
        }))
      );

      const columnWidths = [
        { wch: 20 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 12 },
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Admin Attendance");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, "admin-attendance-report.xlsx");
      message.success("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Error exporting Excel. Please try again.");
    }
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
