import React from "react";
import {
  Card,
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
} from "antd";
import { SettingOutlined, PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useState } from 'react';
import { PiImageSquare } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Added useLocation

const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;

const CreateProducts = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get location
  const { mode, productData } = location.state || { mode: "add", productData: null };
  const isEdit = mode === "edit"; // ✅ determine edit mode

  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const [form] = Form.useForm();

  // ✅ Prefill form when editing
  React.useEffect(() => {
    if (isEdit && productData) {
      form.setFieldsValue(productData);
    }
  }, [isEdit, productData, form]);

  const handleSubmit = (values) => {
    console.log("Form Values:", values);
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

   
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Product Information */}

        <div className="my-4">
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
              className="!border-0"
            >

              <div className="space-y-6">
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
                      >
                        <Select.Option value="store1">Store 1</Select.Option>
                        <Select.Option value="store2">Store 2</Select.Option>
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
                      >
                        <Select.Option value="warehouse1">Warehouse 1</Select.Option>
                        <Select.Option value="warehouse2">Warehouse 2</Select.Option>
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
                      rules={[{ required: true, message: "Please enter SKU" }]}
                      className="mb-0"
                    >
                      <Input
                        placeholder="Enter SKU"
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
                      >
                        <Select.Option value="electronics">Electronics</Select.Option>
                        <Select.Option value="clothing">Clothing</Select.Option>
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
                      >
                        <Select.Option value="laptops">Laptops</Select.Option>
                        <Select.Option value="shirts">Shirts</Select.Option>
                      </Select>
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
                      >
                        <Select.Option value="apple">Apple</Select.Option>
                        <Select.Option value="samsung">Samsung</Select.Option>
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
                      >
                        <Select.Option value="pcs">Pieces</Select.Option>
                        <Select.Option value="kg">Kilograms</Select.Option>
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

        <Card
          className="my-4 rounded-xl shadow-sm"
          title={
            <span className="text-lg font-semibold text-gray-700">
              ⚙️ Pricing & Stocks
            </span>
          }
        >
          <Form.Item label="Product Type" name="productType" required>
            <Radio.Group>
              <Radio value="single">Single Product</Radio>
              <Radio value="variable">Variable Product</Radio>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={<span className="text-sm font-medium text-gray-700">Qyantity</span>}
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
                rules={[{ required: true, message: "Select tax type" }]}
              >
                <Select placeholder="Select tax type" className="!w-full" size="large">
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
                rules={[{ required: true, message: "Select tax" }]}
              >
                <Select placeholder="Select tax" className="!w-full" size="large">
                  <Option value="5">5%</Option>
                  <Option value="12">12%</Option>
                  <Option value="18">18%</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label={<span className="text-sm font-medium text-gray-700">Discount Type</span>}
                name="discountType"
                rules={[{ required: true, message: "Select discount type" }]}
              >
                <Select placeholder="Select discount type" className="!w-full" size="large">
                  <Option value="percentage">Percentage</Option>
                  <Option value="flat">Flat</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label={<span className="text-sm font-medium text-gray-700">Discount Value</span>}
                name="discountValue"
                rules={[{ required: true, message: "Enter discount value" }]}
              >
                <InputNumber placeholder="Enter discount value" className="!w-full" size="large" />
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

          <div className="flex justify-end mt-4">
            <Button type="primary" htmlType="submit">
              {isEdit ? "Save Changes" : "Save Product"}
            </Button>
          </div>


        </Card>

        {/* images */}


        <div className="my-4">
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
              className="!border-0"
            >
              {/* Images Section */}


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
                    rules={[{ required: true, message: 'Please upload at least one image' }]}
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

            </Panel>
          </Collapse>
        </div>


        {/* Custom Fields */}
        <div className="my-4">
          <Card
            className="my-4 rounded-xl shadow-sm"
            title={
              <span className="text-lg font-semibold text-gray-700">
                📋 Custom Fields
              </span>
            }
          >
            <div className="bg-gray-100 my-4 p-4 border border-gray-200 rounded-md flex justify-start gap-2 items-center">
              <div className="flex justify-center gap-2 ">
                <Input type="checkbox" />
                <span className="text-sm font-medium text-gray-300">Warranties</span>
              </div>
              <div className="flex justify-center gap-2 ">
                <Input type="checkbox" />
                <span className="text-sm font-medium text-gray-300">Manufacture</span>
              </div>
              <div className="flex justify-center gap-2 ">
                <Input type="checkbox" />
                <span className="text-sm font-medium text-gray-300">Expiry</span>
              </div>
            </div>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={<span className="text-sm font-medium text-gray-700">Warehouse</span>}
                  name="warehouse"
                  rules={[{ required: true, message: "Please select warehouse" }]}
                  className="mb-0"
                >
                  <Select
                    placeholder="Select Warranty"
                    className="w-full"
                    size="large"
                  >
                    <Select.Option value="select" disabled>Select</Select.Option>
                    <Select.Option value="replacementwarranty">Replacement Warranty</Select.Option>
                    <Select.Option value="onsitewarranty">Onsite Warranty</Select.Option>
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
                  name="manufactureddate"
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
                  name="expiryon"
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

          </Card>
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
