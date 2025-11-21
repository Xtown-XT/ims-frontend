// // src/pages/peoples/suppliers.jsx
// import React, { useState, useMemo } from "react";
// import {
//   Table,
//   Input,
//   Button,
//   Dropdown,
//   Menu,
//   Tag,
//   Space,
//   Avatar,
//   Pagination,
//   message,
//   Modal,
//   Form,
//   Upload,
//   Select,
//   Switch,
// } from "antd";
// import {
//   SearchOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   PlusOutlined,
//   DownOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
// import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
// import { IoReloadOutline } from "react-icons/io5";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const Suppliers = () => {
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [filtersCollapsed, setFiltersCollapsed] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [form] = Form.useForm();

//   const [suppliers, setSuppliers] = useState([
//     {
//       key: "1",
//       code: "SU001",
//       name: "Apex Computers",
//       email: "apexcomputers@example.com",
//       phone: "+15964712634",
//       country: "Germany",
//       image: "https://cdn-icons-png.flaticon.com/512/3050/3050525.png",
//       status: "Active",
//       address: "45 Industrial Area",
//       city: "Berlin",
//       state: "Berlin",
//       postalCode: "10115",
//     },
//     {
//       key: "2",
//       code: "SU002",
//       name: "Beats Headphones",
//       email: "beatsheadphone@example.com",
//       phone: "+16372895190",
//       country: "Japan",
//       image: "https://cdn-icons-png.flaticon.com/512/9111/9111624.png",
//       status: "Active",
//       address: "12 Sakura Street",
//       city: "Tokyo",
//       state: "Tokyo",
//       postalCode: "100-0001",
//     },
//   ]);

//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [isViewModalVisible, setIsViewModalVisible] = useState(false);
//   const [viewSupplier, setViewSupplier] = useState(null);

//   // 🆕 Added for delete confirmation modal
//   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
//   const [deleteSupplier, setDeleteSupplier] = useState(null);

//   const handleSearch = (e) => setSearchText(e.target.value);
//   const handleMenuClick = (e) => setStatusFilter(e.key);

//   const handleRefresh = () => {
//     setSearchText("");
//     setStatusFilter("All");
//     message.success("Refreshed");
//   };

//   const toggleFilters = () => setFiltersCollapsed((prev) => !prev);

//   const filteredData = useMemo(() => {
//     return suppliers.filter((item) => {
//       const s = searchText.toLowerCase();
//       const matchesSearch =
//         item.name.toLowerCase().includes(s) ||
//         item.email.toLowerCase().includes(s) ||
//         item.country.toLowerCase().includes(s);
//       const matchesStatus =
//         statusFilter === "All" || item.status === statusFilter;
//       return matchesSearch && matchesStatus;
//     });
//   }, [searchText, statusFilter, suppliers]);

//   const handleExportCSV = () => {
//     if (!filteredData.length) return message.info("No data to export");
//     const headers = ["Code", "Name", "Email", "Phone", "Country", "Status"];
//     const csvRows = [headers.join(",")];
//     filteredData.forEach((s) =>
//       csvRows.push(
//         [s.code, s.name, s.email, s.phone, s.country, s.status]
//           .map((v) => `"${String(v).replace(/"/g, '""')}"`)
//           .join(",")
//       )
//     );
//     const blob = new Blob([csvRows.join("\n")], {
//       type: "text/csv;charset=utf-8;",
//     });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.setAttribute(
//       "download",
//       `suppliers_${new Date().toISOString().slice(0, 10)}.csv`
//     );
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     message.success("Excel exported successfully");
//   };

//   const handleExportPDF = () => {
//     if (!filteredData.length) return message.info("No data to export");

//     const doc = new jsPDF({
//       orientation: "landscape",
//       unit: "pt",
//       format: "A4",
//     });
//     doc.setFontSize(16);
//     doc.setTextColor("#9333ea");
//     doc.text("Suppliers Report", 40, 40);

//     autoTable(doc, {
//       startY: 60,
//       head: [["Code", "Name", "Email", "Phone", "Country", "Status"]],
//       body: filteredData.map((s) => [
//         s.code,
//         s.name,
//         s.email,
//         s.phone,
//         s.country,
//         s.status,
//       ]),
//       styles: { fontSize: 10, halign: "left", cellPadding: 5 },
//       headStyles: { fillColor: [147, 51, 234], textColor: 255 },
//       alternateRowStyles: { fillColor: [245, 245, 245] },
//     });

