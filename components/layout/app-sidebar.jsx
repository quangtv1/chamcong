// Left navigation sidebar — styled to match khaothi app design
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AuditOutlined,
  TeamOutlined,
  CalendarOutlined,
  BankOutlined,
} from "@ant-design/icons";

const NAV_ITEMS = [
  { key: "/",           label: "Chấm công lỗi", icon: <AuditOutlined /> },
  { key: "/nhan-vien",  label: "Nhân viên",      icon: <TeamOutlined /> },
  { key: "/ca-lam-viec",label: "Ca làm việc",    icon: <CalendarOutlined /> },
  { key: "/phong-ban",  label: "Phòng ban",       icon: <BankOutlined /> },
];

export default function AppSidebar({ collapsed, onToggle }) {
  const router = useRouter();
  const width = collapsed ? 60 : 250;

  return (
    <div
      style={{
        width,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s ease",
        overflow: "hidden",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      {/* Logo area */}
      <div
        style={{
          height: 50,
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 16px" : "0 20px",
          borderBottom: "1px solid #e8ecf0",
          gap: 10,
          flexShrink: 0,
        }}
      >
        {/* HUCE logo mark */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "#0043a5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0043a5", lineHeight: 1.2, whiteSpace: "nowrap" }}>
              Chấm Công
            </div>
            <div style={{ fontSize: 10, color: "#999", whiteSpace: "nowrap" }}>
              HUCE
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "8px 0" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = router.pathname === item.key;
          return (
            <Tooltip key={item.key} title={collapsed ? item.label : ""} placement="right">
              <div
                onClick={() => router.push(item.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: collapsed ? "10px 0" : "10px 20px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  cursor: "pointer",
                  borderRight: isActive ? "3px solid #0043a5" : "3px solid transparent",
                  background: isActive ? "#cfdce6" : "transparent",
                  color: isActive ? "#0043a5" : "#555",
                  fontWeight: isActive ? 500 : 400,
                  fontSize: 13,
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(0,67,165,0.08)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              </div>
            </Tooltip>
          );
        })}
      </nav>

      {/* Collapse toggle at bottom */}
      <div
        onClick={onToggle}
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-end",
          padding: collapsed ? 0 : "0 16px",
          borderTop: "1px solid #f0f0f0",
          cursor: "pointer",
          color: "#999",
          fontSize: 16,
          flexShrink: 0,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#0043a5")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </div>
  );
}
