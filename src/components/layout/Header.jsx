/* HeaderBar.jsx */
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Dropdown, message, Modal, Input, Button } from "antd";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { userService } from "../../ims/services/Userservice";
import { useAuth } from "../../context/AuthContext";   // ✅ ADDED

const HeaderBar = ({ collapsed, toggleCollapsed }) => {
  const { theme, headerBgColor, headerGradient } = useTheme();
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();     // ✅ REAL LOGGED-IN USER

  // Safe access for name + email
  const userName =
    currentUser?.name ||
    currentUser?.full_name ||
    currentUser?.username ||
    currentUser?.employee_name ||
    "User";

  const userEmail =
    currentUser?.email ||
    currentUser?.email_id ||
    currentUser?.identifier ||
    currentUser?.employee_email ||
    "No Email";

  // Change Password Modal
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      return message.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const response = await userService.changePassword({
        oldPassword,
        newPassword,
      });

      message.success(response.data?.message || "Password changed!");

      setOldPassword("");
      setNewPassword("");
      setPasswordModalVisible(false);

    } catch (error) {
      message.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();     // ✅ CORRECT LOGOUT
      message.success("Logged out");
      navigate("/");
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <div className="px-2 py-2">
          <p className="font-semibold text-sm">{userName}</p>
          <p className="text-gray-500 text-xs">{userEmail}</p>

          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            className="mt-2 w-full"
            onClick={() => setPasswordModalVisible(true)}
          >
            Edit / Change Password
          </Button>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  const isGradient = headerGradient?.includes("gradient");
  const textColor =
    theme === "dark" || isGradient ? "text-white" : "text-black";

  const headerStyle = isGradient
    ? { background: headerGradient }
    : { backgroundColor: headerBgColor || "#ffffff" };

  return (
    <div
      className="flex justify-between items-center shadow-lg h-12 px-4 py-2"
      style={{
        ...headerStyle,
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      <button
        onClick={toggleCollapsed}
        className={`text-lg ${textColor} p-2`}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>

      <Dropdown
        menu={{ items: userMenuItems, onClick: handleMenuClick }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <div className="cursor-pointer w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:shadow-lg">
          <UserOutlined className="text-lg" />
        </div>
      </Dropdown>

      {/* Password Modal */}
      <Modal
        title="Change Password"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
        centered
      >
        <div className="space-y-3">
          <Input.Password
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <Input.Password
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button
            type="primary"
            block
            loading={loading}
            onClick={handleChangePassword}
          >
            Update Password
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default HeaderBar;
