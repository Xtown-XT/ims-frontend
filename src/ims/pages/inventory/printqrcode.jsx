import React, { useState, useEffect, useMemo } from "react";
import masterService from "./masterService";
import printqrcodeService from "./printqrcodeService";
import { Select, Input, Table, Switch, Button, Modal } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react";
import NikeJordan from "../../pages/purchases/assets/NikeJordan.png";

const { Option } = Select;

const PrintQRCode = () => {
  const [warehouse, setWarehouse] = useState("");
  const [store, setStore] = useState("");
  const [paperSize, setPaperSize] = useState("");

  const [warehouseList, setWarehouseList] = useState([]);
  const [storeList, setStoreList] = useState([]);

  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [showReference, setShowReference] = useState(true);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [qrModalVisible, setQrModalVisible] = useState(false);

  // FETCH MASTER DATA (WAREHOUSE, STORE, PRODUCTS)
  useEffect(() => {
    fetchAllMasterData();
  }, []);

  // Replace your fetchAllMasterData function with this improved version:

const fetchAllMasterData = async () => {
  try {
    console.log("Fetching master data...");
    
    // Fetch warehouses
    const warehouseRes = await masterService.getWarehouses();
    console.log("🔍 Full Warehouse Response:", warehouseRes);
    console.log("🔍 Response.data:", warehouseRes.data);
    
    let warehouses = [];
    if (warehouseRes.data) {
      // The correct path is: response.data.data.rows
      if (Array.isArray(warehouseRes.data.data?.rows)) {
        warehouses = warehouseRes.data.data.rows;
      } else if (Array.isArray(warehouseRes.data.rows)) {
        warehouses = warehouseRes.data.rows;
      } else if (Array.isArray(warehouseRes.data.data)) {
        warehouses = warehouseRes.data.data;
      } else if (Array.isArray(warehouseRes.data)) {
        warehouses = warehouseRes.data;
      }
    }
    
    console.log("Processed Warehouses:", warehouses);
    console.log("First warehouse object:", warehouses[0]);
    
    // If warehouses is still empty, check the raw response
    if (warehouses.length === 0) {
      console.error("No warehouses found. Raw response data:", warehouseRes.data);
      console.log("Response data keys:", Object.keys(warehouseRes.data || {}));
    } else {
      // Log all possible name fields in the first warehouse
      const firstWarehouse = warehouses[0];
      console.log("Warehouse name fields:", {
        warehouse_name: firstWarehouse.warehouse_name,
        warehouseName: firstWarehouse.warehouseName,
        name: firstWarehouse.name,
        allKeys: Object.keys(firstWarehouse)
      });
    }
    
    setWarehouseList(warehouses);

    // Fetch stores
    const storeRes = await masterService.getStores();
    console.log("Store response:", storeRes);
    let stores = storeRes.data?.data?.rows || storeRes.data?.rows || storeRes.data?.data || storeRes.data || [];
    if (!Array.isArray(stores) && typeof stores === 'object') {
      stores = Object.values(stores);
    }
    console.log("Stores:", stores);
    setStoreList(Array.isArray(stores) ? stores : []);

    // Fetch products
    const productsRes = await masterService.getProducts();
    console.log("Products response:", productsRes);
    let productsData = productsRes.data?.data?.rows || productsRes.data?.rows || productsRes.data?.data || productsRes.data || [];
    if (!Array.isArray(productsData) && typeof productsData === 'object') {
      productsData = Object.values(productsData);
    }
    console.log("Products data:", productsData);

    const mappedProducts = (Array.isArray(productsData) ? productsData : []).map((item, index) => ({
      key: item.id || index + 1,
      productId: item.id,
      image: item.ProductImages?.[0]?.image_url || item.image || item.imageUrl || NikeJordan,
      name: item.product_name || item.productName || item.name || "Unnamed Product",
      sku: item.sku || "",
      code: item.Barcode?.text || item.productCode || item.code || "",
      ref: item.Barcode?.text || item.referenceNumber || item.reference || `REF-${item.id || index}`,
      qty: 1,
    }));

    console.log("Mapped products:", mappedProducts);
    setProducts(mappedProducts);
  } catch (error) {
    console.error("Master data fetch error:", error);
    console.error("Error details:", error.response?.data);
  }
};
  // SEARCH FILTER LOGIC
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

  // QUANTITY UPDATE
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

  // DELETE PRODUCT
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

  // RESET FORM
  const resetForm = () => {
    setWarehouse("");
    setStore("");
    setPaperSize("");
    setShowReference(true);
    setSearchText("");
  };

  // OPEN QR PREVIEW MODAL (VALIDATION FIRST)
  const handleGenerateQRCode = () => {
    if (!warehouse) return alert("Please select warehouse");
    if (!store) return alert("Please select store");
    if (!paperSize) return alert("Select Paper Size");
    if (products.length === 0) return alert("Products not found");

    setQrModalVisible(true);
  };

  // GENERATE QR CODE API CALL
  const generateQRCodeAPI = async () => {
    try {
      const productPayload = products.map((p) => ({
        productId: p.productId,
        quantity: p.qty,
        referenceNumber: p.ref,
        productCode: p.code,
        productName: p.name,
      }));

      const payload = {
        warehouseId: warehouse,
        storeId: store,
        paperSize,
        products: productPayload,
      };

      console.log("Sending Payload: ", payload);

      const res = await printqrcodeService.createqrcode(payload);

      alert("QR Code Created Successfully!");

      setQrModalVisible(false);

      fetchAllMasterData();
    } catch (error) {
      console.error("QR Create Error:", error);
      alert("Failed to generate QR Code!");
    }
  };

  // TABLE COLUMNS
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
          <span className="font-medium">{record.name}</span>
        </div>
      ),
    },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Code", dataIndex: "code", key: "code" },
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
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => decreaseQty(record.key)}
            className="w-8 h-8 rounded-full border flex items-center justify-center bg-white shadow"
          >
            <MinusOutlined />
          </button>

          <span className="px-4 py-1 border rounded-full bg-gray-50 font-semibold">
            {qty}
          </span>

          <button
            onClick={() => increaseQty(record.key)}
            className="w-8 h-8 rounded-full border flex items-center justify-center bg-white shadow"
          >
            <PlusOutlined />
          </button>
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      align: "right",
      render: (_, record) => (
        <button
          onClick={() => handleDeleteClick(record)}
          className="w-9 h-9 rounded-md border flex items-center justify-center bg-white shadow"
        >
          <DeleteOutlined style={{ color: "#4b5563" }} />
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Print QR Code</h2>
      <p className="text-sm text-gray-500 mb-6">Manage your QR codes</p>

      {/* WAREHOUSE & STORE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Warehouse <span className="text-red-500">*</span>
          </label>
          <Select
            placeholder="Select"
            value={warehouse || undefined}
            onChange={setWarehouse}
            className="w-full h-[38px]"
          >
            {warehouseList.map((wh) => (
              <Option key={wh.id || wh._id} value={wh.id || wh._id}>
                {wh.warehouse_name || wh.warehouseName || wh.name || "Unnamed Warehouse"}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Store <span className="text-red-500">*</span>
          </label>
          <Select
            placeholder="Select"
            value={store || undefined}
            onChange={setStore}
            className="w-full h-[38px]"
          >
            {storeList.map((st) => (
              <Option key={st.id || st._id} value={st.id || st._id}>
                {st.store_name || st.storeName || st.name || "Unnamed Store"}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* PRODUCT SEARCH */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">
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

      {/* PRODUCT TABLE */}
      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          pagination={false}
          bordered={false}
          rowClassName="text-sm"
          scroll={{ x: 'max-content' }}
        />
      </div>

      {/* PAPER SIZE + TOGGLE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
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
          <span className="text-sm">Reference Number</span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap justify-end gap-3 mt-4">
        <Button
          onClick={handleGenerateQRCode}
          style={{
            backgroundColor: "#7367F0",
            color: "white",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
          }}
        >
          Generate QR Code
        </Button>

        {/* <Button
          onClick={resetForm}
          style={{
            backgroundColor: "#0C1E5B",
            color: "white",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
          }}
        >
          Reset
        </Button> */}

        <Button
          style={{
            backgroundColor: "#EA5455",
            color: "white",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
          }}
        >
          Print QR Code
        </Button>
      </div>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        open={deleteModalVisible}
        onCancel={handleCancelDelete}
        footer={null}
        centered
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold">Delete Product</h3>
          <p className="text-gray-500">Are you sure you want to delete?</p>

          <div className="flex justify-center gap-3 mt-6">
            <Button
              onClick={handleCancelDelete}
              style={{
                backgroundColor: "#0A2540",
                color: "#fff",
                border: "none",
                minWidth: "100px",
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

      {/* QR PREVIEW MODAL */}
      <Modal
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={null}
        width={600}
        centered
        bodyStyle={{ padding: "0" }}
      >
        <div style={{ padding: 24, background: "#fff" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>QR Code</h3>

            <Button
              onClick={generateQRCodeAPI}
              style={{
                backgroundColor: "#7367F0",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: 6,
              }}
            >
              Save & Print QR
            </Button>
          </div>

          {filteredProducts.slice(0, 1).map((item) => (
            <div key={item.key}>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
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
      </Modal>
    </div>
  );
};

export default PrintQRCode;
