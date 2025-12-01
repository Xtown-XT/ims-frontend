import { useState, useEffect, useMemo } from "react";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  UpOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import {
  Table,
  Button,
  Input,
  Select,
  Form,
  Modal,
  Checkbox,
  DatePicker,
  Row,
  Col,
  Switch,
  message
} from "antd";
import dayjs from "dayjs";
import discountService from "./discountService";
import discountPlanService from "./discountPlanService";

const { Option } = Select;

const Discount = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterApplicableFor, setFilterApplicableFor] = useState(null);
  const [checked, setChecked] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [discounts, setDiscounts] = useState([]);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [discountPlans, setDiscountPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const applicableForOptions = [
    { value: "all_products", label: "All Products" },
    { value: "specific_products", label: "Specific Products" },
  ];

  const discountPlanTypeOptions = [
    { value: "standard", label: "Standard" },
    { value: "membership", label: "Membership" },
    { value: "seasonal", label: "Seasonal" },
    { value: "festival", label: "Festival" },
    { value: "special_offer", label: "Special Offer" },
  ];

  const discountTypeOptions = [
    { value: "percentage", label: "Percentage" },
    { value: "flat", label: "Flat" },
  ];

  const onChange = (ch) => {
    setChecked(ch);
    form.setFieldsValue({ status: ch });
  };

  // Fetch discounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await discountService.getDiscounts(currentPage, pageSize, searchText);
        console.log("API Response:", res.data);
        setDiscounts(res.data.data || []);
      } catch (error) {
        console.log("Failed to Fetch Discounts", error);
        message.error(error.response?.data?.message || "Failed to fetch Discounts");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, pageSize, searchText]);

  // Fetch discount plans for dropdown
  useEffect(() => {
    const fetchDiscountPlans = async () => {
      try {
        setLoadingPlans(true);
        const res = await discountPlanService.getDiscountPlan(1, 100, '');
        console.log("Discount Plans Response:", res.data);
        setDiscountPlans(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch discount plans:", error);
        message.error("Failed to load discount plans");
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchDiscountPlans();
  }, []);

  const filteredData = useMemo(() => {
    return discounts.filter((item) => {
      const matchesSearch =
        item.discount_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.discount_plan?.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = filterStatus ?
        (filterStatus === "Active" ? item.status === true : item.status === false) : true;

      const matchesApplicableFor = filterApplicableFor ? item.applicable_for === filterApplicableFor : true;

      return matchesSearch && matchesStatus && matchesApplicableFor;
    });
  }, [discounts, searchText, filterStatus, filterApplicableFor]);

  const openAddForm = () => {
    setIsEdit(false);
    setEditingKey(null);
    setChecked(true);
    setSelectedDays([]);
    setSelectedPlanId(null);
    form.resetFields();
    form.setFieldsValue({
      status: true,
    });
    setIsModalVisible(true);
  };

  const openEditForm = (record) => {
    setIsEdit(true);
    setEditingKey(record.id);
    setChecked(record.status);
    setSelectedDays(record.valid_days || []);
    setSelectedPlanId(record.discount_plan_id);
    form.setFieldsValue({
      discount_name: record.discount_name,
      discount_plan_id: record.discount_plan_id,
      discount_plan_type: record.discount_plan,
      applicable_for: record.applicable_for,
      valid_from: record.valid_from ? dayjs(record.valid_from) : null,
      valid_till: record.valid_till ? dayjs(record.valid_till) : null,
      discount_type: record.discount_type,
      status: record.status,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        discount_name: values.discount_name,
        discount_plan_id: values.discount_plan_id,
        discount_plan: values.discount_plan_type, // This is the ENUM value
        applicable_for: values.applicable_for,
        valid_from: values.valid_from ? values.valid_from.format("YYYY-MM-DD") : null,
        valid_till: values.valid_till ? values.valid_till.format("YYYY-MM-DD") : null,
        discount_type: values.discount_type,
        valid_days: selectedDays,
        status: checked
      };

      console.log("Sending payload:", payload);

      if (isEdit) {
        await discountService.updateDiscount(editingKey, payload);
        message.success("Discount updated successfully");
      } else {
        await discountService.createDiscount(payload);
        message.success("Discount added successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setIsEdit(false);
      setEditingKey(null);
      setSelectedDays([]);
      setSelectedPlanId(null);

      // Refresh data
      const res = await discountService.getDiscounts(currentPage, pageSize, searchText);
      setDiscounts(res.data.data || []);
    } catch (err) {
      console.log('Failed to save discount', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to save discount";
      message.error(errorMsg);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this discount?",
      onOk: async () => {
        try {
          await discountService.deleteDiscount(id);
          message.success("Discount deleted");
          const res = await discountService.getDiscounts(currentPage, pageSize, searchText);
          setDiscounts(res.data.data || []);
        } catch (err) {
          message.error("Failed to delete discount");
        }
      },
    });
  };

  const handleDayChange = (day, checked) => {
    if (checked) {
      setSelectedDays([...selectedDays, day]);
    } else {
      setSelectedDays(selectedDays.filter(d => d !== day));
    }
  };

  const columns = [
    {
      title: <input type="checkbox" />,
      dataIndex: "checkbox",
      render: () => <input type="checkbox" />,
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "discount_name",
      key: "discount_name",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Discount Type",
      dataIndex: "discount_type",
      key: "discount_type",
      render: (type) => type?.charAt(0).toUpperCase() + type?.slice(1) || "",
    },
    {
      title: "Discount Plan",
      dataIndex: "discount_plan",
      key: "discount_plan",
    },
    {
      title: "Validity",
      key: "validity",
      render: (_, record) => {
        const from = record.valid_from ? dayjs(record.valid_from).format("DD MMM YYYY") : "";
        const till = record.valid_till ? dayjs(record.valid_till).format("DD MMM YYYY") : "";
        return `${from} - ${till}`;
      },
    },
    {
      title: "Days",
      dataIndex: "valid_days",
      key: "valid_days",
      render: (days) => days?.join(", ") || "",
    },
    {
      title: "Applicable For",
      dataIndex: "applicable_for",
      key: "applicable_for",
      render: (value) => {
        const option = applicableForOptions.find(opt => opt.value === value);
        return option ? option.label : value;
      },
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => openEditForm(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </div>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsEdit(false);
    setEditingKey(null);
    setSelectedDays([]);
    setSelectedPlanId(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Discount</h2>
          <p className="text-gray-500">Manage your discount</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            icon={<FilePdfOutlined />}
            style={{
              backgroundColor: "#FF4D4F",
              color: "white",
              border: "none",
            }}
          />
          <Button
            icon={<FileExcelOutlined />}
            style={{
              backgroundColor: "#52C41A",
              color: "white",
              border: "none",
            }}
          />
          <Button icon={<ReloadOutlined />} />
          <Button icon={<UpOutlined />} />
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
              <span>Add Discount</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div>
        <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <div className="flex gap-3">
            <Form.Item>
              <Select
                placeholder="Applicable For"
                style={{ width: 200 }}
                value={filterApplicableFor}
                onChange={(val) => setFilterApplicableFor(val)}
                allowClear
              >
                {applicableForOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
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

      {/* Discount Table */}
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

      {/* Add/Edit Discount Modal */}
      <Modal
        title={isEdit ? "Edit Discount" : "Add Discount"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width={800}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {/* First Row: Three inputs in one row */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Discount Name"
                name="discount_name"
                rules={[{ required: true, message: "Please enter discount name" }]}
              >
                <Input placeholder="Enter discount name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Valid From"
                name="valid_from"
                rules={[{ required: true, message: "Please select valid from date" }]}
              >
                <DatePicker
                  placeholder="dd/mm/yyyy"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Discount Plan Type"
                name="discount_plan_type"
                rules={[{ required: true, message: "Please select discount plan type" }]}
              >
                <Select placeholder="Select Plan Type">
                  {discountPlanTypeOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Second Row: Three inputs in one row */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Discount Plan Reference"
                name="discount_plan_id"
                rules={[{ required: true, message: "Please select discount plan" }]}
              >
                <Select
                  placeholder="Select Discount Plan"
                  loading={loadingPlans}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(value) => setSelectedPlanId(value)}
                >
                  {discountPlans.map((plan) => (
                    <Option key={plan.id} value={plan.id}>
                      {plan.plan_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Valid Till"
                name="valid_till"
                rules={[{ required: true, message: "Please select valid till date" }]}
              >
                <DatePicker
                  placeholder="dd/mm/yyyy"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Applicable For"
                name="applicable_for"
                rules={[{ required: true, message: "Please select applicable for" }]}
              >
                <Select placeholder="Select">
                  {applicableForOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Third Row */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Discount Type"
                name="discount_type"
                rules={[{ required: true, message: "Please select discount type" }]}
              >
                <Select placeholder="Select">
                  {discountTypeOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Days Checkboxes - Full width */}
          <Form.Item
            label="Valid on Following Days"
            required
          >
            <div style={{ display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap" }}>
              {daysOfWeek.map((day) => (
                <Checkbox
                  key={day}
                  checked={selectedDays.includes(day)}
                  onChange={(e) => handleDayChange(day, e.target.checked)}
                  style={{ margin: 0 }}
                >
                  {day}
                </Checkbox>
              ))}
            </div>
          </Form.Item>

          {/* Status Switch */}
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

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={handleCancel}
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
              {isEdit ? "Update Discount" : "Add Discount"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Discount;