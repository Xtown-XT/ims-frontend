import React from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingCart,
  FiRotateCcw,
  FiGift,
  FiRepeat,
  FiLayers,
  FiCreditCard,
  FiDollarSign,
  FiHash,
  FiCalendar,
  FiSettings,
} from "react-icons/fi";
import { FaUsers, FaTruck, FaShoppingCart as FaShopCart } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const barData = [
    { name: "2 am", purchase: 55, sales: 20 },
    { name: "4 am", purchase: 45, sales: 15 },
    { name: "6 am", purchase: 38, sales: 10 },
    { name: "8 am", purchase: 65, sales: 22 },
    { name: "10 am", purchase: 60, sales: 20 },
    { name: "12 pm", purchase: 62, sales: 18 },
    { name: "2 pm", purchase: 40, sales: 14 },
    { name: "4 pm", purchase: 50, sales: 20 },
    { name: "6 pm", purchase: 90, sales: 30 },
    { name: "8 pm", purchase: 65, sales: 25 },
    { name: "10 pm", purchase: 62, sales: 22 },
    { name: "12 am", purchase: 50, sales: 18 },
  ];

  const pieData = [
    { name: "First Time", value: 55 },
    { name: "Return", value: 35 },
  ];

  const COLORS = ["#16a34a", "#f97316"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome, <span className="text-purple-700">Admin</span>
          </h1>
          <p className="text-gray-500">
            You have <span className="text-purple-700 font-semibold">200+</span>{" "}
            Orders, Today
          </p>
        </div>

        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white shadow-sm cursor-pointer">
            <FiCalendar className="text-gray-600" />
            <span className="text-sm text-gray-700">
              10/22/2025 - 10/28/2025
            </span>
          </div>
        </div>
      </div>

      {/* Alert Box */}
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 flex justify-between items-center">
        <p>
          ⚠️ Your Product{" "}
          <span className="font-semibold text-red-700">Apple iPhone 15</span> is
          running Low, already below 5 Pcs.,{" "}
          <a href="#" className="text-orange-600 underline font-medium">
            Add Stock
          </a>
        </p>
        <button className="text-red-400 hover:text-red-600 text-lg font-bold">
          ×
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-purple-600 text-white p-5 rounded-lg shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium opacity-90">Total Sales</h4>
              <h2 className="text-2xl font-semibold mt-1">$48,988,078</h2>
            </div>
            <FiShoppingCart className="text-4xl opacity-80" />
          </div>
          <div className="flex items-center gap-2 mt-2 text-white text-sm">
            <FiTrendingUp />
            <span>+22%</span>
          </div>
        </div>

        <div className="bg-[#001f3f] text-white p-5 rounded-lg shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium opacity-90">
                Total Sales Return
              </h4>
              <h2 className="text-2xl font-semibold mt-1">$16,478,145</h2>
            </div>
            <FiRotateCcw className="text-4xl opacity-80" />
          </div>
          <div className="flex items-center gap-2 mt-2 text-red-300 text-sm">
            <FiTrendingDown />
            <span>-22%</span>
          </div>
        </div>

        <div className="bg-emerald-600 text-white p-5 rounded-lg shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium opacity-90">Total Purchase</h4>
              <h2 className="text-2xl font-semibold mt-1">$24,145,789</h2>
            </div>
            <FiGift className="text-4xl opacity-80" />
          </div>
          <div className="flex items-center gap-2 mt-2 text-white text-sm">
            <FiTrendingUp />
            <span>+22%</span>
          </div>
        </div>

        <div className="bg-pink-600 text-white p-5 rounded-lg shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium opacity-90">
                Total Purchase Return
              </h4>
              <h2 className="text-2xl font-semibold mt-1">$18,458,747</h2>
            </div>
            <FiRepeat className="text-4xl opacity-80" />
          </div>
          <div className="flex items-center gap-2 mt-2 text-white text-sm">
            <FiTrendingUp />
            <span>+22%</span>
          </div>
        </div>
      </div>

      
      {/* Bottom Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">$8,458,798</h2>
              <p className="text-gray-500 text-sm">Profit</p>
            </div>
            <FiLayers className="text-3xl text-cyan-500" />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="text-green-600 font-medium">+35% vs Last Month</p>
            <a href="#" className="text-blue-600 underline">
              View All
            </a>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">$48,988,78</h2>
              <p className="text-gray-500 text-sm">Invoice Due</p>
            </div>
            <FiCreditCard className="text-3xl text-green-500" />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="text-green-600 font-medium">+35% vs Last Month</p>
            <a href="#" className="text-blue-600 underline">
              View All
            </a>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">$8,980,097</h2>
              <p className="text-gray-500 text-sm">Total Expenses</p>
            </div>
            <FiDollarSign className="text-3xl text-orange-500" />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="text-green-600 font-medium">+41% vs Last Month</p>
            <a href="#" className="text-blue-600 underline">
              View All
            </a>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">$78,458,798</h2>
              <p className="text-gray-500 text-sm">Total Payment Returns</p>
            </div>
            <FiHash className="text-3xl text-purple-500" />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="text-red-600 font-medium">-20% vs Last Month</p>
            <a href="#" className="text-blue-600 underline">
              View All
            </a>
          </div>
        </div>
      </div>
    
    {/* DreamsPOS Layout (Sales & Purchase + Overall Info) */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-8">
  {/* Left Section */}
  <div className="col-span-2 bg-white shadow rounded-xl p-5 border">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="bg-purple-100 text-purple-500 p-2 rounded-md">
          <i className="fas fa-chart-bar"></i>
        </span>
        Sales & Purchase
      </h2>
      <div className="flex gap-1 text-sm">
        {["1D", "1W", "1M", "3M", "6M", "1Y"].map((label, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded-md ${
              label === "1Y"
                ? "bg-purple-500 text-white"
                : "text-gray-600 bg-gray-100 hover:bg-purple-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="flex gap-6 mb-4">
          <div>
            <p className="text-gray-400 text-sm">Total Purchase</p>
            <h3 className="text-2xl font-bold text-gray-800">3K</h3>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Sales</p>
            <h3 className="text-2xl font-bold text-gray-800">1K</h3>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis tickFormatter={(v) => `${v}K`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #eee",
              }}
            />
            <Bar
              dataKey="purchase"
              stackId="a"
              fill="#e9d5ff" // light purple
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="sales"
              stackId="a"
              fill="#a855f7" // main purple
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>


     {/* Right Section */}
<div className="bg-white shadow rounded-xl p-5 border flex flex-col justify-between">
  {/* Overall Info */}
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-600 p-2 rounded-md">
          <i className="fas fa-info-circle"></i>
        </span>
        Overall Information
      </h2>
      {/* Removed settings icon */}
    </div>

    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
        <FaTruck className="text-blue-500 text-xl mb-1" />
        <p className="text-gray-500 text-sm">Suppliers</p>
        <h3 className="text-lg font-semibold text-gray-800">6987</h3>
      </div>
      <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
        <FaUsers className="text-purple-500 text-xl mb-1" />
        <p className="text-gray-500 text-sm">Customers</p>
        <h3 className="text-lg font-semibold text-gray-800">4896</h3>
      </div>
      <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
        <FaShopCart className="text-green-500 text-xl mb-1" />
        <p className="text-gray-500 text-sm">Orders</p>
        <h3 className="text-lg font-semibold text-gray-800">487</h3>
      </div>
    </div>
  </div>

  {/* Customer Overview */}
  <div>
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-md font-semibold text-gray-800">
        Customers Overview
      </h2>
      <button className="border px-3 py-1 rounded-md text-gray-600 text-sm flex items-center gap-1">
        📅 Today
      </button>
    </div>

    <div className="flex items-center justify-between">
      <div className="w-32 h-32">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0
                      ? "#9333ea" // purple-600 (replaces orange)
                      : COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800">5.5K</h3>
          <p className="text-gray-500 text-sm">First Time</p>
          <p className="text-green-500 text-xs font-semibold">↑ 25%</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">3.5K</h3>
          <p className="text-gray-500 text-sm">Return</p>
          <p className="text-green-500 text-xs font-semibold">↑ 21%</p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
      {/* ================= New Section: Product Cards ================= */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
  {/* Top Selling Products */}
  <div className="bg-white shadow rounded-xl p-5 border">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="bg-pink-100 text-pink-500 p-2 rounded-md">
          <i className="fas fa-box"></i>
        </span>
        Top Selling Products
      </h2>
      <button className="border px-3 py-1 rounded-md text-gray-600 text-sm flex items-center gap-1">
        📅 Today
      </button>
    </div>

    <div className="space-y-4">
      {[
        {
          name: "Charger Cable - Lighting",
          price: "$187",
          sales: "247+ Sales",
          img: "https://cdn-icons-png.flaticon.com/128/1040/1040238.png",
          growth: "+25%",
          color: "text-green-600 bg-green-50",
        },
        {
          name: "Yves Saint Eau De Parfum",
          price: "$145",
          sales: "289+ Sales",
          img: "https://cdn-icons-png.flaticon.com/128/3658/3658935.png",
          growth: "+25%",
          color: "text-green-600 bg-green-50",
        },
        {
          name: "Apple Airpods 2",
          price: "$458",
          sales: "300+ Sales",
          img: "https://cdn-icons-png.flaticon.com/128/999/999848.png",
          growth: "+25%",
          color: "text-green-600 bg-green-50",
        },
        {
          name: "Vacuum Cleaner",
          price: "$139",
          sales: "225+ Sales",
          img: "https://cdn-icons-png.flaticon.com/128/3133/3133073.png",
          growth: "-21%",
          color: "text-red-600 bg-red-50",
        },
        {
          name: "Samsung Galaxy S21 Fe 5g",
          price: "$898",
          sales: "365+ Sales",
          img: "https://cdn-icons-png.flaticon.com/128/149/149452.png",
          growth: "+25%",
          color: "text-green-600 bg-green-50",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center border-b pb-3 last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <img
              src={item.img}
              alt={item.name}
              className="w-12 h-12 rounded-md"
            />
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
              <p className="text-gray-500 text-xs">
                {item.price} • {item.sales}
              </p>
            </div>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-md font-semibold ${item.color}`}
          >
            {item.growth}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Low Stock Products */}
  <div className="bg-white shadow rounded-xl p-5 border">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="bg-red-100 text-red-500 p-2 rounded-md">⚠️</span>
        Low Stock Products
      </h2>
      <a
        href="#"
        className="text-blue-600 text-sm font-medium hover:underline"
      >
        View All
      </a>
    </div>

    <div className="space-y-4">
      {[
        {
          name: "Dell XPS 13",
          id: "#665814",
          stock: 8,
          img: "https://cdn-icons-png.flaticon.com/128/906/906324.png",
        },
        {
          name: "Vacuum Cleaner Robot",
          id: "#940004",
          stock: 14,
          img: "https://cdn-icons-png.flaticon.com/128/3270/3270950.png",
        },
        {
          name: "KitchenAid Stand Mixer",
          id: "#325569",
          stock: 21,
          img: "https://cdn-icons-png.flaticon.com/128/3121/3121261.png",
        },
        {
          name: "Levi's Trucker Jacket",
          id: "#124588",
          stock: 12,
          img: "https://cdn-icons-png.flaticon.com/128/3344/3344728.png",
        },
        {
          name: "Lay's Classic",
          id: "#365586",
          stock: 10,
          img: "https://cdn-icons-png.flaticon.com/128/3075/3075977.png",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center border-b pb-3 last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <img
              src={item.img}
              alt={item.name}
              className="w-12 h-12 rounded-md"
            />
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
              <p className="text-gray-500 text-xs">ID: {item.id}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">In Stock</p>
            <p className="text-purple-600 font-semibold">
              {item.stock.toString().padStart(2, "0")}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Recent Sales */}
  <div className="bg-white shadow rounded-xl p-5 border">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="bg-pink-100 text-pink-500 p-2 rounded-md">
          <i className="fas fa-box"></i>
        </span>
        Recent Sales
      </h2>
      <button className="border px-3 py-1 rounded-md text-gray-600 text-sm flex items-center gap-1">
        📅 Weekly
      </button>
    </div>

    <div className="space-y-4">
      {[
        {
          name: "Apple Watch Series 9",
          category: "Electronics",
          price: "$640",
          date: "Today",
          status: "Processing",
          color: "bg-purple-100 text-purple-700",
          img: "https://cdn-icons-png.flaticon.com/128/1180/1180872.png",
        },
        {
          name: "Gold Bracelet",
          category: "Fashion",
          price: "$126",
          date: "Today",
          status: "Cancelled",
          color: "bg-red-100 text-red-600",
          img: "https://cdn-icons-png.flaticon.com/128/1076/1076952.png",
        },
        {
          name: "Parachute Down Duvet",
          category: "Health",
          price: "$69",
          date: "15 Jan 2025",
          status: "Onhold",
          color: "bg-cyan-100 text-cyan-700",
          img: "https://cdn-icons-png.flaticon.com/128/7899/7899795.png",
        },
        {
          name: "YETI Rambler Tumbler",
          category: "Sports",
          price: "$65",
          date: "12 Jan 2025",
          status: "Processing",
          color: "bg-purple-100 text-purple-700",
          img: "https://cdn-icons-png.flaticon.com/128/2331/2331931.png",
        },
        {
          name: "Osmo Genius Starter Kit",
          category: "Lifestyle",
          price: "$87.56",
          date: "11 Jan 2025",
          status: "Completed",
          color: "bg-green-100 text-green-700",
          img: "https://cdn-icons-png.flaticon.com/128/3565/3565773.png",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center border-b pb-3 last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <img
              src={item.img}
              alt={item.name}
              className="w-12 h-12 rounded-md"
            />
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
              <p className="text-gray-500 text-xs">
                {item.category} • {item.price}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">{item.date}</p>
            <span
              className={`text-xs px-2 py-1 rounded-md font-semibold ${item.color}`}
            >
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
{/* ============================================================= */}
{/* ================= New Section: Sales Statics + Recent Transactions ================= */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

  {/* Sales Statics Section */}
  <div className="bg-white shadow rounded-xl p-5 border">
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="bg-red-100 text-red-500 p-2 rounded-md">
          ⚠️
        </span>
        Sales Statics
      </h2>
      <button className="border px-3 py-1 rounded-md text-gray-600 text-sm flex items-center gap-1">
        📅 2025
      </button>
    </div>

    {/* Revenue and Expense Cards */}
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex flex-col">
        <span className="text-green-600 font-semibold text-lg">$12,189</span>
        <div className="flex items-center gap-2 text-xs text-green-600">
          <span className="bg-green-100 px-2 py-0.5 rounded-md font-semibold">
            ↑ 25%
          </span>
          <p className="text-gray-600 font-medium">Revenue</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex flex-col">
        <span className="text-red-600 font-semibold text-lg">$48,988,078</span>
        <div className="flex items-center gap-2 text-xs text-red-600">
          <span className="bg-red-100 px-2 py-0.5 rounded-md font-semibold">
            ↓ 25%
          </span>
          <p className="text-gray-600 font-medium">Expense</p>
        </div>
      </div>
    </div>

    {/* Chart */}
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart
          data={[
            { name: "Jan", revenue: 10, expense: -12 },
            { name: "Feb", revenue: 24, expense: -20 },
            { name: "Mar", revenue: 23, expense: -18 },
            { name: "Apr", revenue: 20, expense: -25 },
            { name: "May", revenue: 18, expense: -15 },
            { name: "Jun", revenue: 15, expense: -17 },
            { name: "Jul", revenue: 25, expense: -19 },
            { name: "Aug", revenue: 13, expense: -14 },
            { name: "Sep", revenue: 20, expense: -16 },
            { name: "Oct", revenue: 15, expense: -20 },
            { name: "Nov", revenue: 10, expense: -18 },
            { name: "Dec", revenue: 20, expense: -21 },
          ]}
        >
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis tickFormatter={(v) => `${v}K`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #eee",
            }}
          />
          <Bar dataKey="revenue" fill="#0d9488" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill="#dc2626" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Recent Transactions Section */}
  <div className="bg-white shadow rounded-xl p-5 border">
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="bg-orange-100 text-purple-500 p-2 rounded-md">
          🧾
        </span>
        Recent Transactions
      </h2>
      <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
        View All
      </a>
    </div>

    {/* Tabs */}
    <div className="flex border-b mb-3 text-sm font-medium text-gray-500">
      {["Sale", "Purchase", "Quotation", "Expenses", "Invoices"].map(
        (tab, i) => (
          <button
            key={i}
            className={`px-4 py-2 ${
              tab === "Sale"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "hover:text-purple-500"
            }`}
          >
            {tab}
          </button>
        )
      )}
    </div>

    {/* Transaction List */}
    <div className="divide-y">
      {[
        {
          name: "Andrea Willer",
          id: "#114589",
          date: "24 May 2025",
          status: "Completed",
          color: "bg-green-100 text-green-700",
          total: "$4,560",
          img: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        {
          name: "Timothy Sandsr",
          id: "#114589",
          date: "23 May 2025",
          status: "Completed",
          color: "bg-green-100 text-green-700",
          total: "$3,569",
          img: "https://randomuser.me/api/portraits/men/47.jpg",
        },
        {
          name: "Bonnie Rodrigues",
          id: "#114589",
          date: "22 May 2025",
          status: "Draft",
          color: "bg-pink-100 text-pink-700",
          total: "$4,560",
          img: "https://randomuser.me/api/portraits/women/56.jpg",
        },
        {
          name: "Randy McCree",
          id: "#114589",
          date: "21 May 2025",
          status: "Completed",
          color: "bg-green-100 text-green-700",
          total: "$2,155",
          img: "https://randomuser.me/api/portraits/men/64.jpg",
        },
        {
          name: "Dennis Anderson",
          id: "#114589",
          date: "21 May 2025",
          status: "Completed",
          color: "bg-green-100 text-green-700",
          total: "$5,123",
          img: "https://randomuser.me/api/portraits/men/89.jpg",
        },
      ].map((item, i) => (
        <div key={i} className="flex justify-between items-center py-3">
          <div className="flex items-center gap-3">
            <img
              src={item.img}
              alt={item.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                {item.name}
              </h3>
              <p className="text-orange-500 text-xs">{item.id}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-500 text-xs">{item.date}</p>
            <div className="flex items-center justify-end gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium ${item.color}`}
              >
                {item.status}
              </span>
              <p className="font-semibold text-gray-800 text-sm">
                {item.total}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
{/* ============================================================= */}
{/* ================= New Section: Top Customers + Categories + Order Stats ================= */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

  {/* 🧍‍♂️ Top Customers */}
  <div className="bg-white shadow rounded-xl p-5 border">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="bg-orange-100 text-purple-500 p-2 rounded-md">
          <i className="fas fa-user"></i>
        </span>
        Top Customers
      </h2>
      <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
        View All
      </a>
    </div>

    <div className="space-y-4">
      {[
        {
          name: "Carlos Curran",
          country: "USA",
          orders: "24 Orders",
          total: "$8,9645",
          img: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          name: "Stan Gaunter",
          country: "UAE",
          orders: "22 Orders",
          total: "$16,985",
          img: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          name: "Richard Wilson",
          country: "Germany",
          orders: "14 Orders",
          total: "$5,366",
          img: "https://randomuser.me/api/portraits/men/62.jpg",
        },
        {
          name: "Mary Bronson",
          country: "Belgium",
          orders: "08 Orders",
          total: "$4,569",
          img: "https://randomuser.me/api/portraits/women/66.jpg",
        },
        {
          name: "Annie Tremblay",
          country: "Greenland",
          orders: "14 Orders",
          total: "$3,5698",
          img: "https://randomuser.me/api/portraits/women/75.jpg",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center border-b pb-3 last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <img
              src={item.img}
              alt={item.name}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
              <p className="text-gray-500 text-xs flex items-center gap-1">
                📍 {item.country} • {item.orders}
              </p>
            </div>
          </div>
          <h4 className="font-semibold text-gray-800 text-sm">{item.total}</h4>
        </div>
      ))}
    </div>
  </div>

 {/* 📊 Top Categories */}
<div className="bg-white shadow rounded-xl p-5 border flex flex-col">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      <span className="bg-purple-100 text-purple-500 p-2 rounded-md">
        <i className="fas fa-tags"></i>
      </span>
      Top Categories
    </h2>
    <button className="border px-3 py-1 rounded-md text-gray-600 text-sm flex items-center gap-1">
      📅 Weekly
    </button>
  </div>

  <div className="flex justify-between items-center">
    <div className="w-40 h-40">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={[
              { name: "Electronics", value: 698 },
              { name: "Sports", value: 545 },
              { name: "Lifestyles", value: 456 },
            ]}
            dataKey="value"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={5}
          >
            <Cell fill="#a855f7" /> {/* purple-500 */}
            <Cell fill="#7e22ce" /> {/* purple-700 */}
            <Cell fill="#0f172a" /> {/* slate-900 remains same */}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>

    <div className="text-sm space-y-3">
      <p className="flex items-center gap-2">
        <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
        <span className="text-gray-700 font-medium">Electronics</span>
        <span className="font-bold ml-2 text-gray-900">698</span> Sales
      </p>
      <p className="flex items-center gap-2">
        <span className="w-3 h-3 bg-purple-700 rounded-full"></span>
        <span className="text-gray-700 font-medium">Sports</span>
        <span className="font-bold ml-2 text-gray-900">545</span> Sales
      </p>
      <p className="flex items-center gap-2">
        <span className="w-3 h-3 bg-slate-800 rounded-full"></span>
        <span className="text-gray-700 font-medium">Lifestyles</span>
        <span className="font-bold ml-2 text-gray-900">456</span> Sales
      </p>
    </div>
  </div>

  <div className="mt-6">
    <h4 className="font-semibold text-gray-700 mb-2 text-sm">
      Category Statistics
    </h4>
    <div className="bg-gray-50 border rounded-lg p-3 text-sm space-y-2">
      <div className="flex justify-between items-center">
        <p className="flex items-center gap-2 text-gray-600">
          <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
          Total Number Of Categories
        </p>
        <p className="font-semibold text-gray-800">698</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="flex items-center gap-2 text-gray-600">
          <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
          Total Number Of Products
        </p>
        <p className="font-semibold text-gray-800">7899</p>
      </div>
    </div>
  </div>
</div>

  {/* 📦 Order Statistics */}
<div className="bg-white shadow rounded-xl p-5 border">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      <span className="bg-purple-100 text-purple-500 p-2 rounded-md">
        📦
      </span>
      Order Statistics
    </h2>
    <button className="border px-3 py-1 rounded-md text-gray-600 text-sm flex items-center gap-1">
      📅 Weekly
    </button>
  </div>

  {/* Heatmap Grid */}
  <div className="grid grid-cols-7 gap-1">
    {Array.from({ length: 7 * 9 }).map((_, i) => {
      const highlight =
        [5, 6, 12, 18, 22, 28, 35, 40, 42, 46, 55].includes(i);
      return (
        <div
          key={i}
          className={`w-6 h-6 rounded-md ${
            highlight ? "bg-purple-600" : "bg-purple-100"
          }`}
        ></div>
      );
    })}
  </div>

  {/* Y-axis Labels */}
  <div className="mt-3 flex justify-between text-xs text-gray-500">
    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
      <span key={day}>{day}</span>
    ))}
  </div>
</div>
</div>
{/* ============================================================= */}

    </div>
  );
};

export default AdminDashboard;