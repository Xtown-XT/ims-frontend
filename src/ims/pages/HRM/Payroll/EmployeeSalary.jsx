import React, { useState } from "react";
import { Table, Button, Tag, Modal, Input, Select, message } from "antd";
import { 
  FilePdfOutlined, 
  FileExcelOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  DownloadOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import { Plus, AlertCircle } from "lucide-react";

const { confirm } = Modal;
const { Option } = Select;

const EmployeeSalary = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);

  const [formValues, setFormValues] = useState({
    name: "",
    role: "",
    email: "",
    salary: "",
  });

  const [salaryData, setSalaryData] = useState([
    {
      key: 1,
      id: "EMP001",
      name: "Carl Evans",
      role: "Designer",
      image: "/api/placeholder/40/40",
      email: "carlevans@example.com",
      salary: "$30,000",
      status: "Paid",
    },
    {
      key: 2,
      id: "EMP002",
      name: "Minerva Rameriz",
      role: "Administrator",
      image: "/api/placeholder/40/40",
      email: "rameriz@example.com",
      salary: "$20,000",
      status: "Paid",
    },
    {
      key: 3,
      id: "EMP003",
      name: "Robert Lamon",
      role: "Developer",
      image: "/api/placeholder/40/40",
      email: "robert@example.com",
      salary: "$35,000",
      status: "Paid",
    },
    {
      key: 4,
      id: "EMP004",
      name: "Patricia Lewis",
      role: "HR Manager",
      image: "/api/placeholder/40/40",
      email: "robert@example.com",
      salary: "$35,000",
      status: "Paid",
    },
    {
      key: 5,
      id: "EMP005",
      name: "Mark Joslyn",
      role: "Designer",
      image: "/api/placeholder/40/40",
      email: "markjoslyn@example.com",
      salary: "$32,000",
      status: "Paid",
    },
    {
      key: 6,
      id: "EMP006",
      name: "Marsha Betts",
      role: "Developer",
      image: "/api/placeholder/40/40",
      email: "marshabetts@example.com",
      salary: "$28,000",
      status: "Paid",
    },
    {
      key: 7,
      id: "EMP007",
      name: "Daniel Jude",
      role: "Administrator",
      image: "/api/placeholder/40/40",
      email: "daejude@example.com",
      salary: "$25,000",
      status: "Paid",
    },
    {
      key: 8,
      id: "EMP008",
      name: "Emma Bates",
      role: "HR Assistant",
      image: "/api/placeholder/40/40",
      email: "emmabates@example.com",
      salary: "$22,000",
      status: "Paid",
    },
  ]);

  // Filter data
  const filteredData = salaryData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Delete Confirmation
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this salary record?",
      icon: <AlertCircle color="#ff4d4f" />,
      content: `Employee: ${record.name}`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk() {
        setSalaryData(salaryData.filter((item) => item.key !== record.key));
        message.success("Salary record deleted successfully");
      },
    });
  };

  // Handle Input
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Add / Update Salary
  const handleAddSalary = () => {
    if (!formValues.name || !formValues.email || !formValues.salary) {
      message.warning("Please fill all required fields!");
      return;
    }

    if (editingRecord) {
      const updated = salaryData.map((item) =>
        item.key === editingRecord.key ? { ...item, ...formValues } : item
      );
      setSalaryData(updated);
      message.success("Salary updated successfully");
    } else {
      const newEntry = {
        key: Date.now(),
        id: `EMP${String(salaryData.length + 1).padStart(3, '0')}`,
        name: formValues.name,
        role: formValues.role,
        image: "/api/placeholder/40/40",
        email: formValues.email,
        salary: formValues.salary,
        status: "Paid",
      };
      setSalaryData([...salaryData, newEntry]);
      message.success("Salary added successfully");
    }

    setFormValues({ name: "", role: "", email: "", salary: "" });
    setEditingRecord(null);
    setShowForm(false);
  };

  // Edit Handler
  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormValues({
      name: record.name,
      role: record.role,
      email: record.email,
      salary: record.salary,
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
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
          <Button icon={<EyeOutlined />} type="text" style={{ color: "#6B7280" }} />
          <Button icon={<DownloadOutlined />} type="text" style={{ color: "#6B7280" }} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="text" style={{ color: "#6B7280" }} />
          <Button icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)} type="text" style={{ color: "#6B7280" }} />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Employee Salary</h2>
          <p className="text-sm text-gray-500">Manage your employee salaries</p>
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
            icon={<PrinterOutlined />}
            style={{ borderRadius: "8px" }}
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
            <Plus size={14} /> Add Payroll
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
              placeholder="Select Status"
              style={{ width: 150 }}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              allowClear
            >
              <Option value="Paid">Paid</Option>
              <Option value="Pending">Pending</Option>
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
                {editingRecord ? "Edit Salary" : "Add Payroll"}
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
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  placeholder="Enter employee name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formValues.role}
                  onChange={handleInputChange}
                  placeholder="Enter role"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formValues.salary}
                  onChange={handleInputChange}
                  placeholder="$00,000"
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
                onClick={handleAddSalary}
                className="px-5 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                {editingRecord ? "Update Salary" : "Add Payroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalary;
