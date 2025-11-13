import React from "react";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  BankOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  Button,
  Upload,
  Form,
  Input,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom"; // ✅ Added navigation import

const { Option } = Select;
const { TextArea } = Input;

const AddEmployee = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleSubmit = (values) => {
    console.log("Employee Data:", values);
  };

  const uploadProps = {
    beforeUpload: () => false,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Add Employee</h2>
          <p className="text-gray-500">Create new Employee</p>
        </div>
        <Button
          icon={<ArrowLeftOutlined />}
          className="bg-blue-900 text-white font-medium px-4 py-2 hover:bg-blue-800"
          onClick={() => navigate("/ims/hrm/employeelist")} // ✅ Fixed Back button path
        >
          Back to List
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        {/* Employee Information */}
        <Card
          title={
            <span className="font-semibold text-orange-600 flex items-center gap-2">
              <InfoCircleOutlined /> Employee Information
            </span>
          }
          className="shadow-sm"
        >
          <Row gutter={16}>
            <Col span={6} className="flex flex-col items-center">
              <Upload {...uploadProps} listType="picture-card">
                <div>
                  <UploadOutlined />
                  <div className="mt-2">Profile Photo</div>
                </div>
              </Upload>
              <Button className="bg-orange-100 border-orange-300 mt-2">
                Change Image
              </Button>
            </Col>

            <Col span={18}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: "Enter first name" }]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: "Enter last name" }]}
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Enter email" }]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Contact Number"
                    name="contact"
                    rules={[{ required: true, message: "Enter contact number" }]}
                  >
                    <Input placeholder="Contact Number" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Emp Code"
                    name="empCode"
                    rules={[{ required: true, message: "Enter employee code" }]}
                  >
                    <Input placeholder="Emp Code" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Date of Birth"
                    name="dob"
                    rules={[{ required: true, message: "Select DOB" }]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: "Select gender" }]}
                  >
                    <Select placeholder="Select">
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Nationality"
                    name="nationality"
                    rules={[{ required: true, message: "Select nationality" }]}
                  >
                    <Select placeholder="Select">
                      <Option value="Indian">Indian</Option>
                      <Option value="American">American</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Joining Date"
                    name="joiningDate"
                    rules={[{ required: true, message: "Select joining date" }]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Shift"
                    name="shift"
                    rules={[{ required: true, message: "Select shift" }]}
                  >
                    <Select placeholder="Select">
                      <Option value="Morning">Morning</Option>
                      <Option value="Evening">Evening</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Department"
                    name="department"
                    rules={[{ required: true, message: "Select department" }]}
                  >
                    <Select placeholder="Select">
                      <Option value="Sales">Sales</Option>
                      <Option value="Finance">Finance</Option>
                      <Option value="IT">IT</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Designation"
                    name="designation"
                    rules={[{ required: true, message: "Select designation" }]}
                  >
                    <Select placeholder="Select">
                      <Option value="Manager">Manager</Option>
                      <Option value="Engineer">Engineer</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Blood Group"
                    name="bloodGroup"
                    rules={[{ required: true, message: "Select blood group" }]}
                  >
                    <Select placeholder="Select">
                      <Option value="A+">A+</Option>
                      <Option value="B+">B+</Option>
                      <Option value="O+">O+</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="About" name="about">
                <TextArea
                  placeholder="Maximum 60 Characters"
                  rows={3}
                  maxLength={60}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Address Information */}
        <Card
          title={
            <span className="font-semibold text-orange-600 flex items-center gap-2">
              <HomeOutlined /> Address Information
            </span>
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Address" name="address">
                <Input placeholder="Address" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Country" name="country">
                <Select placeholder="Select">
                  <Option value="India">India</Option>
                  <Option value="USA">USA</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="State" name="state">
                <Select placeholder="Select">
                  <Option value="Tamil Nadu">Tamil Nadu</Option>
                  <Option value="Maharashtra">Maharashtra</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="City" name="city">
                <Select placeholder="Select">
                  <Option value="Chennai">Chennai</Option>
                  <Option value="Mumbai">Mumbai</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Zipcode" name="zipcode">
                <Input placeholder="Zipcode" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Emergency Information */}
        <Card
          title={
            <span className="font-semibold text-orange-600 flex items-center gap-2">
              ⚠️ Emergency Information
            </span>
          }
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Emergency Contact Number 1" name="emgContact1">
                <Input placeholder="Contact Number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Relation" name="relation1">
                <Input placeholder="Relation" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Name" name="name1">
                <Input placeholder="Name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Emergency Contact Number 2" name="emgContact2">
                <Input placeholder="Contact Number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Relation" name="relation2">
                <Input placeholder="Relation" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Name" name="name2">
                <Input placeholder="Name" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Bank Information */}
        <Card
          title={
            <span className="font-semibold text-orange-600 flex items-center gap-2">
              <BankOutlined /> Bank Information
            </span>
          }
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Bank Name" name="bankName">
                <Input placeholder="Bank Name" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Account Number" name="accountNumber">
                <Input placeholder="Account Number" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="IFSC" name="ifsc">
                <Input placeholder="IFSC" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Branch" name="branch">
                <Input placeholder="Branch" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Password */}
        <Card
          title={
            <span className="font-semibold text-orange-600 flex items-center gap-2">
              <LockOutlined /> Password
            </span>
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Password" name="password">
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Confirm Password" name="confirmPassword">
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <Button onClick={() => navigate("/ims/hrm/employeelist")}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-orange-500 border-none hover:bg-orange-600"
          >
            Add Employee
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddEmployee;