//     doc.save(`suppliers_${new Date().toISOString().slice(0, 10)}.pdf`);
//     message.success("PDF downloaded successfully");
//   };

//   const showAddModal = () => {
//     setIsEditMode(false);
//     setSelectedSupplier(null);
//     form.resetFields();
//     setIsModalVisible(true);
//   };

//   const showEditModal = (record) => {
//     setIsEditMode(true);
//     setSelectedSupplier(record);
//     const [firstName, ...rest] = record.name.split(" ");
//     const lastName = rest.join(" ");
//     form.setFieldsValue({
//       firstName,
//       lastName,
//       email: record.email,
//       phone: record.phone,
//       address: record.address,
//       city: record.city,
//       state: record.state,
//       country: record.country,
//       postalCode: record.postalCode,
//       status: record.status === "Active",
//     });
//     setIsModalVisible(true);
//   };

//   const showViewModal = (record) => {
//     setViewSupplier(record);
//     setIsViewModalVisible(true);
//   };

//   const handleCloseViewModal = () => {
//     setViewSupplier(null);
//     setIsViewModalVisible(false);
//   };

//   const handleCancel = () => {
//     form.resetFields();
//     setIsModalVisible(false);
//     setIsEditMode(false);
//   };

//   const handleSubmit = (values) => {
//     const newSupplier = {
//       key:
//         isEditMode && selectedSupplier
//           ? selectedSupplier.key
//           : Date.now().toString(),
//       code:
//         isEditMode && selectedSupplier
//           ? selectedSupplier.code
//           : `SU${String(suppliers.length + 1).padStart(3, "0")}`,
//       name: `${values.firstName} ${values.lastName}`,
//       email: values.email,
//       phone: values.phone,
//       country: values.country,
//       image:
//         (isEditMode && selectedSupplier && selectedSupplier.image) ||
//         "https://cdn-icons-png.flaticon.com/512/3050/3050525.png",
//       status: values.status ? "Active" : "Inactive",
//       address: values.address,
//       city: values.city,
//       state: values.state,
//       postalCode: values.postalCode,
//     };

//     if (isEditMode && selectedSupplier) {
//       setSuppliers((prev) =>
//         prev.map((s) => (s.key === selectedSupplier.key ? newSupplier : s))
//       );
//       message.success(`Supplier "${newSupplier.name}" updated successfully!`);
//     } else {
//       setSuppliers((prev) => [newSupplier, ...prev]);
//       message.success(`Supplier "${newSupplier.name}" added successfully!`);
//     }

//     form.resetFields();
//     setIsModalVisible(false);
//     setIsEditMode(false);
//   };

//   // 🆕 Updated delete logic
//   const openDeleteModal = (record) => {
//     setDeleteSupplier(record);
//     setIsDeleteModalVisible(true);
//   };

//   const handleConfirmDelete = () => {
//     setSuppliers((prev) => prev.filter((s) => s.key !== deleteSupplier.key));
//     message.success(`Supplier "${deleteSupplier?.name}" deleted successfully!`);
//     setIsDeleteModalVisible(false);
//     setDeleteSupplier(null);
//   };

//   const handleCancelDelete = () => {
//     setIsDeleteModalVisible(false);
//     setDeleteSupplier(null);
//   };

//   const columns = [
//     { title: "Code", dataIndex: "code", key: "code" },
//     {
//       title: "Supplier",
//       dataIndex: "name",
//       key: "name",
//       render: (text, record) => (
//         <Space>
//           <Avatar src={record.image} />
//           {text}
//         </Space>
//       ),
//     },
//     { title: "Email", dataIndex: "email", key: "email" },
//     { title: "Phone", dataIndex: "phone", key: "phone" },
//     { title: "Country", dataIndex: "country", key: "country" },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) =>
//         status === "Active" ? (
//           <Tag color="green">Active</Tag>
//         ) : (
//           <Tag color="red">Inactive</Tag>
//         ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="text"
//             icon={<EyeOutlined />}
//             title="View"
//             onClick={() => showViewModal(record)}
//           />
//           <Button
//             type="text"
//             icon={<EditOutlined />}
//             title="Edit"
//             onClick={() => showEditModal(record)}
//           />
//           <Button
//             type="text"
//             icon={<DeleteOutlined style={{ color: "black" }} />}
//             title="Delete"
//             onClick={() => openDeleteModal(record)} // 🆕 updated
//           />
//         </Space>
//       ),
//     },
//   ];

