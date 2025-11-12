import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  AuditOutlined,
  DesktopOutlined,
  ClusterOutlined,
  UserOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

// Import dashboard image
import dashboardIcon from "../components/assets/dashboard.png";

// Existing pages
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import SalesDashboard from "./pages/dashboard/SalesDashboard";

// ✅ Correct import for Super Admin
import Dashboard from "./pages/superadmin/Dashboard";

// ==================== SIDEBAR MENU ITEMS ====================
export const dashboardMenuItems = [
  {
    icon: <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6" />,
    key: "/dashboard",
    label: "Dashboard",
    children: [
      {
        icon: <DashboardOutlined />,
        key: "/dashboard/main",
        label: "Dashboard",
      },
      {
        icon: <DesktopOutlined />,
        key: "/dashboard/admin",
        label: "Admin Dashboard",
      },
      {
        icon: <ClusterOutlined />,
        key: "/dashboard/sales",
        label: "Sales Dashboard",
      },
    ],
  },
];

// ==================== ROUTE CONFIGURATION ====================
const DashboardRoutes = () => {
  return (
    <Routes>
      {/* Main Dashboard */}
      <Route path="main" element={<Dashboard />} />
      
      {/* IMS Dashboards */}
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="sales" element={<SalesDashboard />} />

      {/* Default Route */}
      <Route
        index
        element={
          <div style={{ padding: 20 }}>
            <h2>Dashboard</h2>
            <p>Select a dashboard (Dashboard, Admin Dashboard, or Sales Dashboard) from the sidebar.</p>
          </div>
        }
      />
    </Routes>
  );
};

export default DashboardRoutes;