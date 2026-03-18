// Main attendance management dashboard
// Uses ProTable for data grid, ProCard for layout, dynamic charts
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Button, Tag, Space, Avatar, Popconfirm, message, Tooltip } from "antd";
import { ProTable, ProCard } from "@ant-design/pro-components";
import {
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
import AppSidebar from "../components/layout/app-sidebar";
import AppHeader from "../components/layout/app-header";

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
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const sidebarWidth = sidebarCollapsed ? 60 : 250;

  // Load from localStorage; reset to SAMPLE_DATA when data version changes
  const DATA_VERSION = "v2";
  useEffect(() => {
    try {
      const version = localStorage.getItem("cham_cong_version");
      const saved = localStorage.getItem("cham_cong_data");
      if (saved && version === DATA_VERSION) {
        setRecords(JSON.parse(saved));
      } else {
        setRecords(SAMPLE_DATA);
        localStorage.setItem("cham_cong_version", DATA_VERSION);
        localStorage.setItem("cham_cong_data", JSON.stringify(SAMPLE_DATA));
      }
    } catch {
      setRecords(SAMPLE_DATA);
    }
    setIsMounted(true);
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
    {
      key: "table",
      label: <span><TableOutlined style={{ marginRight: 6 }} />Danh sách</span>,
      children: (
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
      ),
    },
    {
      key: "charts",
      label: <span><BarChartOutlined style={{ marginRight: 6 }} />Thống kê</span>,
      children: (
        <div style={{ padding: 16 }}>
          <AttendanceCharts records={records} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Quản lý Chấm Công Lỗi – HUCE</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      {contextHolder}

      {/* Sidebar + content layout matching khaothi app structure */}
      <div style={{ display: "flex", minHeight: "100vh", background: "#fefefe" }}>
        {isMounted && (
          <AppSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((v) => !v)}
          />
        )}

        {/* Main area shifts right based on sidebar width */}
        <div
          style={{
            marginLeft: isMounted ? sidebarWidth : 0,
            flex: 1,
            minWidth: 0,
            transition: "margin-left 0.2s ease",
          }}
        >
          {/* Fixed top header */}
          {isMounted && (
            <AppHeader
              onAdd={openAdd}
              onExport={exportCSV}
              sidebarWidth={sidebarWidth}
            />
          )}

          {/* Scrollable content below header */}
          <div style={{ padding: "16px", paddingTop: isMounted ? 66 : 16 }}>
            {isMounted && <StatsCards records={records} />}

            {isMounted && (
              <ProCard
                style={{ borderRadius: 5, marginTop: 0 }}
                bodyStyle={{ padding: 0 }}
                tabs={{
                  activeKey: activeTab,
                  onChange: setActiveTab,
                  items: tabItems,
                  tabBarStyle: { paddingLeft: 16, paddingRight: 16, marginBottom: 0 },
                }}
              />
            )}
          </div>
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
