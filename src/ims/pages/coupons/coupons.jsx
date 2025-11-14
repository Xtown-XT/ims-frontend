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

const Coupons = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [shortByFilter, setShortByFilter] = useState("recentlyadded");

  // form instance
  const [form] = Form.useForm();

  // isEdit flag + editing record key
  const [isEdit, setIsEdit] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  const [formData, setFormData] = useState([
    {
      key: 1,
      name: "Big Saver Deal",
      code: "SAVE50",
      description: "$50 off orders over $300",
      type: "Fixed Amount",
      discount: "$50",
      limit: "03",
      startDate: "01/10/2024",
      endDate: "03/10/2024",
      valid: "03 Oct 2024",
      status: "Active",
    },
    {
      key: 2,
      name: "Winter Offer",
      code: "WINTER30",
      description: "30% off all items",
      type: "Percentage",
      discount: "30%",
      limit: "05",
      startDate: "01/11/2024",
      endDate: "12/11/2024",
      valid: "12 Nov 2024",
      status: "Active",
    },
    {
      key: 3,
      name: "Festive Bonanza",
      code: "FEST50",
      description: "50% off on electronics",
      type: "Percentage",
      discount: "50%",
      limit: "10",
      startDate: "10/12/2024",
      endDate: "25/12/2024",
      valid: "25 Dec 2024",
      status: "Inactive",
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
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());

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
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <span
          style={{
            background: "#EBE5FF",
            color: "#6938EF",
            borderRadius: "5px",
            padding: "4px 12px",
            fontSize: "11px",
            fontWeight: "400",
          }}
        >
          {text?.toUpperCase?.()}
        </span>
      ),
    },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Discount", dataIndex: "discount", key: "discount" },
    { title: "Limit", dataIndex: "limit", key: "limit" },
    { title: "Valid", dataIndex: "valid", key: "valid" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            background: status?.toLowerCase() === "active" ? "#3EB780" : "#d63031",
            color: "white",
            borderRadius: "5px",
            padding: "2px 5px",
          }}
        >
          {status}
        </span>
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
    <div className="bg-gray-50  min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Coupons</h2>
          <p className="text-sm text-gray-500">Manage your Coupons</p>
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
              <span>Add Coupon</span>
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
                placeholder="Type"
                style={{ width: 150 }}
                value={filterType}
                onChange={(val) => setFilterType(val)}
                allowClear
              >
                <Option value="Fixed Amount">Fixed Amount</Option>
                <Option value="Percentage">Percentage</Option>
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
            <Form.Item>
              <Select
                placeholder="Sort By"
                style={{ width: 150 }}
                value={shortByFilter}
                onChange={(val) => setShortByFilter(val)}
              >
                <Option value="recentlyadded">Recently Added</Option>
                <Option value="ascending">Ascending</Option>
                <Option value="descending">Descending</Option>
                <Option value="last7days">Last 7 Days</Option>
                <Option value="lastmonth">Last Month</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        className="bg-white"
        bordered={false}
        rowClassName={() => "hover:bg-gray-50"}
        style={{ border: "rounded-xl" }}
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                className="bg-gray-100 text-gray-600 font-bold text-sm px-6 py-3"
              />
            ),
          },
          body: {
            cell: (props) => <td {...props} className="px-6 py-3" />,
            row: (props) => (
              <tr
                {...props}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              />
            ),
          },
        }}
      />

      {/* Add/Edit Coupon Modal */}
      <Modal
        title={isEdit ? "Edit Coupon" : "Add Coupon"}
        open={showForm}
        onCancel={() => {
          setShowForm(false);
          form.resetFields();
          setIsEdit(false);
          setEditingKey(null);
        }}
        footer={null}
        centered
        width={650}
      >
        <Form layout="vertical" form={form} onFinish={handleAddCoupons}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Coupon Name *"
              name="name"
              rules={[{ required: true, message: "Please enter coupon name" }]}
            >
              <Input placeholder="Enter Coupon Name" />
            </Form.Item>
            <Form.Item
              label="Coupon Code *"
              name="code"
              rules={[{ required: true, message: "Please enter coupon code" }]}
            >
              <Input placeholder="Enter Coupon Code" />
            </Form.Item>
            <Form.Item
              label="Type *"
              name="type"
              rules={[{ required: true, message: "Please select type" }]}
            >
              <Select placeholder="Choose Type">
                <Option value="Fixed Amount">Fixed Amount</Option>
                <Option value="Percentage">Percentage</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Discount *"
              name="discount"
              rules={[{ required: true, message: "Please enter discount" }]}
            >
              <Input placeholder="Enter Discount" />
            </Form.Item>
            <Form.Item
              label="Limit *"
              name="limit"
              rules={[{ required: true, message: "Please enter limit" }]}
            >
              <Input placeholder="Enter 0 for Unlimited" />
            </Form.Item>
            <div></div>
            <Form.Item
              label="Start Date *"
              name="startDate"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              label="End Date *"
              name="endDate"
              rules={[{ required: true, message: "Please select end date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <Form.Item
            label="Product *"
            name="product"
            rules={[{ required: false, message: "Please select product" }]}
          >
            <Select placeholder="Select Product" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Enter description (Max 60 words)" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            valuePropName="checked"
            className="flex items-center justify-between"
          >
            <Switch defaultChecked={true} />
          </Form.Item>

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
              {isEdit ? "Update Coupon" : "Add Coupon"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Coupons;
