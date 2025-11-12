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
import {
  Button,
  Dropdown,
  Menu,
  Modal,
  Input,
  Select,
  Switch,
  Form,
  message,
} from "antd";

const { TextArea } = Input;

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const departments = [
    {
      name: "Inventory",
      manager: "Mitchum Daniel",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      members: 8,
    },
    {
      name: "Human Resources",
      manager: "Susan Lopez",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      members: 10,
    },
    {
      name: "Admin",
      manager: "Robert Grossman",
      image: "https://randomuser.me/api/portraits/men/33.jpg",
      members: 5,
    },
    {
      name: "Sales",
      manager: "Janet Hembre",
      image: "https://randomuser.me/api/portraits/women/21.jpg",
      members: 10,
    },
    {
      name: "Marketing",
      manager: "Russell Belle",
      image: "https://randomuser.me/api/portraits/women/47.jpg",
      members: 6,
    },
    {
      name: "Quality Assurance",
      manager: "Edward Muniz",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      members: 6,
    },
    {
      name: "Finance",
      manager: "Susan Moore",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      members: 8,
    },
    {
      name: "Maintenance",
      manager: "Lance Jackson",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
      members: 7,
    },
    {
      name: "R&D",
      manager: "Travis Marcotte",
      image: "https://randomuser.me/api/portraits/men/19.jpg",
      members: 10,
    },
    {
      name: "Content Creation",
      manager: "Malinda Ruiz",
      image: "https://randomuser.me/api/portraits/women/18.jpg",
      members: 8,
    },
    {
      name: "Social Media",
      manager: "David Slater",
      image: "https://randomuser.me/api/portraits/men/27.jpg",
      members: 6,
    },
    {
      name: "IT Support",
      manager: "Michele Kim",
      image: "https://randomuser.me/api/portraits/women/37.jpg",
      members: 4,
    },
  ];

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menu = (
    <Menu>
      <Menu.Item key="1">Edit</Menu.Item>
      <Menu.Item key="2">View</Menu.Item>
      <Menu.Item key="3">Delete</Menu.Item>
    </Menu>
  );

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Department Added:", values);
        message.success("Department added successfully!");
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(() => {
        message.error("Please fill all required fields!");
      });
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Departments</h2>
        <p className="text-gray-500">Manage your departments</p>
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
          onClick={showModal}
        >
          Add Department
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
          <Button> Select Status </Button>
          <Button> Sort By : Last 7 Days </Button>
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDepartments.map((dept, index) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-2xl border hover:shadow-md transition p-4 relative"
          >
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <Button
                shape="circle"
                icon={<MoreOutlined />}
                className="absolute top-3 right-3"
              />
            </Dropdown>

            {/* Department Header */}
            <div className="flex items-center mb-4 mt-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
              <h3 className="text-lg font-semibold text-gray-800">
                {dept.name}
              </h3>
            </div>

            {/* Manager Info */}
            <div className="flex flex-col items-center text-center mb-3">
              <img
                src={dept.image}
                alt={dept.manager}
                className="w-16 h-16 rounded-md mb-2 object-cover"
              />
              <h4 className="text-gray-800 font-medium">{dept.manager}</h4>
            </div>

            {/* Footer - Total Members */}
            <div className="flex justify-between items-center border-t pt-3 mt-3 text-sm text-gray-600">
              <p>Total Members: {dept.members.toString().padStart(2, "0")}</p>
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
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      <Modal
        title="Add Department"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please enter department name" }]}
          >
            <Input placeholder="Enter department name" />
          </Form.Item>

          <Form.Item
            label="HOD"
            name="hod"
            rules={[{ required: true, message: "Please select HOD" }]}
          >
            <Select placeholder="Choose Type">
              <Select.Option value="Mitchum Daniel">Mitchum Daniel</Select.Option>
              <Select.Option value="Susan Lopez">Susan Lopez</Select.Option>
              <Select.Option value="Robert Grossman">Robert Grossman</Select.Option>
              <Select.Option value="Janet Hembre">Janet Hembre</Select.Option>
              <Select.Option value="Russell Belle">Russell Belle</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Enter description" />
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
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Departments;
