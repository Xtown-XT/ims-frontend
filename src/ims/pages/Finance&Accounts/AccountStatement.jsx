

// import React, { useState } from "react";
// import { Table, DatePicker, Select, Button, Row, Col } from "antd";
// const { RangePicker } = DatePicker;
// const { Option } = Select;

// const AccountStatement = () => {
//   const [data] = useState([
//     {
//       key: "1",
//       ref: "#AS842",
//       date: "24 Dec 2024",
//       category: "Sale",
//       description: "Sale of goods",
//       amount: "+200",
//       type: "Credit",
//       balance: "$4365",
//     },
//     {
//       key: "2",
//       ref: "#AS821",
//       date: "10 Dec 2024",
//       category: "Refund",
//       description: "Refund Issued",
//       amount: "-50",
//       type: "Debit",
//       balance: "$4444",
//     },
//     {
//       key: "3",
//       ref: "#AS847",
//       date: "27 Nov 2024",
//       category: "Purchase",
//       description: "Inventory restocking",
//       amount: "-800",
//       type: "Debit",
//       balance: "$65145",
//     },
//     {
//       key: "4",
//       ref: "#AS874",
//       date: "18 Nov 2024",
//       category: "Sale",
//       description: "Sale of goods",
//       amount: "+100",
//       type: "Credit",
//       balance: "$1848",
//     },
//     {
//       key: "5",
//       ref: "#AS887",
//       date: "06 Nov 2024",
//       category: "Purchase",
//       description: "Inventory restocking",
//       amount: "-700",
//       type: "Debit",
//       balance: "$986",
//     },
//     {
//       key: "6",
//       ref: "#AS856",
//       date: "25 Oct 2024",
//       category: "Utility Payment",
//       description: "Electricity Bill",
//       amount: "-1000",
//       type: "Debit",
//       balance: "$15547",
//     },
//     {
//       key: "7",
//       ref: "#AS822",
//       date: "14 Oct 2024",
//       category: "Equipment Purchase",
//       description: "New POS terminal purchased",
//       amount: "-1200",
//       type: "Debit",
//       balance: "$141645",
//     },
//     {
//       key: "8",
//       ref: "#AS844",
//       date: "03 Oct 2024",
//       category: "Refund",
//       description: "Refund Issued",
//       amount: "-750",
//       type: "Debit",
//       balance: "$4356",
//     },
//     {
//       key: "9",
//       ref: "#AS832",
//       date: "20 Sep 2024",
//       category: "Withdraw",
//       description: "Withdraw by accountant",
//       amount: "-450",
//       type: "Debit",
//       balance: "$614389",
//     },
//   ]);

//   const columns = [
//     { title: "Reference Number", dataIndex: "ref", key: "ref" },
//     { title: "Date", dataIndex: "date", key: "date" },
//     { title: "Category", dataIndex: "category", key: "category" },
//     { title: "Description", dataIndex: "description", key: "description" },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//       key: "amount",
//       render: (text) => (
//         <span style={{ color: text.startsWith("+") ? "green" : "red" }}>
//           {text}
//         </span>
//       ),
//     },
//     {
//       title: "Transaction Type",
//       dataIndex: "type",
//       key: "type",
//       render: (text) => (
//         <span
//           style={{
            
//             backgroundColor: text === "Credit" ? "#4CAF50" : "#F44336",
//             color: "#fff",
//             padding: "2px 8px",
//             borderRadius: "6px",
//             fontSize: "13px",
//           }}
//         >
//           {text}
//         </span>
//       ),
//     },
//     { title: "Balance", dataIndex: "balance", key: "balance" },
//   ];

//   const totalAmount = data.reduce((acc, curr) => {
//     const value = parseFloat(curr.amount.replace(/[^0-9.-]/g, ""));
//     return acc + value;
//   }, 0);

//   return (
//     <div className="bg-gray-50 min-h-screen px-4 py-4">
//             <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
// <div>
//           <h2 className="text-xl font-semibold text-gray-800">Account Statement</h2>
//           <p className="text-sm text-gray-500">View your Statement</p>
      
//       </div>
//       </div>

//       {/* Filter Form */}
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "8px",
//           padding: "20px",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
//           marginBottom: "20px",
//         }}
//       >
//         <Row gutter={16} align="middle">
//           <Col xs={24} sm={12} md={8} lg={8}>
//             <label style={{ display: "block", marginBottom: "6px" }}>
//               Choose Your Date
//             </label>
//             <RangePicker style={{ width: "100%" }} />
//           </Col>

//           <Col xs={24} sm={12} md={8} lg={8}>
//             <label style={{ display: "block", marginBottom: "6px" }}>
//               Account
//             </label>
//             <Select placeholder="Select" style={{ width: "100%" }}>
//               <Option value="Zephyr Indira">Zephyr Indira</Option>
//               <Option value="Quillon Elysia">Quillon Elysia</Option>
//             </Select>
//           </Col>

//           <Col
//             xs={24}
//             sm={12}
//             md={8}
//             lg={8}
//             style={{ display: "flex", alignItems: "end" }}
//           >
//             <Button
//               type="primary"
//               style={{
//                 backgroundColor: "#FF914D",
//                 borderColor: "#FF914D",
//                 fontWeight: 500,
//               }}
//             >
//               Submit
//             </Button>
//           </Col>
//         </Row>
//       </div>

