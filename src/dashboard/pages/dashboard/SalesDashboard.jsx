import React, { useMemo } from "react";
import {
  FiTrendingUp,
  FiRotateCcw,
  FiSettings,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";
import worldDataJson from "world-atlas/countries-110m.json";

function SalesDashboard() {
  const bestSellers = [
    {
      id: 1,
      name: "Lenovo 3rd Generation",
      price: "$4420",
      sales: "6547",
      img: "https://cdn-icons-png.flaticon.com/512/1230/1230833.png",
    },
    {
      id: 2,
      name: "Bold V3.2",
      price: "$1474",
      sales: "3474",
      img: "https://cdn-icons-png.flaticon.com/512/2323/2323869.png",
    },
    {
      id: 3,
      name: "Nike Jordan",
      price: "$8784",
      sales: "1478",
      img: "https://cdn-icons-png.flaticon.com/512/284/284489.png",
    },
    {
      id: 4,
      name: "Apple Series 5 Watch",
      price: "$3240",
      sales: "987",
      img: "https://cdn-icons-png.flaticon.com/512/808/808439.png",
    },
    {
      id: 5,
      name: "Amazon Echo Dot",
      price: "$597",
      sales: "784",
      img: "https://cdn-icons-png.flaticon.com/512/1038/1038067.png",
    },
  ];

  const transactions = [
    {
      id: 1,
      name: "Lobar Handy",
      payment: "Paypal",
      status: "Success",
      amount: "$1,099.00",
      img: "https://cdn-icons-png.flaticon.com/512/679/679922.png",
    },
    {
      id: 2,
      name: "Red Premium Handy",
      payment: "Apple Pay",
      status: "Cancelled",
      amount: "$600.55",
      img: "https://cdn-icons-png.flaticon.com/512/1792/1792131.png",
    },
    {
      id: 3,
      name: "Iphone 14 Pro",
      payment: "Stripe",
      status: "Completed",
      amount: "$1,099.00",
      img: "https://cdn-icons-png.flaticon.com/512/882/882704.png",
    },
    {
      id: 4,
      name: "Black Slim 200",
      payment: "PayU",
      status: "Success",
      amount: "$1,569.00",
      img: "https://cdn-icons-png.flaticon.com/512/1214/1214428.png",
    },
    {
      id: 5,
      name: "Woodcraft Sandal",
      payment: "Paytm",
      status: "Success",
      amount: "$1,478.00",
      img: "https://cdn-icons-png.flaticon.com/512/685/685686.png",
    },
  ];

  const statusColors = {
    Success: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  // --- Sales Analytics Data ---
  const SalesAnalyticsData = [
    { name: "Jan", sales: 30 },
    { name: "Feb", sales: 50 },
    { name: "Mar", sales: 55 },
    { name: "Apr", sales: 30 },
    { name: "May", sales: 45 },
    { name: "Jun", sales: 50 },
    { name: "Jul", sales: 30 },
    { name: "Aug", sales: 20 },
    { name: "Sep", sales: 40 },
    { name: "Oct", sales: 35 },
    { name: "Nov", sales: 40 },
    { name: "Dec", sales: 20 },
  ];

  // ✅ Local world map data (no external fetch)
  const geoUrl = useMemo(
    () => feature(worldDataJson, worldDataJson.objects.countries),
    []
  );

  return (
    <div className="p-6 space-y-6">
      {/* ---------------- Header Section ---------------- */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-sm rounded-lg p-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          👋 Hi <span className="text-indigo-600">John Smilga</span>, here's
          what's happening with your store today.
        </h2>
        <div className="flex items-center mt-4 md:mt-0 space-x-3">
          <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50 text-gray-700 text-sm">
            <FiCalendar className="mr-2 text-gray-600" />
            <span>10/22/2025 - 10/28/2025</span>
          </div>
          <button className="p-2 border rounded-md hover:bg-gray-100">
            <FiRotateCcw className="text-gray-600" />
          </button>
          <button className="p-2 border rounded-md hover:bg-gray-100">
            <FiTrendingUp className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* ---------------- Top Cards Section ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Earning Card */}
        <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center">
          <div>
            <h3 className="text-purple-600 font-medium text-sm mb-2">
              Weekly Earning
            </h3>
            <p className="text-2xl font-semibold text-gray-800">$95000.45</p>
            <p className="text-sm text-gray-500 mt-1">
              <span className="text-green-500 font-semibold">▲ 48%</span>{" "}
              increase compare to last week
            </p>
          </div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
            alt="earning"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Total Sales 1 */}
        <div className="bg-purple-600 text-white shadow rounded-xl p-6 flex justify-between items-center relative overflow-hidden">
          <div>
            <div className="flex items-center space-x-2">
              <FiTrendingUp className="text-2xl opacity-90" />
              <p className="text-2xl font-semibold">10000</p>
            </div>
            <p className="text-sm mt-1 opacity-90">No of Total Sales</p>
          </div>
          <button className="absolute top-3 right-3 bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
            <FiRotateCcw />
          </button>
        </div>

       {/* Total Sales 2 */}
<div className="bg-[#0c254a] text-white shadow rounded-xl p-6 flex justify-between items-center relative overflow-hidden">
  <div>
    <div className="flex items-center space-x-2">
      <FiTrendingUp className="text-2xl opacity-90" />
      <p className="text-2xl font-semibold">800</p>
    </div>
    <p className="text-sm mt-1 opacity-90">No of Total Sales</p>
  </div>
</div>
</div>

      {/* ---------------- Best Seller + Recent Transactions ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Best Seller Section */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Best Seller</h3>
            <button className="text-sm border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {bestSellers.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-12 h-12 object-contain rounded-md bg-gray-50 p-1"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Sales</p>
                  <p className="font-semibold text-gray-800">{item.sales}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Recent Transactions
            </h3>
            <button className="text-sm border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50">
              View All
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-2 px-2">#</th>
                <th className="py-2 px-2">Order Details</th>
                <th className="py-2 px-2">Payment</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-2 text-gray-600">{item.id}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-10 h-10 rounded-md object-cover bg-gray-100 p-1"
                      />
                      <div>
                        <h4 className="text-gray-800 font-medium">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FiClock className="text-gray-400" /> 15 Mins
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-gray-700 text-sm">{item.payment}</p>
                    <p className="text-xs text-indigo-600">
                      #{Math.floor(Math.random() * 99999999999)}
                    </p>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${statusColors[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-gray-800">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- Sales Analytics + Sales by Countries ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Sales Analytics Chart */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Sales Analytics
            </h3>
            <button className="flex items-center border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-50">
              <FiCalendar className="mr-2 text-gray-600" /> 2023
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={SalesAnalyticsData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#888" }} />
                <YAxis tick={{ fill: "#888" }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#9333ea"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales By Countries Map */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Sales By Countries
            </h3>
            <button className="border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-50">
              This Week
            </button>
          </div>

          <div className="h-72 w-full">
            <ComposableMap projectionConfig={{ scale: 140 }}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={
                        [
                          "USA",
                          "RUS",
                          "CHN",
                          "IND",
                          "BRA",
                          "TUR",
                          "DEU",
                          "EGY",
                        ].includes(geo.properties.ISO_A3)
                          ? "#000000"
                          : "#e5e7eb"
                      }
                      stroke="#fff"
                      strokeWidth={0.3}
                    />
                  ))
                }
              </Geographies>
            </ComposableMap>
          </div>

          <p className="text-sm text-gray-600 mt-3">
            <span className="text-green-500 font-semibold">▲ 48%</span> increase
            compare to last week
          </p>
        </div>
      </div>
    </div>
  );
}

export default SalesDashboard;
