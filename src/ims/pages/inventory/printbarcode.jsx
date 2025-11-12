import React, { useState, useMemo } from "react";
import { Select, Input, Table, Switch, Button, Modal } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import NikeJordan from "../../pages/purchases/assets/NikeJordan.png";
import AppleWatch from "../../pages/purchases/assets/AppleWatch.png";

const { Option } = Select;

const PrintBarcode = () => {
  const [warehouse, setWarehouse] = useState("");
  const [store, setStore] = useState("");
  const [paperSize, setPaperSize] = useState("");
  const [searchText, setSearchText] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // New state: modal for generated barcode preview
  const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);

  const [products, setProducts] = useState([
    {
      key: 1,
      image: NikeJordan,
      name: "Nike Jordan",
      sku: "PT002",
      code: "HG3FK",
      qty: 4,
      price: 400,
      storeName: "Grocery Alpha",
    },
    {
      key: 2,
      image: AppleWatch,
      name: "Apple Series 5 Watch",
      sku: "PT003",
      code: "TEUIU7",
      qty: 4,
      price: 300,
      storeName: "Grocery Alpha",
    },
    {
      key: 3,
      image: NikeJordan,
      name: "Nike Air Max",
      sku: "PT004",
      code: "NIK123",
      qty: 2,
      price: 250,
      storeName: "Grocery Alpha",
    },
  ]);

  const [showStoreName, setShowStoreName] = useState(true);
  const [showProductName, setShowProductName] = useState(true);
  const [showPrice, setShowPrice] = useState(true);

  // ✅ Filtered product list based on search text
  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return products;
    const lowerSearch = searchText.toLowerCase();
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.sku.toLowerCase().includes(lowerSearch) ||
        item.code.toLowerCase().includes(lowerSearch)
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
    setSearchText("");
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
              borderRadius: 999,
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
              borderRadius: 999,
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
    // New right-aligned actions column for Delete icon (in the right corner)
    {
      title: "",
      key: "actions",
      width: 90,
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

  // Open the "preview barcode" modal
  const handleGenerateClick = () => {
    // Keep current form state; just open modal that shows generated barcode preview
    setBarcodeModalVisible(true);
  };

  // Close barcode preview modal
  const handleCloseBarcodeModal = () => {
    setBarcodeModalVisible(false);
  };

  // Helper that creates a CSS barcode-like block (visual only)
  const BarcodeVisual = ({ code }) => {
    // repeating-linear-gradient to mimic vertical bars
    const style = {
      width: "220px",
      height: "70px",
      margin: "0 auto 8px",
      background:
        "repeating-linear-gradient(90deg, #10243b 0 4px, transparent 4px 8px)",
      borderRadius: 2,
      boxSizing: "border-box",
    };
    return (
      <div style={{ textAlign: "center" }}>
        <div style={style} />
        <div style={{ marginTop: 6, color: "#8a8a8a", fontSize: 12 }}>{code}</div>
      </div>
    );
  };

  // Group products by name to render header + cards like screenshot
  const groupedByName = filteredProducts.reduce((acc, p) => {
    if (!acc[p.name]) acc[p.name] = [];
    acc[p.name].push(p);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        Print Barcode
      </h2>
      <p className="text-sm text-gray-500 mb-6">Manage your barcodes</p>

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

      {/* Paper Size + Switches */}
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
          <Switch checked={showStoreName} onChange={setShowStoreName} />
          <span className="text-sm text-gray-700">Show Store Name</span>
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={showProductName} onChange={setShowProductName} />
          <span className="text-sm text-gray-700">Show Product Name</span>
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={showPrice} onChange={setShowPrice} />
          <span className="text-sm text-gray-700">Show Price</span>
        </div>
      </div>

      {/* Buttons (DreamPOS Style - Purple Updated) */}
      <div className="flex flex-wrap justify-end gap-3 mt-4">
        {/* Generate Barcode */}
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
          onClick={handleGenerateClick} // opens the generated barcode preview modal
        >
          Generate Barcode
        </Button>

        {/* Reset Barcode */}
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
            (e.currentTarget.style.backgroundColor = "#122e83")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#0C1E5B")
          }
        >
          Reset Barcode
        </Button>

        {/* Print Barcode */}
        <Button
          icon={<i className="fa fa-print mr-1"></i>}
          style={{
            backgroundColor: "#E21B1B",
            color: "white",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(226, 27, 27, 0.3)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#c21818")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#E21B1B")
          }
        >
          Print Barcode
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

      {/* ---------------------------------------------------------------- */}
      {/* Barcode Preview Modal (opened when clicking Generate Barcode) */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        open={barcodeModalVisible}
        onCancel={handleCloseBarcodeModal}
        footer={null}
        width={900}
        centered
        bodyStyle={{ padding: 0 }}
        closeIcon={
          <div
            style={{
              background: "#fff",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              color: "#333",
            }}
          >
            ×
          </div>
        }
      >
        {/* Modal content wrapper */}
        <div style={{ padding: 24, background: "#fff" }}>
          {/* Header row: title + action button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Barcode</h3>

            {/* Print Barcode action button (replaced orange with purple as requested) */}
            <div>
              <Button
                icon={<i className="fa fa-print mr-1"></i>}
                style={{
                  backgroundColor: "#7367F0", // purple instead of orange
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 6,
                  boxShadow: "0 2px 6px rgba(115,103,240,0.25)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#5E50EE")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#7367F0")
                }
                // keep for future: print functionality
                onClick={() => {
                  // For now just close modal or you can trigger print
                  // window.print(); // optional
                }}
              >
                Print Barcode
              </Button>
            </div>
          </div>

          <div style={{ padding: "8px 10px 24px 10px" }}>
            {/* main area: emulate screenshot layout */}
            <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: 8 }}>
              {Object.keys(groupedByName).map((productName) => (
                <div key={productName} style={{ marginBottom: 28 }}>
                  {/* Product group header */}
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1f2d3d", marginBottom: 12 }}>
                    {productName}
                  </div>

                  {/* cards grid */}
                  <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                    {groupedByName[productName].map((p) => (
                      <div
                        key={p.key}
                        style={{
                          width: 260,
                          minHeight: 170,
                          borderRadius: 8,
                          border: "1px solid rgba(16,24,39,0.06)",
                          background: "#fff",
                          padding: 16,
                          boxSizing: "border-box",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          boxShadow: "0 1px 4px rgba(10,10,10,0.02)",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          {/* store name */}
                          {showStoreName && (
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1f3b57" }}>
                              {p.storeName || "Store Name"}
                            </div>
                          )}

                          {/* product name */}
                          {showProductName && (
                            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
                              {p.name}
                            </div>
                          )}

                          {/* price */}
                          {showPrice && (
                            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
                              Price: ${p.price ?? ""}
                            </div>
                          )}

                          {/* barcode visual */}
                          <div style={{ marginTop: 12 }}>
                            <BarcodeVisual code={p.code} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* if no products found */}
              {filteredProducts.length === 0 && (
                <div style={{ textAlign: "center", color: "#6b7280", padding: 24 }}>
                  No products to display
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
      {/* ---------------------------------------------------------------- */}
    </div>
  );
};

export default PrintBarcode;