//       {/* Statement Header */}
//       <div style={{ marginBottom: "10px" }}>
//         <strong style={{ marginRight: "10px" }}>Statement of Account :</strong>
//         <span
//           style={{
//             background: "#FFF3E0",
//             color: "#FF914D",
//             padding: "4px 10px",
//             borderRadius: "6px",
//           }}
//         >
//           HBSC - 3298784309485
//         </span>
//       </div>

//       {/* Table */}
//       <Table
//         columns={columns}
//         dataSource={data}
//         pagination={false}
//         bordered
//         summary={() => (
//           <Table.Summary.Row>
//             <Table.Summary.Cell index={0} colSpan={6} align="right">
//               <strong>Total</strong>
//             </Table.Summary.Cell>
//             <Table.Summary.Cell index={6}>
//               <strong>${totalAmount.toFixed(2)}</strong>
//             </Table.Summary.Cell>
//           </Table.Summary.Row>
//         )}
//       />
//     </div>
//   );
// };

// export default AccountStatement;



import React, { useState } from "react";
import { Table, DatePicker, Select, Button, Row, Col } from "antd";
const { Option } = Select;

const AccountStatement = () => {
  const [data] = useState([
    {
      key: "1",
      ref: "#AS842",
      date: "24 Dec 2024",
      category: "Sale",
      description: "Sale of goods",
      amount: "+200",
      type: "Credit",
      balance: "$4365",
    },
    {
      key: "2",
      ref: "#AS821",
      date: "10 Dec 2024",
      category: "Refund",
      description: "Refund Issued",
      amount: "-50",
      type: "Debit",
      balance: "$4444",
    },
    {
      key: "3",
      ref: "#AS847",
      date: "27 Nov 2024",
      category: "Purchase",
      description: "Inventory restocking",
      amount: "-800",
      type: "Debit",
      balance: "$65145",
    },
    {
      key: "4",
      ref: "#AS874",
      date: "18 Nov 2024",
      category: "Sale",
      description: "Sale of goods",
      amount: "+100",
      type: "Credit",
      balance: "$1848",
    },
    {
      key: "5",
      ref: "#AS887",
      date: "06 Nov 2024",
      category: "Purchase",
      description: "Inventory restocking",
      amount: "-700",
      type: "Debit",
      balance: "$986",
    },
    {
      key: "6",
      ref: "#AS856",
      date: "25 Oct 2024",
      category: "Utility Payment",
      description: "Electricity Bill",
      amount: "-1000",
      type: "Debit",
      balance: "$15547",
    },
    {
      key: "7",
      ref: "#AS822",
      date: "14 Oct 2024",
      category: "Equipment Purchase",
      description: "New POS terminal purchased",
      amount: "-1200",
      type: "Debit",
      balance: "$141645",
    },
    {
      key: "8",
      ref: "#AS844",
      date: "03 Oct 2024",
      category: "Refund",
       description: "Refund Issued",
      amount: "-750",
      type: "Debit",
      balance: "$4356",
    },
    {
      key: "9",
      ref: "#AS832",
      date: "20 Sep 2024",
      category: "Withdraw",
      description: "Withdraw by accountant",
      amount: "-450",
      type: "Debit",
      balance: "$614389",
    },
  ]);

  const columns = [
    { title: "Reference Number", dataIndex: "ref", key: "ref" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (
        <span style={{ color: text.startsWith("+") ? "green" : "red" }}>
          {text}
        </span>
      ),
    },
   {
      title: "Transaction Type",
      dataIndex: "type",
      key: "type",
      width: 46,
      render: (text) => (
        <span
          style={{
            backgroundColor: text === "Credit" ? "#3EB780" : "#FF0000",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        >
          {text}
        </span>
      ),
    },
    { title: "Balance", dataIndex: "balance", key: "balance" },
  ];

  const totalAmount = data.reduce((acc, curr) => {
    const value = parseFloat(curr.amount.replace(/[^0-9.-]/g, ""));
    return acc + value;
  }, 0);

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Account Statement
          </h2>
          <p className="text-sm text-gray-500">View your Statement</p>
        </div>
      </div>

      {/* Filter Form */}
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          marginBottom: "20px",
        }}
      >
       <Row gutter={5} align="bottom">
  <Col span={12} sm={12} md={8} lg={7}>
    <label style={{ display: "block", marginBottom: "6px" }}>
      Choose Your Date
    </label>
    <DatePicker style={{ width: "80%" }} />
  </Col>

  <Col xs={24} sm={12} md={8} lg={7}>
    <label style={{ display: "block", marginBottom: "6px" }}>
      Account
    </label>
    <Select placeholder="Select" 
    className="custom-select"
    style={{ width: "80%" }}>
      
      <Option value="Zephyr">Zephyr Indira</Option>
      <Option value="Quillon Elysia">Quillon Elysia</Option>
     
    </Select>
  </Col>

  <Col xs={24} sm={12} md={8} lg={7}>
    <div style={{ marginTop: "26px" }}>
      <Button
        type="primary"
        style={{
          backgroundColor: "#8b5cf6",
          fontWeight: 500,
          width: "30%",
        }}
      >
        Submit
      </Button>
    </div>
  </Col>
</Row>

      </div>

      {/* Statement Header */}
      <div style={{ marginBottom: "10px" }}>
        <strong style={{ marginRight: "10px" }}>Statement of Account :</strong>
        <span
          style={{
            background: "#FFF3E0",
            color: "#8b5cf6",
            padding: "4px 10px",
            borderRadius: "6px",
          }}
        >
          HBSC - 3298784309485
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={6} align="right">
              <strong>Total</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6}>
              <strong>${totalAmount.toFixed(2)}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </div>
  );
};

export default AccountStatement;
