// Main attendance management dashboard
// Uses ProTable for data grid, ProCard for layout, dynamic charts
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Button, Tag, Space, Avatar, Popconfirm, message, Typography, Tooltip } from "antd";
import { ProTable, ProCard } from "@ant-design/pro-components";
import {
  PlusOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  BarChartOutlined,
  TableOutlined,
} from "@ant-design/icons";

import {
  SAMPLE_DATA, DEPTS, TYPES, STATUSES,
  STATUS_COLOR, TYPE_COLOR, getInitials, getAvatarColor,
} from "../data/attendance-data";
import StatsCards from "../components/attendance/stats-cards";
import AttendanceFormModal from "../components/attendance/attendance-form-modal";

// Load charts only on client to avoid SSR canvas errors
const AttendanceCharts = dynamic(
  () => import("../components/attendance/attendance-charts"),
  { ssr: false, loading: () => <ProCard style={{ minHeight: 280 }} loading /> }
);

// ProTable column definitions
function buildColumns(onEdit, onDelete) {
  return [
    {
      title: "Nhân viên",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name, record) => {
        const [bg, color] = getAvatarColor(record.id);
        return (
          <Space>
            <Avatar style={{ background: bg, color, fontWeight: 600, fontSize: 12 }}>
              {getInitials(name)}
            </Avatar>
            <div>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{name}</div>
              <div style={{ fontSize: 11, color: "#8c8c8c" }}>{record.id}</div>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Phòng ban",
      dataIndex: "dept",
      key: "dept",
      width: 150,
      valueType: "select",
      valueEnum: Object.fromEntries(DEPTS.map((d) => [d, { text: d }])),
      ellipsis: true,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 110,
      valueType: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Loại lỗi",
      dataIndex: "type",
      key: "type",
      width: 150,
      valueType: "select",
      valueEnum: Object.fromEntries(TYPES.map((t) => [t, { text: t }])),
      render: (_, record) => (
        <Tag color={TYPE_COLOR[record.type]}>{record.type}</Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      width: 90,
      search: false,
      render: (t) => t || <span style={{ color: "#bfbfbf" }}>—</span>,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
      search: false,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      valueType: "select",
      valueEnum: Object.fromEntries(STATUSES.map((s) => [s, { text: s }])),
      render: (_, record) => (
        <Tag color={STATUS_COLOR[record.status]}>{record.status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      search: false,
      fixed: "right",
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa bản ghi này?"
            onConfirm={() => onDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
}

export default function HomePage() {
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("table");
  const [messageApi, contextHolder] = message.useMessage();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cham_cong_data");
      setRecords(saved ? JSON.parse(saved) : SAMPLE_DATA);
    } catch {
      setRecords(SAMPLE_DATA);
    }
  }, []);

  function persist(data) {
    setRecords(data);
    try { localStorage.setItem("cham_cong_data", JSON.stringify(data)); } catch {}
  }

  function openAdd() {
    setEditRecord(null);
    setModalOpen(true);
  }

  function openEdit(record) {
    setEditRecord(record);
    setModalOpen(true);
  }

  async function handleFormFinish(values) {
    if (editRecord) {
      persist(records.map((r) => (r === editRecord ? { ...values } : r)));
      messageApi.success("Đã cập nhật bản ghi");
    } else {
      const duplicate = records.find(
        (r) => r.id === values.id && r.date === values.date
      );
      if (duplicate) {
        messageApi.error("Mã NV đã có lỗi trong ngày này");
        return false;
      }
      persist([{ ...values }, ...records]);
      messageApi.success("Đã thêm bản ghi mới");
    }
    setModalOpen(false);
  }

  function handleDelete(record) {
    persist(records.filter((r) => r !== record));
    messageApi.success("Đã xóa bản ghi");
  }

  function exportCSV() {
    const header = ["Mã NV", "Họ tên", "Phòng ban", "Ngày", "Loại lỗi", "Thời gian", "Ghi chú", "Trạng thái"];
    const rows = records.map((r) => [r.id, r.name, r.dept, r.date, r.type, r.time, r.note, r.status]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c || ""}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cham_cong_loi.csv";
    a.click();
    messageApi.success("Đã xuất file CSV");
  }

  // Rebuild columns only when records reference changes (for delete closure)
  const columns = useMemo(
    () => buildColumns(openEdit, handleDelete),
    [records] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const tabItems = [
    { key: "table", label: <span><TableOutlined style={{ marginRight: 6 }} />Danh sách</span> },
    { key: "charts", label: <span><BarChartOutlined style={{ marginRight: 6 }} />Thống kê</span> },
  ];

  return (
    <>
      <Head>
        <title>Quản lý Chấm Công Lỗi – HUCE</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      {contextHolder}

      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        {/* Top header bar */}
        <div
          style={{
            background: "linear-gradient(135deg, #1E3A5F 0%, #2E75B6 100%)",
            padding: "0 24px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Space>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Calendar SVG icon — no emoji */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
                Quản lý Chấm Công Lỗi
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                Trường Đại học Xây dựng Hà Nội
              </div>
            </div>
          </Space>
          <Space>
            <Button
              icon={<PlusOutlined />}
              onClick={openAdd}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
              }}
            >
              Thêm lỗi
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={exportCSV}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            >
              Xuất CSV
            </Button>
          </Space>
        </div>

        {/* Main content area */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 16px" }}>
          {/* KPI summary row */}
          <StatsCards records={records} />

          {/* Table / Charts tab card */}
          <ProCard
            style={{ borderRadius: 8 }}
            bodyStyle={{ padding: 0 }}
            tabs={{
              activeKey: activeTab,
              onChange: setActiveTab,
              items: tabItems,
              tabBarStyle: { paddingLeft: 16, paddingRight: 16, marginBottom: 0 },
            }}
          >
            {activeTab === "table" && (
              <ProTable
                rowKey={(r) => `${r.id}-${r.date}`}
                dataSource={records}
                columns={columns}
                search={{ labelWidth: "auto", defaultCollapsed: false }}
                pagination={{
                  pageSize: 8,
                  showSizeChanger: false,
                  showTotal: (total) => `Tổng ${total} bản ghi`,
                }}
                scroll={{ x: 900 }}
                toolBarRender={false}
                style={{ borderRadius: 0 }}
              />
            )}
            {activeTab === "charts" && (
              <div style={{ padding: 16 }}>
                <AttendanceCharts records={records} />
              </div>
            )}
          </ProCard>
        </div>
      </div>

      {/* Add / Edit form modal */}
      <AttendanceFormModal
        open={modalOpen}
        record={editRecord}
        onFinish={handleFormFinish}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
