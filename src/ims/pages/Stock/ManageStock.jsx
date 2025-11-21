



import { useState, useEffect } from "react";
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
import manageStockService from "./manageStockService.js";
import warehouseService from "../peoples/WarehouseService";
import storesService from "../peoples/StoresService";

const ManageStock = () => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filterWarehouse, setFilterWarehouse] = useState("");
  const [filterStore, setFilterStore] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [warehouses, setWarehouses] = useState([]);
  const [stores, setStores] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const products = [
    "Lenovo IdeaPad 3",
    "Beats Pro",
    "Nike Jordan",
    "Apple Series 5 Watch",
    "Amazon Echo Dot",
  ];

  const persons = ["James Kirwin", "Francis Chang", "Steven", "Gravely", "Kevin"];

  // Fetch stocks, warehouses and stores from API
  useEffect(() => {
    fetchStocks();
    fetchWarehouses();
    fetchStores();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await warehouseService.getWarehouses(1, 100, "");
      const rows = res?.data?.data?.rows ?? [];
      const warehouseNames = rows.map(w => w.warehouse_name || w.warehouse);
      setWarehouses(warehouseNames);
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
      message.error("Failed to load warehouses");
    }
  };

  const fetchStores = async () => {
    try {
      const res = await storesService.getStores();
      console.log("Stores API response:", res.data);
      
      // Try different possible response structures
      const rows = res?.data?.rows ?? res?.data?.data?.rows ?? res?.data ?? [];
      console.log("Stores rows:", rows);
      
      const storeNames = rows.map(s => s.store_name || s.store || s.storeName || s.name);
      console.log("Store names:", storeNames);
      
      setStores(storeNames);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
      console.error("Error response:", err.response?.data);
      // Don't show error message if stores API doesn't exist yet
      // message.error("Failed to load stores");
    }
  };

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const res = await manageStockService.getStocks();
      const fetchedStocks = res.data.rows || [];
      setDataSource(fetchedStocks.map(item => ({
        key: item.id,
        id: item.id,
        warehouse: item.warehouse,
        store: item.store,
        product: item.product,
        date: item.createdAt,
        person: item.Responsible_Person,
        qty: item.quantity,
      })));
      setTotal(res.data.count || fetchedStocks.length);
    } catch (err) {
      console.error("Failed to fetch stocks:", err);
      message.error(err.response?.data?.message || "Failed to fetch stocks");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filtered data based on search and dropdowns
  const filteredData = dataSource.filter((item) => {
    const productName = typeof item.product === 'string' ? item.product : item.product?.name || '';
    const searchMatch = productName.toLowerCase().includes(searchText.toLowerCase());
    const warehouseMatch = filterWarehouse ? item.warehouse === filterWarehouse : true;
    const storeMatch = filterStore ? item.store === filterStore : true;
    const productMatch = filterProduct ? productName === filterProduct : true;
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
        typeof item.product === 'string' ? item.product : item.product?.name || '',
        typeof item.person === 'string' ? item.person : item.person?.name || '',
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
        Product: typeof item.product === 'string' ? item.product : item.product?.name || '',
        Person: typeof item.person === 'string' ? item.person : item.person?.name || '',
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
    fetchStocks();
    message.info("Refreshed");
  };

  // ✅ Modal open/close
  const handleOpenModal = (record = null) => {
    setEditingRecord(record);
    if (record) {
      form.setFieldsValue({
        warehouse: record.warehouse,
        store: record.store,
        product: typeof record.product === 'string' ? record.product : record.product?.name || '',
        person: typeof record.person === 'string' ? record.person : record.person?.name || '',
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
  const handleAddOrEditStock = async (values) => {
    try {
      if (editingRecord) {
        // Update payload (without Responsible_Person)
        const updateData = {
          warehouse: values.warehouse,
          store: values.store,
          product: values.product,
          quantity: values.qty,
        };
        await manageStockService.updateStock(editingRecord.id, updateData);
        message.success("Stock updated successfully!");
      } else {
        // Create payload (with Responsible_Person)
        const createData = {
          warehouse: values.warehouse,
          store: values.store,
          product: values.product,
          Responsible_Person: values.person,
          quantity: values.qty,
        };
        await manageStockService.createStock(createData);
        message.success("New stock added successfully!");
      }
      handleCloseModal();
      fetchStocks();
    } catch (err) {
      console.error("Failed to save stock:", err);
      message.error(err.response?.data?.message || "Failed to save stock");
    }
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await manageStockService.deleteStock(deleteRecord.id);
      message.success("Stock deleted successfully!");
      setShowDeleteModal(false);
      setDeleteRecord(null);
      fetchStocks();
    } catch (err) {
      console.error("Failed to delete stock:", err);
      message.error(err.response?.data?.message || "Failed to delete stock");
      setShowDeleteModal(false);
      setDeleteRecord(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

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
          <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
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
            Delete Stock
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this stock?
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

export default ManageStock;
