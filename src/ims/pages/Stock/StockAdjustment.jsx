



import { useState, useEffect } from "react";
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
  message,
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
import stockAdjustmentService from "./stockAdjustmentService.js";
import warehouseService from "../peoples/WarehouseService";
import storesService from "../peoples/StoresService";

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
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [stores, setStores] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    fetchAdjustments();
    fetchWarehouses();
    fetchStores();
  }, []);

  const fetchAdjustments = async () => {
    try {
      setLoading(true);
      const res = await stockAdjustmentService.getAdjustments();
      const fetchedAdjustments = res.data.rows || [];
      setDataSource(fetchedAdjustments.map(item => ({
        key: item.id,
        id: item.id,
        warehouse: item.warehouse,
        store: item.store,
        product: item.product,
        date: item.createdAt,
        person: item.responsible_person,
        qty: item.quantity,
        reference: item.reference_number,
        notes: item.notes,
      })));
    } catch (err) {
      console.error("Failed to fetch adjustments:", err);
      message.error(err.response?.data?.message || "Failed to fetch adjustments");
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await warehouseService.getWarehouses(1, 100, "");
      const rows = res?.data?.data?.rows ?? [];
      const warehouseNames = rows.map(w => w.warehouse_name || w.warehouse);
      setWarehouses(warehouseNames);
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await storesService.getStores();
      const rows = res?.data?.rows ?? res?.data?.data?.rows ?? res?.data ?? [];
      const storeNames = rows.map(s => s.store_name || s.store || s.storeName || s.name);
      setStores(storeNames);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
    }
  };

  const openModal = (record = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    if (record) {
      form.setFieldsValue({
        product: record.product,
        warehouse: record.warehouse,
        reference: record.reference,
        store: record.store,
        person: record.person,
        notes: record.notes,
        quantity: record.qty,
      });
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const submitAdjustment = async (values) => {
    try {
      if (editingRecord) {
        const updateData = {
          product: values.product,
          warehouse: values.warehouse,
          reference_number: values.reference,
          store: values.store,
          responsible_person: values.person,
          quantity: values.quantity,
          notes: values.notes,
        };
        await stockAdjustmentService.updateAdjustment(editingRecord.id, updateData);
        message.success("Adjustment updated successfully!");
      } else {
        const createData = {
          product: values.product,
          warehouse: values.warehouse,
          reference_number: values.reference,
          store: values.store,
          responsible_person: values.person,
          quantity: values.quantity,
          notes: values.notes,
        };
        await stockAdjustmentService.createAdjustment(createData);
        message.success("Adjustment created successfully!");
      }
      closeModal();
      fetchAdjustments();
    } catch (err) {
      console.error("Failed to save adjustment:", err);
      message.error(err.response?.data?.message || "Failed to save adjustment");
    }
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await stockAdjustmentService.deleteAdjustment(deleteRecord.id);
      message.success("Adjustment deleted successfully!");
      setShowDeleteModal(false);
      setDeleteRecord(null);
      fetchAdjustments();
    } catch (err) {
      console.error("Failed to delete adjustment:", err);
      message.error(err.response?.data?.message || "Failed to delete adjustment");
      setShowDeleteModal(false);
      setDeleteRecord(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  // ✅ Warehouse + Search + Sort Filtering
  const filteredData = dataSource
    .filter((item) => {
      const productName = typeof item.product === 'string' ? item.product : item.product?.name || '';
      const matchSearch =
        productName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.warehouse.toLowerCase().includes(searchText.toLowerCase());
      const matchWarehouse = selectedWarehouse
        ? item.warehouse === selectedWarehouse
        : true;
      return matchSearch && matchWarehouse;
    })
    .sort((a, b) => {
      const aProduct = typeof a.product === 'string' ? a.product : a.product?.name || '';
      const bProduct = typeof b.product === 'string' ? b.product : b.product?.name || '';
      if (sortBy === "Ascending") return aProduct.localeCompare(bProduct);
      if (sortBy === "Descending") return bProduct.localeCompare(aProduct);
      if (sortBy === "Recently Added") return b.key - a.key;
      return 0;
    });

  const columns = [
    { title: "Warehouse", dataIndex: "warehouse", key: "warehouse" },
    { title: "Store", dataIndex: "store", key: "store" },
    {
      title: "Product",
      key: "product",
      render: (_, record) => {
        const productName = typeof record.product === 'string' ? record.product : record.product?.name || '';
        return <span>{productName}</span>;
      },
    },
    { 
      title: "Date", 
      dataIndex: "date", 
      key: "date",
      render: (date) => {
        if (!date) return '';
        if (typeof date === 'string' && date.includes(' ') && !date.includes('T')) return date;
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    },
    {
      title: "Person",
      key: "person",
      render: (_, record) => {
        const personName = typeof record.person === 'string' ? record.person : record.person?.name || '';
        return <span>{personName}</span>;
      },
    },
    { title: "Qty", dataIndex: "qty", key: "qty" },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  // ✅ Warehouse Filter Menu
  const warehouseMenu = (
    <Menu
      onClick={(e) => setSelectedWarehouse(e.key === 'null' ? null : e.key)}
      items={[
        ...warehouses.map(w => ({ key: w, label: w })),
        { key: 'null', label: "All Warehouses" },
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

  const warehouseOptions = warehouses.map(w => ({ value: w, label: w }));
  const storeOptions = stores.map(s => ({ value: s, label: s }));
  const personOptions = [
    { value: "James Kirwin", label: "James Kirwin" },
    { value: "Francis Chang", label: "Francis Chang" },
    { value: "Antonio Engle", label: "Antonio Engle" },
  ];
  const productOptions = [
    { value: "Laptop", label: "Laptop" },
    { value: "Mouse", label: "Mouse" },
    { value: "Keyboard", label: "Keyboard" },
  ];

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

        <Table 
          dataSource={filteredData} 
          columns={columns} 
          loading={loading}
          rowKey="id"
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
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <Input placeholder="Enter quantity" type="number" />
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

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onCancel={cancelDelete}
        footer={null}
        centered
      >
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#FEE2E2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 15px",
            }}
          >
            <DeleteOutlined style={{ fontSize: 30, color: "#EF4444" }} />
          </div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#1F2937",
              marginBottom: 10,
            }}
          >
            Delete Adjustment
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this adjustment?
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginTop: 10,
            }}
          >
            <Button
              onClick={cancelDelete}
              style={{
                backgroundColor: "#0A2540",
                color: "#fff",
                border: "none",
                height: 38,
                width: 100,
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={confirmDelete}
              style={{
                backgroundColor: "#6C5CE7",
                borderColor: "#6C5CE7",
                color: "#fff",
                height: 38,
                width: 120,
              }}
            >
              Yes Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StockAdjustment;
