// Department management page — data from data.xlsx sheet: 0.thongke
import { message } from "antd";
import { ProTable } from "@ant-design/pro-components";
import { DEPARTMENTS } from "../data/departments-data";
import MainLayout from "../components/layout/main-layout";

const COLUMNS = [
  { title: "STT",       dataIndex: "stt",     key: "stt",     width: 60,  search: false },
  {
    title: "Đơn vị công tác",
    dataIndex: "dept",
    key: "dept",
    width: 320,
    ellipsis: true,
  },
  { title: "Mã đơn vị",      dataIndex: "maDept",  key: "maDept",  width: 150, ellipsis: true },
  {
    title: "Quản lý trực tiếp",
    dataIndex: "quanly",
    key: "quanly",
    width: 150,
    search: false,
  },
  {
    title: "Số lượng NV",
    dataIndex: "soUser",
    key: "soUser",
    width: 120,
    search: false,
    sorter: (a, b) => a.soUser - b.soUser,
    render: (v) => (
      <span style={{ fontWeight: 600, color: v > 10 ? "#0043a5" : "#333" }}>{v}</span>
    ),
  },
  {
    title: "Ghi chú",
    dataIndex: "ghiChu",
    key: "ghiChu",
    search: false,
    render: (v) => v || <span style={{ color: "#bfbfbf" }}>—</span>,
  },
];

export default function PhongBanPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const totalNV = DEPARTMENTS.reduce((s, d) => s + (d.soUser || 0), 0);

  return (
    <MainLayout
      title="Phòng ban"
      addLabel="Thêm phòng ban"
      onAdd={() => messageApi.info("Chức năng đang phát triển")}
    >
      {contextHolder}
      <ProTable
        rowKey="maDept"
        dataSource={DEPARTMENTS}
        columns={COLUMNS}
        search={{ labelWidth: "auto", defaultCollapsed: false }}
        pagination={false}
        scroll={{ x: 900 }}
        toolBarRender={false}
        style={{ borderRadius: 5 }}
        summary={() => (
          <ProTable.Summary.Row>
            <ProTable.Summary.Cell index={0} colSpan={4}>
              <strong>Tổng cộng</strong>
            </ProTable.Summary.Cell>
            <ProTable.Summary.Cell index={4}>
              <strong style={{ color: "#0043a5" }}>{totalNV}</strong>
            </ProTable.Summary.Cell>
            <ProTable.Summary.Cell index={5} />
          </ProTable.Summary.Row>
        )}
      />
    </MainLayout>
  );
}
