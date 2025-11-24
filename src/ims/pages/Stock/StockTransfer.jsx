
import { useState, useEffect } from "react";
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
  SettingOutlined,
  DownOutlined,
  UploadOutlined,
  UpOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import stockTransferService from "../Stock/stockTransferService.js";
import warehouseService from "../peoples/WarehouseService.js";

const { Dragger } = Upload;

const StockTransfer = () => {
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("Last 7 Days");
  const [pageSize, setPageSize] = useState(10);
  const [collapsed, setCollapsed] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  // modal states + forms
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [addForm] = Form.useForm();
  const [importForm] = Form.useForm();

  // Fetch data on mount
  useEffect(() => {
    fetchTransfers();
    fetchWarehouses();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const res = await stockTransferService.getTransfers();
      console.log("Stock Transfer API response:", res.data);
      const fetchedTransfers = res.data.rows || res.data || [];
      console.log("Fetched transfers:", fetchedTransfers);
      const mappedData = fetchedTransfers.map(item => {
        console.log("Individual item:", item);
        return {
          key: item.id,
          id: item.id,
          fromWarehouse: item.from_warehouse || item.fromWarehouse || item.from || item.warehouse_from || item.warehouseFrom,
          toWarehouse: item.to_warehouse || item.toWarehouse || item.to || item.warehouse_to || item.warehouseTo,
          noOfProducts: item.no_of_products || item.noOfProducts || item.product_count || 0,
          qtyTransferred: item.qty_transferred || item.qtyTransferred || item.quantity || item.qty || 0,
          refNumber: item.reference_number || item.refNumber || item.ref_number || item.reference,
          date: item.createdAt || item.created_at || item.date,
        };
      });
      console.log("Mapped data:", mappedData);
      setDataSource(mappedData);
    } catch (err) {
      console.error("Failed to fetch transfers:", err);
      console.error("Error details:", err.response?.data);
      message.error(err.response?.data?.message || "Failed to fetch transfers");
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

  const openAddModal = (record = null) => {
    setEditingRecord(record);
    setIsAddModalOpen(true);
    if (record) {
      addForm.setFieldsValue({
        from: record.fromWarehouse,
        to: record.toWarehouse,
        refNumber: record.refNumber,
        product: record.product,
        notes: record.notes,
      });
    } else {
      addForm.resetFields();
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingRecord(null);
    addForm.resetFields();
  };

  const submitAddTransfer = async (values) => {
    try {
      console.log("Form values:", values);
      const transferData = {
        from_warehouse: values.from,
        to_warehouse: values.to,
        reference_number: values.refNumber,
        product: values.product,
        notes: values.notes,
      };
      console.log("Sending to backend:", transferData);

      if (editingRecord) {
        await stockTransferService.updateTransfer(editingRecord.id, transferData);
        message.success("Transfer updated successfully!");
      } else {
        await stockTransferService.createTransfer(transferData);
        message.success("Transfer created successfully!");
      }
      closeAddModal();
      fetchTransfers();
    } catch (err) {
      console.error("Failed to save transfer:", err);
      message.error(err.response?.data?.message || "Failed to save transfer");
    }
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await stockTransferService.deleteTransfer(deleteRecord.id);
      message.success("Transfer deleted successfully!");
      setShowDeleteModal(false);
      setDeleteRecord(null);
      fetchTransfers();
    } catch (err) {
      console.error("Failed to delete transfer:", err);
      message.error(err.response?.data?.message || "Failed to delete transfer");
      setShowDeleteModal(false);
      setDeleteRecord(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
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



  const filteredData = dataSource.filter(
    (item) =>
      (item.fromWarehouse || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (item.toWarehouse || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (item.refNumber || '').toLowerCase().includes(searchText.toLowerCase())
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
      title: "",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openAddModal(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const fromMenu = (
    <Menu>
      {warehouses.map((w, idx) => (
        <Menu.Item key={`f${idx}`}>{w}</Menu.Item>
      ))}
    </Menu>
  );

  const toMenu = (
    <Menu>
      {warehouses.map((w, idx) => (
        <Menu.Item key={`t${idx}`}>{w}</Menu.Item>
      ))}
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

  const warehouseOptions = warehouses.map(w => ({ value: w, label: w }));

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
            onClick={() => openAddModal()}
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
          loading={loading}
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

      {/* ✅ Add/Edit Transfer Modal */}
      <Modal
        title={editingRecord ? "Edit Transfer" : "Add Transfer"}
        open={isAddModalOpen}
        onCancel={closeAddModal}
        footer={null}
        width={500}
        style={{ top: 120 }}
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
              {editingRecord ? "Update" : "Create"}
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
            Delete Transfer
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this transfer?
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

export default StockTransfer;
