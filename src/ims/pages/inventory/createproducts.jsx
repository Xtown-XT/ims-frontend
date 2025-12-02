import React from "react";
import {
  Collapse,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Button,
  Row,
  Col,
  DatePicker,
  Upload,
  message,
} from "antd";
import { SettingOutlined, PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from 'react';
import { PiImageSquare } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import storeService from "./storeService.js";
import warehouseService from "./warehouseService.js";
import brandService from "./brandsService.js";
import unitService from "./unitService.js";
import categoryService from "./productCategoryService.js";
import subcategoriesService from "./subcategoriesService.js";
import warrantyService from "./warrantyService.js";
import taxService from "./taxService.js";
import api from "../../services/api.js";
import productService from "./productService.js"
import printbarcodeService from "./printbarcodeService.js";
import variantAttributesService from "./variantattributesService.js";

const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;

const CreateProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, productData } = location.state || { mode: "add", productData: null };
  const isEdit = mode === "edit";

  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedBarcodeId, setGeneratedBarcodeId] = useState(null);
  const [productType, setProductType] = useState('single');
  const [variants, setVariants] = useState([]);
  const [variantAttributes, setVariantAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState(null);

  // Dropdown data states
  const [stores, setStores] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handle category change to filter and auto-select subcategories
  const handleCategoryChange = (categoryId) => {
    console.log("Category selected:", categoryId);
    console.log("All subcategories:", subcategories);
    // Filter subcategories based on selected category
    const filtered = subcategories.filter(sub => {
      console.log("Checking subcategory:", sub.subcategory_name, "category_id:", sub.category_id);
      return sub.category_id === categoryId;
    });
    console.log("Filtered subcategories:", filtered);
    setFilteredSubcategories(filtered);

    // Auto-select subcategory if there's only one match
    if (filtered.length === 1) {
      form.setFieldsValue({ subCategory: filtered[0].id });
      console.log("Auto-selected subcategory:", filtered[0].subcategory_name);
    } else {
      // Clear subcategory field when category changes and there are multiple options
      form.setFieldsValue({ subCategory: undefined });
    }
  };

  // Generate barcode function
  const generateBarcode = async () => {
    try {
      console.log("=== BARCODE GENERATION DEBUG ===");

      // Generate a random barcode number (12-13 digits for EAN/UPC format)
      const randomBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      
      console.log("Generated random barcode:", randomBarcode);

      // Create barcode via API
      const payload = {
        text: randomBarcode,
        type: "code128" // or "ean13", "upc", etc. depending on your backend
      };

      console.log("Calling API: /barcode/createBarcode with payload:", payload);

      const response = await printbarcodeService.createBarcode(payload);
      console.log("Barcode creation response:", response.data);

      // Extract the barcode ID and text from response
      const barcodeId = response.data?.data?.id || response.data?.id;
      const barcodeText = response.data?.data?.text || 
                         response.data?.barcode?.text || 
                         response.data?.text || 
                         randomBarcode;

      // Store the barcode ID for later use when creating product
      setGeneratedBarcodeId(barcodeId);
      
      // Set the barcode in the form
      form.setFieldsValue({ itembarcode: barcodeText });
      message.success("Barcode generated successfully");
      console.log("Barcode ID:", barcodeId, "Barcode text:", barcodeText);

    } catch (err) {
      console.error("=== BARCODE GENERATION ERROR ===");
      console.error("Error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.response?.data?.message);
      message.error(err.response?.data?.message || "Failed to generate barcode");
    }
  };

  const [form] = Form.useForm();

  // Handle product type change
  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
    if (e.target.value === 'single') {
      setVariants([]);
    }
  };

  // Add variant row
  const addVariant = () => {
    if (!selectedAttribute) {
      message.error("Please select a variant attribute first");
      return;
    }
    
    const newVariant = {
      id: Date.now(),
      attribute_name: selectedAttribute.variant_name,
      attribute_value: '',
      sku: '',
      quantity: 0,
      price: 0
    };
    setVariants([...variants, newVariant]);
  };

  // Remove variant row
  const removeVariant = (id) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  // Update variant field
  const updateVariant = (id, field, value) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  // Fetch all dropdown data
  useEffect(() => {
    console.log("CreateProducts component mounted, fetching data...");
    fetchAllDropdownData();
  }, []);

  const fetchAllDropdownData = async () => {
    setLoading(true);
    console.log("Fetching dropdown data...");

    // Fetch each API individually with error handling
    try {
      const storesRes = await storeService.getStores();
      console.log("Stores response:", storesRes);
      console.log("Stores response.data:", storesRes.data);
      // Handle multiple possible response structures
      const storesData = Array.isArray(storesRes) ? storesRes :
        (storesRes.data?.rows || storesRes.data?.data?.rows || storesRes.data || []);
      setStores(Array.isArray(storesData) ? storesData : []);
      console.log("Parsed stores:", Array.isArray(storesData) ? storesData.length : 0);
    } catch (err) {
      console.error("Failed to fetch stores:", err.message);
    }

    try {
      const warehousesRes = await warehouseService.getWarehouses();
      console.log("Warehouses response:", warehousesRes.data);
      const warehousesData = warehousesRes.data?.data?.rows || warehousesRes.data?.rows || warehousesRes.data?.data || [];
      setWarehouses(warehousesData);
      console.log("Parsed warehouses:", warehousesData.length);
    } catch (err) {
      console.error("Failed to fetch warehouses:", err.message);
    }

    try {
      const brandsRes = await brandService.getBrands();
      console.log("Brands response:", brandsRes.data);
      const brandsData = brandsRes.data.rows || brandsRes.data.data || [];
      setBrands(brandsData);
      console.log("Parsed brands:", brandsData.length);
    } catch (err) {
      console.error("Failed to fetch brands:", err.message);
    }

    try {
      const unitsRes = await unitService.getUnits();
      console.log("Units response:", unitsRes.data);
      const unitsData = unitsRes.data.data?.rows || unitsRes.data.data || unitsRes.data.rows || [];
      setUnits(unitsData);
      console.log("Parsed units:", unitsData.length);
    } catch (err) {
      console.error("Failed to fetch units:", err.message);
    }

    try {
      const categoriesRes = await categoryService.getCategories();
      console.log("Categories response:", categoriesRes.data);
      const categoriesData = categoriesRes.data.data?.rows || categoriesRes.data.rows || categoriesRes.data.data || [];
      setCategories(categoriesData);
      console.log("Parsed categories:", categoriesData.length);
    } catch (err) {
      console.error("Failed to fetch categories:", err.message);
    }

    try {
      const subcategoriesRes = await subcategoriesService.getSubcategories();
      console.log("Subcategories response:", subcategoriesRes.data);
      const subcategoriesData = subcategoriesRes.data.data?.subcategories || subcategoriesRes.data.subcategories || subcategoriesRes.data.rows || [];
      setSubcategories(subcategoriesData);
      setFilteredSubcategories(subcategoriesData); // Initialize filtered subcategories with all data
      console.log("Parsed subcategories:", subcategoriesData.length);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err.message);
    }

    try {
      const warrantiesRes = await warrantyService.getWarranties();
      console.log("Warranties response:", warrantiesRes.data);
      const warrantiesData = warrantiesRes.data.data?.rows || warrantiesRes.data.rows || warrantiesRes.data.data || [];
      setWarranties(warrantiesData);
      console.log("Parsed warranties:", warrantiesData.length);
    } catch (err) {
      console.error("Failed to fetch warranties:", err.message);
    }

    try {
      const taxesRes = await taxService.getTaxes();
      console.log("Taxes response:", taxesRes.data);
      const taxesData = taxesRes.data.data?.rows || taxesRes.data.rows || taxesRes.data.data || [];
      setTaxes(taxesData);
      console.log("Parsed taxes:", taxesData.length);
    } catch (err) {
      console.error("Failed to fetch taxes:", err.message);
    }

    try {
      const variantAttributesRes = await variantAttributesService.getVariantAttributes();
      console.log("Variant Attributes response:", variantAttributesRes.data);
      const variantAttributesData = variantAttributesRes.data.data?.rows || variantAttributesRes.data.rows || [];
      setVariantAttributes(variantAttributesData);
      console.log("Parsed variant attributes:", variantAttributesData.length);
    } catch (err) {
      console.error("Failed to fetch variant attributes:", err.message);
    }

    setLoading(false);
    console.log("Finished fetching all dropdown data");
  };

  // Prefill form when editing
  useEffect(() => {
    if (isEdit && productData) {
      form.setFieldsValue(productData);
    }
  }, [isEdit, productData, form]);

  // Debug: Log state changes
  useEffect(() => {
    console.log("State updated - Stores:", stores.length, "Warehouses:", warehouses.length, "Brands:", brands.length, "Units:", units.length, "Categories:", categories.length, "Subcategories:", subcategories.length, "Warranties:", warranties.length, "Taxes:", taxes.length);
  }, [stores, warehouses, brands, units, categories, subcategories, warranties, taxes]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log("=== FORM SUBMISSION DEBUG ===");
      console.log("Form Values:", values);

      // Generate slug if not provided (required field)
      const slug = values.slug || values.productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Create FormData
      const formData = new FormData();

      // Check if barcode was generated
      if (!generatedBarcodeId) {
        message.error("Please generate a barcode first");
        setLoading(false);
        return;
      }

      // Build productInfo object
      const productInfo = {
        store_id: values.store,
        warehouse_id: values.warehouse,
        product_name: values.productName,
        slug: slug,
        sku: values.sku,
        category_id: values.category,
        subcategory_id: values.subCategory,
        brand_id: values.brand,
        unit_id: values.unit,
        barcode_symbology_id: generatedBarcodeId, // Use the generated barcode ID
        selling_type: values.sellingType,
        description: values.description || ''
      };

      console.log("Using barcode_symbology_id:", generatedBarcodeId);

      // Append productInfo as JSON string
      formData.append('productInfo', JSON.stringify(productInfo));

      // Build and append singleProduct or variantProducts
      console.log("Product Type:", productType);
      if (productType === 'single') {
        const singleProduct = {
          quantity: parseInt(values.quantity) || 0,
          quantity_alert: parseInt(values.quantityAlert) || 0,
          price: parseFloat(values.price) || 0,
          tax_id: values.tax || null,
          tax_type: values.taxType || 'exclusive',
          discount_type: values.discountType || 'fixed',
          discount_value: values.discountValue ? parseFloat(values.discountValue) : 0
        };
        
        console.log("SingleProduct object:", singleProduct);
        formData.append('singleProduct', JSON.stringify(singleProduct));
      } else if (productType === 'variable') {
        if (variants.length === 0) {
          message.error("Please add at least one variant");
          setLoading(false);
          return;
        }
        
        // Send variants as array
        const variantProductsArray = variants.map(v => ({
          attribute_name: v.attribute_name,
          attribute_value: v.attribute_value,
          sku: v.sku,
          quantity: parseInt(v.quantity) || 0,
          price: parseFloat(v.price) || 0
        }));
        
        console.log("VariantProducts array:", variantProductsArray);
        formData.append('variantProducts', JSON.stringify(variantProductsArray));
      }

      // Build and append customFields if they exist
      const hasCustomFields = values.warranty || values.manufacturer || values.manufacturedDate || values.expiryDate;
      if (hasCustomFields) {
        const customFields = {};
        if (values.warranty) customFields.warranty_id = values.warranty;
        if (values.manufacturer) customFields.manufacturer = values.manufacturer;
        if (values.manufacturedDate) {
          customFields.manufactured_date = values.manufacturedDate.format('YYYY-MM-DD');
        }
        if (values.expiryDate) {
          customFields.expiry_on = values.expiryDate.format('YYYY-MM-DD');
        }
        formData.append('customFields', JSON.stringify(customFields));
      }

      // Add product images
      if (fileList && fileList.length > 0) {
        fileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append('images', file.originFileObj);
          }
        });
      }

      console.log("=== FORMDATA CONTENTS ===");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
      }

      // Call the API with FormData
      console.log("Calling API...", isEdit ? 'UPDATE' : 'CREATE');
      let response;
      if (isEdit && productData?.id) {
        response = await productService.updateProduct(productData.id, formData);
        message.success('Product updated successfully');
      } else {
        response = await productService.createProduct(formData);
        message.success('Product created successfully');
      }

      console.log('Product submission response:', response);

      // Navigate back to products list
      navigate('/ims/inventory/products');
    } catch (err) {
      console.error('=== ERROR SUBMITTING PRODUCT ===');
      console.error('Error object:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error message:', err.response?.data?.message || err.message);
      message.error(err.response?.data?.message || 'Failed to submit product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFailed = (errorInfo) => {
    console.log("=== FORM VALIDATION FAILED ===");
    console.log("Failed fields:", errorInfo.errorFields);
    console.log("Values:", errorInfo.values);
    message.error("Please fill in all required fields");
  };

  return (
    <div className="py-2 px-4 mb-4 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* ✅ Dynamic heading and subheading */}
          <h1 className="text-lg font-bold text-gray-800">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>
          <p className="text-gray-500">
            {isEdit ? "Edit your product details" : "Create new product"}
          </p>
        </div>
        <div className="space-x-2">
          <Button icon={<SettingOutlined />} />
          <Button
            type="primary"
            onClick={() => navigate("/ims/inventory/products")}
          >
            Back to Product
          </Button>

        </div>
      </div>


      <Form form={form} layout="vertical" onFinish={handleSubmit} onFinishFailed={handleSubmitFailed}>
        {/* Product Information */}

        <div className="my-4" style={{ background: "white" }}>
          <Collapse
            defaultActiveKey={["1"]}
            className="rounded-lg border border-gray-200 bg-white shadow-sm"
            expandIconPosition="end"
            ghost
          >
            <Panel
              header={
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-800">
                    Product Information
                  </span>
                </div>
              }
              key="1"
              className="!border-0 [&>.ant-collapse-header]:border-b [&>.ant-collapse-header]:border-gray-200"
            >
              <div className="space-y-6 bg-white p-4">
                <Row gutter={[16, 16]}>
                  {/* First Row */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Store</span>}
                      name="store"
                      rules={[{ required: true, message: "Please select store" }]}
                      className="mb-0"
                    >
                      <Select
                        placeholder="Select store"
                        className="w-full"
                        size="large"
                        loading={loading}
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {Array.isArray(stores) && stores.map(store => (
                          <Select.Option key={store.id} value={store.id}>
                            {store.store_name || store.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Warehouse</span>}
                      name="warehouse"
                      rules={[{ required: true, message: "Please select warehouse" }]}
                      className="mb-0"
                    >
                      <Select
                        placeholder="Select warehouse"
                        className="w-full"
                        size="large"
                        loading={loading}
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {Array.isArray(warehouses) && warehouses.map(warehouse => (
                          <Select.Option key={warehouse.id} value={warehouse.id}>
                            {warehouse.warehouse_name || warehouse.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Second Row */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Product Name</span>}
                      name="productName"
                      rules={[{ required: true, message: "Please enter product name" }]}
                      className="mb-0"
                    >
                      <Input
                        placeholder="Enter product name"
                        className="w-full"
                        size="large"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Slug</span>}
                      name="slug"
                      rules={[{ message: "Please enter SKU" }]}
                      className="mb-0"
                    >
                      <Input
                        placeholder="Enter Slug"
                        className="w-full"
                        size="large"
                      />
                    </Form.Item>
                  </Col>

                  {/* Third Row */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">SKU</span>}
                      name="sku"
                      rules={[{ required: true, message: "Please enter SKU" }]}
                      className="mb-0"
                    >
                      <Input
                        placeholder="Enter SKU"
                        className="w-full"
                        size="large"
                        suffix={
                          <Button
                            type="primary"
                            className="!bg-violet-600 hover:!bg-violet-700 !text-white !border-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              const randomSKU = 'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
                              form.setFieldsValue({ sku: randomSKU });
                            }}
                          >
                            Generate
                          </Button>
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Category</span>}
                      name="category"
                      rules={[{ required: true, message: "Please select category" }]}
                      className="mb-0"
                    >
                      <Select
                        placeholder="Select category"
                        className="w-full"
                        size="large"
                        loading={loading}
                        showSearch
                        onChange={handleCategoryChange}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {Array.isArray(categories) && categories.map(category => (
                          <Select.Option key={category.id} value={category.id}>
                            {category.category_name || category.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Sub Category</span>}
                      name="subCategory"
                      className="mb-0"
                    >
                      <Select
                        placeholder="Select sub category"
                        className="w-full"
                        size="large"
                        loading={loading}
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {Array.isArray(filteredSubcategories) && filteredSubcategories.map(subcategory => (
                          <Select.Option key={subcategory.id} value={subcategory.id}>
                            {subcategory.subcategory_name || subcategory.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Item Barcode</span>}
                      name="itembarcode"
                      className="mb-0"
                    >
                      <Input
                        placeholder="Enter item barcode"
                        className="w-full"
                        size="large"
                        suffix={
                          <Button
                            type="primary"
                            className="!bg-violet-600 hover:!bg-violet-700 !text-white !border-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              generateBarcode();
                            }}
                          >
                            Generate
                          </Button>
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Brand</span>}
                      name="brand"
                      className="mb-0"
                    >
                      <Select
                        placeholder="Select brand"
                        className="w-full"
                        size="large"
                        loading={loading}
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {Array.isArray(brands) && brands.map(brand => (
                          <Select.Option key={brand.id} value={brand.id}>
                            {brand.brand_name || brand.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Unit</span>}
                      name="unit"
                      rules={[{ required: true, message: "Please select unit" }]}
                      className="mb-0"
                    >
                      <Select
                        placeholder="Select unit"
                        className="w-full"
                        size="large"
                        loading={loading}
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {Array.isArray(units) && units.map(unit => (
                          <Select.Option key={unit.id} value={unit.id}>
                            {unit.unit_name || unit.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Selling Type</span>}
                      name="sellingType"
                      rules={[{ required: true, message: "Please select selling type" }]}
                      className="mb-0"
                    >
                      <Select
                        placeholder="Select Selling Type"
                        className="w-full"
                        size="large"
                      >
                        <Select.Option value="select" disabled>Select</Select.Option>
                        <Select.Option value="online">Online</Select.Option>
                        <Select.Option value="pos">POS</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Description - Full Width */}
                  <Col span={24}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Description</span>}
                      name="description"
                      className="mb-0"
                    >
                      <TextArea
                        placeholder="Enter product description"
                        rows={4}
                        className="w-full"
                        style={{ borderRadius: 0 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

            </Panel>
          </Collapse>
        </div>

        {/* Pricing & Stocks */}
        <div className="my-4" style={{ background: "white" }}>
          <Collapse
            defaultActiveKey={["1"]}
            className="rounded-lg border border-gray-200 bg-white shadow-sm"
            expandIconPosition="end"
            ghost
          >
            <Panel
              header={
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-800">
                    ⚙️ Pricing & Stocks
                  </span>
                </div>
              }
              key="1"
              className="!border-0 [&>.ant-collapse-header]:border-b [&>.ant-collapse-header]:border-gray-200"
            >
              <div className="bg-white p-4">
                <Form.Item label="Product Type" name="productType" required initialValue="single">
                  <Radio.Group onChange={handleProductTypeChange}>
                    <Radio value="single">Single Product</Radio>
                    <Radio value="variable">Variable Product</Radio>
                  </Radio.Group>
                </Form.Item>

                {productType === 'single' && (
                  <>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-sm font-medium text-gray-700">Quantity</span>}
                          name="quantity"
                          rules={[{ required: true, message: "Enter quantity" }]}
                        >
                          <InputNumber
                            placeholder="Enter quantity"
                            className="!w-full"
                            size="large"
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-sm font-medium text-gray-700">Price</span>}
                          name="price"
                          rules={[{ required: true, message: "Enter price" }]}
                        >
                          <InputNumber
                            placeholder="Enter price"
                            className="!w-full"
                            size="large"
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-sm font-medium text-gray-700">Tax Type</span>}
                          name="taxType"
                        >
                          <Select placeholder="Select tax type (optional)" className="!w-full" size="large" allowClear>
                            <Option value="inclusive">Inclusive</Option>
                            <Option value="exclusive">Exclusive</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-sm font-medium text-gray-700">Product Tax</span>}
                          name="tax"
                        >
                          <Select placeholder="Select tax (optional)" className="!w-full" size="large" loading={loading} allowClear>
                            {taxes.map((tax) => (
                              <Option key={tax.id} value={tax.id}>
                                {tax.tax_name} - {tax.tax_percentage}%
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-sm font-medium text-gray-700">Discount Type</span>}
                          name="discountType"
                        >
                          <Select placeholder="Select discount type (optional)" className="!w-full" size="large" allowClear>
                            <Option value="%">Percentage</Option>
                            <Option value="fixed">Fixed</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-sm font-medium text-gray-700">Discount Value</span>}
                          name="discountValue"
                        >
                          <InputNumber placeholder="Enter discount value (optional)" className="!w-full" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-sm font-medium text-gray-700">Quantity Alert</span>}
                          name="quantityAlert"
                          rules={[{ required: true, message: "Enter quantity alert" }]}
                        >
                          <InputNumber placeholder="Enter alert quantity" className="!w-full" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}

                {productType === 'variable' && (
                  <div className="mt-4">
                    <Row gutter={16} className="mb-4">
                      <Col span={20}>
                        <Form.Item
                          label={<span className="text-sm font-medium text-gray-700">Variant Attribute *</span>}
                          name="variantAttribute"
                          rules={[{ required: true, message: "Please select a variant attribute" }]}
                        >
                          <Select
                            placeholder="Choose variant attribute"
                            className="!w-full"
                            size="large"
                            loading={loading}
                            onChange={(value) => {
                              const selected = variantAttributes.find(attr => attr.id === value);
                              setSelectedAttribute(selected);
                            }}
                            allowClear
                          >
                            {variantAttributes.map((attr) => (
                              <Option key={attr.id} value={attr.id}>
                                {attr.variant_name} ({Array.isArray(attr.values) ? attr.values.join(', ') : attr.values})
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={4} className="flex items-end">
                        <Button
                          type="primary"
                          icon={<PlusCircleOutlined />}
                          onClick={addVariant}
                          disabled={!selectedAttribute}
                          style={{ background: "#9333ea", borderColor: "#9333ea", width: "100%",  color: "#fff" }}
                          size="large"
                        >
                          Add
                        </Button>
                      </Col>
                    </Row>

                    {variants.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Attribute Name</th>
                              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Attribute Value</th>
                              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">SKU</th>
                              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                              <th className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variants.map((variant) => (
                              <tr key={variant.id}>
                                <td className="border border-gray-200 px-2 py-2">
                                  <Input
                                    placeholder="e.g., Color"
                                    value={variant.attribute_name}
                                    onChange={(e) => updateVariant(variant.id, 'attribute_name', e.target.value)}
                                    disabled
                                  />
                                </td>
                                <td className="border border-gray-200 px-2 py-2">
                                  <Select
                                    placeholder="Select value"
                                    className="!w-full"
                                    value={variant.attribute_value}
                                    onChange={(value) => updateVariant(variant.id, 'attribute_value', value)}
                                  >
                                    {selectedAttribute && Array.isArray(selectedAttribute.values) && 
                                      selectedAttribute.values.map((val, idx) => (
                                        <Option key={idx} value={val}>{val}</Option>
                                      ))
                                    }
                                  </Select>
                                </td>
                                <td className="border border-gray-200 px-2 py-2">
                                  <Input
                                    placeholder="SKU"
                                    value={variant.sku}
                                    onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                                  />
                                </td>
                                <td className="border border-gray-200 px-2 py-2">
                                  <InputNumber
                                    placeholder="Qty"
                                    className="!w-full"
                                    value={variant.quantity}
                                    onChange={(value) => updateVariant(variant.id, 'quantity', value)}
                                    min={0}
                                  />
                                </td>
                                <td className="border border-gray-200 px-2 py-2">
                                  <InputNumber
                                    placeholder="Price"
                                    className="!w-full"
                                    value={variant.price}
                                    onChange={(value) => updateVariant(variant.id, 'price', value)}
                                    min={0}
                                  />
                                </td>
                                <td className="border border-gray-200 px-2 py-2 text-center">
                                  <Button
                                    type="text"
                                    danger
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => removeVariant(variant.id)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Panel>
          </Collapse>
        </div>

        {/* images */}

        <div className="my-4" style={{ background: "white" }}>
          <Collapse
            defaultActiveKey={["1"]}
            className="rounded-lg border border-gray-200 bg-white shadow-sm"
            expandIconPosition="end"
            ghost
          >
            <Panel
              header={
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <PiImageSquare /> Images
                  </span>
                </div>
              }
              key="1"
              className="!border-0 [&>.ant-collapse-header]:border-b [&>.ant-collapse-header]:border-gray-200"
            >
              {/* Images Section */}
              <div className="bg-white p-4">
                <Row gutter={[16, 16]}>
                  <Col xs={24}>

                    <Form.Item
                      name="productImages"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e?.fileList;
                      }}
                      rules={[{ required: false, message: 'Please upload at least one image' }]}
                    >
                      <div className="flex flex-wrap gap-4">
                        <Upload
                          name="files"
                          multiple
                          showUploadList={false}
                          fileList={fileList}
                          onChange={handleChange}
                          beforeUpload={() => false}
                        >
                          <div className="w-[150px] h-[150px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-violet-400 transition-colors bg-gray-50">
                            <PlusCircleOutlined className="text-3xl text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">  Add Images</span>
                          </div>
                        </Upload>

                        {fileList.map((file) => (
                          <div
                            key={file.uid}
                            className="relative w-[150px] h-[150px] border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <img
                              src={file.thumbUrl || URL.createObjectURL(file.originFileObj)}
                              alt={file.name}
                              className="w-full h-full object-cover z-10"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFileList = fileList.filter(item => item.uid !== file.uid);
                                setFileList(newFileList);
                              }}
                              className="absolute top-2 right-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all z-50"
                            >
                              <CloseCircleOutlined className="text-red-500 text-2xl z-40" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </Form.Item>

                  </Col>
                </Row>
              </div>
            </Panel>
          </Collapse>
        </div>


        {/* Custom Fields */}
        <div className="my-4" style={{ background: "white" }}>
          <Collapse
            defaultActiveKey={["1"]}
            className="rounded-lg border border-gray-200 bg-white shadow-sm"
            expandIconPosition="end"
            ghost
          >
            <Panel
              header={
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-800">
                    📋 Custom Fields
                  </span>
                </div>
              }
              key="1"
              className="!border-0 [&>.ant-collapse-header]:border-b [&>.ant-collapse-header]:border-gray-200"
            >
              <div className="bg-white p-4">
                <div className="bg-white my-4 p-4 border border-gray-200 rounded-md flex justify-start gap-2 items-center">
                  <div className="flex justify-center gap-2 ">
                    <Input type="checkbox" />
                    <span className="text-sm font-medium text-gray-800">Warranties</span>
                  </div>
                  <div className="flex justify-center gap-2 ">
                    <Input type="checkbox" />
                    <span className="text-sm font-medium text-gray-800">Manufacture</span>
                  </div>
                  <div className="flex justify-center gap-2 ">
                    <Input type="checkbox" />
                    <span className="text-sm font-medium text-gray-800">Expiry</span>
                  </div>
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Warranty</span>}
                      name="warranty"
                      className="mb-0"
                    >
                      <Select
                        placeholder="Select Warranty"
                        className="w-full"
                        size="large"
                        loading={loading}
                      >
                        {warranties.map((warranty) => (
                          <Option key={warranty.id} value={warranty.id}>
                            {warranty.warranty_name || warranty.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Manufacturer</span>}
                      name="manufacturer"
                      className="mb-0"
                    >
                      <Input
                        placeholder="Enter custom Manufacturer"
                        className="w-full"
                        size="large"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Manufactured Date</span>}
                      name="manufacturedDate"
                      className="mb-0"
                    >
                      <DatePicker
                        placeholder="Start date"
                        className="w-full"
                        size="large"
                      />
                    </Form.Item>
                  </Col>


                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="text-sm font-medium text-gray-700">Expiry On</span>}
                      name="expiryDate"
                      className="mb-0"
                    >
                      <DatePicker
                        placeholder="End date"
                        className="w-full"
                        size="large"
                      />
                    </Form.Item>
                  </Col>

                </Row>
              </div>
            </Panel>
          </Collapse>
        </div>


        <div className="flex justify-end mt-5 space-x-2">
          <Button
            type="default"
            style={{ backgroundColor: '#4B5563', color: 'white', borderColor: '#4B5563', borderRadius: "5px" }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" style={{ borderRadius: "5px" }}>
            {isEdit ? "Save Changes" : "Add Product"}
          </Button>
        </div>

      </Form>
    </div>
  );
};

export default CreateProducts;
