import React, { useState, useEffect } from "react";
import { Button, Table, Input, Select, Progress, Tag, message } from "antd";
import { SearchOutlined, ClockCircleOutlined, FilePdfOutlined, FileExcelOutlined, ReloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Option } = Select;

const Employee = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [sortBy, setSortBy] = useState("Sort By");

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit",
      hour12: false 
    });
  };

  // Sample attendance data
  const [attendanceData] = useState([
    {
      key: 1,
      date: "01 Jan 2025",
      status: "Present",
      clockIn: "09:15 AM",
      clockOut: "08:55 PM",
      production: "9h 00m",
      break: "1h 13m",
      overtime: "00h 50m",
      totalHours: "09h 50m",
      progress: 85,
    },
    {
      key: 2,
      date: "02 Jan 2025",
      status: "Present",
      clockIn: "09:07 AM",
      clockOut: "06:40 PM",
      production: "9h 10m",
      break: "1h 07m",
      overtime: "01h 13m",
      totalHours: "10h 23m",
      progress: 90,
    },
    {
      key: 3,
      date: "03 Jan 2025",
      status: "Present",
      clockIn: "09:04 AM",
      clockOut: "08:52 PM",
      production: "8h 47m",
      break: "1h 04m",
      overtime: "01h 07m",
      totalHours: "10h 04m",
      progress: 88,
    },
    {
      key: 4,
      date: "04 Jan 2025",
      status: "Holiday",
      clockIn: "-",
      clockOut: "-",
      production: "-",
      break: "-",
      overtime: "-",
      totalHours: "-",
      progress: 0,
    },
    {
      key: 5,
      date: "04 Jan 2025",
      status: "Present",
      clockIn: "09:46 AM",
      clockOut: "06:10 PM",
      production: "09h 12m",
      break: "00h 50m",
      overtime: "00 14m",
      totalHours: "09h 14m",
      progress: 82,
    },
    {
      key: 6,
      date: "06 Jan 2025",
      status: "Absent",
      clockIn: "-",
      clockOut: "-",
      production: "-",
      break: "-",
      overtime: "-",
      totalHours: "-",
      progress: 0,
    },
  ]);

  // Days overview stats
  const stats = {
    totalWorkingDays: 31,
    absentDays: 5,
    presentDays: 28,
    halfDays: 2,
    lateDays: 1,
    holidays: 2,
  };

  // Filter data
  const filteredData = attendanceData.filter((item) => {
    const matchesSearch = item.date.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "success";
      case "Absent":
        return "error";
      case "Holiday":
        return "default";
      default:
        return "default";
    }
  };

  // Get progress color
  const getProgressColor = (progress) => {
    if (progress >= 90) return "#52c41a";
    if (progress >= 70) return "#7C3AED";
    return "#ff4d4f";
  };

  // Refresh Handler
  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
    setSortBy("Sort By");
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
      doc.text("Employee Attendance Report", 14, 22);

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("employee-attendance-report.pdf");
        return;
      }

      const tableData = filteredData.map(item => [
        item.date || '',
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
          head: [['Date', 'Status', 'Clock In', 'Clock Out', 'Production', 'Break', 'Overtime', 'Total Hours']],
          body: tableData,
          startY: 40,
          styles: {
            fontSize: 9,
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

      doc.save("employee-attendance-report.pdf");
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
          "Date": item.date,
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Attendance");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, "employee-attendance-report.xlsx");
      message.success("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      message.error("Error exporting Excel. Please try again.");
    }
  };

  // Table columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      width:100,
       render: (text) => (
    <span style={{ whiteSpace: "nowrap", display: "inline-block" }}>{text}</span>
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
    else if (status === "Holiday") color = "#6938E1"; // fixed hex (E1 not ET)

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
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      align: "center",
      render: (progress) => (
        <Progress
          percent={progress}
          strokeColor={getProgressColor(progress)}
          size="small"
          style={{ width: "100px" }}
        />
      ),
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
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            👋 Good Morning, <span className="text-violet-600">John Smilga</span>
          </h2>
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

      {/* Main Content - Two Separate Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Box - Attendance (Smaller - 1 column) */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Attendance</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">📅</div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{formatTime(currentTime)}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <ClockCircleOutlined /> Current Time
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="primary"
              size="large"
              style={{
                background: "#7C3AED",
                borderColor: "#7C3AED",
                borderRadius: "8px",
                flex: 1,
              }}
            >
              Clock Out
            </Button>
            <Button
              size="large"
              style={{
                background: "#1F2937",
                color: "white",
                borderColor: "#1F2937",
                borderRadius: "8px",
                flex: 1,
              }}
            >
              Break
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">22 Aug 2023</div>
        </div>

        {/* Right Box - Days Overview (Larger - 2 columns) */}
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 lg:col-span-2">
  <h3 className="text-lg font-semibold mb-4">Days Overview This Month</h3>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      flexWrap: "nowrap",
      overflowX: "auto",
      paddingLeft: "10px",
      paddingRight: "10px",
    }}
  >
    {/* Total Working Days */}
    <div className="flex flex-col items-center text-center">
      <div className="bg-purple-50 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
        <span className="text-3xl font-bold text-purple-500">{stats.totalWorkingDays}</span>
      </div>
      <div className="text-xs text-gray-600 mt-2 leading-tight">Total Working<br />Days</div>
    </div>

    {/* Absent Days */}
    <div className="flex flex-col items-center text-center">
      <div className="bg-red-50 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
        <span className="text-3xl font-bold text-red-500">{stats.absentDays}</span>
      </div>
      <div className="text-xs text-gray-600 mt-2 leading-tight">Absent<br />Days</div>
    </div>

    {/* Present Days */}
    <div className="flex flex-col items-center text-center">
      <div className="bg-purple-50 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
        <span className="text-3xl font-bold text-purple-500">{stats.presentDays}</span>
      </div>
      <div className="text-xs text-gray-600 mt-2 leading-tight">Present<br />Days</div>
    </div>

    {/* Half Days */}
    <div className="flex flex-col items-center text-center">
      <div className="bg-yellow-50 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
        <span className="text-3xl font-bold text-yellow-500">{stats.halfDays}</span>
      </div>
      <div className="text-xs text-gray-600 mt-2 leading-tight">Half<br />Days</div>
    </div>

    {/* Late Days */}
    <div className="flex flex-col items-center text-center">
      <div className="bg-cyan-50 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
        <span className="text-3xl font-bold text-cyan-500">{stats.lateDays}</span>
      </div>
      <div className="text-xs text-gray-600 mt-2 leading-tight">Late<br />Days</div>
    </div>

    {/* Holidays */}
    <div className="flex flex-col items-center text-center">
      <div className="bg-green-50 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
        <span className="text-3xl font-bold text-green-500">{stats.holidays}</span>
      </div>
      <div className="text-xs text-gray-600 mt-2 leading-tight">Holidays</div>
    </div>
  </div>
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
              placeholder="Select Status"
              style={{ width: 150 }}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              allowClear
            >
              <Option value="Present">Present</Option>
              <Option value="Absent">Absent</Option>
              <Option value="Holiday">Holiday</Option>
            </Select>

            <Select
              placeholder="Sort By"
              style={{ width: 150 }}
              value={sortBy}
              onChange={(val) => setSortBy(val)}
            >
              <Option value="Recently Added">Recently Added</Option>
              <Option value="Ascending">Ascending</Option>
              <Option value="Desending">Desending</Option>
              <Option value="Last Month">Last Month</Option>
              <Option value="Last 7 Days">Last 7 Days</Option>


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

export default Employee;
