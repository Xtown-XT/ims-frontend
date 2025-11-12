import React, { useState, useMemo } from "react";

// 🖼️ Imported Product Images
import LenovoIdeaPad3 from "./assets/LenovoIdeaPad3.png";
import Bold from "./assets/Bold.png";
import NikeJordan from "./assets/NikeJordan.png";
import AppleWatch from "./assets/AppleWatch.png";
import AmazonEchoDot from "./assets/AmazonEchoDot.png";
import LobarHandy from "./assets/LobarHandy.png";
import RedPremiunHandy from "./assets/RedPremiunHandy.png";
import Iphone14Pro from "./assets/Iphone14Pro.png";
import GamingChair from "./assets/GamingChair.png";
import BorealisBackpack from "./assets/BorealisBackpack.png";

import {
  Table,
  Input,
  Button,
  Space,
  Dropdown,
  Pagination,
  Image,
  Select,
} from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";

const { Option } = Select;

const PurchaseOrder = () => {
  const [pageSize, setPageSize] = useState(10);

  // 🔍 Search state
  const [searchText, setSearchText] = useState("");

  // ✅ Checkbox selection states
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
  };

  // 📦 Table Data (10 Products)
  const data = [
    {
      key: "1",
      product: "Lenovo IdeaPad 3",
      image: LenovoIdeaPad3,
      amount: "$1000",
      purchasedQty: 40,
      instockQty: 30,
    },
    {
      key: "2",
      product: "Beats Pro",
      image: Bold,
      amount: "$1500",
      purchasedQty: 25,
      instockQty: 18,
    },
    {
      key: "3",
      product: "Nike Jordan",
      image: NikeJordan,
      amount: "$1500",
      purchasedQty: 30,
      instockQty: 35,
    },
    {
      key: "4",
      product: "Apple Series 5 Watch",
      image: AppleWatch,
      amount: "$2000",
      purchasedQty: 28,
      instockQty: 30,
    },
    {
      key: "5",
      product: "Amazon Echo Dot",
      image: AmazonEchoDot,
      amount: "$800",
      purchasedQty: 15,
      instockQty: 10,
    },
    {
      key: "6",
      product: "Sanford Chair Sofa",
      image: LobarHandy,
      amount: "$750",
      purchasedQty: 20,
      instockQty: 15,
    },
    {
      key: "7",
      product: "Red Premium Satchel",
      image: RedPremiunHandy,
      amount: "$1300",
      purchasedQty: 35,
      instockQty: 40,
    },
    {
      key: "8",
      product: "Iphone 14 Pro",
      image: Iphone14Pro,
      amount: "$1100",
      purchasedQty: 45,
      instockQty: 35,
    },
    {
      key: "9",
      product: "Gaming Chair",
      image: GamingChair,
      amount: "$2300",
      purchasedQty: 22,
      instockQty: 20,
    },
    {
      key: "10",
      product: "Borealis Backpack",
      image: BorealisBackpack,
      amount: "$1700",
      purchasedQty: 18,
      instockQty: 25,
    },
  ];

  // 🔍 Filter data based on search text
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;
    const lowerSearch = searchText.toLowerCase();
    return data.filter((item) =>
      item.product.toLowerCase().includes(lowerSearch)
    );
  }, [searchText, data]);

  // ✅ Select All Handler
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedKeys(filteredData.map((item) => item.key));
    } else {
      setSelectedKeys([]);
    }
  };

  // ✅ Individual Row Checkbox Handler
  const handleRowSelect = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  // 🧭 Sort Dropdown Menu
  const sortMenu = {
    items: [
      { key: "1", label: "Recently Added" },
      { key: "2", label: "Ascending" },
      { key: "3", label: "Descending" },
      { key: "4", label: "Last Month" },
      { key: "5", label: "Last 7 Days" },
    ],
  };

  // 🧱 Table Columns
  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          style={{ accentColor: "#9333ea" }}
        />
      ),
      dataIndex: "checkbox",
      key: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedKeys.includes(record.key)}
          onChange={() => handleRowSelect(record.key)}
          style={{ accentColor: "#9333ea" }}
        />
      ),
      width: 50,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <Space>
          <Image
            src={record.image}
            alt={text}
            width={40}
            height={40}
            style={{ borderRadius: 6, objectFit: "cover" }}
            preview={false}
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Purchased Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Purchased QTY",
      dataIndex: "purchasedQty",
      key: "purchasedQty",
    },
    {
      title: "Instock QTY",
      dataIndex: "instockQty",
      key: "instockQty",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔍 Search & Sort Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by product name"
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Dropdown menu={sortMenu} placement="bottomRight" arrow>
          <Button>
            Sort By : Last 7 Days <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      {/* 🧾 Product Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        bordered={false}
        rowKey="key"
      />

      {/* 📄 Pagination & Row Selector Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {/* Row Per Page Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Row Per Page</span>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: 80 }}
            options={[
              { value: 10, label: "10" },
              { value: 25, label: "25" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
            ]}
          />
          <span>Entries</span>
        </div>

        {/* Pagination Control */}
        <Pagination current={1} total={filteredData.length} pageSize={pageSize} />
      </div>
    </div>
  );
};

export default PurchaseOrder;
