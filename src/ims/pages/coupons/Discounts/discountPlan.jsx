import { useState, useMemo, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Form,
  Switch,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import discountPlanService from "./discountPlanService";

const { Option } = Select;

const DiscountPlan = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterCustomer, setFilterCustomer] = useState(null);
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [discountPlans, setDiscountPlans] = useState([]);

  // Customer type options (matching backend enum)
  const customerTypes = [
    { value: "all_customers", label: "All Customers" },
    { value: "members_only", label: "Members Only" },
    { value: "high_spending_customers", label: "High Spending Customers" },
    { value: "custom_selected", label: "Custom Selected" },
  ];

  const onChange = (ch) => {
    setChecked(ch);
    form.setFieldsValue({ status: ch });
  };

  // Fetch discount plans
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await discountPlanService.getDiscountPlan(currentPage, pageSize, searchText)
        console.log("API Response:", res.data)
        console.log("Discount Plans Data:", res.data.data || [])
        setDiscountPlans(res.data.data || []);
      } catch (error) {
        console.log("Failed to Fetch Discount Plans", error)
        message.error(error.response?.data?.message || "Failed to fetch Discount Plans");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, pageSize, searchText])



  const openAddForm = () => {
    setIsEdit(false);
    setEditingKey(null);
    setChecked(true);
    form.resetFields();
    form.setFieldsValue({
      plan_name: "",
      customer: undefined,
      status: true,
    });
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setIsEdit(true);
    setEditingKey(record.id);
    form.setFieldsValue({
      plan_name: record.plan_name,
      customer: record.customer,
      status: record.status,
    });
    setChecked(record.status);
    setShowForm(true);
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        plan_name: values.plan_name,
        customer: values.customer,
        status: Boolean(checked)
      };

      if (isEdit) {
        await discountPlanService.updateDiscountPlan(editingKey, payload);
        message.success("Discount Plan updated successfully");
      } else {
        await discountPlanService.createDiscountPlan(payload);
        message.success("Discount Plan added successfully");
      }

      setShowForm(false);
      form.resetFields();
      setIsEdit(false);
      setEditingKey(null);

      // Refresh data
      const res = await discountPlanService.getDiscountPlan(currentPage, pageSize, searchText);
      setDiscountPlans(res.data.data || []);
    } catch (err) {
      console.log('Failed to save discount plan', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to save discount plan";
      message.error(errorMsg);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this discount plan?",
      onOk: async () => {
        try {
          await discountPlanService.deleteDiscountPlan(id);
          message.success("Discount Plan deleted");
          const res = await discountPlanService.getDiscountPlan(currentPage, pageSize, searchText);
          setDiscountPlans(res.data.data || []);
        } catch (err) {
          message.error("Failed to delete discount plan");
        }
      },
    });
  };

  const filteredData = useMemo(() => {
    return discountPlans.filter((item) => {
      const matchesSearch =
        item.plan_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customer?.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = filterStatus ?
        (filterStatus === "Active" ? item.status === true : item.status === false) : true;

      const matchesCustomer = filterCustomer ? item.customer === filterCustomer : true;

      return matchesSearch && matchesStatus && matchesCustomer;
    });
  }, [discountPlans, searchText, filterStatus, filterCustomer]);

  const columns = [
    {
      title: <input type="checkbox" />,
      dataIndex: "checkbox",
      render: () => <input type="checkbox" />,
      width: 50,
    },
    { title: "Plan Name", dataIndex: "plan_name", key: "plan_name" },
    { 
      title: "Customer Type", 
      dataIndex: "customer", 
      key: "customer",
      render: (customer) => {
        const customerType = customerTypes.find(ct => ct.value === customer);
        return customerType ? customerType.label : customer;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <button
          style={{
            backgroundColor: status === true ? "#71D98D" : "#FF9999",
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
          {status === true ? "Active" : "Inactive"}
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
            onClick={() => handleDelete(record.id)}
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
                placeholder="Customer Type"
                style={{ width: 200 }}
                value={filterCustomer}
                onChange={(val) => setFilterCustomer(val)}
                allowClear
              >
                {customerTypes.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
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
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        rowKey="id"
      />

      {/* Add/Edit Discount Plan Modal */}
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
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-4">
            <Form.Item
              label="Plan Name"
              name="plan_name"
              rules={[{ required: true, message: "Please enter plan name" }]}
            >
              <Input placeholder="Enter plan Name" />
            </Form.Item>
            <Form.Item
              label="Customer Type"
              name="customer"
              rules={[{ required: true, message: "Please select customer type" }]}
            >
              <Select
                placeholder="Select Customer Type"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {customerTypes.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
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
                  form.setFieldsValue({ status: ch });
                }}
                style={{
                  backgroundColor: checked ? "#9333ea" : "#ccc",
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
