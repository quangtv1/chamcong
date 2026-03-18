// Shared attendance data, constants, and style mappings

export const SAMPLE_DATA = [
  { id: "NV001", name: "Nguyễn Văn An",   dept: "Phòng CNTT",       date: "2025-03-17", type: "Đi muộn",        time: "08:42", note: "Muộn 42 phút",    status: "Chờ xử lý" },
  { id: "NV002", name: "Trần Thị Bích",   dept: "Phòng Kế toán",    date: "2025-03-17", type: "Quên chấm công", time: "",      note: "Không chấm vào", status: "Đã xác nhận" },
  { id: "NV003", name: "Lê Minh Cường",   dept: "Phòng Hành chính", date: "2025-03-17", type: "Về sớm",         time: "16:15", note: "Về sớm 45 phút",  status: "Chờ xử lý" },
  { id: "NV004", name: "Phạm Thị Dung",   dept: "Phòng Đào tạo",    date: "2025-03-17", type: "Vắng mặt",       time: "",      note: "Không phép",      status: "Vi phạm" },
  { id: "NV005", name: "Hoàng Văn Em",    dept: "Phòng NCKH",       date: "2025-03-17", type: "Đi muộn",        time: "09:05", note: "Muộn 65 phút",    status: "Vi phạm" },
  { id: "NV006", name: "Vũ Thị Phương",   dept: "Khoa CNTT",        date: "2025-03-17", type: "Thiếu ca",       time: "",      note: "Thiếu chấm ra",   status: "Chờ xử lý" },
  { id: "NV007", name: "Đặng Văn Giang",  dept: "Phòng CNTT",       date: "2025-03-16", type: "Đi muộn",        time: "08:55", note: "Muộn 55 phút",    status: "Đã xác nhận" },
  { id: "NV008", name: "Bùi Thị Hoa",     dept: "Phòng Kế toán",    date: "2025-03-16", type: "Về sớm",         time: "16:30", note: "Về sớm 30 phút",  status: "Đã xác nhận" },
  { id: "NV009", name: "Trịnh Minh Hùng", dept: "Phòng Hành chính", date: "2025-03-16", type: "Quên chấm công", time: "",      note: "Không chấm ra",   status: "Chờ xử lý" },
  { id: "NV010", name: "Ngô Thị Lan",     dept: "Phòng Đào tạo",    date: "2025-03-16", type: "Vắng mặt",       time: "",      note: "Có đơn xin phép", status: "Đã xác nhận" },
  { id: "NV011", name: "Mai Văn Long",     dept: "Phòng NCKH",       date: "2025-03-15", type: "Đi muộn",        time: "08:35", note: "Muộn 35 phút",    status: "Đã xác nhận" },
  { id: "NV012", name: "Đinh Thị Mai",     dept: "Khoa CNTT",        date: "2025-03-15", type: "Thiếu ca",       time: "",      note: "Thiếu chấm vào",  status: "Chờ xử lý" },
];

export const DEPTS = [
  "Phòng CNTT", "Phòng Kế toán", "Phòng Hành chính",
  "Phòng Đào tạo", "Phòng NCKH", "Khoa CNTT",
  "Phòng QTTB", "Phòng KHTC", "Phòng TTPC",
];

export const TYPES = ["Đi muộn", "Về sớm", "Quên chấm công", "Vắng mặt", "Thiếu ca"];

export const STATUSES = ["Chờ xử lý", "Đã xác nhận", "Vi phạm"];

// Status → Ant Design Tag color
export const STATUS_COLOR = {
  "Chờ xử lý":  "warning",
  "Đã xác nhận": "success",
  "Vi phạm":    "error",
};

// Violation type → Ant Design Tag color
export const TYPE_COLOR = {
  "Đi muộn":        "gold",
  "Về sớm":         "cyan",
  "Quên chấm công": "red",
  "Vắng mặt":       "volcano",
  "Thiếu ca":       "purple",
};

// Generate two-letter initials from full Vietnamese name
export function getInitials(name) {
  const parts = name.trim().split(" ");
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  ["#E8EAF6", "#3949AB"], ["#E8F5E9", "#2E7D32"], ["#FFF3E0", "#E65100"],
  ["#FCE4EC", "#880E4F"], ["#E3F2FD", "#1565C0"], ["#F3E5F5", "#6A1B9A"],
];

export function getAvatarColor(id) {
  const n = parseInt(id.replace(/\D/g, "")) || 0;
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}
