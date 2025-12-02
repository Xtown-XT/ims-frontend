import React from "react";
import { Button } from "antd";
import { PrinterOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = (location.state && location.state.product) || null;

  // Get barcode from product data
  // Check SingleProduct.Barcode first, then fallback to product.Barcode
  const barcodeData = product?.SingleProduct?.Barcode || product?.Barcode;
  const barcodeText = barcodeData?.text || product?.sku || "86102192";
  
  // Check multiple possible field names for barcode image
  const barcodeImageUrl = barcodeData?.image_url || barcodeData?.imageUrl || barcodeData?.image;
  
  console.log("=== BARCODE DEBUG ===");
  console.log("Full product data:", product);
  console.log("SingleProduct:", product?.SingleProduct);
  console.log("SingleProduct.Barcode:", product?.SingleProduct?.Barcode);
  console.log("product.Barcode:", product?.Barcode);
  console.log("Barcode data used:", barcodeData);
  console.log("Barcode text field:", barcodeData?.text);
  console.log("Barcode image_url:", barcodeData?.image_url);
  console.log("Barcode imageUrl:", barcodeData?.imageUrl);
  console.log("Barcode image:", barcodeData?.image);
  console.log("Final barcode text:", barcodeText);
  console.log("Final barcode image URL:", barcodeImageUrl);
  console.log("Product SKU:", product?.sku);
  console.log("===================");
  
  // Use backend barcode image if available, otherwise generate using external API
  const barcodeUrl = barcodeImageUrl || `https://barcode.tec-it.com/barcode.ashx?data=${barcodeText}&code=Code128&translate-esc=on&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0`;

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
                {barcodeText}
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
                ["Product", product?.product_name || product?.productname || "Macbook pro"],
                ["Category", product?.Category?.category_name || product?.category || "Computers"],
                ["Sub Category", product?.SubCategory?.sub_category_name || product?.subcategory || "None"],
                ["Brand", product?.Brand?.brand_name || product?.brand || "None"],
                ["Unit", product?.Unit?.unit_name || product?.unit || "Piece"],
                ["SKU", product?.sku || "PT0001"],
                ["Minimum Qty", product?.SingleProduct?.min_qty || product?.minqty || "5"],
                ["Quantity", product?.SingleProduct?.quantity || product?.quantity || "50"],
                ["Tax", product?.SingleProduct?.Tax?.tax_name 
                  ? `${product.SingleProduct.Tax.tax_name} (${product.SingleProduct.Tax.tax_percentage}%)` 
                  : product?.tax || "0.00 %"],
                ["Discount Type", product?.SingleProduct?.discount_type || product?.discounttype || "Percentage"],
                ["Price", product?.SingleProduct?.price || product?.price || "1500.00"],
                ["Status", product?.is_active ? "Active" : "Inactive"],
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
              product?.ProductImages?.[0]?.image_url ||
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
            {product?.ProductImages?.[0]?.image_name || product?.imageName || "product-image.jpg"}
          </p>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 0 }}>
            {product?.ProductImages?.[0]?.image_size || product?.imageSize || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
