// Charts for attendance violation breakdown by type and by department
// Uses @ant-design/charts (G2-based) — must be loaded client-side only
import dynamic from "next/dynamic";
import { Row, Col, Spin } from "antd";
import { ProCard } from "@ant-design/pro-components";
import { TYPES, DEPTS } from "../../data/attendance-data";

// Dynamic import prevents SSR errors with canvas-based chart library
const Pie = dynamic(() => import("@ant-design/charts").then((m) => m.Pie), { ssr: false });
const Column = dynamic(() => import("@ant-design/charts").then((m) => m.Column), { ssr: false });

// Chart color palette aligned with violation type semantics
const TYPE_COLORS = ["#fa8c16", "#13c2c2", "#ff4d4f", "#ff7a45", "#722ed1"];

// Orange/coral color matching the reference chart image
const COLUMN_COLOR = "#E8552B";

export default function AttendanceCharts({ records }) {
  // Aggregate by violation type
  const typeData = TYPES.map((type, i) => ({
    type,
    value: records.filter((r) => r.type === type).length,
    color: TYPE_COLORS[i],
  })).filter((d) => d.value > 0);

  // Abbreviated dept name map for x-axis labels (matches khaothi chart style)
  const DEPT_ABBR = {
    "Phòng Truyền thông và Tuyển sinh": "TTTS",
    "Phòng Quản lý Đào tạo": "QLDT",
    "Phòng Quản trị Thiết bị": "QTTB",
    "Khoa Kỹ thuật môi trường": "MOITRUONG",
    "Văn phòng trường": "VPD",
    "Phòng Công tác chính trị và Quản lý sinh viên": "CTSV",
    "Phòng Khoa học và Công nghệ": "KHCN",
    "Trung tâm CNTT & CSDL": "TTCNTT",
    "Phòng Kế hoạch - Tài chính": "KHTC",
    "Khoa Cầu đường": "CAUDUONG",
  };

  // Aggregate by department (top 10, sorted descending) with abbreviated labels
  const deptData = DEPTS.map((dept) => ({
    dept: DEPT_ABBR[dept] || dept.replace("Phòng ", "").replace("Khoa ", "").replace("Trung tâm ", "").replace("Văn phòng ", ""),
    fullDept: dept,
    count: records.filter((r) => r.dept === dept).length,
  }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const pieConfig = {
    data: typeData,
    angleField: "value",
    colorField: "type",
    color: TYPE_COLORS,
    radius: 0.85,
    innerRadius: 0.55,
    label: { type: "inner", offset: "-30%", content: "{value}", style: { fontSize: 12, fontWeight: 600 } },
    legend: { position: "bottom", layout: "horizontal" },
    statistic: {
      title: { content: "Tổng", style: { fontSize: 14 } },
      content: { content: String(records.length), style: { fontSize: 24, fontWeight: 700 } },
    },
    tooltip: {
      title: "type",
      items: [{ field: "value", name: "Số lỗi" }],
    },
    height: 240,
  };

  // Vertical column chart config — matches orange column style in reference image
  // Uses @ant-design/charts v2.x (G2 v5) API: text instead of formatter
  const columnConfig = {
    data: deptData,
    xField: "dept",
    yField: "count",
    style: { fill: COLUMN_COLOR, radius: 2 },
    // G2 v5 label API: use `text` field (not formatter)
    label: {
      text: "count",
      position: "top",
      style: { fontSize: 12, fontWeight: 600, fill: "#333" },
    },
    legend: false,
    axis: {
      y: {
        gridStroke: "#e8ecf0",
        labelFontSize: 12,
        labelFill: "#666",
      },
      x: {
        labelFontSize: 11,
        labelFill: "#555",
        tickStroke: "transparent",
      },
    },
    // G2 v5 tooltip API
    tooltip: {
      title: "fullDept",
      items: [{ field: "count", name: "Số lỗi" }],
    },
    height: 260,
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col xs={24} md={10}>
        <ProCard title="Phân bố theo loại lỗi" style={{ borderRadius: 8 }}>
          {typeData.length > 0 ? (
            <Pie {...pieConfig} />
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "#bfbfbf" }}>
              Chưa có dữ liệu
            </div>
          )}
        </ProCard>
      </Col>
      <Col xs={24} md={14}>
        <ProCard title="Lỗi theo phòng ban" style={{ borderRadius: 8 }}>
          {deptData.length > 0 ? (
            <Column {...columnConfig} />
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "#bfbfbf" }}>
              Chưa có dữ liệu
            </div>
          )}
        </ProCard>
      </Col>
    </Row>
  );
}
