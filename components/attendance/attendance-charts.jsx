// Charts for attendance violation breakdown by type and by department
// Uses @ant-design/charts (G2-based) — must be loaded client-side only
import dynamic from "next/dynamic";
import { Row, Col, Spin } from "antd";
import { ProCard } from "@ant-design/pro-components";
import { TYPES, DEPTS } from "../../data/attendance-data";

// Dynamic import prevents SSR errors with canvas-based chart library
const Pie = dynamic(() => import("@ant-design/charts").then((m) => m.Pie), { ssr: false });
const Bar = dynamic(() => import("@ant-design/charts").then((m) => m.Bar), { ssr: false });

// Chart color palette aligned with violation type semantics
const TYPE_COLORS = ["#fa8c16", "#13c2c2", "#ff4d4f", "#ff7a45", "#722ed1"];

export default function AttendanceCharts({ records }) {
  // Aggregate by violation type
  const typeData = TYPES.map((type, i) => ({
    type,
    value: records.filter((r) => r.type === type).length,
    color: TYPE_COLORS[i],
  })).filter((d) => d.value > 0);

  // Aggregate by department (top 6 only for readability)
  const deptData = DEPTS.map((dept) => ({
    dept: dept.replace("Phòng ", "").replace("Khoa ", ""),
    count: records.filter((r) => r.dept === dept).length,
  }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

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
    tooltip: { formatter: (d) => ({ name: d.type, value: `${d.value} lỗi` }) },
    interactions: [{ type: "element-active" }],
    height: 240,
  };

  const barConfig = {
    data: deptData,
    xField: "count",
    yField: "dept",
    seriesField: "dept",
    color: "#1677ff",
    barBackground: { style: { fill: "rgba(0,0,0,0.04)" } },
    label: { position: "right", style: { fontSize: 12 } },
    legend: false,
    xAxis: { grid: { line: { style: { stroke: "#f0f0f0" } } } },
    tooltip: { formatter: (d) => ({ name: d.dept, value: `${d.count} lỗi` }) },
    interactions: [{ type: "element-active" }],
    height: 240,
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
            <Bar {...barConfig} />
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
