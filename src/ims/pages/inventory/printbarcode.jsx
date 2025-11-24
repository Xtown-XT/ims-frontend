// src/components/printbarcode/PrintBarcode.jsx
import React, { useState, useMemo, useEffect } from "react";
import { message, Spin } from "antd";
import printbarcodeService from "./printbarcodeService";
import warehouseService from "../peoples/WarehouseService";
import storesService from "../peoples/StoresService";

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
  // form controls
  const [warehouse, setWarehouse] = useState("");
  const [store, setStore] = useState("");
  const [paperSize, setPaperSize] = useState("");
  const [searchText, setSearchText] = useState("");

  // modals
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);

  // main data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ware/store lists
  const [warehouseList, setWarehouseList] = useState([]);
  const [storeList, setStoreList] = useState([]);

  // display toggles
  const [showStoreName, setShowStoreName] = useState(true);
  const [showProductName, setShowProductName] = useState(true);
  const [showPrice, setShowPrice] = useState(true);

  // Helper: normalize various API shapes into an array
  const toArray = (res) => {
    // res may be: array, {data: array}, {data: {data: array}}, {result: array}, etc.
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.result)) return res.result;
    return [];
  };

  // Fetch barcodes, warehouses and stores on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // run them in parallel but ignore individual failures to still show what loads
        await Promise.all([fetchBarcodes(), fetchWarehouses(), fetchStores()]);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch barcodes
  const fetchBarcodes = async () => {
    try {
      const res = await printbarcodeService.getBarcode();
      // normalize to array
      const arr = toArray(res?.data ?? res);
      const items = (arr ?? []).map((p) => ({
        key: p.id ?? p._id ?? p.key ?? `${p.code ?? p.sku ?? Math.random()}`,
        image: p.imageUrl ?? p.image ?? NikeJordan,
        name: p.name ?? p.productName ?? "Unnamed",
        sku: p.sku ?? "",
        code: p.code ?? "",
        qty: p.qty ?? p.quantity ?? 1,
        price: p.price ?? 0,
        storeName: p.storeName ?? p.store?.name ?? "",
      }));
      setProducts(items);
    } catch (err) {
      console.error("Failed to fetch barcodes", err);
      setError("Failed to load barcodes");
      message.error("Failed to load barcodes. Check console/network.");
      setProducts([]); // safe fallback
    }
  };

  // fetch warehouses
  const fetchWarehouses = async () => {
    try {
      const res = await warehouseService.getWarehouses(1, 1000, "");
      const arr = toArray(res?.data ?? res);
      setWarehouseList(arr ?? []);
    } catch (err) {
      console.error("Error loading warehouses:", err);
      setWarehouseList([]);
    }
  };

  // fetch stores
  const fetchStores = async () => {
    try {
      const res = await storesService.getStores(1, 1000, "");
      const arr = toArray(res?.data ?? res);
      setStoreList(arr ?? []);
    } catch (err) {
      console.error("Error loading stores:", err);
      setStoreList([]);
    }
  };

  // Filtered product list based on search text
  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return products;
    const lowerSearch = searchText.toLowerCase();
    return products.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(lowerSearch) ||
        (item.sku || "").toLowerCase().includes(lowerSearch) ||
        (item.code || "").toLowerCase().includes(lowerSearch)
    );
  }, [searchText, products]);

  // qty modifications
  const increaseQty = (key) => {
    setProducts((prev) =>
      prev.map((item) => (item.key === key ? { ...item, qty: (item.qty || 0) + 1 } : item))
    );
  };

  const decreaseQty = (key) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.key === key && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  // delete flow (local + backend)
  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      setLoading(true);
      const id = recordToDelete.key;
      try {
        await printbarcodeService.deleteById(id);
      } catch (err) {
        // log but continue to remove locally
        console.warn("Backend delete failed (ignored):", err);
      }
      setProducts((prev) => prev.filter((item) => item.key !== recordToDelete.key));
      message.success("Deleted product");
    } catch (err) {
      console.error("Delete failed", err);
      message.error("Failed to delete product");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setRecordToDelete(null);
    }
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

  const handleGenerateClick = () => {
    setBarcodeModalVisible(true);
  };

  const handleCloseBarcodeModal = () => {
    setBarcodeModalVisible(false);
  };

  const BarcodeVisual = ({ code }) => {
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

  // Table columns
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
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Code", dataIndex: "code", key: "code" },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "center",
      render: (qty, record) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <button onClick={() => decreaseQty(record.key)} style={{
            width: 30, height: 30, borderRadius: 999, border: "1px solid rgba(16,24,39,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", cursor: "pointer",
            boxShadow: "0 1px 2px rgba(16,24,39,0.04)"
          }} aria-label="decrease" type="button"><MinusOutlined /></button>

          <div style={{
            minWidth: 44, padding: "6px 8px", borderRadius: 18, border: "1px solid rgba(16,24,39,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFBFD", fontWeight: 600, color: "#1f2937",
          }}>{qty}</div>

          <button onClick={() => increaseQty(record.key)} style={{
            width: 30, height: 30, borderRadius: 999, border: "1px solid rgba(16,24,39,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", cursor: "pointer",
            boxShadow: "0 1px 2px rgba(16,24,39,0.04)"
          }} aria-label="increase" type="button"><PlusOutlined /></button>
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 90,
      align: "right",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => handleDeleteClick(record)} style={{
            width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(16,24,39,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", cursor: "pointer",
            boxShadow: "0 1px 2px rgba(16,24,39,0.04)"
          }} aria-label="delete" type="button">
            <DeleteOutlined style={{ color: "#4b5563" }} />
          </button>
        </div>
      ),
    },
  ];

  // Group products by name for preview
  const groupedByName = filteredProducts.reduce((acc, p) => {
    if (!acc[p.name]) acc[p.name] = [];
    acc[p.name].push(p);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Print Barcode</h2>
      <p className="text-sm text-gray-500 mb-6">Manage your barcodes</p>

      {/* Warehouse & Store */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warehouse <span className="text-red-500">*</span>
          </label>
          <Select
            placeholder="Select Warehouse"
            value={warehouse || undefined}
            onChange={(val) => setWarehouse(val)}
            className="w-full h-[38px]"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
            }
          >
            {/* dynamic options */}
            {warehouseList.map((w) => (
              <Option key={w._id ?? w.id ?? w.key} value={w._id ?? w.id ?? w.key}>
                {w.name ?? w.warehouseName ?? w.title ?? "Unnamed Warehouse"}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store <span className="text-red-500">*</span>
          </label>
          <Select
            placeholder="Select Store"
            value={store || undefined}
            onChange={(val) => setStore(val)}
            className="w-full h-[38px]"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
            }
          >
            {storeList.map((s) => (
              <Option key={s._id ?? s.id ?? s.key} value={s._id ?? s.id ?? s.key}>
                {s.name ?? s.storeName ?? "Unnamed Store"}
              </Option>
            ))}
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
          style={{ width: 220, height: 38 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      {/* Product Table */}
      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredProducts}
            pagination={false}
            bordered={false}
            rowClassName="text-sm"
          />
        </Spin>
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

      {/* Buttons */}
      <div className="flex flex-wrap justify-end gap-3 mt-4">
        <Button
          style={{
            backgroundColor: "#7367F0",
            color: "white",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(115, 103, 240, 0.3)",
          }}
          onClick={handleGenerateClick}
        >
          Generate Barcode
        </Button>

        <Button
          onClick={resetForm}
          style={{
            backgroundColor: "#0C1E5B",
            color: "white",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(12, 30, 91, 0.3)",
          }}
        >
          Reset Barcode
        </Button>

        <Button
          style={{
            backgroundColor: "#E21B1B",
            color: "white",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(226, 27, 27, 0.3)",
          }}
        >
          Print Barcode
        </Button>
      </div>

      {/* Delete modal */}
      <Modal open={deleteModalVisible} onCancel={handleCancelDelete} footer={null} centered>
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
          <p className="text-gray-500 mt-1">Are you sure you want to delete product?</p>

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

      {/* Barcode preview modal */}
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
        <div style={{ padding: 24, background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Barcode</h3>
            <div>
              <Button
                style={{
                  backgroundColor: "#7367F0",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 6,
                  boxShadow: "0 2px 6px rgba(115,103,240,0.25)",
                }}
                onClick={() => {
                  // future: trigger print
                }}
              >
                Print Barcode
              </Button>
            </div>
          </div>

          <div style={{ padding: "8px 10px 24px 10px" }}>
            <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: 8 }}>
              {Object.keys(groupedByName).map((productName) => (
                <div key={productName} style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1f2d3d", marginBottom: 12 }}>
                    {productName}
                  </div>

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
                          {showStoreName && <div style={{ fontSize: 14, fontWeight: 700, color: "#1f3b57" }}>{p.storeName || "Store Name"}</div>}
                          {showProductName && <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>{p.name}</div>}
                          {showPrice && <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>Price: ${p.price ?? ""}</div>}
                          <div style={{ marginTop: 12 }}>
                            <BarcodeVisual code={p.code} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div style={{ textAlign: "center", color: "#6b7280", padding: 24 }}>No products to display</div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PrintBarcode;
