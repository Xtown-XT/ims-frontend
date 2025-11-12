import React, { useState } from "react";
import {
  SearchOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
} from "antd";

const Designation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const designations = [
    {
      name: "Sales Manager",
      department: "Sales",
      members: 7,
      date: "24 Dec 2024",
      status: "Active",
    },
    {
      name: "Inventory Manager",
      department: "Inventory",
      members: 10,
      date: "10 Dec 2024",
      status: "Active",
    },
    {
      name: "Accountant",
      department: "Finance",
      members: 5,
      date: "27 Nov 2024",
      status: "Active",
    },
    {
      name: "System Administrator",
      department: "Admin",
      members: 10,
      date: "18 Nov 2024",
      status: "Active",
    },
    {
      name: "HR Manager",
      department: "Human Resources",
      members: 6,
      date: "06 Nov 2024",
      status: "Active",
    },
    {
      name: "Marketing Manager",
      department: "Marketing",
      members: 12,
      date: "25 Oct 2024",
      status: "Active",
    },
    {
      name: "QA Analyst",
      department: "Quality Assurance",
      members: 8,
      date: "14 Oct 2024",
      status: "Active",
    },
    {
      name: "Research Analyst",
      department: "R&D",
      members: 7,
      date: "03 Oct 2024",
      status: "Active",
    },
    {
      name: "Support Engineer",
      department: "IT Support",
      members: 10,
      date: "20 Sep 2024",
      status: "Active",
    },
    {
      name: "Content Writer",
      department: "Content Creation",
      members: 8,
      date: "10 Sep 2024",
      status: "Inactive",
    },
  ];

  const filteredData = designations.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusTag = (status) => {
    return status === "Active" ? (
      <Tag color="green" className="rounded-md px-3 py-1 text-white">
        ● Active
      </Tag>
    ) : (
      <Tag color="red" className="rounded-md px-3 py-1 text-white">
        ● Inactive
      </Tag>
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("New Designation Added:", values);
        message.success("Designation added successfully!");
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(() => {
        message.error("Please fill all required fields!");
      });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Designation</h2>
        <p className="text-gray-500">Manage your designation</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button icon={<FilePdfOutlined />} />
          <Button icon={<FileExcelOutlined />} />
          <Button icon={<ReloadOutlined />} />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-orange-500 border-none hover:bg-orange-600"
          onClick={showModal}
        >
          Add Designation
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
          <Button>Department</Button>
          <Button>Select Status</Button>
          <Button>Sort By : Last 7 Days</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-sm rounded-xl border">
        <table className="min-w-full table-auto text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-gray-600 text-sm font-semibold w-10">
                <input type="checkbox" />
              </th>
              <th className="p-3 text-gray-600 text-sm font-semibold">
                Designation
              </th>
              <th className="p-3 text-gray-600 text-sm font-semibold">
                Department
              </th>
              <th className="p-3 text-gray-600 text-sm font-semibold">
                Members
              </th>
              <th className="p-3 text-gray-600 text-sm font-semibold">
                Total Members
              </th>
              <th className="p-3 text-gray-600 text-sm font-semibold">
                Created On
              </th>
              <th className="p-3 text-gray-600 text-sm font-semibold">
                Status
              </th>
              <th className="p-3 text-gray-600 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="p-3 text-center">
                  <input type="checkbox" />
                </td>
                <td className="p-3 text-gray-800 font-medium">{item.name}</td>
                <td className="p-3 text-gray-700">{item.department}</td>
                <td className="p-3">
                  <div className="flex items-center -space-x-2">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="member"
                      className="w-6 h-6 rounded-full border-2 border-white"
                    />
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="member"
                      className="w-6 h-6 rounded-full border-2 border-white"
                    />
                    <img
                      src="https://randomuser.me/api/portraits/men/65.jpg"
                      alt="member"
                      className="w-6 h-6 rounded-full border-2 border-white"
                    />
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center border-2 border-white">
                      +2
                    </div>
                  </div>
                </td>
                <td className="p-3 text-gray-700 text-center">
                  {item.members.toString().padStart(2, "0")}
                </td>
                <td className="p-3 text-gray-700">{item.date}</td>
                <td className="p-3">{renderStatusTag(item.status)}</td>
                <td className="p-3 flex space-x-2">
                  <Button
                    icon={<EditOutlined />}
                    className="border-none text-blue-500 hover:text-blue-700"
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    className="border-none text-red-500 hover:text-red-700"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center text-gray-600 text-sm mt-4">
        <div className="flex items-center space-x-2">
          <span>Row Per Page</span>
          <select className="border rounded-md px-2 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div>Entries</div>
      </div>

      {/* Add Designation Modal */}
      <Modal
        title="Add Designation"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Designation"
            name="designation"
            rules={[{ required: true, message: "Please enter designation name" }]}
          >
            <Input placeholder="Enter designation name" />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select department" }]}
          >
            <Select placeholder="Select Department">
              <Select.Option value="Sales">Sales</Select.Option>
              <Select.Option value="Inventory">Inventory</Select.Option>
              <Select.Option value="Finance">Finance</Select.Option>
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="Marketing">Marketing</Select.Option>
              <Select.Option value="Quality Assurance">Quality Assurance</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-700">Status</label>
            <Form.Item name="status" valuePropName="checked" noStyle>
              <Switch defaultChecked />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              className="bg-orange-500 border-none hover:bg-orange-600"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Designation;
