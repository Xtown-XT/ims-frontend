// Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import logo from "../assets/Dark Logo.png";
import settings from "../assets/technology.png";
import salesIcon from "../assets/sales.png";
import { useTheme } from "../../context/ThemeContext";
import {
  UpOutlined,
  DownOutlined,
  ShoppingOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  EditOutlined,
} from "@ant-design/icons";

// SubSidebar Component
const SubSidebar = ({ parentItem, collapsed }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, primaryColor } = useTheme();

  const [openSubSubMenuKey, setOpenSubSubMenuKey] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);

  const containerStyles = {
    height: "100%",
    width: collapsed ? "170px" : "200px",
    backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    paddingTop: "0rem",
    position: "absolute",
    left: collapsed ? "80px" : "200px",
    top: 0,
    zIndex: 999,
    borderLeft: `1px solid ${theme === "dark" ? "#4b5563" : "#e5e7eb"}`,
    display: "flex",
    flexDirection: "column",
  };

  const baseMenuItemStyles = {
    padding: collapsed ? "0.5rem" : "0.5rem 1rem",
    cursor: "pointer",
    color: theme === "dark" ? "#d1d5db" : "#374151",
    margin: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    fontSize: collapsed ? "0.8rem" : "0.9rem",
  };

  const getMenuItemStyles = (itemKey, hasChildren) => {
    const isActive = pathname === itemKey;
    const isHovered = hoveredKey === itemKey;
    const isOpen = openSubSubMenuKey === itemKey && hasChildren;

    let styles = { ...baseMenuItemStyles };

    if (isActive || isHovered || isOpen) {
      styles.backgroundColor = theme === "dark" ? "#4b5563" : "#e5e7eb";
      styles.color = theme === "dark" ? "#ffffff" : primaryColor;
      styles.fontWeight = "bold";
    }

    return styles;
  };

  const getSubSubMenuItemStyles = (itemKey) => {
    const isActive = pathname === itemKey;
    const isHovered = hoveredKey === itemKey;

    let styles = {
      ...baseMenuItemStyles,
      paddingLeft: collapsed ? "1rem" : "1.75rem",
      fontSize: collapsed ? "0.75rem" : "0.85rem",
      margin: "0.1rem 0.5rem",
    };

    if (isActive || isHovered) {
      styles.backgroundColor = theme === "dark" ? "#4b5563" : "#e0e7ff";
      styles.color = theme === "dark" ? "#ffffff" : primaryColor;
      styles.fontWeight = "bold";
    }

    return styles;
  };

  const handleSubItemClick = (subItem) => {
    if (subItem.children?.length > 0) {
      setOpenSubSubMenuKey(openSubSubMenuKey === subItem.key ? null : subItem.key);
    } else {
      navigate(subItem.key);
    }
  };

  return (
    <div style={containerStyles}>
      <div
        style={{
          display: "flex",
          padding: "0.75rem 1rem",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
        }}
      >
        <span
          style={{
            fontWeight: "600",
            color: theme === "dark" ? "#ffffff" : "#111827",
            fontSize: "1rem",
          }}
        >
          {parentItem.label}
        </span>
      </div>

      <div style={{ padding: "0.5rem", overflowY: "auto", flexGrow: 1 }}>
        {parentItem.children.map((subItem) => (
          <div key={subItem.key}>
            <div
              style={getMenuItemStyles(subItem.key, subItem.children?.length > 0)}
              onClick={() => handleSubItemClick(subItem)}
              onMouseEnter={() => setHoveredKey(subItem.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              {subItem.icon && (
                <span
                  style={{
                    marginRight: collapsed ? "0.25rem" : "0.5rem",
                    color:
                      pathname === subItem.key ||
                      openSubSubMenuKey === subItem.key
                        ? primaryColor
                        : "inherit",
                  }}
                >
                  {subItem.icon}
                </span>
              )}
              <span>{subItem.label}</span>

              {subItem.children?.length > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.7rem",
                    color: openSubSubMenuKey === subItem.key ? primaryColor : "inherit",
                  }}
                >
                  {openSubSubMenuKey === subItem.key ? <UpOutlined /> : <DownOutlined />}
                </span>
              )}
            </div>

            {openSubSubMenuKey === subItem.key && (
              <div
                style={{
                  paddingTop: "0.25rem",
                  paddingBottom: "0.25rem",
                  paddingLeft: collapsed ? "0.5rem" : "1rem",
                }}
              >
                {subItem.children.map((subSubItem) => (
                  <div
                    key={subSubItem.key}
                    style={getSubSubMenuItemStyles(subSubItem.key)}
                    onClick={() => navigate(subSubItem.key)}
                    onMouseEnter={() => setHoveredKey(subSubItem.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <span>{subSubItem.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------
// MAIN SIDEBAR
// ----------------------------------------------------------

const Sidebar = ({
  collapsed,
  menuItems = [],
  selectedParent,
  setSelectedParent,
  user, // <-- GET FULL USER HERE
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, primaryColor, sidebarBgColor } = useTheme();

  const [hoveredKey, setHoveredKey] = useState(null);

  // Get user from localStorage
  const getStoredUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const storedUser = user || getStoredUser();

  // Determine user type (EMPLOYEE has role_id, USER has role: "user")
  const userType = storedUser?.role_id ? "employee" : "user";

  // Filter menu (HIDE User Management for employees with role_id)
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.key === "/ims/user-management") {
      return userType === "user"; // only normal users (without role_id) can see
    }
    return true;
  });

  const containerStyles = {
    height: "100%",
    width: collapsed ? "80px" : "200px",
    backgroundColor: theme === "dark" ? "#1f2937" : sidebarBgColor,
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    paddingTop: "0.5rem",
    position: "relative",
  };

  const getMenuItemStyles = (itemKey) => {
    const isActive = pathname === itemKey || selectedParent?.key === itemKey;
    const isHovered = hoveredKey === itemKey;

    let styles = {
      padding: collapsed ? "0.5rem" : "0.5rem 1rem",
      cursor: "pointer",
      color: theme === "dark" ? "#d1d5db" : "#374151",
      margin: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
      display: "flex",
      alignItems: "center",
      fontSize: collapsed ? "0.875rem" : "1rem",
      fontWeight: "semibold",
    };

    if (isActive || isHovered) {
      styles.backgroundColor = theme === "dark" ? "#4b5563" : "#e5e7eb";
      styles.color = theme === "dark" ? "#ffffff" : primaryColor;
    }

    return styles;
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div style={containerStyles}>
        <div style={{ padding: "0.5rem", height: "calc(100% - 100px)", fontWeight: "500" }}>
          {filteredMenuItems.map((item) => (
            <div
              key={item.key}
              style={getMenuItemStyles(item.key)}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => {
                if (item.children) {
                  setSelectedParent(selectedParent?.key === item.key ? null : item);
                } else {
                  navigate(item.key);
                }
              }}
            >
              {item.icon && (
                <span
                  style={{
                    marginRight: collapsed ? "0" : "0.5rem",
                    color:
                      pathname === item.key || selectedParent?.key === item.key
                        ? primaryColor
                        : "inherit",
                  }}
                >
                  {item.icon}
                </span>
              )}
              {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
            </div>
          ))}
        </div>

        {/* ⚙️ Settings */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            padding: "0.5rem",
          }}
        >
          <div
            style={{
              ...getMenuItemStyles("settings"),
              width: collapsed ? "50px" : "80%",
              display: "flex",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            onClick={() => navigate("/settings")}
            onMouseEnter={() => setHoveredKey("settings")}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <img
              src={settings}
              alt="Settings"
              style={{
                width: collapsed ? "24px" : "26px",
                height: collapsed ? "24px" : "26px",
              }}
            />
            {!collapsed && <span style={{ marginLeft: "0.5rem" }}>Settings</span>}
          </div>
        </div>
      </div>

      {selectedParent?.children && (
        <SubSidebar parentItem={selectedParent} collapsed={collapsed} />
      )}
    </div>
  );
};

export default Sidebar;
