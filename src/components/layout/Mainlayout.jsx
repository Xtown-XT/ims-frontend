import {
  Layout,
  ConfigProvider,
  Drawer,
  Button,
  Radio,
  Tabs,
  Tooltip,
  Card,
  Switch,
} from "antd";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderBar from "./Header";
import POSHeader from "../../ims/pages/Sales/POS/POSHeader";
import {
  SettingOutlined,
  CheckOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import { SketchPicker } from "react-color";
import { useTheme } from "../../context/ThemeContext";
import AppFooter from "./Footer";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const MainLayout = ({ menuItems }) => {
  const location = useLocation(); // ✅ Needed to detect POS path
  const isPOSPage = location.pathname.includes("/pos"); // ✅ Detect /pos anywhere in path

  // ✅ Hide Header/Footer only on Product Details page
  const hideHeaderFooter = location.pathname === "/ims/inventory/productdetails";

  const [collapsed, setCollapsed] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);

  const {
    theme,
    setTheme,
    layoutType,
    primaryColor,
    setPrimaryColor,
    contentBgColor,
    setContentBgColor,
    headerGradient,
    setHeaderGradient,
    sidebarBgColor,
    setSidebarBgColor,
    footerBgColor,
    setFooterBgColor,
    resetTheme,
    commonColorSchemes,
    applyCommonColorScheme,
    createGradientFromColor,
    setShowCustomButton,
    showCustomButton,
  } = useTheme();

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const openSettings = () => setSettingsVisible(true);
  const closeSettings = () => setSettingsVisible(false);
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#0000ff");

  const updateGradient = (c1, c2) => {
    const gradient = `linear-gradient(to right, ${c1}, ${c2})`;
    setHeaderGradient(gradient);
  };

  // Function to close submenu
  const closeSubMenu = () => {
    setSelectedParent(null);
  };

  // Handle content click to close submenu
  const handleContentClick = () => {
    if (selectedParent) {
      closeSubMenu();
    }
  };

  // Function to handle gradient selection
  const handleGradientSelect = (gradient) => {
    setHeaderGradient(gradient);
  };

  // Predefined gradients
  const predefinedGradients = [
    {
      name: "Violet to Purple",
      value: "linear-gradient(to right, #8e2de2, #4a00e0)",
    },
    {
      name: "Blue to Purple",
      value: "linear-gradient(to right, #4facfe, #00f2fe)",
    },
    {
      name: "Green to Blue",
      value: "linear-gradient(to right, #43cea2, #185a9d)",
    },
    {
      name: "Orange to Red",
      value: "linear-gradient(to right, #ff8008, #ffc837)",
    },
    {
      name: "Pink to Orange",
      value: "linear-gradient(to right, #ff6a88, #ff99ac)",
    },
  ];

  const toggleColorPicker = (pickerName) => {
    setActiveColorPicker(activeColorPicker === pickerName ? null : pickerName);
  };

  const handlePrimaryColorChange = (color) => {
    setPrimaryColor(color.hex);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      <Layout
        className="min-h-screen"
        style={{
          maxWidth: layoutType === "boxed" ? "1200px" : "100%",
          margin: layoutType === "boxed" ? "0 auto" : 0,
        }}
      >
        {/* ✅ Sidebar remains unchanged */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={200}
          collapsedWidth={60}
          theme={theme}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            backgroundColor: theme === "dark" ? "#001529" : sidebarBgColor,
          }}
        >
          <Sidebar
            collapsed={collapsed}
            menuItems={menuItems}
            selectedParent={selectedParent}
            setSelectedParent={setSelectedParent}
          />
        </Sider>

        <Layout
          style={{
            marginLeft: selectedParent
              ? collapsed
                ? 230
                : 400
              : collapsed
              ? 60
              : 200,
            transition: "margin-left 0.3s",
            backgroundColor: contentBgColor,
          }}
        >
          {/* ✅ Hide HeaderBar only on Product Details page */}
          {!hideHeaderFooter && (
            <>
              {isPOSPage ? (
                <POSHeader />
              ) : (
                <HeaderBar
                  collapsed={collapsed}
                  toggleCollapsed={toggleCollapsed}
                  closeSubMenu={closeSubMenu}
                />
              )}
            </>
          )}

          {/* Floating Settings Button */}
          <div className="fixed bottom-5 right-5 z-50">
            <Tooltip title="Customize Theme">
              <Button
                type="primary"
                shape="circle"
                icon={<SettingOutlined spin />}
                onClick={openSettings}
                size="large"
              />
            </Tooltip>
          </div>

          {/* ✅ Page Content */}
          <Content
            style={{
              padding: "6px",
              backgroundColor: contentBgColor,
              minHeight: "calc(100vh - 112px)",
              overflow: "auto",
              position: "relative",
            }}
            onClick={handleContentClick}
          >
            <div className="bg-white rounded-lg shadow p-6 min-h-full">
              <Outlet />
            </div>
          </Content>

          {/* ✅ Hide Footer only on Product Details page */}
          {!hideHeaderFooter && (
            <AppFooter
              theme={theme}
              bgColor={theme === "dark" ? "#001529" : footerBgColor}
            />
          )}
        </Layout>
      </Layout>

      {/* Settings Drawer (Unchanged) */}
      <Drawer
        title={
          <div className="flex items-center">
            <SettingOutlined className="mr-2" />
            <span>Theme Settings</span>
          </div>
        }
        placement="right"
        closable
        onClose={closeSettings}
        open={settingsVisible}
        width={340}
        styles={{ body: { padding: "16px" } }}
        footer={
          <div className="flex justify-between">
            <Button onClick={resetTheme}>Reset to Default</Button>
            <Button type="primary" onClick={closeSettings}>
              Apply Changes
            </Button>
          </div>
        }
      >
        {/* ... rest of your tabs and theme controls stay unchanged */}
      </Drawer>
    </ConfigProvider>
  );
};

export default MainLayout;
