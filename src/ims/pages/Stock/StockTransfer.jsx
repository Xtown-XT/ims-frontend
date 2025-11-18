
import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  Menu,
  Space,
  Select,
  Modal,
  Form,
  Upload,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  PlusOutlined,
  SettingOutlined,
  DownOutlined,
  UploadOutlined,
  UpOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;

const StockTransfer = () => {
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("Last 7 Days");
  const [pageSize, setPageSize] = useState(10);
  const [collapsed, setCollapsed] = useState(false);

  // modal states + forms
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [addForm] = Form.useForm();
  const [importForm] = Form.useForm();

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    addForm.resetFields();
  };
  const submitAddTransfer = (values) => {
    console.log("Add Transfer:", values);
    closeAddModal();
  };

  const openImportModal = () => setIsImportModalOpen(true);
  const closeImportModal = () => {
    setIsImportModalOpen(false);
    importForm.resetFields();
  };
  const submitImport = (values) => {
    console.log("Import Transfer:", values);
    closeImportModal();
  };

  const dataSource = [
    {
      key: "1",
      fromWarehouse: "Lavish Warehouse",
      toWarehouse: "North Zone Warehouse",
      noOfProducts: 20,
      qtyTransferred: 15,
      refNumber: "#458924",
      date: "24 Dec 2024",
    },
    {
      key: "2",
      fromWarehouse: "Lobar Handy",
      toWarehouse: "Nova Storage Hub",
      noOfProducts: 4,
      qtyTransferred: 14,
      refNumber: "#145445",
      date: "25 Jul 2023",
    },
    {
      key: "3",
      fromWarehouse: "Quaint Warehouse",
      toWarehouse: "Cool Warehouse",
      noOfProducts: 21,
      qtyTransferred: 10,
      refNumber: "#135478",
      date: "28 Jul 2023",
    },
    {
      key: "4",
      fromWarehouse: "Traditional Warehouse",
      toWarehouse: "Retail Supply Hub",
      noOfProducts: 15,
      qtyTransferred: 14,
      refNumber: "#145124",
      date: "24 Jul 2023",
    },
    {
      key: "5",
      fromWarehouse: "Cool Warehouse",
      toWarehouse: "EdgeWare Solutions",
      noOfProducts: 14,
      qtyTransferred: 74,
      refNumber: "#474541",
      date: "15 Jul 2023",
    },
    {
      key: "6",
      fromWarehouse: "Overflow Warehouse",
      toWarehouse: "Quaint Warehouse",
      noOfProducts: 30,
      qtyTransferred: 20,
      refNumber: "#366713",
      date: "06 Nov 2024",
    },
    {
      key: "7",
      fromWarehouse: "Nova Storage Hub",
      toWarehouse: "Traditional Warehouse",
      noOfProducts: 10,
      qtyTransferred: 6,
      refNumber: "#327814",
      date: "25 Oct 2024",
    },
    {
      key: "8",
      fromWarehouse: "Retail Supply Hub",
      toWarehouse: "Overflow Warehouse",
      noOfProducts: 70,
      qtyTransferred: 60,
      refNumber: "#274509",
      date: "14 Oct 2024",
    },
    {
      key: "9",
      fromWarehouse: "EdgeWare Solutions",
      toWarehouse: "Lavish Warehouse",
      noOfProducts: 35,
      qtyTransferred: 30,
      refNumber: "#239073",
      date: "03 Oct 2024",
    },
    {
      key: "10",
      fromWarehouse: "North Zone Warehouse",
      toWarehouse: "Fulfillment Hub",
      noOfProducts: 15,
      qtyTransferred: 10,
      refNumber: "#187204",
      date: "20 Sep 2024",
    },
  ];

  const filteredData = dataSource.filter(
    (item) =>
      item.fromWarehouse.toLowerCase().includes(searchText.toLowerCase()) ||
      item.toWarehouse.toLowerCase().includes(searchText.toLowerCase()) ||
      item.refNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "From Warehouse",
      dataIndex: "fromWarehouse",
      key: "fromWarehouse",
    },
    {
      title: "To Warehouse",
      dataIndex: "toWarehouse",
      key: "toWarehouse",
    },
    {
      title: "No of Products",
      dataIndex: "noOfProducts",
      key: "noOfProducts",
      align: "center",
    },
    {
      title: "Quantity Transferred",
      dataIndex: "qtyTransferred",
      key: "qtyTransferred",
      align: "center",
    },
    {
      title: "Ref Number",
      dataIndex: "refNumber",
      key: "refNumber",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "",
      key: "actions",
      render: () => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Button  icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const fromMenu = (
    <Menu>
      <Menu.Item key="f1">Lavish Warehouse</Menu.Item>
      <Menu.Item key="f2">Lobar Handy</Menu.Item>
      <Menu.Item key="f3">Quaint Warehouse</Menu.Item>
      <Menu.Item key="f4">Traditional Warehouse</Menu.Item>
      <Menu.Item key="f5">Cool Warehouse</Menu.Item>
    </Menu>
  );

  const toMenu = (
    <Menu>
      <Menu.Item key="t1">North Zone Warehouse</Menu.Item>
      <Menu.Item key="t2">Nova Storage Hub</Menu.Item>
      <Menu.Item key="t3">EdgeWare Solutions</Menu.Item>
      <Menu.Item key="t4">Retail Supply Hub</Menu.Item>
    </Menu>
  );

  const sortMenu = (
    <Menu onClick={(e) => setSortBy(e.key)}>
      <Menu.Item key="Recently Added">Recently Added</Menu.Item>
      <Menu.Item key="Ascending">Ascending</Menu.Item>
      <Menu.Item key="Descending">Descending</Menu.Item>
      <Menu.Item key="Last Month">Last Month</Menu.Item>
      <Menu.Item key="Last 7 Days">Last 7 Days</Menu.Item>
    </Menu>
  );

  const warehouseOptions = [
    { value: "Lavish Warehouse", label: "Lavish Warehouse" },
    { value: "Lobar Handy", label: "Lobar Handy" },
    { value: "Quaint Warehouse", label: "Quaint Warehouse" },
    { value: "Traditional Warehouse", label: "Traditional Warehouse" },
    { value: "North Zone Warehouse", label: "North Zone Warehouse" },
    { value: "Nova Storage Hub", label: "Nova Storage Hub" },
  ];

  const productOptions = dataSource.map((d) => ({
    value: d.refNumber,
    label: `${d.refNumber} — ${d.fromWarehouse} → ${d.toWarehouse}`,
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold">Stock Transfer</h2>
          <p className="text-gray-500 text-sm">Manage your stock transfer</p>
        </div>
        <div className="flex items-center gap-2">
          <Button icon={<FilePdfOutlined />} className="bg-white border-gray-200 hover:bg-gray-100 shadow-sm" />
          <Button icon={<FileExcelOutlined />} className="bg-white border-gray-200 hover:bg-gray-100 shadow-sm" />
          <Button icon={<ReloadOutlined />} className="bg-white border-gray-200 hover:bg-gray-100 shadow-sm" />
          <Button
            icon={<UpOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="bg-white border-gray-200 hover:bg-gray-100 shadow-sm"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-orange-500 border-none hover:bg-orange-600"
            onClick={openAddModal}
          >
            Add New
          </Button>
          <Button
            icon={<UploadOutlined />}
            className="bg-[#05264E] text-white hover:bg-[#153b66]"
            onClick={openImportModal}
          >
            Import Transfer
          </Button>
        </div>
      </div>

      {/* Filters + Table Together */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center gap-3 mb-4">
          <div className="flex-1 max-w-[180px]">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search"
              className="w-full h-8 rounded-md text-sm px-2"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Dropdown overlay={fromMenu} trigger={["click"]}>
              <Button className="bg-white border rounded-md hover:bg-gray-100 shadow-sm">
                <Space>
                  From Warehouse <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Dropdown overlay={toMenu} trigger={["click"]}>
              <Button className="bg-white border rounded-md hover:bg-gray-100 shadow-sm">
                <Space>
                  To Warehouse <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Dropdown overlay={sortMenu} trigger={["click"]}>
              <Button className="bg-orange-100 border rounded-md hover:bg-orange-200 shadow-sm">
                <Space>
                  <span className="text-purple-600">Sort By : {sortBy}</span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>

        {/* Table */}
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="key"
          pagination={{
            pageSize: pageSize,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          className="bg-white"
          bordered={false}
          rowClassName={() => "hover:bg-gray-50"}
        />
      </div>

      {/* ✅ Add Transfer Modal (Fixed Size & Position) */}
      <Modal
        title="Add Transfer"
        open={isAddModalOpen}
        onCancel={closeAddModal}
        footer={null}
        width={500} // 🔹 smaller modal width
        style={{ top: 120 }} // 🔹 moves modal down below header
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={submitAddTransfer}
        >
          <Form.Item
            label="Warehouse From"
            name="from"
            rules={[{ required: true, message: "Select warehouse from" }]}
          >
            <Select options={warehouseOptions} placeholder="Select" />
          </Form.Item>

          <Form.Item
            label="Warehouse To"
            name="to"
            rules={[{ required: true, message: "Select warehouse to" }]}
          >
            <Select options={warehouseOptions} placeholder="Select" />
          </Form.Item>

          <Form.Item
            label="Reference Number"
            name="refNumber"
            rules={[{ required: true, message: "Enter reference number" }]}
          >
            <Input placeholder="Enter reference number" />
          </Form.Item>

          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true, message: "Select product" }]}
          >
            <Select showSearch placeholder="Search Product" options={productOptions} />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
            rules={[{ required: true, message: "Enter notes" }]}
          >
            <Input.TextArea rows={2} placeholder="Enter notes" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={closeAddModal}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-orange-500 hover:bg-orange-600">
              Create
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StockTransfer;
