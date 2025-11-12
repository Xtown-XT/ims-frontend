// import React, { useState } from "react";
// import { Search, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
// import {
//   Modal,
//   Select,
//   Table,
//   Button,
//   Input,
//   DatePicker,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";

// const { confirm } = Modal;
// const { Option } = Select;

// const BalanceSheet = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [filterSelectStore, setFilterSelectStore] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [filterDate, setFilterDate] = useState(null);

//   const [formData, setFormData] = useState([
//     {
//       name: "Ava Mason	",
//       bankaccountnumber: "SWIZ - 3456565767787	",
//       credit: "$614848	",
//       debit: "$450",
//       balance: "$614389",
    
//     },
//     {
//       name: "Caspian Marigold",
//       bankaccountnumber: "NBC - 4324356677889",
//       credit: "$$1686",
//       debit: "-$700	",
//       balance: "$986",
//     },
//   ]);

//   const [newIncome, setNewIncome] = useState({
//       name: "",
//       bankaccountnumber: "",
//       credit: "",
//       debit: "",
//       balance: "",

//   });

//   // ✅ Table Columns
//   const columns = [
//     {
//       title: <input type="checkbox" />,
//       dataIndex: "checkbox",
//       render: () => <input type="checkbox" />,
//       width: 50,
//     },
//     { title: "Name", dataIndex: "name", key: "name" },
//     { title: "Bank&Account Number", dataIndex: "bankaccountnumber", key: "Bankaccountnumber" },
//     { title: "Credit", dataIndex: "credit", key: "credit" },
//     { title: "Debit", dataIndex: "debit", key: "debit" },
//     { title: "Balance", dataIndex: "balance", key: "balance" },
    
     
        
    

//   ];

//   // ✅ Delete Confirmation Modal
//   const showDeleteConfirm = (record) => {
//     confirm({
//       title: "Are you sure you want to delete this income record?",
//       icon: <AlertCircle color="#ff4d4f" />,
//       content: `Reference: ${record.reference}`,
//       okText: "Yes, delete it",
//       okType: "danger",
//       cancelText: "No, keep it",
//       onOk() {
//         setFormData(formData.filter((item) => item.reference !== record.reference));
//       },
//     });
//   };

//   // ✅ Add Income
 

//   return (
//     <div className="bg-gray-50 min-h-screen px-4 py-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">Balance Sheet</h2>
//           <p className="text-sm text-gray-500">View your Balance Sheet</p>
//         </div>
       
//       </div>

//       {/* Filters + Table */}
//       <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
//         {/* ✅ Filters */}
//         <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
//           {/* Left - Search Box */}
//                     <div className="flex-1 max-w-[180px]">

//           <Input
//             placeholder="Search..."
//             prefix={<SearchOutlined />}
//               className="w-full h-8 rounded-md text-sm px-2"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />
//           </div>

        
//         </div>

//         {/* ✅ Table */}
//         <Table
//           columns={columns}
//           dataSource={formData}
//           pagination={{ pageSize: 5 }}
//           className="bg-white"
//           bordered={false}
//           rowClassName={() => "hover:bg-gray-50"}
//           style={{ border: "1px solid #e5e7eb" }}
//         />
//       </div>

//       {/* ✅ Add Income Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
//             <h3 className="text-lg font-semibold mb-4">Add Income</h3>

//             <div className="flex flex-col gap-3">
//               <input
//                 type="text"
//                 name="reference"
//                 placeholder="Reference*"
//                 value={newIncome.reference}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, reference: e.target.value })
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               />

//               <DatePicker
//                 style={{ width: "100%" }}
//                 placeholder="Select Date"
//                 format="YYYY-MM-DD"
//                 value={newIncome.date ? dayjs(newIncome.date) : null}
//                 onChange={(date, dateString) =>
//                   setNewIncome({ ...newIncome, date: dateString })
//                 }
//               />

//               <input
//                 type="text"
//                 name="store"
//                 placeholder="Store*"
//                 value={newIncome.store}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, store: e.target.value })
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               />

//               <select
//                 name="category"
//                 value={newIncome.category}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, category: e.target.value })
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               >
//                 <option value="">Category*</option>
//                 <option value="Product Sales">Product Sales</option>
//                 <option value="Service Income">Service Income</option>
//               </select>

//               <input
//                 type="text"
//                 name="notes"
//                 placeholder="Notes"
//                 value={newIncome.notes}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, notes: e.target.value })
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               />

//               <input
//                 type="text"
//                 name="amount"
//                 placeholder="Amount*"
//                 value={newIncome.amount}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, amount: e.target.value })
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               />
//             </div>

//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddIncome}
//                 className="px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600"
//               >
//                 Add Income
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BalanceSheet;


