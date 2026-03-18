// Employee management page — styled like nhansu.png (ProTable with avatar, tabs)
import { useState } from "react";
import { Avatar, Tag, Space, message } from "antd";
import { ProTable } from "@ant-design/pro-components";
import { EMPLOYEES, getEmployeeInitials } from "../data/employees-data";
import { getAvatarColor } from "../data/attendance-data";
import MainLayout from "../components/layout/main-layout";

const COLUMNS = [
  {
    title: "Họ và tên",
    dataIndex: "ten",
    key: "ten",
    width: 200,
    fixed: "left",
    render: (_, r) => {
      const [bg, color] = getAvatarColor(r.maNV);
      return (
        <Space>
          <Avatar size={32} style={{ background: bg, color, fontWeight: 600, fontSize: 12, flexShrink: 0 }}>
            {getEmployeeInitials(r.hodem, r.ten)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500, fontSize: 13 }}>{r.hodem} {r.ten}</div>
            <div style={{ fontSize: 11, color: "#8c8c8c" }}>{r.maNV}</div>
          </div>
        </Space>
      );
    },
  },
  {
    title: "Điện thoại",
    dataIndex: "phone",
    key: "phone",
    width: 120,
    search: false,
  },
  {
    title: "Email tài khoản",
    dataIndex: "email",
    key: "email",
    width: 200,
    ellipsis: true,
  },
  {
    title: "Trạng thái",
    dataIndex: "trangthai",
    key: "trangthai",
    width: 140,
    valueType: "select",
    valueEnum: { "Đang làm việc": { text: "Đang làm việc" }, "Đã nghỉ việc": { text: "Đã nghỉ việc" } },
    render: (_, r) => (
      <Tag color={r.trangthai === "Đang làm việc" ? "success" : "default"}>
        {r.trangthai === "Đang làm việc" ? "Đang hoạt động" : r.trangthai}
      </Tag>
    ),
  },
  {
    title: "Ngày sinh",
    dataIndex: "ngaysinh",
    key: "ngaysinh",
    width: 110,
    search: false,
  },
  {
    title: "Giới tính",
    dataIndex: "gioitinh",
    key: "gioitinh",
    width: 90,
    valueType: "select",
    valueEnum: { "Nam": { text: "Nam" }, "Nữ": { text: "Nữ" } },
  },
  {
    title: "Địa chỉ",
    dataIndex: "diachi",
    key: "diachi",
    ellipsis: true,
    search: false,
  },
  {
    title: "Phòng ban",
    dataIndex: "dept",
    key: "dept",
    width: 220,
    ellipsis: true,
    valueType: "select",
    valueEnum: Object.fromEntries([...new Set(EMPLOYEES.map((e) => e.dept))].map((d) => [d, { text: d }])),
  },
  {
    title: "Vị trí",
    dataIndex: "vitri",
    key: "vitri",
    width: 90,
    search: false,
  },
];

export default function NhanVienPage() {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MainLayout
      title="Nhân viên"
      addLabel="Thêm nhân viên"
      onAdd={() => messageApi.info("Chức năng đang phát triển")}
    >
      {contextHolder}
      <ProTable
        rowKey="maNV"
        dataSource={EMPLOYEES}
        columns={COLUMNS}
        search={{ labelWidth: "auto", defaultCollapsed: true }}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => `Tổng số bản ghi: ${total}`,
        }}
        scroll={{ x: 1100 }}
        toolBarRender={false}
        style={{ borderRadius: 5 }}
      />
    </MainLayout>
  );
}
