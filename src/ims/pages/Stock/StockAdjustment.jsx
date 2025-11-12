



import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  Menu,
  Avatar,
  Space,
  Select,
  Modal,
  Form,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  PlusOutlined,
  DownOutlined,
  UpOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import LenovoIdeaPad3 from "../Stock/assets/LenovoIdeaPad3.jpg";
import BeatsPro from "../Stock/assets/BeatsPro.jpg";
import NikeJordan from "../Stock/assets/NikeJordan.jpg";
import AppleSeries5Watch from "../Stock/assets/AppleSeries5Watch.jpg";
import AmazonEchoDot from "../Stock/assets/AmazonEchoDot.jpg";
import LobarHandy from "../Stock/assets/LobarHandy.jpg";
import RedPremiumSatchel from "../Stock/assets/RedPremiumSatchel.jpg";
import Iphone14Pro from "../Stock/assets/Iphone14Pro.jpg";
import GamingChair from "../Stock/assets/GamingChair.jpg";
import BorealisBackpack from "../Stock/assets/BorealisBackpack.jpg";
import JamesKirwin from "../Stock/assets/JamesKirwin.png";
import FrancisChang from "../Stock/assets/FrancisChang.png";
import AntonioEngle from "../Stock/assets/AntonioEngle.png";
import LeoKelly from "../Stock/assets/LeoKelly.png";
import AnnetteWalker from "../Stock/assets/AnnetteWalker.png";
import JohnWeaver from "../Stock/assets/JohnWeaver.png";
import GaryHennessy from "../Stock/assets/GaryHennessy.png";
import EleanorPanek from "../Stock/assets/EleanorPanek.png";
import WilliamLevy from "../Stock/assets/WilliamLevy.png";
import CharlotteKlotz from "../Stock/assets/CharlotteKlotz.png";

