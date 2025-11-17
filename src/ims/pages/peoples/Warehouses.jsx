// src/pages/peoples/warehouses.jsx
import React, { useState, useMemo, useEffect } from "react"; // added useEffect
import {
  Table,
  Input,
  Button,
  Dropdown,
  Menu,
  Tag,
  Space,
  Pagination,
  message,
  Modal,
  Form,
  Select,
  Switch,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import warehouseService from "../peoples/WarehouseService"; // ADDED: service import

const Warehouses = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();

  const [warehouses, setWarehouses] = useState([
    {
      key: "1",
      warehouse: "Lavish Warehouse",
      contact: "Chad Taylor",
      phone: "+12498345785",
      email: "lavish@example.com",
      totalProducts: 10,
      stock: 600,
      qty: 80,
      created: "24 Dec 2024",
      status: "Active",
      address: "12 Main Street",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      postalCode: "600001",
      products: [
        { id: 1, name: "Laptop", stock: 50, price: "$800" },
        { id: 2, name: "Keyboard", stock: 100, price: "$25" },
      ],
    },
    {
      key: "2",
      warehouse: "Quaint Warehouse",
      contact: "Jennifer Lopez",
      phone: "+13197521863",
      email: "quaint@example.com",
      totalProducts: 8,
      stock: 300,
      qty: 85,
      created: "10 Dec 2024",
      status: "Active",
      address: "23 River Road",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      postalCode: "400001",
      products: [
        { id: 1, name: "Monitor", stock: 30, price: "$150" },
        { id: 2, name: "Mouse", stock: 200, price: "$10" },
      ],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewWarehouse, setViewWarehouse] = useState(null);

  // 🆕 Delete Confirmation Modal States
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteWarehouse, setDeleteWarehouse] = useState(null);

  // ---------------------------
  // fetch function declared so other handlers (create/update) can call it
  // ---------------------------
  const fetchWarehouses = async () => {
    try {
      const res = await warehouseService.getWarehouses(
        currentPage,
        pageSize,
        searchText
      );

      const rows = res?.data?.data?.rows ?? [];

      const mapped = rows.map((r) => ({
        key: r.id || r.key || String(Math.random()),
        warehouse: r.warehouse_name || r.warehouse || "",
        contact: r.Contact_person || r.contact || "",
        phone: r.phone_number || r.phone || r.phone_work || "",
        email: r.email || "",
        totalProducts: r.totalProducts || 0,
        stock: r.stock || 0,
        qty: r.qty || 0,
        created: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString()
          : r.created || "",
        status: r.status || "Active",
        address: r.address || "",
        city: r.city || "",
        state: r.state || "",
        country: r.country || "",
        postalCode: r.postalCode || r.postal_code || "",
        products: r.products || [],
      }));

      setWarehouses(mapped);
    } catch (err) {
      console.error("Failed to fetch warehouses from API:", err);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [currentPage, pageSize, searchText]);

  const handleSearch = (e) => setSearchText(e.target.value);
  const handleMenuClick = (e) => setStatusFilter(e.key);
  const toggleFilters = () => setFiltersCollapsed((prev) => !prev);

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter("All");
    setCurrentPage(1);
    message.success("Refreshed");
  };

  const filteredData = useMemo(() => {
    return warehouses.filter((item) => {
      const s = searchText.toLowerCase();
      const matchesSearch =
        item.warehouse.toLowerCase().includes(s) ||
        item.contact.toLowerCase().includes(s);
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, warehouses]);



  // EXPORT TO CSV
  const handleExportCSV = () => {
    if (!filteredData.length) return message.info("No data to export");
    const headers = [
      "Warehouse",
      "Contact Person",
      "Phone",
      "Email",
      "Stock",
      "Qty",
      "Created On",
      "Status",
    ];
    const csvRows = [headers.join(",")];
    filteredData.forEach((b) =>
      csvRows.push(
        [
          b.warehouse,
          b.contact,
          b.phone,
          b.email,
          b.stock,
          b.qty,
          b.created,
          b.status,
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
    );
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `warehouses_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Excel exported successfully");
  };

  // EXPORT TO PDF
  const handleExportPDF = () => {
    if (!filteredData.length) return message.info("No data to export");
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });
    doc.setFontSize(16);
    doc.setTextColor("#9333ea");
    doc.text("Warehouses Report", 40, 40);

    autoTable(doc, {
      startY: 60,
      head: [["Warehouse", "Contact", "Phone", "Email", "Stock", "Qty", "Created On", "Status"]],
      body: filteredData.map((b) => [
        b.warehouse,
        b.contact,
        b.phone,
        b.email,
        b.stock,
        b.qty,
        b.created,
        b.status,
      ]),
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`warehouses_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  // ADD/EDIT MODAL LOGIC
  const showAddModal = () => {
    setIsEditMode(false);
    setSelectedWarehouse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEditMode(true);
    setSelectedWarehouse(record);
    form.setFieldsValue({
      warehouse: record.warehouse,
      contactPerson: record.contact,
      email: record.email,
      phone: record.phone,
      address: record.address,
      city: record.city,
      state: record.state,
      country: record.country,
      postalCode: record.postalCode,
      status: record.status === "Active",
    });
    setIsModalVisible(true);
  };

  const showViewModal = async (record) => {
    try {
      setIsViewModalVisible(true);
      setViewWarehouse(null); // Show loading state

      // Fetch warehouse by ID from API
      const res = await warehouseService.getWarehouseById(record.key);
      const data = res?.data?.data;

      if (data) {
        const warehouseDetails = {
          key: data.id || record.key,
          warehouse: data.warehouse_name || record.warehouse,
          contact: data.Contact_person || record.contact,
          phone: data.phone_number || record.phone,
          email: data.email || record.email,
          address: data.address || record.address,
          city: data.city || record.city,
          state: data.state || record.state,
          country: data.country || record.country,
          postalCode: data.postalCode || data.postal_code || record.postalCode,
          status: data.status || record.status,
          totalProducts: data.totalProducts || record.totalProducts,
          stock: data.stock || record.stock,
          qty: data.qty || record.qty,
          created: data.createdAt
            ? new Date(data.createdAt).toLocaleDateString()
            : record.created,
          products: data.products || record.products || [],
        };
        setViewWarehouse(warehouseDetails);
      } else {
        // Fallback to local data if API doesn't return data
        setViewWarehouse(record);
      }
    } catch (err) {
      console.error("Failed to fetch warehouse by ID:", err);
      message.error("Failed to load warehouse details");
      // Fallback to local data on error
      setViewWarehouse(record);
    }
  };

  const handleCloseViewModal = () => {
    setViewWarehouse(null);
    setIsViewModalVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditMode(false);
  };


  const handleSubmit = async (values) => {
  const payload = {
    warehouse_name: values.warehouse,
    Contact_person: values.contactPerson,
    email: values.email,
    phone_number: values.phone,
    phone_work: values.phone, // since the form doesn't have separate work phone
    address: values.address,
    city: values.city,
    state: values.state,
    country: values.country,
  };

  try {
    if (!isEditMode) {
      // CREATE API CALL
      const res = await warehouseService.createWarehouse(payload);

      message.success("Warehouse created successfully!");

      // Add new item to table without refreshing the page (optimistic)
      const newItem = {
        key: res.data?.data?.id ?? String(Math.random()),
        warehouse: res.data?.data?.warehouse_name ?? payload.warehouse_name,
        contact: res.data?.data?.Contact_person ?? payload.Contact_person,
        phone: res.data?.data?.phone_number ?? payload.phone_number,
        email: res.data?.data?.email ?? payload.email,
        address: res.data?.data?.address ?? payload.address,
        city: res.data?.data?.city ?? payload.city,
        state: res.data?.data?.state ?? payload.state,
        country: res.data?.data?.country ?? payload.country,
        created: res.data?.data?.createdAt ? new Date(res.data.data.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        status: "Active",
        products: [],
      };

      setWarehouses((prev) => [newItem, ...prev]);

      // THEN fetch fresh data from backend to keep everything consistent
      await fetchWarehouses();
    } else {
      // UPDATE API CALL
      const res = await warehouseService.updateWarehouse(selectedWarehouse.key, payload);

      message.success("Warehouse updated successfully!");

      // Update the local state optimistically
      const updatedWarehouse = {
        key: selectedWarehouse.key,
        warehouse: res.data?.data?.warehouse_name ?? payload.warehouse_name,
        contact: res.data?.data?.Contact_person ?? payload.Contact_person,
        phone: res.data?.data?.phone_number ?? payload.phone_number,
        email: res.data?.data?.email ?? payload.email,
        address: res.data?.data?.address ?? payload.address,
        city: res.data?.data?.city ?? payload.city,
        state: res.data?.data?.state ?? payload.state,
        country: res.data?.data?.country ?? payload.country,
        postalCode: selectedWarehouse?.postalCode,
        totalProducts: selectedWarehouse?.totalProducts || 0,
        stock: selectedWarehouse?.stock || 0,
        qty: selectedWarehouse?.qty || 0,
        created: selectedWarehouse?.created,
        status: values.status ? "Active" : "Inactive",
        products: selectedWarehouse?.products || [],
      };

      setWarehouses((prev) =>
        prev.map((w) => (w.key === selectedWarehouse.key ? updatedWarehouse : w))
      );

      // THEN fetch fresh data from backend to keep everything consistent
      await fetchWarehouses();
    }
  } catch (err) {
    console.error("Create Warehouse Error:", err);
    message.error("Failed to create warehouse");
  } finally {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditMode(false);
  }
};

  // 🆕 Delete Modal Logic
  const openDeleteModal = (record) => {
    setDeleteWarehouse(record);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // DELETE API CALL
      await warehouseService.deleteWarehouse(deleteWarehouse.key);

      message.success(`Warehouse "${deleteWarehouse?.warehouse}" deleted successfully!`);

      // Remove from local state
      setWarehouses((prev) => prev.filter((w) => w.key !== deleteWarehouse.key));

      // Fetch fresh data from backend to keep everything consistent
      await fetchWarehouses();
    } catch (err) {
      console.error("Delete Warehouse Error:", err);
      message.error("Failed to delete warehouse");
    } finally {
      setIsDeleteModalVisible(false);
      setDeleteWarehouse(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteWarehouse(null);
  };

  const columns = [
    { title: "Warehouse", dataIndex: "warehouse", key: "warehouse" },
    { title: "Contact Person", dataIndex: "contact", key: "contact" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    { title: "Qty", dataIndex: "qty", key: "qty" },
    { title: "Created On", dataIndex: "created", key: "created" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "Active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            title="View"
            onClick={() => showViewModal(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            title="Edit"
            onClick={() => showEditModal(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "black" }} />}
            title="Delete"
            onClick={() => openDeleteModal(record)} // ✅ Updated
          />
        </Space>
      ),
    },
  ];

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="Active">Active</Menu.Item>
      <Menu.Item key="Inactive">Inactive</Menu.Item>
    </Menu>
  );

  const pageSizeMenu = (
    <Menu onClick={(e) => setPageSize(Number(e.key))}>
      <Menu.Item key="10">10</Menu.Item>
      <Menu.Item key="25">25</Menu.Item>
      <Menu.Item key="50">50</Menu.Item>
      <Menu.Item key="100">100</Menu.Item>
    </Menu>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Warehouses</h2>
          <p className="text-sm text-gray-500">Manage your warehouses</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button
            icon={<FaFilePdf color="red" size={16} />}
            onClick={handleExportPDF}
            title="Export to PDF"
          />
          <Button
            icon={<FaFileExcel color="green" size={16} />}
            onClick={handleExportCSV}
            title="Export to Excel"
          />
          <Button
            icon={<IoReloadOutline color="#9333ea" size={18} />}
            onClick={handleRefresh}
            title="Refresh"
          />
          <Button
            icon={
              <FaAngleUp
                color="#9333ea"
                size={16}
                style={{
                  transform: filtersCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            }
            onClick={toggleFilters}
            title={filtersCollapsed ? "Expand filters" : "Collapse filters"}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              background: "#9333ea",
              borderColor: "#9333ea",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onClick={showAddModal}
          >
            Add Warehouse
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      {!filtersCollapsed && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <Input
            prefix={<SearchOutlined style={{ fontSize: "12px", color: "#999" }} />}
            placeholder="Search by warehouse or contact"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 260 }}
            allowClear
          />
          <Dropdown overlay={menu}>
            <Button size="small">
              Status <DownOutlined style={{ fontSize: 10, marginLeft: 6 }} />
            </Button>
          </Dropdown>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        pagination={false}
        bordered={false}
        className="rounded-md"
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span>Row Per Page</span>
          <Dropdown overlay={pageSizeMenu} placement="top">
            <Button className="border border-gray-300 rounded-md px-2 py-1">
              {pageSize} <DownOutlined style={{ marginLeft: 6 }} />
            </Button>
          </Dropdown>
          <span>Entries</span>
        </div>
        <Pagination
          current={currentPage}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>

      {/* Add/Edit Warehouse Modal */}
      <Modal
        title={isEditMode ? "Edit Warehouse" : "Add Warehouse"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="warehouse"
            label="Warehouse"
            rules={[{ required: true, message: "Please enter warehouse name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="contactPerson"
            label="Contact Person"
            rules={[{ required: true, message: "Please select contact person" }]}
          >
            <Select>
              <Select.Option value="Chad Taylor">Chad Taylor</Select.Option>
              <Select.Option value="Jennifer Lopez">Jennifer Lopez</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input />
          </Form.Item>

          <div className="flex gap-3">
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please select city" }]}
              className="flex-1"
            >
              <Select>
                <Select.Option value="Chennai">Chennai</Select.Option>
                <Select.Option value="Mumbai">Mumbai</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please select state" }]}
              className="flex-1"
            >
              <Select>
                <Select.Option value="Tamil Nadu">Tamil Nadu</Select.Option>
                <Select.Option value="Maharashtra">Maharashtra</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex gap-3">
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please select country" }]}
              className="flex-1"
            >
              <Select>
                <Select.Option value="India">India</Select.Option>
                <Select.Option value="USA">USA</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="postalCode"
              label="Postal Code"
              rules={[{ required: true, message: "Please enter postal code" }]}
              className="flex-1"
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Save Changes" : "Add Warehouse"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Warehouse Modal */}
      <Modal
        title="Warehouse Details"
        open={isViewModalVisible}
        onCancel={handleCloseViewModal}
        footer={[
          <Button key="close" onClick={handleCloseViewModal}>
            Close
          </Button>,
        ]}
        width={700}
        centered
      >
        {viewWarehouse ? (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3">
              {viewWarehouse.warehouse}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-400">Contact Person</p>
                <p className="text-sm">{viewWarehouse.contact}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm">{viewWarehouse.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm">{viewWarehouse.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="text-sm">{viewWarehouse.address}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">City</p>
                <p className="text-sm">{viewWarehouse.city}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">State</p>
                <p className="text-sm">{viewWarehouse.state}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Country</p>
                <p className="text-sm">{viewWarehouse.country}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Postal Code</p>
                <p className="text-sm">{viewWarehouse.postalCode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <Tag
                  color={
                    viewWarehouse.status === "Active" ? "green" : "red"
                  }
                >
                  {viewWarehouse.status}
                </Tag>
              </div>
            </div>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">
              Product Details
            </h4>
            <Table
              dataSource={viewWarehouse.products}
              columns={[
                { title: "Product Name", dataIndex: "name", key: "name" },
                { title: "Stock", dataIndex: "stock", key: "stock" },
                { title: "Price", dataIndex: "price", key: "price" },
              ]}
              pagination={false}
              bordered
              size="small"
              rowKey="id"
            />
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>

      {/* 🆕 Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalVisible}
        onCancel={handleCancelDelete}
        footer={null}
        centered
        width={400}
      >
        <div className="text-center p-4">
          <div
            className="flex justify-center items-center mb-3"
            style={{
              background: "#fdecea",
              width: 60,
              height: 60,
              margin: "0 auto",
              borderRadius: "50%",
            }}
          >
            <DeleteOutlined style={{ color: "black", fontSize: 28 }} />
          </div>
          <h3 className="text-lg font-semibold mb-1">Delete Warehouse</h3>
          <p className="text-gray-500 mb-5">
            Are you sure you want to delete this warehouse?
          </p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={handleCancelDelete}
              style={{
                background: "#001f3f",
                color: "#fff",
                border: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              danger
              type="primary"
              onClick={handleConfirmDelete}
              style={{
                background: "#ff8c00",
                border: "none",
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

export default Warehouses;