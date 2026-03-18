// Top header bar — styled to match khaothi app (white, 50px, border-bottom)
import { Button, Space, Dropdown, Avatar } from "antd";
import {
  DownloadOutlined,
  PlusOutlined,
  UserOutlined,
  LogoutOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const USER_MENU = {
  items: [
    { key: "profile", label: "Tài khoản", icon: <UserOutlined /> },
    { type: "divider" },
    { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined />, danger: true },
  ],
};

export default function AppHeader({ onAdd, onExport, sidebarWidth, pageTitle, addLabel, exportLabel }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: sidebarWidth,
        right: 0,
        height: 50,
        background: "#fff",
        borderBottom: "1px solid #e8ecf0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        zIndex: 99,
        transition: "left 0.2s ease",
      }}
    >
      {/* Page title */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>
        {pageTitle || "Quản lý Chấm Công Lỗi"}
      </div>

      {/* Action buttons + user menu */}
      <Space size={8}>
        <Button
          icon={<ReloadOutlined />}
          size="small"
          style={{ borderRadius: 5, fontSize: 13 }}
          title="Tải lại"
          onClick={() => window.location.reload()}
        />
        <Button
          icon={<PlusOutlined />}
          type="primary"
          size="small"
          onClick={onAdd}
          style={{ borderRadius: 5, background: "#0043a5", borderColor: "#0043a5", fontSize: 13 }}
        >
          {addLabel || "Thêm mới"}
        </Button>
        {onExport && (
          <Button
            icon={<DownloadOutlined />}
            size="small"
            onClick={onExport}
            style={{ borderRadius: 5, background: "#00ccd6", borderColor: "#00ccd6", color: "#fff", fontSize: 13 }}
          >
            {exportLabel || "Xuất CSV"}
          </Button>
        )}
        <Dropdown menu={USER_MENU} placement="bottomRight" arrow>
          <Avatar
            size={30}
            icon={<UserOutlined />}
            style={{ background: "#0043a5", cursor: "pointer" }}
          />
        </Dropdown>
      </Space>
    </div>
  );
}
