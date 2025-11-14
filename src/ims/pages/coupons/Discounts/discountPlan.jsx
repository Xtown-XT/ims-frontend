import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Form,
  DatePicker,
  Switch,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const DiscountPlan = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [checked, setChecked] = useState(true);
  const [shortByFilter, setShortByFilter] = useState("Customers");

  const [status, setStatus] = useState(true);
  // form instance
  const [form] = Form.useForm();

  // isEdit flag + editing record key
  const [isEdit, setIsEdit] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  const [formData, setFormData] = useState([
    {
      key: 1,
      planname: "Big Saver Deal",
      customers: "kiran",
      status: "Active",
    },
    {
      key: 2,
      planname: "Big Saver Deal",
      customers: "vijay",
      status: "Active",
    },

  ]);

  const openAddForm = () => {
    setIsEdit(false);
    setEditingKey(null);
    form.resetFields();
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setIsEdit(true);
    setEditingKey(record.key);
    // populate form fields (convert date strings to dayjs if present)
    const initial = {
      name: record.name,
      code: record.code,
      type: record.type,
      discount: record.discount,
      limit: record.limit,
      description: record.description,
      status: record.status === "Active",
      product: record.product || undefined,
      startDate: record.startDate ? dayjs(record.startDate, "DD/MM/YYYY") : null,
      endDate: record.endDate ? dayjs(record.endDate, "DD/MM/YYYY") : null,
    };
    form.setFieldsValue(initial);
    setShowForm(true);
  };

  const handleAddCoupons = (values) => {
    // values.startDate and endDate are dayjs objects; convert to string format DD/MM/YYYY
    const startDateStr = values.startDate ? values.startDate.format("DD/MM/YYYY") : "";
    const endDateStr = values.endDate ? values.endDate.format("DD/MM/YYYY") : "";

    if (isEdit && editingKey != null) {
      // update existing item
      setFormData((prev) =>
        prev.map((item) =>
          item.key === editingKey
            ? {
              ...item,
              name: values.name,
              code: values.code,
              type: values.type,
              discount: values.discount,
              limit: values.limit,
              description: values.description || "",
              startDate: startDateStr,
              endDate: endDateStr,
              valid: endDateStr, // maintain your existing 'valid' field logic
              status: values.status ? "Active" : "Inactive",
              product: values.product,
            }
            : item
        )
      );
      message.success("Coupon updated successfully");
    } else {
      // add new item
      const newKey = formData.length ? Math.max(...formData.map((i) => i.key)) + 1 : 1;
      const newItem = {
        key: newKey,
        name: values.name,
        code: values.code,
        type: values.type,
        discount: values.discount,
        limit: values.limit,
        description: values.description || "",
        startDate: startDateStr,
        endDate: endDateStr,
        valid: endDateStr,
        status: values.status ? "Active" : "Inactive",
        product: values.product,
      };
      setFormData((prev) => [newItem, ...prev]);
      message.success("Coupon added successfully");
    }

    // close modal & reset
    setShowForm(false);
    form.resetFields();
    setIsEdit(false);
    setEditingKey(null);
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: "Are you sure you want to delete this coupon?",
      onOk: () => {
        setFormData((prev) => prev.filter((i) => i.key !== key));
        message.success("Coupon deleted");
      },
    });
  };

  // 🔍 SEARCH FUNCTIONALITY — filters coupons by name, code, or description
  const filteredData = useMemo(() => {
    return formData.filter((item) => {
      const matchesSearch =
        item.planname.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customers.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = filterStatus ? item.status === filterStatus : true;
      const matchesType = filterType ? item.type === filterType : true;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [formData, searchText, filterStatus, filterType]);

  const columns = [
    {
      title: <input type="checkbox" />,
      dataIndex: "checkbox",
      render: () => <input type="checkbox" />,
      width: 50,
    },
    { title: "Plan Name", dataIndex: "planname", key: "planname" },
    { title: "Customers", dataIndex: "customers", key: "customers" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      status: status === true ? "Active" : "InActive",
      render: (status) => (
        <button
          style={{
            backgroundColor:
              status.toLowerCase() === "active" ? "#71D98D" : "#FF9999",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            height: "22px",
            width: "70px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "default",
          }}
        >
          {status}
        </button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => openEditForm(record)} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Discount Plan</h2>
          <p className="text-sm text-gray-500">Manage your discount plan</p>
        </div>
        <div>
          <Button
            type="primary"
            onClick={openAddForm}
            style={{
              background: "#9333ea",
              borderColor: "#9333ea",
              height: "38px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <PlusCircleOutlined style={{ color: "#fff" }} />
              <span>Add Discount Plan</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div>
        <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="flex gap-3">
            <Form.Item>
              <Select
                placeholder="Customers"
                style={{ width: 150 }}
                value={shortByFilter}
                onChange={(val) => setShortByFilter(val)}
              >

                <Option value="kiran">kiran</Option>
                <Option value="vijay">vijay</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Select
                placeholder="Status"
                style={{ width: 150 }}
                value={filterStatus}
                onChange={(val) => setFilterStatus(val)}
                allowClear
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>

          </div>
        </Form>
      </div>

      {/* Table */}
      {/* <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        className="bg-white"
        bordered={false}
     
      /> */}

      <Table
        columns={columns}
        dataSource={filteredData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        pagination={false}
        rowKey="name"
      />

      {/* Add/Edit Coupon Modal */}
      <Modal
        title={isEdit ? "Edit Discount plan" : "Add Discount Plan"}
        open={showForm}
        onCancel={() => {
          setShowForm(false);
          form.resetFields();
          setIsEdit(false);
          setEditingKey(null);
        }}
        footer={null}
        centered
        width={500}
      >
        <Form layout="vertical" form={form} onFinish={handleAddCoupons}>
          <div className="grid grid-cols-1 gap-4">
            <Form.Item
              label="Plan Name"
              name="planname"
              rules={[{ required: true, message: "Please enter plan name" }]}
            >
              <Input placeholder="Enter plan Name" />
            </Form.Item>
            <Form.Item
              label={
                <div className="flex justify-between items-center">
                  <span>Customer</span>
                  <span className="text-purple-500 text-sm cursor-pointer">
                    + Add New
                  </span>
                </div>
              }
              name="customer *"
              rules={[{ required: true, message: "Please select a customer" }]}
            >
              <Select placeholder="Select Customer">
                <Option value="Carl Evans">Carl Evans</Option>
                <Option value="Minerva Rameriz">Minerva Rameriz</Option>
                <Option value="Robert Lamon">Robert Lamon</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </span>
            <Form.Item name="status" valuePropName="checked" noStyle>
              <Switch
                size="small"
                checked={checked}
                onChange={(ch) => {
                  onChange(ch);
                }}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => {
                setShowForm(false);
                form.resetFields();
                setIsEdit(false);
                setEditingKey(null);
              }}
              style={{
                background: "#0c254a",
                color: "white",
                border: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                background: "#9333ea",
                borderColor: "#9333ea",
              }}
            >
              {isEdit ? "Update Discount Plan" : "Add Discount Plan"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscountPlan;