//   const menu = (
//     <Menu onClick={handleMenuClick}>
//       <Menu.Item key="Active">Active</Menu.Item>
//       <Menu.Item key="Inactive">Inactive</Menu.Item>
//     </Menu>
//   );

//   const pageSizeMenu = (
//     <Menu onClick={(e) => setPageSize(Number(e.key))}>
//       <Menu.Item key="10">10</Menu.Item>
//       <Menu.Item key="25">25</Menu.Item>
//       <Menu.Item key="50">50</Menu.Item>
//       <Menu.Item key="100">100</Menu.Item>
//     </Menu>
//   );

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-sm">
//       <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">Suppliers</h2>
//           <p className="text-sm text-gray-500">Manage your Suppliers</p>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <Button
//             icon={<FaFilePdf color="red" size={16} />}
//             onClick={handleExportPDF}
//             title="Export to PDF"
//           />
//           <Button
//             icon={<FaFileExcel color="green" size={16} />}
//             onClick={handleExportCSV}
//             title="Export to Excel"
//           />
//           <Button
//             icon={<IoReloadOutline color="#9333ea" size={18} />}
//             onClick={handleRefresh}
//             title="Refresh"
//           />
//           <Button
//             icon={
//               <FaAngleUp
//                 color="#9333ea"
//                 size={16}
//                 style={{
//                   transform: filtersCollapsed ? "rotate(180deg)" : "rotate(0deg)",
//                   transition: "transform 0.2s",
//                 }}
//               />
//             }
//             onClick={toggleFilters}
//             title={filtersCollapsed ? "Expand filters" : "Collapse filters"}
//           />
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             style={{
//               background: "#9333ea",
//               borderColor: "#9333ea",
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//             }}
//             onClick={showAddModal}
//           >
//             Add Supplier
//           </Button>
//         </div>
//       </div>

//       {!filtersCollapsed && (
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
//           <Input
//             prefix={<SearchOutlined style={{ fontSize: "12px", color: "#999" }} />}
//             placeholder="Search by name or email"
//             value={searchText}
//             onChange={handleSearch}
//             style={{ width: 220 }}
//             allowClear
//           />
//           <Dropdown overlay={menu}>
//             <Button size="small">
//               Status <DownOutlined style={{ fontSize: 10, marginLeft: 6 }} />
//             </Button>
//           </Dropdown>
//         </div>
//       )}

//       <Table
//         columns={columns}
//         dataSource={filteredData.slice(
//           (currentPage - 1) * pageSize,
//           currentPage * pageSize
//         )}
//         pagination={false}
//         bordered={false}
//         className="rounded-md"
//       />

//       <div className="flex justify-between items-center mt-4">
//         <div className="flex items-center gap-2 text-gray-600 text-sm">
//           <span>Row Per Page</span>
//           <Dropdown overlay={pageSizeMenu} placement="top">
//             <Button className="border border-gray-300 rounded-md px-2 py-1">
//               {pageSize} <DownOutlined style={{ marginLeft: 6 }} />
//             </Button>
//           </Dropdown>
//           <span>Entries</span>
//         </div>
//         <Pagination
//           current={currentPage}
//           total={filteredData.length}
//           pageSize={pageSize}
//           onChange={setCurrentPage}
//           showSizeChanger={false}
//         />
//       </div>

//       {/* Add/Edit Supplier Modal */}
//       <Modal
//         title={isEditMode ? "Edit Supplier" : "Add Supplier"}
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         width={600}
//         centered
//       >
//         <Form layout="vertical" form={form} onFinish={handleSubmit}>
//           <Form.Item label="Upload Image">
//             <Upload maxCount={1} listType="picture-card">
//               <div>
//                 <UploadOutlined /> Upload Image
//               </div>
//             </Upload>
//             <p>JPEG, PNG up to 2 MB</p>
//           </Form.Item>

//           <div className="flex gap-3">
//             <Form.Item
//               name="firstName"
//               label="First Name"
//               rules={[{ required: true, message: "Please enter first name" }]}
//               className="flex-1"
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               name="lastName"
//               label="Last Name"
//               rules={[{ required: true, message: "Please enter last name" }]}
//               className="flex-1"
//             >
//               <Input />
//             </Form.Item>
//           </div>

//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[{ required: true, message: "Please enter email" }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="phone"
//             label="Phone"
//             rules={[{ required: true, message: "Please enter phone number" }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="address"
//             label="Address"
//             rules={[{ required: true, message: "Please enter address" }]}
//           >
//             <Input />
//           </Form.Item>

//           <div className="flex gap-3">
//             <Form.Item
//               name="city"
//               label="City"
//               rules={[{ required: true, message: "Please select city" }]}
//               className="flex-1"
//             >
//               <Select>
//                 <Select.Option value="Berlin">Berlin</Select.Option>
//                 <Select.Option value="Tokyo">Tokyo</Select.Option>
//                 <Select.Option value="Chennai">Chennai</Select.Option>
//               </Select>
//             </Form.Item>
//             <Form.Item
//               name="state"
//               label="State"
//               rules={[{ required: true, message: "Please select state" }]}
//               className="flex-1"
//             >
//               <Select>
//                 <Select.Option value="Berlin">Berlin</Select.Option>
//                 <Select.Option value="Tokyo">Tokyo</Select.Option>
//                 <Select.Option value="TN">Tamil Nadu</Select.Option>
//               </Select>
//             </Form.Item>
//           </div>

//           <div className="flex gap-3">
//             <Form.Item
//               name="country"
//               label="Country"
//               rules={[{ required: true, message: "Please select country" }]}
//               className="flex-1"
//             >
//               <Select>
//                 <Select.Option value="India">India</Select.Option>
//                 <Select.Option value="Germany">Germany</Select.Option>
//                 <Select.Option value="Japan">Japan</Select.Option>
//               </Select>
//             </Form.Item>
//             <Form.Item
//               name="postalCode"
//               label="Postal Code"
//               rules={[{ required: true, message: "Please enter postal code" }]}
//               className="flex-1"
//             >
//               <Input />
//             </Form.Item>
//           </div>

//           <Form.Item name="status" label="Status" valuePropName="checked">
//             <Switch defaultChecked />
//           </Form.Item>

//           <div className="flex justify-end gap-3">
//             <Button onClick={handleCancel}>Cancel</Button>
//             <Button type="primary" htmlType="submit">
//               {isEditMode ? "Save Changes" : "Add Supplier"}
//             </Button>
//           </div>
//         </Form>
//       </Modal>

//       {/* View Supplier Modal */}
//       <Modal
//         title="Supplier Details"
//         open={isViewModalVisible}
//         onCancel={handleCloseViewModal}
//         footer={[
//           <Button key="close" onClick={handleCloseViewModal}>
//             Close
//           </Button>,
//         ]}
//         width={700}
//         centered
//       >
//         {viewSupplier ? (
//           <div className="p-4">
//             <div className="flex items-center gap-4 mb-4">
//               <Avatar size={80} src={viewSupplier.image} />
//               <div>
//                 <h3 className="text-lg font-semibold">{viewSupplier.name}</h3>
//                 <p className="text-sm text-gray-500">
//                   Code: {viewSupplier.code}
//                 </p>
//                 <div style={{ marginTop: 6 }}>
//                   {viewSupplier.status === "Active" ? (
//                     <Tag color="green">Active</Tag>
//                   ) : (
//                     <Tag color="red">Inactive</Tag>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               <div>
//                 <p className="text-xs text-gray-400">Email</p>
//                 <p className="text-sm">{viewSupplier.email || "-"}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400">Phone</p>
//                 <p className="text-sm">{viewSupplier.phone || "-"}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400">Address</p>
//                 <p className="text-sm">{viewSupplier.address || "-"}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400">City / State</p>
//                 <p className="text-sm">
//                   {viewSupplier.city || "-"}{" "}
//                   {viewSupplier.state ? `/ ${viewSupplier.state}` : ""}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400">Country</p>
//                 <p className="text-sm">{viewSupplier.country || "-"}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400">Postal Code</p>
//                 <p className="text-sm">{viewSupplier.postalCode || "-"}</p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div>Loading...</div>
//         )}
//       </Modal>

//       {/* 🆕 Delete Confirmation Modal */}
//       <Modal
//         open={isDeleteModalVisible}
//         onCancel={handleCancelDelete}
//         footer={null}
//         centered
//         width={400}
//         className="delete-modal"
//       >
//         <div className="text-center p-4">
//           <div
//             className="flex justify-center items-center mb-3"
//             style={{
//               background: "#fdecea",
//               width: 60,
//               height: 60,
//               margin: "0 auto",
//               borderRadius: "50%",
//             }}
//           >
//             <DeleteOutlined style={{ color: "black", fontSize: 28 }} />
//           </div>
//           <h3 className="text-lg font-semibold mb-1">Delete Supplier</h3>
//           <p className="text-gray-500 mb-5">
//             Are you sure you want to delete supplier?
//           </p>
//           <div className="flex justify-center gap-3">
//             <Button
//               onClick={handleCancelDelete}
//               style={{
//                 background: "#001f3f",
//                 color: "#fff",
//                 border: "none",
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               danger
//               type="primary"
//               onClick={handleConfirmDelete}
//               style={{
//                 background: "#ff8c00",
//                 border: "none",
//               }}
//             >
//               Yes Delete
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Suppliers;

import React, { useState, useMemo, useEffect } from "react";
import { Switch, Table, Input, Select, Button, Modal, Form, message, Upload, Avatar } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FaFilePdf, FaFileExcel, FaAngleUp } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import customerService from "./CustomerService.js";

const { Option } = Select;

const Customers = () => {
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false);
  const [checked, setChecked] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      
      try {
        setLoading(true);
        const res = await customerService.getCustomers(page, limit, search);
        console.log("API response:", res.data);
        const customerData = res.data.data?.customers || res.data.customers || [];
        console.log("Customer data:", customerData);
        console.log("First customer image:", customerData[0]?.image);
        setCustomers(customerData);
        setTotal(res.data.data?.total || res.data.total || 0);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        message.error(err.response?.data?.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, search]);

  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    if (filterStatus) {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    return filtered;
  }, [filterStatus, customers]);

  const onChange = (ch) => {
    setChecked(ch);
    form.setFieldsValue({ status: ch ? "active" : "inactive" });
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditRecord(null);
    setChecked(true);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      status: "active",
    });
    setShowForm(true);
  };

  const handleAddCustomer = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('address', values.address || "");
      formData.append('city', values.city || "");
      formData.append('state', values.state || "");
      formData.append('country', values.country || "");
      formData.append('postal_code', values.postal_code || "");
      formData.append('status', checked ? "active" : "inactive");
      
      if (fileList.length > 0) {
        const imageFile = fileList[0].originFileObj || fileList[0];
        console.log("Uploading image:", imageFile);
        console.log("Image file type:", imageFile.type);
        console.log("Image file size:", imageFile.size);
        formData.append('image', imageFile, imageFile.name);
      } else {
        console.log("No image selected");
      }

      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await customerService.createCustomer(formData);
      console.log("Create response:", response);
      message.success("Customer added successfully");
      setShowForm(false);
      form.resetFields();
      setFileList([]);
      setIsEditMode(false);
      setEditRecord(null);
      
      // Refetch data
      const res = await customerService.getCustomers(page, limit, search);
      const customerData = res.data.data?.customers || res.data.customers || [];
      setCustomers(customerData);
      setTotal(res.data.data?.total || res.data.total || 0);
    } catch (err) {
      console.error("Failed to add customer:", err);
      message.error(err.response?.data?.message || "Failed to add customer");
    }
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditRecord(record);
    form.setFieldsValue({
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      phone: record.phone,
      address: record.address,
      city: record.city,
      state: record.state,
      country: record.country,
      postal_code: record.postal_code,
      status: record.status,
    });
    setChecked(record.status?.toLowerCase() === "active");
    
    if (record.image) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: record.image,
      }]);
    } else {
      setFileList([]);
    }
    
    setShowForm(true);
  };

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();

      if (!editRecord) {
        message.error("No record selected for editing");
        return;
      }

      const formData = new FormData();
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('address', values.address || "");
      formData.append('city', values.city || "");
      formData.append('state', values.state || "");
      formData.append('country', values.country || "");
      formData.append('postal_code', values.postal_code || "");
      formData.append('status', checked ? "active" : "inactive");
      
      if (fileList.length > 0) {
        const imageFile = fileList[0].originFileObj || fileList[0];
        console.log("Updating with image:", imageFile);
        formData.append('image', imageFile, imageFile.name);
      }

      await customerService.updateCustomer(editRecord.id, formData);
      message.success("Customer updated successfully");
      setShowForm(false);
      setIsEditMode(false);
      setEditRecord(null);
      form.resetFields();
      setFileList([]);
      
      // Refetch data
      const res = await customerService.getCustomers(page, limit, search);
      const customerData = res.data.data?.customers || res.data.customers || [];
      setCustomers(customerData);
      setTotal(res.data.data?.total || res.data.total || 0);
    } catch (err) {
      console.error("Failed to update customer:", err);
      message.error(err.response?.data?.message || "Failed to update customer");
    }
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await customerService.deleteCustomer(deleteRecord.id);
      message.success("Customer deleted successfully");
      setShowDeleteModal(false);
      setDeleteRecord(null);
      
      // Refetch data
      const res = await customerService.getCustomers(page, limit, search);
      const customerData = res.data.data?.customers || res.data.customers || [];
      setCustomers(customerData);
      setTotal(res.data.data?.total || res.data.total || 0);
    } catch (err) {
      console.error("Failed to delete customer:", err);
      message.error(err.response?.data?.message || "Failed to delete customer");
      setShowDeleteModal(false);
      setDeleteRecord(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteRecord(null);
  };

  const toggleFilters = () => {
    setFiltersCollapsed((s) => !s);
  };

  const handleRefresh = () => {
    setSearch("");
    setFilterStatus(null);
    setPage(1);
    message.success("Refreshed");
  };

  const handleExportCSV = () => {
    if (!customers || !customers.length) {
      message.info("No data to export");
      return;
    }

    const dataToExport = filteredCustomers.length ? filteredCustomers : customers;
    const headers = ["first_name", "last_name", "email", "phone", "city", "country", "status"];
    const csvRows = [];
    csvRows.push(headers.join(","));
    dataToExport.forEach((row) => {
      const values = headers.map((h) => {
        const v = row[h] ?? "";
        const safe = String(v).replace(/"/g, '""');
        return `"${safe}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `customers_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("CSV exported");
  };

  const handleExportPDF = () => {
    const dataToExport = filteredCustomers.length ? filteredCustomers : customers;
    if (!dataToExport || !dataToExport.length) {
      message.info("No data to export");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });
    doc.setFontSize(16);
    doc.setTextColor("#9333ea");
    doc.text("Customers Report", 40, 40);

    const columns = [
      { header: "First Name", dataKey: "first_name" },
      { header: "Last Name", dataKey: "last_name" },
      { header: "Email", dataKey: "email" },
      { header: "Phone", dataKey: "phone" },
      { header: "City", dataKey: "city" },
      { header: "Country", dataKey: "country" },
      { header: "Status", dataKey: "status" },
    ];

    autoTable(doc, {
      startY: 60,
      columns,
      body: dataToExport,
      styles: { fontSize: 10, halign: "left", cellPadding: 5 },
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`customers_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success("PDF downloaded successfully");
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedKeys(customers.map((item) => item.id));
    } else {
      setSelectedKeys([]);
    }
  };

  const handleSelectOne = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    onRemove: () => {
      setFileList([]);
    },
  };

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectedKeys.length === customers.length && customers.length > 0}
          onChange={handleSelectAll}
          style={{ accentColor: "#7E57C2", cursor: "pointer" }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedKeys.includes(record.id)}
          onChange={() => handleSelectOne(record.id)}
          style={{ accentColor: "#7E57C2", cursor: "pointer" }}
        />
      ),
      width: 50,
    },
    {
      title: "Customer",
      dataIndex: "first_name",
      key: "first_name",
      render: (_, record) => {
        console.log("Rendering customer:", record.first_name, "Image:", record.image);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar 
              src={record.image} 
              icon={<UserOutlined />}
              size={32}
            />
            <span>{`${record.first_name} ${record.last_name}`}</span>
          </div>
        );
      },
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <button
          style={{
            backgroundColor: record?.status?.toLowerCase() === "active" ? "#3EB780" : "#d63031",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            height: "22px",
            width: "46px",
            fontSize: "11px",
            fontWeight: "500",
            cursor: "default",
            textTransform: "capitalize",
          }}
        >
          {record?.status}
        </button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Customers</h2>
          <p className="text-sm text-gray-500">Manage your customers</p>
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
            icon={<FaAngleUp color="#9333ea" size={16} />}
            onClick={toggleFilters}
            title={filtersCollapsed ? "Expand filters" : "Collapse filters"}
            style={{
              transform: filtersCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
          <Button type="primary" onClick={openAddModal}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <PlusCircleOutlined style={{ color: "#fff" }} />
              <span>Add Customer</span>
            </div>
          </Button>
        </div>
      </div>

      {!filtersCollapsed && (
        <div>
          <Form className="flex flex-wrap gap-3 mb-4 justify-between items-center">
            <Input
              placeholder="Search customer..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
            />
            <div className="flex gap-3">
              <Form.Item>
                <Select
                  placeholder="Status"
                  style={{ width: 150 }}
                  value={filterStatus}
                  onChange={(val) => setFilterStatus(val)}
                  allowClear
                >
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
        </div>
      )}

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            onChange: (newPage) => setPage(newPage),
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          rowKey="id"
          className="bg-white"
          bordered={false}
          rowClassName={() => "hover:bg-gray-50"}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  className="bg-gray-100 text-gray-600 font-bold text-sm px-6 py-3"
                />
              ),
            },
            body: {
              cell: (props) => (
                <td {...props} className="px-6 py-3" />
              ),
              row: (props) => (
                <tr
                  {...props}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                />
              ),
            },
          }}
        />
      </div>

      <Modal
        title={
          <span className="font-semibold">
            {isEditMode ? "Edit Customer" : "Add Customer"}
          </span>
        }
        open={showForm}
        onCancel={() => {
          setShowForm(false);
          setIsEditMode(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        centered
        width={600}
      >
        <Form layout="vertical" form={form}>
          <div className="flex gap-3">
            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">First Name</span>}
              name="first_name"
              rules={[{ required: true, message: "Please enter first name" }]}
              className="mb-3 flex-1"
            >
              <Input placeholder="First Name" />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">Last Name</span>}
              name="last_name"
              rules={[{ required: true, message: "Please enter last name" }]}
              className="mb-3 flex-1"
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" }
            ]}
            className="mb-3"
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Phone</span>}
            name="phone"
            rules={[{ required: true, message: "Please enter phone" }]}
            className="mb-3"
          >
            <Input placeholder="Phone" maxLength={10} />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Address</span>}
            name="address"
            className="mb-3"
          >
            <Input.TextArea placeholder="Address" rows={2} />
          </Form.Item>

          <div className="flex gap-3">
            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">City</span>}
              name="city"
              className="mb-3 flex-1"
            >
              <Input placeholder="City" />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">State</span>}
              name="state"
              className="mb-3 flex-1"
            >
              <Input placeholder="State" />
            </Form.Item>
          </div>

          <div className="flex gap-3">
            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">Country</span>}
              name="country"
              className="mb-3 flex-1"
            >
              <Input placeholder="Country" />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">Postal Code</span>}
              name="postal_code"
              className="mb-3 flex-1"
            >
              <Input placeholder="Postal Code" />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Customer Image</span>}
            className="mb-3"
          >
            <Upload {...uploadProps} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <Form.Item name="status" valuePropName="checked" noStyle>
              <Switch
                size="small"
                checked={checked}
                onChange={(ch) => {
                  onChange(ch);
                  form.setFieldsValue({ status: ch ? "active" : "inactive" });
                }}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => {
                setShowForm(false);
                setIsEditMode(false);
                form.resetFields();
                setFileList([]);
              }}
              style={{
                backgroundColor: "#0A2540",
                color: "#fff",
                border: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: "#7E57C2",
                borderColor: "#7E57C2",
                color: "#fff",
              }}
              onClick={isEditMode ? handleSaveChanges : handleAddCustomer}
            >
              {isEditMode ? "Save Changes" : "Add Customer"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal open={showDeleteModal} onCancel={cancelDelete} footer={null} centered>
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
            Delete Customer
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 25 }}>
            Are you sure you want to delete this customer?
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
                backgroundColor: "#7E57C2",
                borderColor: "#7E57C2",
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

export default Customers;




