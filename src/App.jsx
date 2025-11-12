import { Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import dashboard from "./components/assets/dashboard.png";
import Login from "./login/Login";
import Register from "./login/RegisterPage";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Loading from "./utils/Loading";
import Settings from "./components/pages/Settings";
import ims from "./components/assets/sewing-machine.png";
import Pos from "./ims/pages/Sales/POS/POS"; // ✅ New POS Page Import

const routeModules = import.meta.glob("./*/AppRoutes.jsx", { eager: true });

// Example static import (you can extend this later)
import products from "./ims/pages/inventory/products";

// ✅ Module icons for sidebar menu
const moduleIcons = {
  dashboard: <img src={dashboard} alt="dashboard" className="w-6 h-6" />,
  ims: <img src={ims} alt="ims" className="w-6 h-6" />,
  // Add more modules icons here if needed
};

const App = () => {
  // ✅ Load all modules dynamically from /src/[module]/AppRoutes.jsx
  const modules = Object.entries(routeModules).map(([path, mod]) => {
    const match = path.match(/\.\/(.*?)\/AppRoutes\.jsx$/);
    const name = match?.[1];

    return {
      name,
      path: `/${name}/*`,
      element: mod.default,
      menuItems: mod[`${name}MenuItems`] || [],
    };
  });

  // ✅ Generate sidebar menu dynamically - Flatten structure
  const menuItems = useMemo(() => {
    const allMenuItems = [];
    
    modules.forEach(({ name, menuItems }) => {
      if (name === 'dashboard') {
        // Flatten dashboard menu items to main sidebar
        menuItems.forEach(item => {
          allMenuItems.push(item);
        });
      } else if (name === 'ims') {
        // Flatten IMS menu items to main sidebar
        menuItems.forEach(item => {
          allMenuItems.push(item);
        });
      } else {
        // Other modules remain as is
        allMenuItems.push({
          key: name,
          icon: moduleIcons[name] || null,
          label: name.toUpperCase(),
          children: menuItems,
        });
      }
    });
    
    return allMenuItems;
  }, [modules]);

  // ✅ Default redirect logic
  const getDefaultRedirect = () => {
    const filteredModules = modules.filter((mod) => mod.name !== "dashboard");
    return filteredModules.length > 0
      ? `/${filteredModules[0].name}/pages/dashboard`
      : "/404";
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Loading duration={3000} />
        <Suspense fallback={<div className="p-4"><Loading /></div>}>
          <Routes>
            {/* 🔐 Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔐 Protected Main Layout Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout menuItems={menuItems} />
                </ProtectedRoute>
              }
            >
              {/* Default redirect after login */}
              <Route
                path="/"
                element={<Navigate to={getDefaultRedirect()} replace />}
              />

              {/* Dynamic Module Routes */}
              {modules.map(({ name, path, element: Element }) => (
                <Route key={name} path={path} element={<Element />} />
              ))}

              {/* Settings Page */}
              <Route path="/settings" element={<Settings />} />

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <div className="p-4 text-red-500 font-semibold text-center">
                    404 - Page Not Found
                  </div>
                }
              />
            </Route>

            {/* 🧾 POS Page (Standalone Page) */}
            {/* This route does NOT use MainLayout, opens as a separate full-screen page */}
            <Route path="/pos" element={<Pos />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
