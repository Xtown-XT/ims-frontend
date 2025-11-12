import React, { useState } from "react";
import {
  DeleteOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  PrinterOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Button, Input, Table, Pagination, Select } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ✅ Avatars
import AlizaDuncan from "../Sales/assets/AlizaDuncan.jpeg";
import HenryBryant from "../Sales/assets/HenryBryant.jpeg";
import JadaRobinson from "../Sales/assets/JadaRobinson.jpeg";
import JamesHigham from "../Sales/assets/JamesHigham.jpeg";
import JennyEllis from "../Sales/assets/JennyEllis.jpeg";
import KarenGalvan from "../Sales/assets/KarenGalvan.jpeg";
import LeonBaxter from "../Sales/assets/LeonBaxter.jpeg";
import MichaelDawson from "../Sales/assets/MichaelDawson.jpeg";
import ThomasWard from "../Sales/assets/ThomasWard.jpeg";

const { Search } = Input;
const { Option } = Select;

const DeleteAccountRequest = () => {
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // ✅ User data
  const usersData = [
    {
      key: 1,
      avatar: AlizaDuncan,
      name: "Aliza Duncan",
      requisition: "25 Sep 2023",
      deleteDate: "01 Oct 2023",
    },
    {
      key: 2,
      avatar: HenryBryant,
      name: "Henry Bryant",
      requisition: "30 Sep 2023",
      deleteDate: "05 Oct 2023",
    },
    {
      key: 3,
      avatar: JadaRobinson,
      name: "Jada Robinson",
      requisition: "10 Sep 2023",
      deleteDate: "25 Sep 2023",
    },
    {
      key: 4,
      avatar: JamesHigham,
      name: "James Higham",
      requisition: "15 Sep 2023",
      deleteDate: "20 Sep 2023",
    },
    {
      key: 5,
      avatar: JennyEllis,
      name: "Jenny Ellis",
      requisition: "15 Aug 2023",
      deleteDate: "01 Sep 2023",
    },
    {
      key: 6,
      avatar: KarenGalvan,
      name: "Karen Galvan",
      requisition: "12 Aug 2023",
      deleteDate: "01 Sep 2023",
    },
    {
      key: 7,
      avatar: MichaelDawson,
      name: "Michael Dawson",
      requisition: "15 Sep 2023",
      deleteDate: "01 Oct 2023",
    },
    {
      key: 8,
      avatar: LeonBaxter,
      name: "Leon Baxter",
      requisition: "01 Jan 2023",
      deleteDate: "01 Feb 2023",
    },
    {
      key: 9,
      avatar: ThomasWard,
      name: "Thomas Ward",
      requisition: "22 Oct 2023",
      deleteDate: "15 Nov 2023",
    },
  ];

  React.useEffect(() => {
    setFilteredData(usersData);
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = usersData.filter(
      (user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.requisition.includes(value) ||
        user.deleteDate.includes(value)
    );
    setFilteredData(filtered);
    setCurrent(1);
  };

  // Export to PDF function
  const exportToPDF = () => {
    try {
      console.log("Starting PDF export...");
      
      // Check if jsPDF is available
      if (!jsPDF) {
        console.error("jsPDF is not available");
        alert("PDF library not loaded. Please refresh the page and try again.");
        return;
      }
      
      const doc = new jsPDF();
      console.log("jsPDF instance created");
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("Delete Account Requests Report", 14, 22);
      
      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      
      // Check if we have data
      if (!filteredData || filteredData.length === 0) {
        doc.setFontSize(14);
        doc.text("No data available to export", 14, 50);
        doc.save("delete-account-requests-report.pdf");
        return;
      }
      
      // Prepare table data
      const tableData = filteredData.map(user => [
        user.name || '',
        user.requisition || '',
        user.deleteDate || ''
      ]);
      
      console.log("Table data prepared:", tableData);
      
      // Check if autoTable is available
      if (typeof doc.autoTable !== 'function') {
        console.error("autoTable is not available");
        // Fallback: create simple text-based PDF
        let yPosition = 50;
        doc.setFontSize(12);
        filteredData.forEach((user, index) => {
          doc.text(`${index + 1}. ${user.name} - ${user.requisition} - ${user.deleteDate}`, 14, yPosition);
          yPosition += 10;
        });
      } else {
        // Add table using autoTable
        doc.autoTable({
          head: [['User Name', 'Requisition Date', 'Delete Request Date']],
          body: tableData,
          startY: 40,
          styles: {
            fontSize: 9,
            cellPadding: 4,
            overflow: 'linebreak',
            halign: 'left',
          },
          headStyles: {
            fillColor: [139, 92, 246], // Purple color
            textColor: 255,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { top: 40 },
        });
      }
      
      // Save the PDF
      doc.save("delete-account-requests-report.pdf");
      console.log("PDF exported successfully");
      
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert(`Error exporting PDF: ${error.message}`);
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map(user => ({
          "User Name": user.name,
          "Requisition Date": user.requisition,
          "Delete Request Date": user.deleteDate
        }))
      );
      
      // Set column widths
      const columnWidths = [
        { wch: 20 }, // User Name
        { wch: 18 }, // Requisition Date
        { wch: 20 }, // Delete Request Date
      ];
      worksheet['!cols'] = columnWidths;
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Delete Account Requests");
      
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(data, "delete-account-requests-report.xlsx");
      
      console.log("Excel exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Error exporting Excel. Please try again.");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Delete Account Requests Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Delete Account Requests Report</h1>
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Requisition Date</th>
                <th>Delete Request Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (user) => `
                <tr>
                  <td>${user.name}</td>
                  <td>${user.requisition}</td>
                  <td>${user.deleteDate}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); }
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Checkbox selection handlers
  const handleSelectAll = (selected, selectedRows, changeRows) => {
    if (selected) {
      setSelectedRowKeys(filteredData.map(item => item.key));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectRow = (record, selected, selectedRows) => {
    if (selected) {
      setSelectedRowKeys([...selectedRowKeys, record.key]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.key));
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchText("");
    setCurrent(1);
    setPageSize(10);
    setSelectedRowKeys([]);
    setFilteredData([]);

    setTimeout(() => {
      setFilteredData([...usersData]);
      setIsRefreshing(false);
    }, 500);
  };

  // Robust scroll-to-top: scroll window + .ant-layout-content + any scrollable element on page
  const handleScrollToTop = () => {
    // 1) scroll window
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch (err) {
      // ignore if not supported
      window.scrollTo(0, 0);
    }

    // 2) scroll known layout container if present
    const layoutContent = document.querySelector(".ant-layout-content");
    if (layoutContent) {
      try {
        layoutContent.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch (err) {
        layoutContent.scrollTop = 0;
      }
    }

    // 3) find and scroll any other scrollable elements (overflow-y: auto|scroll)
    try {
      const all = Array.from(document.querySelectorAll("*"));
      const scrollables = all.filter((el) => {
        // skip html/body because window handled them
        if (!el || el === document.body || el === document.documentElement) return false;
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        return (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight;
      });

      scrollables.forEach((el) => {
        try {
          el.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          el.scrollTop = 0;
        }
      });
    } catch (err) {
      // fail silently
    }
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.avatar}
            alt={record.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-gray-800">{record.name}</span>
        </div>
      ),
    },
    {
      title: "Requisition Date",
      dataIndex: "requisition",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Delete Request Date",
      dataIndex: "deleteDate",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Action",
      width: 100,
      render: () => (
        <div className="flex gap-1">
          <Button
            icon={<DeleteOutlined />}
            size="small"
            className="w-8 h-8 flex items-center justify-center border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-300"
          />
        </div>
      ),
    },
  ];

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Delete Account Request
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage your delete requests</p>
        </div>

        <div className="flex gap-2 items-center">
          <Button 
            icon={<FilePdfOutlined />} 
            onClick={() => {
              console.log("PDF button clicked");
              console.log("Filtered data:", filteredData);
              exportToPDF();
            }}
            className="w-10 h-10 flex items-center justify-center border-0 bg-red-500 text-white hover:bg-red-600"
            title="Export to PDF"
            style={{ backgroundColor: '#dc2626', color: 'white', border: 'none' }}
          />
          <Button 
            icon={<FileExcelOutlined />} 
            onClick={exportToExcel}
            className="w-10 h-10 flex items-center justify-center border-0 bg-green-500 text-white hover:bg-green-600"
            title="Export to Excel"
            style={{ backgroundColor: '#16a34a', color: 'white', border: 'none' }}
          />
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-500 hover:bg-gray-50"
            title="Print"
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isRefreshing}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-blue-500"
            title="Refresh Data"
          />
          <Button
            icon={<UpOutlined />}
            onClick={handleScrollToTop}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-blue-500"
            title="Scroll to Top"
          />
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center mb-6">
        <Search
          placeholder="Search"
          className="max-w-sm"
          style={{ width: 280 }}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
          allowClear
        />
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden" key={refreshKey}>
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          rowKey="key"
          rowSelection={{
            selectedRowKeys,
            onSelectAll: handleSelectAll,
            onSelect: handleSelectRow,
            checkStrictly: false,
          }}
          className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-gray-200 [&_.ant-table-thead>tr>th]:font-medium [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-thead>tr>th]:py-4 [&_.ant-table-tbody>tr>td]:border-b [&_.ant-table-tbody>tr>td]:border-gray-100 [&_.ant-table-tbody>tr>td]:py-4 [&_.ant-table-tbody>tr:hover>td]:bg-gray-50 [&_.ant-checkbox-wrapper]:accent-purple-600"
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Row Per Page</span>
          <Select
            value={pageSize}
            onChange={(value) => setPageSize(value)}
            className="w-20 ml-2"
            size="small"
          >
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={30}>30</Option>
          </Select>
          <span className="ml-2">Entries</span>
        </div>

        <Pagination
          current={current}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          className="[&_.ant-pagination-item-active]:bg-purple-500 [&_.ant-pagination-item-active]:border-purple-500 [&_.ant-pagination-item-active>a]:text-white"
        />
      </div>
    </div>
  );
};

export default DeleteAccountRequest;
