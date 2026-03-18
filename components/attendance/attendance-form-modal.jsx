// Add / Edit attendance violation using ProForm inside Ant Design Modal
import { useEffect } from "react";
import { Modal } from "antd";
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormTimePicker,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { DEPTS, TYPES, STATUSES } from "../../data/attendance-data";

export default function AttendanceFormModal({ open, record, onFinish, onCancel }) {
  const [form] = ProForm.useForm();

  // Populate form when editing an existing record
  useEffect(() => {
    if (open) {
      if (record) {
        form.setFieldsValue({
          ...record,
          // Convert stored "HH:mm" string to dayjs for TimePicker
          time: record.time || undefined,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "Chờ xử lý",
          date: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [open, record, form]);

  async function handleFinish(values) {
    // Normalize TimePicker value (dayjs → "HH:mm" string, or keep as-is)
    const time =
      values.time && typeof values.time === "object"
        ? values.time.format("HH:mm")
        : values.time || "";

    const dateStr =
      values.date && typeof values.date === "object"
        ? values.date.format("YYYY-MM-DD")
        : values.date || "";

    await onFinish({ ...values, time, date: dateStr });
    return true; // tells ProForm to reset on success
  }

  return (
    <Modal
      open={open}
      title={record ? "Chỉnh sửa lỗi chấm công" : "Thêm lỗi chấm công"}
      onCancel={onCancel}
      footer={null}
      width={560}
      destroyOnClose
    >
      <ProForm
        form={form}
        onFinish={handleFinish}
        submitter={{
          searchConfig: { submitText: record ? "Lưu thay đổi" : "Thêm mới" },
          resetButtonProps: { onClick: onCancel },
        }}
        layout="vertical"
      >
        <ProForm.Group>
          <ProFormText
            name="id"
            label="Mã nhân viên"
            placeholder="VD: NV001"
            rules={[{ required: true, message: "Vui lòng nhập mã nhân viên" }]}
            width="sm"
          />
          <ProFormText
            name="name"
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            width="md"
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            name="dept"
            label="Phòng ban"
            placeholder="Chọn phòng ban"
            options={DEPTS.map((d) => ({ label: d, value: d }))}
            rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
            width="md"
          />
          <ProFormDatePicker
            name="date"
            label="Ngày"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
            width="sm"
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            name="type"
            label="Loại lỗi"
            placeholder="Chọn loại lỗi"
            options={TYPES.map((t) => ({ label: t, value: t }))}
            rules={[{ required: true, message: "Vui lòng chọn loại lỗi" }]}
            width="md"
          />
          <ProFormTimePicker
            name="time"
            label="Thời gian"
            placeholder="HH:mm"
            fieldProps={{ format: "HH:mm" }}
            width="sm"
          />
        </ProForm.Group>

        <ProFormSelect
          name="status"
          label="Trạng thái"
          options={STATUSES.map((s) => ({ label: s, value: s }))}
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        />

        <ProFormTextArea
          name="note"
          label="Ghi chú"
          placeholder="Mô tả chi tiết..."
          fieldProps={{ rows: 3 }}
        />
      </ProForm>
    </Modal>
  );
}
