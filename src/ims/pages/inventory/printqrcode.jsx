import React, { useState, useMemo } from "react";
import { Select, Input, Table, Switch, Button, Modal } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react";

import NikeJordan from "../../pages/purchases/assets/NikeJordan.png"; // replace with correct image path

const { Option } = Select;

const PrintQRCode = () => {
  const [warehouse, setWarehouse] = useState("");
  const [store, setStore] = useState("");
  const [paperSize, setPaperSize] = useState("");
  const [showReference, setShowReference] = useState(true);
  const [searchText, setSearchText] = useState("");

  // 🟣 Delete Modal States
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // 🟣 QR Preview Modal State
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const [products, setProducts] = useState([
    {
      key: 1,
      image: NikeJordan,
      name: "Nike Jordan",
      sku: "PT002",
      code: "HG3FK",
      ref: "32RRR554",
      qty: 4,
    },
    {
      key: 2,
      image: NikeJordan,
      name: "Adidas UltraBoost",
      sku: "PT005",
      code: "AD345",
      ref: "45AD123",
      qty: 3,
    },
    {
      key: 3,
      image: NikeJordan,
      name: "Puma Running Shoes",
      sku: "PT007",
      code: "PM987",
      ref: "90PM876",
      qty: 2,
    },
  ]);

  // ✅ Search filter logic
  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return products;
    const lowerSearch = searchText.toLowerCase();
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.sku.toLowerCase().includes(lowerSearch) ||
        item.code.toLowerCase().includes(lowerSearch) ||
        item.ref.toLowerCase().includes(lowerSearch)
    );
  }, [searchText, products]);

  const increaseQty = (key) => {
    setProducts(
      products.map((item) =>
        item.key === key ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (key) => {
    setProducts(
      products.map((item) =>
        item.key === key && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  // 🟣 Delete Logic
  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setProducts(products.filter((item) => item.key !== recordToDelete.key));
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  const resetForm = () => {
    setWarehouse("");
    setStore("");
    setPaperSize("");
    setShowReference(true);
    setSearchText("");
  };

  // 🟣 Generate QR Code button click
  const handleGenerateQRCode = () => {
    setQrModalVisible(true);
  };

  // 🟣 Close QR Preview
  const handleCloseQrModal = () => {
    setQrModalVisible(false);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.image}
            alt={record.name}
            className="w-8 h-8 rounded-md object-contain border border-gray-200"
          />
          <span className="font-medium text-gray-800">{record.name}</span>
        </div>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Reference Number",
      dataIndex: "ref",
      key: "ref",
      render: (ref) =>
        showReference ? (
          <span className="text-gray-700">{ref}</span>
        ) : (
          <span className="text-gray-400 italic">Hidden</span>
        ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "center",
      render: (qty, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {/* minus button */}
          <button
            onClick={() => decreaseQty(record.key)}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1px solid rgba(16,24,39,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(16,24,39,0.04)",
            }}
            aria-label="decrease"
            type="button"
          >
            <MinusOutlined />
          </button>

          {/* qty pill */}
          <div
            style={{
              minWidth: 44,
              padding: "6px 8px",
              borderRadius: 18,
              border: "1px solid rgba(16,24,39,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FBFBFD",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            {qty}
          </div>

          {/* plus button */}
          <button
            onClick={() => increaseQty(record.key)}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1px solid rgba(16,24,39,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(16,24,39,0.04)",
            }}
            aria-label="increase"
            type="button"
          >
            <PlusOutlined />
          </button>
        </div>
      ),
    },
    // Right-aligned Delete column
    {
      title: "",
      key: "actions",
      width: 80,
      align: "right",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => handleDeleteClick(record)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid rgba(16,24,39,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(16,24,39,0.04)",
            }}
            aria-label="delete"
            type="button"
          >
            <DeleteOutlined style={{ color: "#4b5563" }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        Print QR Code
      </h2>
      <p className="text-sm text-gray-500 mb-6">Manage your QR codes</p>

      {/* Warehouse & Store */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warehouse <span className="text-red-500">*</span>
          </label>
          <Select
            placeholder="Select"
            value={warehouse || undefined}
            onChange={setWarehouse}
            className="w-full h-[38px]"
          >
            <Option value="Warehouse 1">Warehouse 1</Option>
            <Option value="Warehouse 2">Warehouse 2</Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store <span className="text-red-500">*</span>
          </label>
          <Select
            placeholder="Select"
            value={store || undefined}
            onChange={setStore}
            className="w-full h-[38px]"
          >
            <Option value="Store 1">Store 1</Option>
            <Option value="Store 2">Store 2</Option>
          </Select>
        </div>
      </div>

      {/* Product Search */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Search Product..."
          prefix={<i className="fa fa-search text-gray-400 mr-1"></i>}
          style={{ width: 220, height: 38 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      {/* Product Table */}
      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          pagination={false}
          bordered={false}
          rowClassName="text-sm"
        />
      </div>

      {/* Paper Size + Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paper Size <span className="text-red-500">*</span>
          </label>
          <Select
            placeholder="Select"
            value={paperSize || undefined}
            onChange={setPaperSize}
            className="w-full h-[38px]"
          >
            <Option value="A4">A4</Option>
            <Option value="A5">A5</Option>
            <Option value="A6">A6</Option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={showReference} onChange={setShowReference} />
          <span className="text-sm text-gray-700">Reference Number</span>
        </div>
      </div>

      {/* Buttons (DreamPOS Style - Purple Updated) */}
      <div className="flex flex-wrap justify-end gap-3 mt-4">
        {/* Generate QR */}
        <Button
          icon={<i className="fa fa-eye mr-1"></i>}
          style={{
            backgroundColor: "#7367F0",
            color: "white",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(115, 103, 240, 0.3)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#5E50EE")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#7367F0")
          }
          onClick={handleGenerateQRCode}
        >
          Generate QR Code
        </Button>

        {/* Reset */}
        <Button
          icon={<i className="fa fa-power-off mr-1"></i>}
          onClick={resetForm}
          style={{
            backgroundColor: "#0C1E5B",
            color: "white",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(12, 30, 91, 0.3)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#122B83")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#0C1E5B")
          }
        >
          Reset
        </Button>

        {/* Print */}
        <Button
          icon={<i className="fa fa-print mr-1"></i>}
          style={{
            backgroundColor: "#EA5455",
            color: "white",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(234, 84, 85, 0.3)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#D63D3E")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#EA5455")
          }
        >
          Print QR Code
        </Button>
      </div>

      {/* 🟣 Delete Confirmation Modal */}
      <Modal
        open={deleteModalVisible}
        onCancel={handleCancelDelete}
        footer={null}
        centered
      >
        <div className="text-center">
          <div
            style={{
              backgroundColor: "#F4F1FF",
              width: "60px",
              height: "60px",
              margin: "0 auto",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteOutlined style={{ fontSize: "28px", color: "#6C5CE7" }} />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Delete Product</h3>
          <p className="text-gray-500 mt-1">
            Are you sure you want to delete product?
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <Button
              onClick={handleCancelDelete}
              style={{
                backgroundColor: "#0A2540",
                color: "#fff",
                border: "none",
                minWidth: "90px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              style={{
                backgroundColor: "#6C5CE7",
                color: "#fff",
                border: "none",
                minWidth: "100px",
              }}
            >
              Yes Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* 🟣 QR Preview Modal (Screenshot Style with Purple Button) */}
      <Modal
        open={qrModalVisible}
        onCancel={handleCloseQrModal}
        footer={null}
        width={600}
        centered
        bodyStyle={{ padding: "0" }}
      >
        <div style={{ padding: 24, background: "#fff" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>QR Code</h3>
            <Button
              icon={<i className="fa fa-print mr-1"></i>}
              style={{
                backgroundColor: "#7367F0", // purple instead of orange
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: 6,
                boxShadow: "0 2px 6px rgba(115,103,240,0.3)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#5E50EE")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#7367F0")
              }
            >
              Print QR Code
            </Button>
          </div>

          {/* Body */}
          <div>
            {filteredProducts.slice(0, 1).map((item) => (
              <div key={item.key}>
                <h4
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: "#1f2d3d",
                  }}
                >
                  {item.name}
                </h4>
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 20,
                    width: "fit-content",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <QRCodeCanvas value={item.ref} size={100} />
                    <p
                      style={{
                        marginTop: 10,
                        fontSize: 13,
                        color: "#4b5563",
                      }}
                    >
                      Ref No : {item.ref}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PrintQRCode;
