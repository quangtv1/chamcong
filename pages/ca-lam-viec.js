// Work shift management page — data from data.xlsx sheet: 4.ca_lam_viec
import { Tag, message } from "antd";
import { ProTable } from "@ant-design/pro-components";
import { SHIFTS } from "../data/shifts-data";
import MainLayout from "../components/layout/main-layout";

// Color by shift group prefix
const SHIFT_COLOR = { HC: "blue", GD: "orange", BV: "red", GH: "purple" };

const COLUMNS = [
  {
    title: "Mã ca",
    dataIndex: "ma",
    key: "ma",
    width: 90,
    render: (ma) => {
      const prefix = ma.slice(0, 2);
      return <Tag color={SHIFT_COLOR[prefix] || "default"}>{ma}</Tag>;
    },
  },
  { title: "Tên ca",        dataIndex: "ten",        key: "ten",        width: 170 },
  { title: "Đơn vị áp dụng", dataIndex: "donVi",    key: "donVi",      width: 220, ellipsis: true },
  { title: "Bắt đầu ca",   dataIndex: "batDau",     key: "batDau",     width: 100, search: false },
  { title: "Chấm vào từ",  dataIndex: "chamVaoTu",  key: "chamVaoTu",  width: 110, search: false },
  { title: "Chấm vào đến", dataIndex: "chamVaoDen", key: "chamVaoDen", width: 110, search: false },
  { title: "Kết thúc ca",  dataIndex: "ketThuc",    key: "ketThuc",    width: 110, search: false },
  { title: "Chấm ra từ",   dataIndex: "chamRaTu",   key: "chamRaTu",   width: 100, search: false },
  { title: "Chấm ra đến",  dataIndex: "chamRaDen",  key: "chamRaDen",  width: 110, search: false },
  { title: "Số giờ",       dataIndex: "soGio",      key: "soGio",      width: 80,  search: false },
  {
    title: "Số ngày công",
    dataIndex: "soNgay",
    key: "soNgay",
    width: 110,
    search: false,
    render: (v) => v,
  },
  { title: "HS ngày thường", dataIndex: "hsNgayThuong", key: "hsNgayThuong", width: 120, search: false },
  { title: "HS ngày nghỉ",   dataIndex: "hsNgayNghi",   key: "hsNgayNghi",   width: 115, search: false },
  { title: "HS ngày lễ",     dataIndex: "hsNgayLe",     key: "hsNgayLe",     width: 105, search: false },
];

export default function CaLamViecPage() {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MainLayout
      title="Ca làm việc"
      addLabel="Thêm ca"
      onAdd={() => messageApi.info("Chức năng đang phát triển")}
    >
      {contextHolder}
      <ProTable
        rowKey="ma"
        dataSource={SHIFTS}
        columns={COLUMNS}
        search={false}
        pagination={false}
        scroll={{ x: 1300 }}
        toolBarRender={false}
        style={{ borderRadius: 5 }}
      />
    </MainLayout>
  );
}
