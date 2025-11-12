import React from "react";
import { Button } from "antd";
import { PrinterOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = (location.state && location.state.product) || null;

  const barcodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${
    product?.sku || "86102192"
  }&size=150x150`;

  return (
    <div
      style={{
        background: "#f9fafb",
        minHeight: "100vh",
        padding: "20px 30px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              color: "#9333ea",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Product Details
          </h2>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Full details of a product
          </p>
        </div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/ims/inventory/products")}
          style={{
            background: "#9333ea",
            borderColor: "#9333ea",
            color: "#fff",
            borderRadius: 6,
          }}
        >
          Back to Product List
        </Button>
      </div>

      {/* Product Card */}
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "flex-start",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 20,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* LEFT: Product Info */}
        <div style={{ flex: 1 }}>
          {/* Barcode Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #e5e7eb",
              borderRadius: 4,
              padding: "10px 20px",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <img
                src={barcodeUrl}
                alt="Barcode"
                style={{ width: 160, height: 60, objectFit: "contain" }}
              />
              <span style={{ fontWeight: 500, fontSize: 14 }}>
                {product?.sku || "86102192"}
              </span>
            </div>
            <Button
              icon={<PrinterOutlined />}
              onClick={() => {
                const w = window.open("");
                if (w) {
                  w.document.write(
                    `<img src="${barcodeUrl}" style="width:200px;height:80px;" />`
                  );
                  w.document.close();
                  w.print();
                  w.close();
                }
              }}
              style={{
                background: "#9333ea",
                borderColor: "#9333ea",
                color: "#fff",
                borderRadius: 6,
              }}
            />
          </div>

          {/* Product Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <tbody>
              {[
                ["Product", product?.productname || "Macbook pro"],
                ["Category", product?.category || "Computers"],
                ["Sub Category", product?.subcategory || "None"],
                ["Brand", product?.brand || "None"],
                ["Unit", product?.unit || "Piece"],
                ["SKU", product?.sku || "PT0001"],
                ["Minimum Qty", product?.minqty || "5"],
                ["Quantity", product?.quantity || "50"],
                ["Tax", product?.tax || "0.00 %"],
                ["Discount Type", product?.discounttype || "Percentage"],
                ["Price", product?.price || "1500.00"],
                ["Status", product?.status || "Active"],
                [
                  "Description",
                  product?.description ||
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
                ],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td
                    style={{
                      border: "1px solid #e5e7eb",
                      padding: "10px 12px",
                      fontWeight: 600,
                      color: "#374151",
                      width: "35%",
                      background: "#fbfbff",
                      verticalAlign: "top",
                    }}
                  >
                    {label}
                  </td>
                  <td
                    style={{
                      border: "1px solid #e5e7eb",
                      padding: "10px 12px",
                      color: "#4b5563",
                    }}
                  >
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT: Image Card */}
        <div
          style={{
            width: "320px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "#fff",
            textAlign: "center",
            padding: 12,
          }}
        >
          <img
            src={
              product?.image ||
              "https://via.placeholder.com/300x200?text=Product+Image"
            }
            alt="Product"
            style={{
              width: "100%",
              height: 200,
              objectFit: "contain",
              marginBottom: 8,
              borderRadius: 4,
            }}
          />
          <p style={{ fontWeight: 600, color: "#374151", marginBottom: 4 }}>
            {product?.imageName || "macbookpro.jpg"}
          </p>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 0 }}>
            {product?.imageSize || "581kb"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
