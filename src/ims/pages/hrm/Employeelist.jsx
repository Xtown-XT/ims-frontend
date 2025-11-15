import React, { useState } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Button,
  Tag,
  Dropdown,
  Menu,
  Pagination,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const employees = [
    {
      id: "EMP001",
      name: "Carl Evans",
      email: "carlevans@example.com",
      phone: "+12163547758",
      designation: "Designer",
      shift: "Regular",
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "EMP002",
      name: "Minerva Rameriz",
      email: "rameriz@example.com",
      phone: "+11367529510",
      designation: "Administrator",
      shift: "Regular",
      status: "Active",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: "EMP003",
      name: "Robert Lamon",
      email: "robert@example.com",
      phone: "+15362789414",
      designation: "Developer",
      shift: "Regular",
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: "EMP004",
      name: "Patricia Lewis",
      email: "patricia@example.com",
      phone: "+18513094627",
      designation: "HR Manager",
      shift: "Night Shift",
      status: "Active",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: "EMP005",
      name: "Mark Joslyn",
      email: "markjoslyn@example.com",
      phone: "+14678219025",
      designation: "Designer",
      shift: "Mid Shift",
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      id: "EMP006",
      name: "Marsha Betts",
      email: "marshabetts@example.com",
      phone: "+10913278319",
      designation: "Developer",
      shift: "Mid Shift",
      status: "Active",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    {
      id: "EMP007",
      name: "Daniel Jude",
      email: "daieljude@example.com",
      phone: "+19125852947",
      designation: "Administrator",
      shift: "Regular",
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
      id: "EMP008",
      name: "Emma Bates",
      email: "emmabates@example.com",
      phone: "+13671835209",
      designation: "HR Assistant",
      shift: "Regular",
      status: "Active",
      image: "https://randomuser.me/api/portraits/women/8.jpg",
    },
    {
      id: "EMP009",
      name: "Richard Fralick",
      email: "richard@example.com",
      phone: "+19756194733",
      designation: "Designer",
      shift: "Regular",
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/9.jpg",
    },
    {
      id: "EMP010",
      name: "Michelle Robison",
      email: "robinson@example.com",
      phone: "+19167850925",
      designation: "HR Manager",
      shift: "Regular",
      status: "Inactive",
      image: "https://randomuser.me/api/portraits/women/10.jpg",
    },
  ];

  const filteredData = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Employee",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.image}
            alt={text}
            className="w-8 h-8 rounded-full border"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Shift",
      dataIndex: "shift",
      key: "shift",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EyeOutlined />} />
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />}  />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
          <p className="text-gray-500">Manage your employees</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-orange-500 border-none hover:bg-orange-600"
          onClick={() => navigate("/ims/hrm/addemployee")}
        >
          Add Employee
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-600 text-white p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Total Employee</p>
            <h3 className="text-2xl font-semibold">1007</h3>
          </div>
          <span className="text-3xl">👥</span>
        </div>
        <div className="bg-teal-600 text-white p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Active</p>
            <h3 className="text-2xl font-semibold">1007</h3>
          </div>
          <span className="text-3xl">✅</span>
        </div>
        <div className="bg-blue-900 text-white p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Inactive</p>
            <h3 className="text-2xl font-semibold">1007</h3>
          </div>
          <span className="text-3xl">🚫</span>
        </div>
        <div className="bg-blue-600 text-white p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">New Joiners</p>
            <h3 className="text-2xl font-semibold">67</h3>
          </div>
          <span className="text-3xl">🧑‍💻</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search"
          className="w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-3">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">Select Employees</Menu.Item>
                <Menu.Item key="2">All Employees</Menu.Item>
              </Menu>
            }
          >
            <Button>Select Employees</Button>
          </Dropdown>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">Designation</Menu.Item>
                <Menu.Item key="2">Department</Menu.Item>
              </Menu>
            }
          >
            <Button>Designation</Button>
          </Dropdown>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          pagination={false}
          rowKey="id"
          className="custom-table"
        />

        {/* Custom Footer (Row Per Page Dropdown + Pagination) */}
        <div className="flex justify-between items-center mt-4 px-2 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <span>Row Per Page</span>
            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              size="small"
              style={{ width: 70 }}
            >
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span>Entries</span>
          </div>

          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