// import React, { useState } from "react";
// import { Search, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
// import {
//   Modal,
//   Select,
//   Table,
//   Button,
//   Input,
//   DatePicker,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";

// const { confirm } = Modal;
// const { Option } = Select;

// const BalanceSheet = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [filterSelectStore, setFilterSelectStore] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [filterDate, setFilterDate] = useState(null);

//   const [formData, setFormData] = useState([
//     {
//       key: "1",
//       name: "Ava Mason",
//       bankaccountnumber: "SWIZ - 3456565767787",
//       credit: "$614848",
//       debit: "$450",
//       balance: "$614389",
//     },
//     {
//       key: "2",
//       name: "Caspian Marigold",
//       bankaccountnumber: "NBC - 4324356677889",
//       credit: "$1686",
//       debit: "-$700",
//       balance: "$986",
//     },
//   ]);

//   const [selectedRows, setSelectedRows] = useState([]);

//   const [newIncome, setNewIncome] = useState({
//     name: "",
//     bankaccountnumber: "",
//     credit: "",
//     debit: "",
//     balance: "",
//   });

//   // ✅ Columns with working checkboxes
//   const columns = [
//     {
//       title: (
//         <input
//           type="checkbox"
//           checked={selectedRows.length === formData.length && formData.length > 0}
//           onChange={(e) => {
//             if (e.target.checked) {
//               setSelectedRows(formData.map((item) => item.key));
//             } else {
//               setSelectedRows([]);
//             }
//           }}
//         />
//       ),
//       dataIndex: "checkbox",
//       render: (_, record) => (
//         <input
//           type="checkbox"
//           checked={selectedRows.includes(record.key)}
//           onChange={(e) => {
//             if (e.target.checked) {
//               setSelectedRows([...selectedRows, record.key]);
//             } else {
//               setSelectedRows(selectedRows.filter((id) => id !== record.key));
//             }
//           }}
//         />
//       ),
//       width: 50,
//     },
//     { title: "Name", dataIndex: "name", key: "name" },
//     {
//       title: "Bank&Account Number",
//       dataIndex: "bankaccountnumber",
//       key: "Bankaccountnumber",
//     },
//     { title: "Credit", dataIndex: "credit", key: "credit" },
//     { title: "Debit", dataIndex: "debit", key: "debit" },
//     { title: "Balance", dataIndex: "balance", key: "balance" },
//   ];

//   // ✅ Delete Confirmation Modal (kept same)
//   const showDeleteConfirm = (record) => {
//     confirm({
//       title: "Are you sure you want to delete this income record?",
//       icon: <AlertCircle color="#ff4d4f" />,
//       content: `Reference: ${record.reference}`,
//       okText: "Yes, delete it",
//       okType: "danger",
//       cancelText: "No, keep it",
//       onOk() {
//         setFormData(formData.filter((item) => item.reference !== record.reference));
//       },
//     });
//   };

//   // ✅ Search filter logic
//   const filteredData = formData.filter(
//     (item) =>
//       item.name.toLowerCase().includes(searchText.toLowerCase()) ||
//       item.bankaccountnumber.toLowerCase().includes(searchText.toLowerCase()) ||
//       item.credit.toLowerCase().includes(searchText.toLowerCase()) ||
//       item.debit.toLowerCase().includes(searchText.toLowerCase()) ||
//       item.balance.toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (
//     <div className="bg-gray-50 min-h-screen px-4 py-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">Balance Sheet</h2>
//           <p className="text-sm text-gray-500">View your Balance Sheet</p>
//         </div>
//       </div>

//       {/* Filters + Table */}
//       <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
//         {/* ✅ Filters */}
//         <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
//           {/* Left - Search Box */}
//           <div className="flex-1 max-w-[180px]">
//             <Input
//               placeholder="Search..."
//               prefix={<SearchOutlined />}
//               className="w-full h-8 rounded-md text-sm px-2"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* ✅ Table */}
//         <Table
//           columns={columns}
//           dataSource={filteredData}
//           pagination={{ pageSize: 5 }}
//           className="bg-white"
//           bordered={false}
//           rowClassName={() => "hover:bg-gray-50"}
//           style={{ border: "1px solid #e5e7eb" }}
//         />
//       </div>

//       {/* ✅ Add Income Modal (kept as-is) */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
//             <h3 className="text-lg font-semibold mb-4">Add Income</h3>

//             <div className="flex flex-col gap-3">
//               <input
//                 type="text"
//                 name="reference"
//                 placeholder="Reference*"
//                 value={newIncome.reference}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, reference: e.target.value })
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               />

//               <DatePicker
//                 style={{ width: "100%" }}
//                 placeholder="Select Date"
//                 format="YYYY-MM-DD"
//                 value={newIncome.date ? dayjs(newIncome.date) : null}
//                 onChange={(date, dateString) =>
//                   setNewIncome({ ...newIncome, date: dateString })
//                 }
//               />

