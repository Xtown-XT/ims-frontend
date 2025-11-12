import React, { useState } from "react";
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  PlusOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useNavigate } from "react-router-dom"; // ✅ Added import

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigation

  const employees = [
    {
      id: "POS001",
      name: "Anthony Lewis",
      designation: "System Admin",
      department: "HR",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "POS002",
      name: "Brian Villalobos",
      designation: "Software Developer",
      department: "UI/UX",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: "POS003",
      name: "Harvey Smith",
      designation: "System Admin",
      department: "Admin",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    {
      id: "POS004",
      name: "Stephan Peralt",
      designation: "System Admin",
      department: "Admin",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/women/21.jpg",
    },
    {
      id: "POS005",
      name: "Doglas Martini",
      designation: "System Admin",
      department: "IT",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      id: "POS006",
      name: "Linda Ray",
      designation: "System Admin",
      department: "Support",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/women/15.jpg",
    },
    {
      id: "POS007",
      name: "Elliot Murray",
      designation: "System Admin",
      department: "UI/UX",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/men/17.jpg",
    },
    {
      id: "POS008",
      name: "Rebecca Smith",
      designation: "System Admin",
      department: "HR",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/women/20.jpg",
    },
    {
      id: "POS009",
      name: "Connie Waters",
      designation: "System Admin",
      department: "Admin",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/men/34.jpg",
    },
    {
      id: "POS010",
      name: "Lori Broaddus",
      designation: "System Admin",
      department: "React JS",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/women/10.jpg",
    },
    {
      id: "POS011",
      name: "Trent Frazier",
      designation: "System Admin",
      department: "Support",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/men/49.jpg",
    },
    {
      id: "POS012",
      name: "Norene Valle",
      designation: "System Admin",
      department: "Admin",
      joined: "30 May 2023",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
  ];

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Updated Dropdown items for Ant Design v5
  const menuItems = [
    { key: "1", label: "Edit" },
    { key: "2", label: "View" },
    { key: "3", label: "Delete" },
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
        <p className="text-gray-500">Manage your employees</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-600 text-white p-4 rounded-xl shadow flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Total Employee</p>
            <h3 className="text-2xl font-semibold">1007</h3>
          </div>
          <span className="text-3xl">👥</span>
        </div>
        <div className="bg-teal-600 text-white p-4 rounded-xl shadow flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Active</p>
            <h3 className="text-2xl font-semibold">1007</h3>
          </div>
          <span className="text-3xl">✅</span>
        </div>
        <div className="bg-blue-950 text-white p-4 rounded-xl shadow flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Inactive</p>
            <h3 className="text-2xl font-semibold">1007</h3>
          </div>
          <span className="text-3xl">🚫</span>
        </div>
        <div className="bg-blue-600 text-white p-4 rounded-xl shadow flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">New Joiners</p>
            <h3 className="text-2xl font-semibold">67</h3>
          </div>
          <span className="text-3xl">🧑‍💻</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button icon={<UnorderedListOutlined />} />
          <Button icon={<AppstoreOutlined />} />
          <Button icon={<FilePdfOutlined />} />
          <Button icon={<FileExcelOutlined />} />
          <Button icon={<ReloadOutlined />} />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-orange-500 border-none hover:bg-orange-600"
          onClick={() => navigate("/ims/hrm/addemployee")} // ✅ Correct path fixed
        >
          Add Employee
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex items-center bg-white border rounded-lg px-3 py-1 w-full md:w-1/3 shadow-sm">
          <SearchOutlined className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="outline-none w-full text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-3 mt-3 md:mt-0">
          <Button> Select Employees </Button>
          <Button> Designation </Button>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white shadow-sm rounded-2xl border hover:shadow-md transition p-4 relative"
          >
            <input type="checkbox" className="absolute top-3 left-3" />

            {/* ✅ Updated Dropdown syntax for AntD v5 */}
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
              <Button
                shape="circle"
                icon={<MoreOutlined />}
                className="absolute top-3 right-3"
              />
            </Dropdown>

            <div className="flex flex-col items-center text-center mt-6">
              <img
                src={emp.image}
                alt={emp.name}
                className="w-20 h-20 rounded-full border mb-3"
              />
              <p className="text-orange-500 text-sm font-medium mb-1">
                EMP ID : {emp.id}
              </p>
              <h3 className="text-lg font-semibold text-gray-800">
                {emp.name}
              </h3>
              <p className="bg-gray-100 text-gray-700 text-xs mt-1 px-3 py-1 rounded-lg">
                {emp.designation}
              </p>

              <div className="bg-gray-50 w-full mt-4 rounded-xl p-3 flex justify-between text-sm text-gray-700">
                <div>
                  <p className="font-medium">Joined</p>
                  <p>{emp.joined}</p>
                </div>
                <div>
                  <p className="font-medium">Department</p>
                  <p>{emp.department}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
