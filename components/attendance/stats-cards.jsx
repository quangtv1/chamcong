// KPI summary cards shown at the top of the attendance dashboard
import { Row, Col } from "antd";
import { ProCard } from "@ant-design/pro-components";
import {
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const CARD_CONFIGS = [
  {
    key: "total",
    label: "Tổng lỗi",
    icon: <TeamOutlined />,
    color: "#1677ff",
    bg: "#e6f4ff",
    getValue: (records) => records.length,
  },
  {
    key: "pending",
    label: "Chờ xử lý",
    icon: <WarningOutlined />,
    color: "#fa8c16",
    bg: "#fff7e6",
    getValue: (records) => records.filter((r) => r.status === "Chờ xử lý").length,
  },
  {
    key: "confirmed",
    label: "Đã xác nhận",
    icon: <CheckCircleOutlined />,
    color: "#52c41a",
    bg: "#f6ffed",
    getValue: (records) => records.filter((r) => r.status === "Đã xác nhận").length,
  },
  {
    key: "violation",
    label: "Vi phạm",
    icon: <CloseCircleOutlined />,
    color: "#ff4d4f",
    bg: "#fff1f0",
    getValue: (records) => records.filter((r) => r.status === "Vi phạm").length,
  },
];

export default function StatsCards({ records }) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      {CARD_CONFIGS.map(({ key, label, icon, color, bg, getValue }) => (
        <Col key={key} xs={12} sm={12} md={6}>
          <ProCard
            style={{ borderRadius: 8 }}
            bodyStyle={{ padding: "16px 20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Colored icon circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color,
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#8c8c8c", lineHeight: 1.3 }}>
                  {label}
                </div>
                <div
                  style={{ fontSize: 26, fontWeight: 700, color: "#111", lineHeight: 1.2 }}
                >
                  {getValue(records)}
                </div>
              </div>
            </div>
          </ProCard>
        </Col>
      ))}
    </Row>
  );
}