//               <input
//                 type="text"
//                 name="store"
//                 placeholder="Store*"
//                 value={newIncome.store}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, store: e.target.value })
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               />

//               <select
//                 name="category"
//                 value={newIncome.category}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, category: e.target.value })
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               >
//                 <option value="">Category*</option>
//                 <option value="Product Sales">Product Sales</option>
//                 <option value="Service Income">Service Income</option>
//               </select>

//               <input
//                 type="text"
//                 name="notes"
//                 placeholder="Notes"
//                 value={newIncome.notes}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, notes: e.target.value })
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               />

//               <input
//                 type="text"
//                 name="amount"
//                 placeholder="Amount*"
//                 value={newIncome.amount}
//                 onChange={(e) =>
//                   setNewIncome({ ...newIncome, amount: e.target.value })
//                 }
//                 className="border border-gray-300 rounded-lg px-3 py-2"
//               />
//             </div>

//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {}}
//                 className="px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600"
//               >
//                 Add Income
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BalanceSheet;
import React, { useState } from "react";
import { Search, Plus, FileDown, FileSpreadsheet, RefreshCw, AlertCircle } from "lucide-react";
import { Modal, Table, Input, Button } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, FilePdfOutlined, FileExcelOutlined, ReloadOutlined, } from "@ant-design/icons";
import dayjs from "dayjs";

const { confirm } = Modal;

const BalanceSheet = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const [formData, setFormData] = useState([
    {
      key: "1",
      name: "Ava Mason",
      bankaccountnumber: "SWIZ - 3456565767787",
      credit: "$614848",
      debit: "$450",
      balance: "$614389",
    },
    {
      key: "2",
      name: "Caspian Marigold",
      bankaccountnumber: "NBC - 4324356677889",
      credit: "$1686",
      debit: "-$700",
      balance: "$986",
    },
  ]);

  const [newIncome, setNewIncome] = useState({
    name: "",
    bankaccountnumber: "",
    credit: "",
    debit: "",
    balance: "",
  });

  const exportPDF = () => alert("PDF export not implemented yet");
  const exportExcel = () => alert("Excel export not implemented yet");

  // ✅ Columns with working checkboxes
  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectedRows.length === formData.length && formData.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(formData.map((item) => item.key));
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows([...selectedRows, record.key]);
            } else {
              setSelectedRows(selectedRows.filter((id) => id !== record.key));
            }
          }}
        />
      ),
      width: 50,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Bank&Account Number",
      dataIndex: "bankaccountnumber",
      key: "bankaccountnumber",
    },
    { title: "Credit", dataIndex: "credit", key: "credit" },
    { title: "Debit", dataIndex: "debit", key: "debit" },
    { title: "Balance", dataIndex: "balance", key: "balance" },
  ];

  // ✅ Filtered data
  const filteredData = formData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.bankaccountnumber.toLowerCase().includes(searchText.toLowerCase()) ||
      item.credit.toLowerCase().includes(searchText.toLowerCase()) ||
      item.debit.toLowerCase().includes(searchText.toLowerCase()) ||
      item.balance.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Balance Sheet</h2>
          <p className="text-sm text-gray-500">View your Balance Sheet</p>
        </div>
 <div className="flex items-center gap-2">
          <Button
            icon={<FilePdfOutlined />}
            onClick={exportPDF}
            style={{
              background: "#DC2626",
              color: "white",
              borderColor: "#DC2626",
              borderRadius: "10px",
            }}
          />
          <Button
            icon={<FileExcelOutlined />}
            onClick={exportExcel}
            style={{
              background: "#16A34A",
              color: "white",
              borderColor: "#16A34A",
              borderRadius: "10px",
            }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
            style={{ borderRadius: "8px" }}
          />
        </div>
      </div>

      {/* Filters + Table */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex justify-start items-center flex-wrap gap-3 mb-4">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            className="w-full max-w-[220px] h-8 rounded-md text-sm px-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          rowKey="key"
        />
      </div>

      {/* Add Income Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Add Income</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name*"
                value={newIncome.name}
                onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Bank Account Number*"
                value={newIncome.bankaccountnumber}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, bankaccountnumber: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Credit*"
                value={newIncome.credit}
                onChange={(e) => setNewIncome({ ...newIncome, credit: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Debit*"
                value={newIncome.debit}
                onChange={(e) => setNewIncome({ ...newIncome, debit: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Balance*"
                value={newIncome.balance}
                onChange={(e) => setNewIncome({ ...newIncome, balance: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {}}
                className="px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600"
              >
                Add Income
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceSheet;
