import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiCalendar } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import bannerpurple from "../../pages/superadmin/assets/bannerpurple2.jpg"

function Dashboard() {
  // Chart data
  const companyData = [
    { name: "M", value: 45 },
    { name: "T", value: 65 },
    { name: "W", value: 20 },
    { name: "T", value: 80 },
    { name: "F", value: 70 },
    { name: "S", value: 68 },
    { name: "S", value: 66 },
  ];

  const revenueData = [
    { name: "Jan", revenue: 40 },
    { name: "Feb", revenue: 30 },
    { name: "Mar", revenue: 50 },
    { name: "Apr", revenue: 80 },
    { name: "May", revenue: 85 },
    { name: "Jun", revenue: 90 },
    { name: "Jul", revenue: 70 },
    { name: "Aug", revenue: 75 },
    { name: "Sep", revenue: 80 },
    { name: "Oct", revenue: 60 },
    { name: "Nov", revenue: 20 },
    { name: "Dec", revenue: 78 },
  ];

  const planData = [
    { name: "Basic", value: 60, color: "#9333ea" },
    { name: "Premium", value: 20, color: "#facc15" },
    { name: "Enterprise", value: 20, color: "#2563eb" },
  ];

  const transactions = [
    { name: "Stellar Dynamics", plan: "Basic", amount: "+$245", date: "14 Jan 2025", id: "#12457" },
    { name: "Quantum Nexus", plan: "Enterprise", amount: "+$395", date: "14 Jan 2025", id: "#65974" },
    { name: "Aurora Technologies", plan: "Advanced", amount: "+$145", date: "14 Jan 2025", id: "#22457" },
    { name: "TerraFusion Energy", plan: "Enterprise", amount: "+$145", date: "14 Jan 2025", id: "#43412" },
    { name: "Epicurean Delights", plan: "Premium", amount: "+$977", date: "14 Jan 2025", id: "#43567" },
  ];

  const registered = [
    { name: "Pitch", users: "150 Users", plan: "Basic (Monthly)" },
    { name: "Initech", users: "200 Users", plan: "Enterprise (Yearly)" },
    { name: "Umbrella Corp", users: "129 Users", plan: "Advanced (Monthly)" },
    { name: "Capital Partners", users: "103 Users", plan: "Enterprise (Monthly)" },
    { name: "Massive Dynamic", users: "108 Users", plan: "Premium (Yearly)" },
  ];

  const expired = [
    { name: "Silicon Corp", date: "10 Apr 2025" },
    { name: "Hubspot", date: "12 Jun 2025" },
    { name: "Licon Industries", date: "16 Jun 2025" },
    { name: "TerraFusion Energy", date: "12 May 2025" },
    { name: "Epicurean Delights", date: "15 May 2025" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Welcome, Admin</h1>
          <p className="text-gray-500">
            You have <span className="text-purple-600 font-semibold">200+</span> Orders, Today
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50 text-gray-700 text-sm">
            <FiCalendar className="mr-2 text-gray-600" />
            <span>10/22/2025 - 10/28/2025</span>
          </div>
          <button className="p-2 border rounded-md hover:bg-gray-100">↑</button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div
        className="rounded-xl text-white p-8 flex justify-between items-center relative"
        style={{
          backgroundImage: `url(${bannerpurple})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <h2 className="text-2xl font-semibold">Welcome Back, Adrian</h2>
          <p className="mt-2 text-sm">14 New Companies Subscribed Today !!!</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-[#0c254a] text-white px-4 py-2 rounded-md text-sm font-medium">
            Companies
          </button>
          <button className="bg-white/30 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/50 transition">
            All Packages
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Companies",
            value: "5468",
            change: "+19.01%",
            color: "text-green-600",
            icon: "📁",
          },
          {
            label: "Active Companies",
            value: "4598",
            change: "-12%",
            color: "text-red-600",
            icon: "🏢",
          },
          {
            label: "Total Subscribers",
            value: "3698",
            change: "+6%",
            color: "text-green-600",
            icon: "📊",
          },
          {
            label: "Total Earnings",
            value: "$89,878,58",
            change: "-16%",
            color: "text-red-600",
            icon: "💰",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-xl p-6 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl">{item.icon}</div>
              <span
                className={`text-xs px-2 py-1 rounded-md font-medium ${
                  item.color.includes("green")
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {item.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-semibold text-gray-800">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Companies */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between mb-4 items-center">
            <h3 className="font-semibold text-gray-800">Companies</h3>
            <button className="border px-3 py-1 rounded-md text-sm hover:bg-gray-50">
              This Week
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={companyData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#111827" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-green-600 text-sm mt-3">+6% 5 Companies from last month</p>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between mb-4 items-center">
            <h3 className="font-semibold text-gray-800">Revenue</h3>
            <button className="border px-3 py-1 rounded-md text-sm hover:bg-gray-50">
              2025
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#9333ea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-green-600 text-sm mt-3">
            $45787 +40% increased from last year
          </p>
        </div>

        {/* Top Plans */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between mb-4 items-center">
            <h3 className="font-semibold text-gray-800">Top Plans</h3>
            <button className="border px-3 py-1 rounded-md text-sm hover:bg-gray-50">
              This Month
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={planData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
              >
                {planData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col mt-3 space-y-1 text-sm">
            {planData.map((p) => (
              <div key={p.name} className="flex justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.color }}
                  ></span>
                  {p.name}
                </span>
                <span>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions / Registered / Expired */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
            <button className="border px-3 py-1 rounded-md text-sm hover:bg-gray-50">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {transactions.map((t, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.id} • {t.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{t.amount}</p>
                  <p className="text-xs text-gray-500">{t.plan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Registered */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recently Registered</h3>
            <button className="border px-3 py-1 rounded-md text-sm hover:bg-gray-50">
              View All
            </button>
          </div>
          <div className="space-y-3 text-sm">
            {registered.map((r, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-gray-100 pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.plan}</p>
                </div>
                <span className="text-gray-800 font-semibold">{r.users}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Plan Expired */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Plan Expired</h3>
            <button className="border px-3 py-1 rounded-md text-sm hover:bg-gray-50">
              View All
            </button>
          </div>
          <div className="space-y-3 text-sm">
            {expired.map((e, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">{e.name}</p>
                  <p className="text-xs text-gray-500">
                    Expired : {e.date}
                  </p>
                </div>
                <button className="text-indigo-500 text-xs font-medium hover:underline">
                  Send Reminder
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
