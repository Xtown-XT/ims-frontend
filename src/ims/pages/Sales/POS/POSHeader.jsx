import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  CalculatorOutlined,
  ExpandOutlined,
  PrinterOutlined,
  BarChartOutlined,
  SettingOutlined,
  DownOutlined,
  UserOutlined,
  CloseOutlined,
  DollarOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Dropdown, Avatar, Button, Modal, Input } from "antd";

export default function POSHeader() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cashModalVisible, setCashModalVisible] = useState(false);
  const [profitModalVisible, setProfitModalVisible] = useState(false);
  const [calcModalVisible, setCalcModalVisible] = useState(false);
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [calcInput, setCalcInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const storeMenu = {
    items: [
      { key: "1", label: "Freshmart" },
      { key: "2", label: "TechHub" },
      { key: "3", label: "SuperStore" },
    ],
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleCalcInput = (val) => {
    if (val === "C") setCalcInput("");
    else if (val === "=") {
      try {
        setCalcInput(String(eval(calcInput)));
      } catch {
        setCalcInput("Error");
      }
    } else setCalcInput(calcInput + val);
  };

  const calcButtons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "C", "+",
    "=",
  ];

  return (
    <>
      {/* 🧭 Header */}
      <div className="w-full flex justify-between items-center bg-white px-5 py-2.5 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/logo192.png"
              alt="Dreams POS"
              className="w-9 h-9 object-contain"
            />
            {/* <span className="text-[15px] font-semibold text-gray-700 tracking-tight">
              Dreams <span className="text-purple-500">POS</span>
            </span> */}
          </div>
          <div className="bg-emerald-600 text-white text-[13px] font-medium px-3 py-1.5 rounded-md shadow-sm">
            {formatTime(time)}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto mr-3">
          <Button
            type="primary"
            icon={<DashboardOutlined />}
            onClick={() => navigate('/dashboard')}
            className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !px-4 !py-3 !text-sm !font-medium flex items-center gap-2 shadow-sm"
          >
            Dashboard
          </Button>

          <Dropdown menu={storeMenu} placement="bottomLeft" trigger={["click"]}>
            <Button className="!bg-white !text-gray-800 !border !border-gray-200 !rounded-lg !px-4 !py-3 !text-sm flex items-center gap-2 shadow-sm hover:!border-purple-400">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3523/3523063.png"
                alt="store"
                className="w-4 h-4"
              />
              Freshmart
              <DownOutlined className="text-xs ml-1" />
            </Button>
          </Dropdown>
        </div>

        <div className="flex items-center gap-2">
          {[
            {
              icon: <CalculatorOutlined />,
              bg: "bg-purple-700 text-white",
              onClick: () => setCalcModalVisible(true),
              title: "Calculator",
            },
            {
              icon: <ExpandOutlined />,
              bg: isFullscreen ? "bg-purple-600 text-white" : "bg-gray-100",
              onClick: toggleFullscreen,
              title: "Fullscreen",
            },
            {
              icon: <DollarOutlined />,
              bg: "bg-gray-100",
              onClick: () => setCashModalVisible(true),
              title: "Cash Register",
            },
            {
              icon: <BarChartOutlined />,
              bg: "bg-gray-100",
              onClick: () => setProfitModalVisible(true),
              title: "Today's Profit",
            },
            {
              icon: <SyncOutlined />,
              bg: "bg-gray-100",
              onClick: () => setSaleModalVisible(true),
              title: "Today's Sale",
            },
            {
              icon: <PrinterOutlined />,
              bg: "bg-gray-100",
              title: "Print",
            },
            {
              icon: <SettingOutlined />,
              bg: "bg-gray-100",
              title: "Settings",
            },
          ].map((btn, i) => (
            <div
              key={i}
              onClick={btn.onClick}
              title={btn.title}
              className={`w-10 h-10 ${btn.bg} flex items-center justify-center rounded-full text-base cursor-pointer hover:opacity-85 border border-gray-200 transition-all`}
            >
              {btn.icon}
            </div>
          ))}
          <Avatar
            size={42}
            icon={<UserOutlined />}
            className="ml-2 border border-gray-300 cursor-pointer"
          />
        </div>
      </div>

      {/* 🧮 Calculator Modal */}
      <Modal
        title={<div className="text-lg font-semibold text-gray-800">Calculator</div>}
        open={calcModalVisible}
        onCancel={() => setCalcModalVisible(false)}
        footer={null}
        centered
        width={300}
        closeIcon={<CloseOutlined style={{ color: "red" }} />}
      >
        <div className="flex flex-col gap-3">
          <Input value={calcInput} readOnly className="text-right font-semibold text-lg py-2" />
          <div className="grid grid-cols-4 gap-2">
            {calcButtons.map((btn) => (
              <Button
                key={btn}
                className={`!py-2 !text-base font-semibold ${
                  btn === "="
                    ? "!bg-purple-500 !text-white"
                    : btn === "C"
                    ? "!bg-red-500 !text-white"
                    : "!bg-gray-100"
                }`}
                onClick={() => handleCalcInput(btn)}
              >
                {btn}
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      {/* 💰 Cash Register Modal */}
      <Modal
        title={<div className="text-lg font-semibold text-gray-800">Cash Register Details</div>}
        open={cashModalVisible}
        onCancel={() => setCashModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setCashModalVisible(false)}
            className="!bg-orange-500 !text-white hover:!bg-orange-600 rounded-md px-6"
          >
            Cancel
          </Button>,
        ]}
        centered
        width={480}
        closeIcon={<CloseOutlined style={{ color: "red" }} />}
      >
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Cash in Hand</span>
            <span className="text-gray-900 font-semibold">$45689</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Total Sale Amount</span>
            <span className="text-gray-900 font-semibold">$565597.88</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Total Payment</span>
            <span className="text-gray-900 font-semibold">$566867.97</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Cash Payment</span>
            <span className="text-gray-900 font-semibold">$3355.84</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Total Sale Return</span>
            <span className="text-gray-900 font-semibold">$1959</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Total Expense</span>
            <span className="text-gray-900 font-semibold">$0</span>
          </div>
          
          <div className="flex justify-between items-center py-3 px-3 bg-purple-50 rounded border-t-2 border-purple-200 mt-4">
            <span className="text-purple-800 font-bold text-lg">Total Cash</span>
            <span className="text-purple-900 font-bold text-lg">$587130.97</span>
          </div>
        </div>
      </Modal>

      {/* 📊 Today's Sale Modal */}
      <Modal
        title={<div className="text-lg font-semibold text-gray-800">Today's Sale</div>}
        open={saleModalVisible}
        onCancel={() => setSaleModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setSaleModalVisible(false)}
            className="!bg-purple-500 !text-white hover:!bg-purple-600 rounded-md px-6"
          >
            Cancel
          </Button>,
        ]}
        centered
        width={480}
        closeIcon={<CloseOutlined style={{ color: "red" }} />}
      >
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Total Sale Amount</span>
            <span className="text-gray-900 font-semibold">$565597.88</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Cash Payment</span>
            <span className="text-gray-900 font-semibold">$3355.84</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Credit Card Payment</span>
            <span className="text-gray-900 font-semibold">$1959</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Cheque Payment</span>
            <span className="text-gray-900 font-semibold">$0</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Deposit Payment</span>
            <span className="text-gray-900 font-semibold">$565597.88</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Points Payment</span>
            <span className="text-gray-900 font-semibold">$3355.84</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Gift Card Payment</span>
            <span className="text-gray-900 font-semibold">$565597.88</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Scan & Pay</span>
            <span className="text-gray-900 font-semibold">$3355.84</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Pay Later</span>
            <span className="text-gray-900 font-semibold">$3355.84</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Total Payment</span>
            <span className="text-gray-900 font-semibold">$565597.88</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Total Sale Return</span>
            <span className="text-gray-900 font-semibold">$565597.88</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Total Expense</span>
            <span className="text-gray-900 font-semibold">$565597.88</span>
          </div>
          
          <div className="flex justify-between items-center py-3 px-3 bg-green-50 rounded border-t-2 border-green-200 mt-4">
            <span className="text-green-800 font-bold text-lg">Total Cash</span>
            <span className="text-green-900 font-bold text-lg">$587130.97</span>
          </div>
        </div>
      </Modal>

      {/* 📈 Today's Profit Modal */}
      <Modal
        title={<div className="text-lg font-semibold text-gray-800">Today's Profit</div>}
        open={profitModalVisible}
        onCancel={() => setProfitModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setProfitModalVisible(false)}
            className="!bg-green-500 !text-white hover:!bg-green-600 rounded-md px-6"
          >
            Cancel
          </Button>,
        ]}
        centered
        width={480}
        closeIcon={<CloseOutlined style={{ color: "red" }} />}
      >
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Total Sales</span>
            <span className="text-gray-900 font-semibold">$565597.88</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Total Cost</span>
            <span className="text-gray-900 font-semibold">$345000.00</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium">Total Expenses</span>
            <span className="text-gray-900 font-semibold">$15000.00</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3">
            <span className="text-gray-700 font-medium">Total Returns</span>
            <span className="text-gray-900 font-semibold">$1959.00</span>
          </div>
          
          <div className="flex justify-between items-center py-3 px-3 bg-green-50 rounded border-t-2 border-green-200 mt-4">
            <span className="text-green-800 font-bold text-lg">Net Profit</span>
            <span className="text-green-900 font-bold text-lg">$203638.88</span>
          </div>
        </div>
      </Modal>
    </>
  );
}
