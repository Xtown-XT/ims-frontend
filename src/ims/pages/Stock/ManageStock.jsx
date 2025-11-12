



import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Modal,
  Form,
  Space,
  Avatar,
  message,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Plus } from "lucide-react";

import LenovoIdeaPad3 from "../Stock/assets/LenovoIdeaPad3.jpg";
import BeatsPro from "../Stock/assets/BeatsPro.jpg";
import NikeJordan from "../Stock/assets/NikeJordan.jpg";
import AppleSeries5Watch from "../Stock/assets/AppleSeries5Watch.jpg";
import AmazonEchoDot from "../Stock/assets/AmazonEchoDot.jpg";
import JamesKirwin from "../Stock/assets/JamesKirwin.png";
import FrancisChang from "../Stock/assets/FrancisChang.png";
import Steven from "../Stock/assets/Steven.png";
import Gravely from "../Stock/assets/Gravely.png";
import Kevin from "../Stock/assets/Kevin.png";

const ManageStock = () => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filterWarehouse, setFilterWarehouse] = useState("");
  const [filterStore, setFilterStore] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [form] = Form.useForm();

  const warehouses = [
    "Lavish Warehouse",
    "Quaint Warehouse",
    "Traditional Warehouse",
    "Cool Warehouse",
    "Retail Supply Hub",
  ];

  const stores = [
    "Electro Mart",
    "Quantum Gadgets",
    "Prime Bazaar",
    "Gadget World",
    "Volt Vault",
  ];

  const products = [
    "Lenovo IdeaPad 3",
    "Beats Pro",
    "Nike Jordan",
    "Apple Series 5 Watch",
    "Amazon Echo Dot",
  ];

  const persons = ["James Kirwin", "Francis Chang", "Steven", "Gravely", "Kevin"];

  const [dataSource, setDataSource] = useState([
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
      warehouse: "Lobar Handy",
      store: "Prime Bazaar",
      product: { name: "Nike Jordan", img: NikeJordan },
      date: "25 Jul 2023",
      person: { name: "Steven", img: Steven },
      qty: 120,
    },
  ]);

  // ✅ Filtered data based on search and dropdowns
  const filteredData = dataSource.filter((item) => {
    const searchMatch = item.product.name.toLowerCase().includes(searchText.toLowerCase());
    const warehouseMatch = filterWarehouse ? item.warehouse === filterWarehouse : true;
    const storeMatch = filterStore ? item.store === filterStore : true;
    const productMatch = filterProduct ? item.product.name === filterProduct : true;
    return searchMatch && warehouseMatch && storeMatch && productMatch;
  });

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Manage Stock Report", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["Warehouse", "Store", "Product", "Person", "Date", "Qty"]],
      body: filteredData.map((item) => [
        item.warehouse,
        item.store,
        item.product.name,
        item.person.name,
        item.date,
        item.qty,
      ]),
    });
    doc.save("ManageStock.pdf");
    message.success("PDF Downloaded Successfully");
  };

  // ✅ Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        Warehouse: item.warehouse,
        Store: item.store,
        Product: item.product.name,
        Person: item.person.name,
        Date: item.date,
        Quantity: item.qty,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock");
    XLSX.writeFile(workbook, "ManageStock.xlsx");
    message.success("Excel Downloaded Successfully");
  };

  // ✅ Refresh
  const handleRefresh = () => {
    setSearchText("");
    setFilterWarehouse("");
    setFilterStore("");
    setFilterProduct("");
    message.info("Filters cleared");
  };

  // ✅ Modal open/close
  const handleOpenModal = (record = null) => {
    setEditingRecord(record);
    if (record) {
      form.setFieldsValue({
        warehouse: record.warehouse,
        store: record.store,
        product: record.product.name,
        person: record.person.name,
        qty: record.qty,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // ✅ Add/Edit Stock (same form)
  const handleAddOrEditStock = (values) => {
    if (editingRecord) {
      const updatedData = dataSource.map((item) =>
        item.key === editingRecord.key
          ? {
              ...item,
              warehouse: values.warehouse,
              store: values.store,
              product: { name: values.product, img: item.product.img },
              person: { name: values.person, img: item.person.img },
              qty: values.qty,
            }
          : item
      );
      setDataSource(updatedData);
      message.success("Stock updated successfully!");
    } else {
      const newItem = {
        key: Date.now().toString(),
        warehouse: values.warehouse,
        store: values.store,
        product: { name: values.product, img: LenovoIdeaPad3 },
        person: { name: values.person, img: JamesKirwin },
        qty: values.qty,
        date: new Date().toLocaleDateString(),
      };
      setDataSource([...dataSource, newItem]);
      message.success("New stock added successfully!");
    }
    handleCloseModal();
  };

  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
    message.success("Stock deleted successfully!");
  };

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
          <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Manage Stock</h2>
          <p className="text-gray-500 text-sm">Manage your stock efficiently</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            icon={<FilePdfOutlined />}
            onClick={exportPDF}
            style={{
              background: "#DC2626",
              color: "white",
              borderColor: "#DC2626",
              borderRadius: "8px",
            }}
          />
          <Button
            icon={<FileExcelOutlined />}
            onClick={exportExcel}
            style={{
              background: "#16A34A",
              color: "white",
              borderColor: "#16A34A",
              borderRadius: "8px",
            }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            style={{ borderRadius: "8px" }}
          />
          <button
            className="flex items-center gap-1 bg-violet-500 text-white px-3 py-1.5 rounded-lg hover:bg-violet-600 transition text-sm"
            onClick={() => handleOpenModal()}
          >
            <Plus size={14} /> Add Stock
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
          <div className="flex-1 max-w-[160px]">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search product..."
              className="h-8 text-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select
              placeholder="Warehouse"
              value={filterWarehouse || undefined}
              onChange={(v) => setFilterWarehouse(v)}
              allowClear
              className="custom-select"
              options={warehouses.map((w) => ({ label: w, value: w }))}
            />
            <Select
              placeholder="Store"
              value={filterStore || undefined}
              onChange={(v) => setFilterStore(v)}
              allowClear
                            className="custom-select"

              options={stores.map((s) => ({ label: s, value: s }))}
            />
            <Select
              placeholder="Product"
              value={filterProduct || undefined}
              onChange={(v) => setFilterProduct(v)}
              allowClear
                            className="custom-select"

              options={products.map((p) => ({ label: p, value: p }))}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          rowSelection={{}}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Rows per page</span>
            <Select
              value={pageSize}
              style={{ width: 80 }}
              onChange={(value) => setPageSize(value)}
              options={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 20, label: "20" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button shape="circle" size="small">
              {"<"}
            </Button>
            <Button shape="circle" size="small" className="bg-orange-500 text-white border-none">
              1
            </Button>
            <Button shape="circle" size="small">
              {">"}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={
          <span className="font-semibold text-lg">
            {editingRecord ? "Edit Stock" : "Add Stock"}
          </span>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        closeIcon={<CloseOutlined className="text-red-500" />}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleAddOrEditStock}
          className="pt-2"
        >
          <Form.Item
            label="Warehouse"
            name="warehouse"
            rules={[{ required: true, message: "Please select warehouse" }]}
          >
            <Select
              placeholder="Select"
              options={warehouses.map((w) => ({ value: w, label: w }))}
            />
          </Form.Item>

          <Form.Item
            label="Store"
            name="store"
            rules={[{ required: true, message: "Please select store" }]}
          >
            <Select
              placeholder="Select"
              options={stores.map((s) => ({ value: s, label: s }))}
            />
          </Form.Item>

          <Form.Item
            label="Responsible Person"
            name="person"
            rules={[{ required: true, message: "Please select person" }]}
          >
            <Select
              placeholder="Select"
              options={persons.map((p) => ({ value: p, label: p }))}
            />
          </Form.Item>

          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true, message: "Please select product" }]}
          >
            <Select
              placeholder="Select"
              options={products.map((p) => ({ value: p, label: p }))}
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="qty"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <Input placeholder="Enter quantity" type="number" />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleCloseModal} className="bg-[#0e2954] text-white">
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              className="bg-orange-500 border-none hover:bg-orange-600"
            >
              {editingRecord ? "Update" : "Add Stock"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageStock;
