import { useState } from "react";
import { Table, Button, Tag, Modal, Input, Select, message, Radio } from "antd";
import { 
  FilePdfOutlined, 
  FileExcelOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  DownloadOutlined,
  PrinterOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import { Plus, AlertCircle } from "lucide-react";

const { confirm } = Modal;
const { Option } = Select;

const EmployeeSalary = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [formValues, setFormValues] = useState({
    employee: "",
    basicSalary: "",
    status: "Paid",
    hraAllowance: "",
    conveyance: "",
    medicalAllowance: "",
    bonus: "",
    allowanceOthers: "",
    pf: "",
    professionalTax: "",
    tds: "",
    loansOthers: "",
    deductionOthers: "",
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

  // Calculate totals
  const calculateTotals = () => {
    const totalAllowance = 
      (parseFloat(formValues.hraAllowance) || 0) +
      (parseFloat(formValues.conveyance) || 0) +
      (parseFloat(formValues.medicalAllowance) || 0) +
      (parseFloat(formValues.bonus) || 0) +
      (parseFloat(formValues.allowanceOthers) || 0);

    const totalDeduction = 
      (parseFloat(formValues.pf) || 0) +
      (parseFloat(formValues.professionalTax) || 0) +
      (parseFloat(formValues.tds) || 0) +
      (parseFloat(formValues.loansOthers) || 0) +
      (parseFloat(formValues.deductionOthers) || 0);

    const basicSalary = parseFloat(formValues.basicSalary) || 0;
    const netSalary = basicSalary + totalAllowance - totalDeduction;

    return { totalAllowance, totalDeduction, netSalary };
  };

  // Add / Update Salary
  const handleAddSalary = () => {
    if (!formValues.employee || !formValues.basicSalary) {
      message.warning("Please fill all required fields!");
      return;
    }

    const { netSalary } = calculateTotals();

    if (editingRecord) {
      const updated = salaryData.map((item) =>
        item.key === editingRecord.key ? { 
          ...item, 
          name: formValues.employee,
          salary: `$${netSalary.toFixed(2)}`,
          status: formValues.status
        } : item
      );
      setSalaryData(updated);
      message.success("Salary updated successfully");
    } else {
      const newEntry = {
        key: Date.now(),
        id: `EMP${String(salaryData.length + 1).padStart(3, '0')}`,
        name: formValues.employee,
        role: "Employee",
        image: "/api/placeholder/40/40",
        email: "employee@example.com",
        salary: `$${netSalary.toFixed(2)}`,
        status: formValues.status,
      };
      setSalaryData([...salaryData, newEntry]);
      message.success("Salary added successfully");
    }

    setFormValues({ 
      employee: "",
      basicSalary: "",
      status: "Paid",
      hraAllowance: "",
      conveyance: "",
      medicalAllowance: "",
      bonus: "",
      allowanceOthers: "",
      pf: "",
      professionalTax: "",
      tds: "",
      loansOthers: "",
      deductionOthers: "",
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  // Edit Handler
  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormValues({
      employee: record.name,
      basicSalary: "",
      status: record.status,
      hraAllowance: "",
      conveyance: "",
      medicalAllowance: "",
      bonus: "",
      allowanceOthers: "",
      pf: "",
      professionalTax: "",
      tds: "",
      loansOthers: "",
      deductionOthers: "",
    });
    setShowForm(true);
  };

  // Refresh Handler
  const handleRefresh = () => {
    setSearchText("");
    setFilterStatus(null);
    setSelectedRowKeys([]);
    message.info("Refreshed!");
  };

  // Export to PDF
  const handleExportPDF = () => {
    message.success("Exporting to PDF...");
    // Add your PDF export logic here
  };

  // Export to Excel
  const handleExportExcel = () => {
    message.success("Exporting to Excel...");
    // Add your Excel export logic here
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
    message.info("Opening print dialog...");
  };

  // View Handler
  const handleView = (record) => {
    message.info(`Viewing details for ${record.name}`);
    // Add your view logic here
  };

  // Download Handler
  const handleDownload = (record) => {
    message.success(`Downloading salary slip for ${record.name}`);
    // Add your download logic here
  };

  // Checkbox selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
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
        <Tag 
          style={{ 
            borderRadius: "6px", 
            padding: "2px 12px",
            backgroundColor: "#3EB780",
            color: "white",
            border: "none"
          }}
        >
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
          <Button 
            icon={<EyeOutlined />} 
            type="text" 
            style={{ color: "#6B7280" }} 
            onClick={() => handleView(record)}
            title="View"
          />
          <Button 
            icon={<DownloadOutlined />} 
            type="text" 
            style={{ color: "#6B7280" }} 
            onClick={() => handleDownload(record)}
            title="Download"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
            type="text" 
            style={{ color: "#6B7280" }}
            title="Edit"
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => showDeleteConfirm(record)} 
            type="text" 
            style={{ color: "#6B7280" }}
            title="Delete"
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
          <h2 className="text-xl font-semibold text-gray-800">Employee Salary</h2>
          <p className="text-sm text-gray-500">Manage your employee salaries</p>
        </div>
        <div className="flex gap-2">
          <Button
            icon={<FilePdfOutlined />}
            onClick={handleExportPDF}
            style={{
              background: "#DC2626",
              color: "white",
              borderColor: "#DC2626",
              borderRadius: "8px",
            }}
            title="Export to PDF"
          />
          <Button
            icon={<FileExcelOutlined />}
            onClick={handleExportExcel}
            style={{
              background: "#16A34A",
              color: "white",
              borderColor: "#16A34A",
              borderRadius: "8px",
            }}
            title="Export to Excel"
          />
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            style={{ borderRadius: "8px" }}
            title="Print"
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            style={{ borderRadius: "8px" }}
            title="Refresh"
          />
          <button
            className="flex items-center gap-1 bg-purple-500 text-white px-3 py-1.5 rounded-lg hover:bg-purple-600 transition text-sm"
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
              <Option value="Unpaid">Unpaid</Option>
            </Select>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowSelection={rowSelection}
          pagination={{ pageSize: 10 }}
          rowClassName={() => "hover:bg-gray-50"}
          style={{ border: "1px solid #e5e7eb" }}
        />
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col relative shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
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

            <div className="space-y-5 overflow-y-auto px-5 py-4 flex-1">
              {/* Select Employee */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Select Employee <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Select"
                  className="w-full"
                  value={formValues.employee || undefined}
                  onChange={(value) => setFormValues({ ...formValues, employee: value })}
                >
                  <Option value="Carl Evans">Carl Evans</Option>
                  <Option value="Minerva Rameriz">Minerva Rameriz</Option>
                  <Option value="Robert Lamon">Robert Lamon</Option>
                  <Option value="Patricia Lewis">Patricia Lewis</Option>
                  <Option value="Mark Joslyn">Mark Joslyn</Option>
                </Select>
              </div>

              {/* Salary Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Salary Information</h4>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Basic Salary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="basicSalary"
                    value={formValues.basicSalary}
                    onChange={handleInputChange}
                    placeholder="Enter basic salary"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Status</label>
                <Radio.Group
                  value={formValues.status}
                  onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                >
                  <Radio value="Paid">Paid</Radio>
                  <Radio value="Unpaid">Unpaid</Radio>
                </Radio.Group>
              </div>

              {/* Allowances */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Allowances</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      HRA Allowance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="hraAllowance"
                      value={formValues.hraAllowance}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Conveyance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="conveyance"
                      value={formValues.conveyance}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Medical Allowance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="medicalAllowance"
                      value={formValues.medicalAllowance}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Bonus <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="bonus"
                      value={formValues.bonus}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </div>

              {/* Others (Allowances) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-700">Others</label>
                  <button className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-white hover:opacity-90">
                    <PlusCircleOutlined style={{ fontSize: '14px' }} />
                  </button>
                </div>
                <input
                  type="number"
                  name="allowanceOthers"
                  value={formValues.allowanceOthers}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Deductions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Deductions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      PF <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="pf"
                      value={formValues.pf}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Professional Tax <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="professionalTax"
                      value={formValues.professionalTax}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      TDS <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="tds"
                      value={formValues.tds}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Loans & Others <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="loansOthers"
                      value={formValues.loansOthers}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </div>

              {/* Others (Deductions) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-700">Others</label>
                  <button className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-white hover:opacity-90">
                    <PlusCircleOutlined style={{ fontSize: '14px' }} />
                  </button>
                </div>
                <input
                  type="number"
                  name="deductionOthers"
                  value={formValues.deductionOthers}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Total Allowance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={calculateTotals().totalAllowance.toFixed(2)}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Total Deduction <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={calculateTotals().totalDeduction.toFixed(2)}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Net Salary <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={calculateTotals().netSalary.toFixed(2)}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-3 border-t border-gray-200 bg-white">
              <button
                className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-600 transition text-sm"
              >
                Preview
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-md bg-gray-500 text-white hover:opacity-95 transition text-sm"
              >
                Reset
              </button>
              <button
                onClick={handleAddSalary}
                className="px-5 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalary;