const StockAdjustment = () => {
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("Last 7 Days");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const openModal = (record = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const submitAdjustment = (values) => {
    if (editingRecord) console.log("Edited Adjustment:", values);
    else console.log("Create Adjustment:", values);
    closeModal();
  };

  const dataSource = [
    {
      key: "1",
      warehouse: "Lavish Warehouse",
      store: "Electro Mart",
      product: { name: "Lenovo IdeaPad 3", img: LenovoIdeaPad3 },
      date: "24 Dec 2024",
      person: { name: "James Kirwin", img: JamesKirwin },
      qty: 100,
    },
    {
      key: "2",
      warehouse: "Quaint Warehouse",
      store: "Quantum Gadgets",
      product: { name: "Beats Pro", img: BeatsPro },
      date: "10 Dec 2024",
      person: { name: "Francis Chang", img: FrancisChang },
      qty: 140,
    },
    {
      key: "3",
      warehouse: "Overflow Warehouse",
      store: "Prime Bazaar",
      product: { name: "Nike Jordan", img: NikeJordan },
      date: "25 Jul 2023",
      person: { name: "Antonio Engle", img: AntonioEngle },
      qty: 120,
    },
    {
      key: "4",
      warehouse: "Traditional Warehouse",
      store: "Volt Vault",
      product: { name: "Amazon Echo Dot", img: AmazonEchoDot },
      date: "24 Jul 2023",
      person: { name: "Annette Walker", img: AnnetteWalker },
      qty: 140,
    },
  ];

  // ✅ Warehouse + Search + Sort Filtering
  const filteredData = dataSource
    .filter((item) => {
      const matchSearch =
        item.product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.warehouse.toLowerCase().includes(searchText.toLowerCase());
      const matchWarehouse = selectedWarehouse
        ? item.warehouse === selectedWarehouse
        : true;
      return matchSearch && matchWarehouse;
    })
    .sort((a, b) => {
      if (sortBy === "Ascending") return a.product.name.localeCompare(b.product.name);
      if (sortBy === "Descending") return b.product.name.localeCompare(a.product.name);
      if (sortBy === "Recently Added") return b.key - a.key;
      return 0;
    });

  const columns = [
    { title: "Warehouse", dataIndex: "warehouse", key: "warehouse" },
    { title: "Store", dataIndex: "store", key: "store" },
    {
      title: "Product",
      key: "product",
      render: (_, record) => (
        <Space>
          <Avatar shape="square" src={record.product.img} />
          <span>{record.product.name}</span>
        </Space>
      ),
    },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Person",
      key: "person",
      render: (_, record) => (
        <Space>
          <Avatar src={record.person.img} />
          <span>{record.person.name}</span>
        </Space>
      ),
    },
    { title: "Qty", dataIndex: "qty", key: "qty" },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Button icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  // ✅ Warehouse Filter Menu
  const warehouseMenu = (
    <Menu
      onClick={(e) => setSelectedWarehouse(e.key)}
      items={[
        { key: "Lavish Warehouse", label: "Lavish Warehouse" },
        { key: "Quaint Warehouse", label: "Quaint Warehouse" },
        { key: "Overflow Warehouse", label: "Overflow Warehouse" },
        { key: "Traditional Warehouse", label: "Traditional Warehouse" },
        { key: null, label: "All Warehouses" },
      ]}
    />
  );

  // ✅ Sort Menu
  const sortMenu = (
    <Menu
      onClick={(e) => setSortBy(e.key)}
      items={[
        { key: "Recently Added", label: "Recently Added" },
        { key: "Ascending", label: "Ascending" },
        { key: "Descending", label: "Descending" },
        { key: "Last Month", label: "Last Month" },
        { key: "Last 7 Days", label: "Last 7 Days" },
      ]}
    />
  );

  const warehouseOptions = [
    { value: "Lavish Warehouse", label: "Lavish Warehouse" },
    { value: "Quaint Warehouse", label: "Quaint Warehouse" },
    { value: "Overflow Warehouse", label: "Overflow Warehouse" },
    { value: "Traditional Warehouse", label: "Traditional Warehouse" },
  ];
  const storeOptions = [
    { value: "Electro Mart", label: "Electro Mart" },
    { value: "Quantum Gadgets", label: "Quantum Gadgets" },
    { value: "Prime Bazaar", label: "Prime Bazaar" },
  ];
  const personOptions = [
    { value: "James Kirwin", label: "James Kirwin" },
    { value: "Francis Chang", label: "Francis Chang" },
    { value: "Antonio Engle", label: "Antonio Engle" },
  ];
  const productOptions = dataSource.map((d) => ({
    value: d.product.name,
    label: d.product.name,
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold">Stock Adjustment</h2>
          <p className="text-gray-500 text-sm">Manage your stock adjustment</p>
        </div>

        <div className="flex items-center gap-2">
          <Button icon={<FilePdfOutlined />} className="bg-white border-gray-200 hover:bg-gray-100 shadow-sm" />
          <Button icon={<FileExcelOutlined />} className="bg-white border-gray-200 hover:bg-gray-100 shadow-sm" />
          <Button icon={<ReloadOutlined />} className="bg-white border-gray-200 hover:bg-gray-100 shadow-sm" />
          <Button
            icon={collapsed ? <DownOutlined /> : <UpOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="bg-white border-gray-200 hover:bg-gray-100 shadow-sm"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-orange-500 border-none hover:bg-orange-600"
            onClick={() => openModal()}
          >
            Add Adjustment
          </Button>
        </div>
      </div>

      {/* Table + Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4 gap-3">
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
            {/* ✅ Warehouse Dropdown (working) */}
            <Dropdown overlay={warehouseMenu} trigger={["click"]}>
              <Button className="custom-select">
                <Space>
                  {selectedWarehouse || "Warehouse"} <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            {/* ✅ Sort Dropdown (working) */}
            <Dropdown overlay={sortMenu} trigger={["click"]}>
              <Button className="custom-select">
                <Space>
                  <span className="text-purple-600">Sort By: {sortBy}</span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>

        <Table dataSource={filteredData} columns={columns} pagination={false} rowSelection={{}} />
      </div>

      {/* Shared Add/Edit Modal */}
      <Modal
        title={<span className="font-semibold text-lg">{editingRecord ? "Edit Adjustment" : "Add Adjustment"}</span>}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        closeIcon={<CloseOutlined className="text-red-500" />}
        width={720}
      >
        <Form layout="vertical" form={form} onFinish={submitAdjustment}>
          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true, message: "Please select product" }]}
          >
            <Select showSearch placeholder="Search Product" options={productOptions} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Warehouse"
              name="warehouse"
              rules={[{ required: true, message: "Please select warehouse" }]}
            >
              <Select placeholder="Select" options={warehouseOptions} />
            </Form.Item>

            <Form.Item
              label="Reference Number"
              name="reference"
              rules={[{ required: true, message: "Please enter reference number" }]}
            >
              <Input placeholder="" />
            </Form.Item>
          </div>

          <Form.Item
            label="Store"
            name="store"
            rules={[{ required: true, message: "Please select store" }]}
          >
            <Select placeholder="Select" options={storeOptions} />
          </Form.Item>

          <Form.Item
            label="Responsible Person"
            name="person"
            rules={[{ required: true, message: "Please select responsible person" }]}
          >
            <Select placeholder="Select" options={personOptions} />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
            rules={[{ required: true, message: "Please enter notes" }]}
          >
            <Input.TextArea rows={4} placeholder="Notes" />
          </Form.Item>

          <div className="flex justify-end gap-4">
            <Button onClick={closeModal} className="bg-[#0e2954] text-white">
              Cancel
            </Button>
            <Button htmlType="submit" type="primary" className="bg-orange-500 border-none hover:bg-orange-600">
              {editingRecord ? "Update Adjustment" : "Create Adjustment"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StockAdjustment;
