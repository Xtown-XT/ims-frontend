// src/pages/peoples/suppliers.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  Menu,
  Tag,
  Space,
  Avatar,
  Pagination,
  message,
  Modal,
  Form,
  Upload,
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
  UploadOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SupplierService from "./SuppliersService";

const Suppliers = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewSupplier, setViewSupplier] = useState(null);

  // 🆕 Added for delete confirmation modal
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteSupplier, setDeleteSupplier] = useState(null);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      console.log("Fetching suppliers...");
      const res = await SupplierService.getSuppliers(
        currentPage,
        pageSize,
        searchText
      );

      console.log("Full API Response:", res);
      console.log("Response data:", res?.data);

      // Handle different response structures
      let rows = [];
      
      // Try different possible response structures
      if (res?.data?.data?.suppliers) {
        // For suppliers endpoint
        rows = res.data.data.suppliers;
      } else if (res?.data?.suppliers) {
        rows = res.data.suppliers;
      } else if (res?.data?.data?.rows) {
        rows = res.data.data.rows;
      } else if (res?.data?.data) {
        // If data is directly an array
        rows = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      } else if (res?.data?.rows) {
        rows = res.data.rows;
      } else if (res?.data) {
        // If data is directly an array
        rows = Array.isArray(res.data) ? res.data : [res.data];
      }

      console.log("Extracted rows:", rows);
      console.log("Number of suppliers:", rows.length);

      const mapped = rows.map((r, index) => {
        console.log("=== RAW SUPPLIER DATA ===");
        console.log("Full object:", JSON.stringify(r, null, 2));
        console.log("Available fields:", Object.keys(r));
        console.log("Field values:");
        Object.keys(r).forEach(key => {
          console.log(`  ${key}:`, r[key]);
        });
        console.log("========================");
        
        // Construct full name from first_name and last_name
        const fullName = r.first_name && r.last_name 
          ? `${r.first_name} ${r.last_name}`.trim()
          : r.supplier_name || r.name || "";
        
        // Generate supplier code if not provided by API
        const supplierCode = r.supplier_code || r.code || `SUP${String(index + 1).padStart(3, "0")}`;
        
        return {
          key: r.id || r.key || String(Math.random()),
          code: supplierCode,
          name: fullName,
          email: r.email || "",
          phone: r.phone || r.phone_number || "",
          country: r.country || "",
          image: r.image || "https://cdn-icons-png.flaticon.com/512/3050/3050525.png",
          status: r.status || "Active",
          address: r.address || "",
          city: r.city || "",
          state: r.state || "",
          postalCode: r.postal_code || r.postalCode || "",
          // Store original first/last names for editing
          firstName: r.first_name || "",
          lastName: r.last_name || "",
        };
      });

      console.log("Mapped suppliers:", mapped);
      setSuppliers(mapped);
      
      if (mapped.length === 0) {
        console.warn("No suppliers found in the response");
      }
    } catch (err) {
      console.error("Failed to fetch suppliers from API:", err);
      console.error("Error details:", err.response?.data);
      console.error("Error status:", err.response?.status);
      message.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage, pageSize, searchText]);

  const handleSearch = (e) => setSearchText(e.target.value);
  const handleMenuClick = (e) => setStatusFilter(e.key);

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter("All");
    setCurrentPage(1);
    fetchSuppliers();
    message.success("Refreshed");
  };

  const toggleFilters = () => setFiltersCollapsed((prev) => !prev);

  const filteredData = useMemo(() => {
    return suppliers.filter((item) => {
      const s = searchText.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(s) ||
        item.email.toLowerCase().includes(s) ||
        item.country.toLowerCase().includes(s);
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, suppliers]);

  const handleExportCSV = () => {
    if (!filteredData.length) return message.info("No data to export");
    const headers = ["Code", "Name", "Email", "Phone", "Country", "Status"];
    const csvRows = [headers.join(",")];
    filteredData.forEach((s) =>
      csvRows.push(
        [s.code, s.name, s.email, s.phone, s.country, s.status]
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
      `suppliers_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Excel exported successfully");
  };

  const handleExportPDF = () => {
    if (!filteredData.length) return message.info("No data to export");

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });
    doc.setFontSize(16);
    doc.setTextColor("#9333ea");
    doc.text("Suppliers Report", 40, 40);

    autoTable(doc, {
      startY: 60,
      head: [["Code", "Name", "Email", "Phone", "Country", "Status"]],
      body: filteredData.map((s) => [
        s.code,
        s.name,
        s.email,
        s.phone,
        s.country,
        s.status,
      ]),
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`suppliers_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  const showAddModal = () => {
    setIsEditMode(false);
    setSelectedSupplier(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEditMode(true);
    setSelectedSupplier(record);
    const [firstName, ...rest] = record.name.split(" ");
    const lastName = rest.join(" ");
    form.setFieldsValue({
      firstName,
      lastName,
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
      setViewSupplier(null); // Show loading state

      // Fetch supplier by ID from API
      const res = await SupplierService.getSupplierById(record.key);
      const data = res?.data?.data;

      if (data) {
        const fullName = data.first_name && data.last_name
          ? `${data.first_name} ${data.last_name}`.trim()
          : data.supplier_name || record.name;
        
        const supplierDetails = {
          key: data.id || record.key,
          code: data.supplier_code || record.code,
          name: fullName,
          email: data.email || record.email,
          phone: data.phone || data.phone_number || record.phone,
          country: data.country || record.country,
          image: data.image || record.image,
          status: data.status || record.status,
          address: data.address || record.address,
          city: data.city || record.city,
          state: data.state || record.state,
          postalCode: data.postal_code || data.postalCode || record.postalCode,
        };
        setViewSupplier(supplierDetails);
      } else {
        // Fallback to local data if API doesn't return data
        setViewSupplier(record);
      }
    } catch (err) {
      console.error("Failed to fetch supplier by ID:", err);
      message.error("Failed to load supplier details");
      // Fallback to local data on error
      setViewSupplier(record);
    }
  };

  const handleCloseViewModal = () => {
    setViewSupplier(null);
    setIsViewModalVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditMode(false);
  };

  const handleSubmit = async (values) => {
    const payload = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      state: values.state,
      country: values.country,
      postal_code: values.postalCode,
      status: values.status ? "Active" : "Inactive",
    };

    try {
      if (!isEditMode) {
        // CREATE API CALL
        const res = await SupplierService.createSupplier(payload);

        message.success("Supplier created successfully!");

        // Add new item to table without refreshing the page (optimistic)
        const newItem = {
          key: res.data?.data?.id ?? String(Math.random()),
          code: res.data?.data?.supplier_code ?? `SU${String(suppliers.length + 1).padStart(3, "0")}`,
          name: res.data?.data?.first_name && res.data?.data?.last_name
            ? `${res.data.data.first_name} ${res.data.data.last_name}`.trim()
            : `${payload.first_name} ${payload.last_name}`.trim(),
          email: res.data?.data?.email ?? payload.email,
          phone: res.data?.data?.phone ?? payload.phone,
          country: res.data?.data?.country ?? payload.country,
          image: res.data?.data?.image ?? "https://cdn-icons-png.flaticon.com/512/3050/3050525.png",
          status: res.data?.data?.status ?? payload.status,
          address: res.data?.data?.address ?? payload.address,
          city: res.data?.data?.city ?? payload.city,
          state: res.data?.data?.state ?? payload.state,
          postalCode: res.data?.data?.postal_code ?? payload.postal_code,
          firstName: res.data?.data?.first_name ?? payload.first_name,
          lastName: res.data?.data?.last_name ?? payload.last_name,
        };

        setSuppliers((prev) => [newItem, ...prev]);

        // THEN fetch fresh data from backend to keep everything consistent
        await fetchSuppliers();
      } else {
        // UPDATE API CALL
        const res = await SupplierService.updateSupplier(selectedSupplier.key, payload);

        message.success("Supplier updated successfully!");

        // Update the local state optimistically
        const updatedSupplier = {
          key: selectedSupplier.key,
          code: selectedSupplier.code,
          name: res.data?.data?.first_name && res.data?.data?.last_name
            ? `${res.data.data.first_name} ${res.data.data.last_name}`.trim()
            : `${payload.first_name} ${payload.last_name}`.trim(),
          email: res.data?.data?.email ?? payload.email,
          phone: res.data?.data?.phone ?? payload.phone,
          country: res.data?.data?.country ?? payload.country,
          image: selectedSupplier.image,
          status: payload.status,
          address: res.data?.data?.address ?? payload.address,
          city: res.data?.data?.city ?? payload.city,
          state: res.data?.data?.state ?? payload.state,
          postalCode: res.data?.data?.postal_code ?? payload.postal_code,
          firstName: res.data?.data?.first_name ?? payload.first_name,
          lastName: res.data?.data?.last_name ?? payload.last_name,
        };

        setSuppliers((prev) =>
          prev.map((s) => (s.key === selectedSupplier.key ? updatedSupplier : s))
        );

        // THEN fetch fresh data from backend to keep everything consistent
        await fetchSuppliers();
      }
    } catch (err) {
      console.error("Supplier Error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      console.error("Payload sent:", payload);
      message.error(err.response?.data?.message || err.message || "Failed to save supplier");
    } finally {
      form.resetFields();
      setIsModalVisible(false);
      setIsEditMode(false);
    }
  };

  // 🆕 Updated delete logic
  const openDeleteModal = (record) => {
    setDeleteSupplier(record);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // DELETE API CALL
      await SupplierService.deleteSupplier(deleteSupplier.key);

      message.success(`Supplier "${deleteSupplier?.name}" deleted successfully!`);

      // Remove from local state
      setSuppliers((prev) => prev.filter((s) => s.key !== deleteSupplier.key));

      // Fetch fresh data from backend to keep everything consistent
      await fetchSuppliers();
    } catch (err) {
      console.error("Delete Supplier Error:", err);
      message.error("Failed to delete supplier");
    } finally {
      setIsDeleteModalVisible(false);
      setDeleteSupplier(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteSupplier(null);
  };

  const columns = [
    { title: "Code", dataIndex: "code", key: "code" },
    {
      title: "Supplier",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar src={record.image} />
          {text}
        </Space>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Country", dataIndex: "country", key: "country" },
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
            onClick={() => openDeleteModal(record)} // 🆕 updated
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
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Suppliers</h2>
          <p className="text-sm text-gray-500">Manage your Suppliers</p>
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
            Add Supplier
          </Button>
        </div>
      </div>

      {!filtersCollapsed && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <Input
            prefix={<SearchOutlined style={{ fontSize: "12px", color: "#999" }} />}
            placeholder="Search by name or email"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 220 }}
            allowClear
          />
          <Dropdown overlay={menu}>
            <Button size="small">
              Status <DownOutlined style={{ fontSize: 10, marginLeft: 6 }} />
            </Button>
          </Dropdown>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={filteredData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        pagination={false}
        bordered={false}
        className="rounded-md"
        loading={loading}
      />

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

      {/* Add/Edit Supplier Modal */}
      <Modal
        title={isEditMode ? "Edit Supplier" : "Add Supplier"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item label="Upload Image">
            <Upload maxCount={1} listType="picture-card">
              <div>
                <UploadOutlined /> Upload Image
              </div>
            </Upload>
            <p>JPEG, PNG up to 2 MB</p>
          </Form.Item>

          <div className="flex gap-3">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter first name" }]}
              className="flex-1"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name" }]}
              className="flex-1"
            >
              <Input />
            </Form.Item>
          </div>

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
            rules={[{ required: true, message: "Please enter phone number" }]}
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
                <Select.Option value="Berlin">Berlin</Select.Option>
                <Select.Option value="Tokyo">Tokyo</Select.Option>
                <Select.Option value="Chennai">Chennai</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please select state" }]}
              className="flex-1"
            >
              <Select>
                <Select.Option value="Berlin">Berlin</Select.Option>
                <Select.Option value="Tokyo">Tokyo</Select.Option>
                <Select.Option value="TN">Tamil Nadu</Select.Option>
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
                <Select.Option value="Germany">Germany</Select.Option>
                <Select.Option value="Japan">Japan</Select.Option>
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
              {isEditMode ? "Save Changes" : "Add Supplier"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Supplier Modal */}
      <Modal
        title="Supplier Details"
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
        {viewSupplier ? (
          <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar size={80} src={viewSupplier.image} />
              <div>
                <h3 className="text-lg font-semibold">{viewSupplier.name}</h3>
                <p className="text-sm text-gray-500">
                  Code: {viewSupplier.code}
                </p>
                <div style={{ marginTop: 6 }}>
                  {viewSupplier.status === "Active" ? (
                    <Tag color="green">Active</Tag>
                  ) : (
                    <Tag color="red">Inactive</Tag>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm">{viewSupplier.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm">{viewSupplier.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="text-sm">{viewSupplier.address || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">City / State</p>
                <p className="text-sm">
                  {viewSupplier.city || "-"}{" "}
                  {viewSupplier.state ? `/ ${viewSupplier.state}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Country</p>
                <p className="text-sm">{viewSupplier.country || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Postal Code</p>
                <p className="text-sm">{viewSupplier.postalCode || "-"}</p>
              </div>
            </div>
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
        className="delete-modal"
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
          <h3 className="text-lg font-semibold mb-1">Delete Supplier</h3>
          <p className="text-gray-500 mb-5">
            Are you sure you want to delete supplier?
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

export default Suppliers;
