// Shared attendance data, constants, and style mappings
// Source: data.xlsx (HUCE - Trường Đại học Xây dựng Hà Nội)

export const SAMPLE_DATA = [
  // --- 2026-03-18 ---
  { id: "00149", name: "Lê Thị Thùy Dương",      dept: "Khoa Công nghệ thông tin",              date: "2026-03-18", type: "Đi muộn",        time: "08:12", note: "Muộn 42 phút",            status: "Chờ xử lý" },
  { id: "00495", name: "Nguyễn Quốc Toản",        dept: "Khoa Kinh tế và Quản lý xây dựng",      date: "2026-03-18", type: "Quên chấm công", time: "",      note: "Không chấm vào",          status: "Đã xác nhận" },
  { id: "00229", name: "Vũ Quốc Hưng",            dept: "Khoa Xây dựng Công trình thủy",         date: "2026-03-18", type: "Về sớm",         time: "16:15", note: "Về sớm 45 phút",          status: "Chờ xử lý" },
  { id: "00500", name: "Vũ Tiến Dũng",            dept: "Khoa Lý luận chính trị",                date: "2026-03-18", type: "Vắng mặt",       time: "",      note: "Không phép",              status: "Vi phạm" },
  { id: "00009", name: "Cù Việt Hưng",            dept: "Khoa Cầu đường",                        date: "2026-03-18", type: "Đi muộn",        time: "09:05", note: "Muộn 65 phút",            status: "Vi phạm" },
  { id: "00935", name: "Vũ Thị Hoàng Hồng",       dept: "Khoa Công nghệ thông tin",              date: "2026-03-18", type: "Thiếu ca",       time: "",      note: "Thiếu chấm ra",           status: "Chờ xử lý" },
  { id: "00362", name: "Nguyễn Cao Lãnh",         dept: "Khoa Kiến trúc và Quy hoạch",           date: "2026-03-18", type: "Đi muộn",        time: "08:48", note: "Muộn 18 phút",            status: "Đã xác nhận" },
  { id: "00516", name: "Văn Viết Thiên Ân",       dept: "Khoa Vật liệu xây dựng",                date: "2026-03-18", type: "Về sớm",         time: "16:30", note: "Về sớm 30 phút",          status: "Đã xác nhận" },

  // --- 2026-03-17 ---
  { id: "00105", name: "Cao Thành Dũng",          dept: "Khoa Cơ khí",                           date: "2026-03-17", type: "Quên chấm công", time: "",      note: "Không chấm ra",           status: "Chờ xử lý" },
  { id: "00496", name: "Nguyễn Mai Thu",           dept: "Khoa Kinh tế và Quản lý xây dựng",      date: "2026-03-17", type: "Vắng mặt",       time: "",      note: "Có đơn xin phép",         status: "Đã xác nhận" },
  { id: "00213", name: "Bùi Thế Anh",             dept: "Khoa Xây dựng Công trình biển và Dầu khí", date: "2026-03-17", type: "Đi muộn",     time: "08:35", note: "Muộn 35 phút",            status: "Đã xác nhận" },
  { id: "00544", name: "Trương Thị Hạnh",         dept: "Khoa Vật liệu xây dựng",                date: "2026-03-17", type: "Thiếu ca",       time: "",      note: "Thiếu chấm vào",          status: "Chờ xử lý" },
  { id: "00282", name: "Nguyễn Quốc Hòa",         dept: "Khoa Kỹ thuật môi trường",              date: "2026-03-17", type: "Đi muộn",        time: "08:52", note: "Muộn 22 phút",            status: "Chờ xử lý" },
  { id: "00692", name: "Nguyễn Văn Hiếu",         dept: "Khoa Giáo dục thể chất - Quốc phòng",  date: "2026-03-17", type: "Về sớm",         time: "16:10", note: "Về sớm 50 phút",          status: "Vi phạm" },
  { id: "00444", name: "Nguyễn Huy Hoàng",        dept: "Khoa Kiến trúc và Quy hoạch",           date: "2026-03-17", type: "Vắng mặt",       time: "",      note: "Không phép",              status: "Vi phạm" },
  { id: "00984", name: "Đặng Thị Tú",             dept: "Khoa Lý luận chính trị",                date: "2026-03-17", type: "Quên chấm công", time: "",      note: "Không chấm vào",          status: "Đã xác nhận" },

  // --- 2026-03-16 ---
  { id: "00272", name: "Nguyễn Việt Anh",         dept: "Khoa Kỹ thuật môi trường",              date: "2026-03-16", type: "Đi muộn",        time: "08:40", note: "Muộn 40 phút",            status: "Chờ xử lý" },
  { id: "00223", name: "Nguyễn Thị Thùy Dương",   dept: "Khoa Xây dựng Công trình biển và Dầu khí", date: "2026-03-16", type: "Thiếu ca",   time: "",      note: "Thiếu chấm ra",           status: "Đã xác nhận" },
  { id: "00014", name: "Nguyễn Hùng Sơn",         dept: "Khoa Cầu đường",                        date: "2026-03-16", type: "Về sớm",         time: "16:20", note: "Về sớm 40 phút",          status: "Đã xác nhận" },
  { id: "00098", name: "Nguyễn Thị Thanh Dung",   dept: "Khoa Cơ khí",                           date: "2026-03-16", type: "Vắng mặt",       time: "",      note: "Nghỉ ốm không phép",      status: "Vi phạm" },
  { id: "00264", name: "Hoàng Thị Thanh Hoa",     dept: "Khoa Xây dựng Công trình thủy",         date: "2026-03-16", type: "Đi muộn",        time: "08:55", note: "Muộn 55 phút",            status: "Vi phạm" },
  { id: "00706", name: "Cầm Ngọc Thảo",           dept: "Khoa Giáo dục thể chất - Quốc phòng",  date: "2026-03-16", type: "Quên chấm công", time: "",      note: "Không chấm vào",          status: "Chờ xử lý" },
  { id: "00652", name: "Vũ Anh Tuấn",             dept: "Khoa Xây dựng Dân dụng và Công nghiệp", date: "2026-03-16", type: "Thiếu ca",       time: "",      note: "Thiếu chấm vào ca sáng",  status: "Chờ xử lý" },
  { id: "00463", name: "Phạm Xuân Anh",           dept: "Ban Giám hiệu",                         date: "2026-03-16", type: "Đi muộn",        time: "08:20", note: "Muộn 20 phút",            status: "Đã xác nhận" },
  { id: "00064", name: "Hoàng Tùng",              dept: "Ban Giám hiệu",                         date: "2026-03-15", type: "Vắng mặt",       time: "",      note: "Có đơn xin phép",         status: "Đã xác nhận" },
];

// All 36 departments from HUCE organization structure (data.xlsx - sheet 1.import_cctc)
export const DEPTS = [
  "Ban Giám hiệu",
  "Khoa Cầu đường",
  "Khoa Cơ khí",
  "Khoa Công nghệ thông tin",
  "Khoa Giáo dục thể chất - Quốc phòng",
  "Khoa Kiến trúc và Quy hoạch",
  "Khoa Kinh tế và Quản lý xây dựng",
  "Khoa Kỹ thuật môi trường",
  "Khoa Lý luận chính trị",
  "Khoa Vật liệu xây dựng",
  "Khoa Xây dựng Công trình biển và Dầu khí",
  "Khoa Xây dựng Công trình thủy",
  "Khoa Xây dựng Dân dụng và Công nghiệp",
  "Khoa Đào tạo quốc tế",
  "Ban Đào tạo kỹ sư chất lượng cao",
  "Bộ môn Ngoại ngữ",
  "Phòng Quản lý Đào tạo",
  "Phòng Công tác chính trị và Quản lý sinh viên",
  "Phòng Khảo thí và Bảo đảm chất lượng giáo dục",
  "Phòng Truyền thông và Tuyển sinh",
  "Phòng Tổ chức Cán bộ",
  "Văn phòng trường",
  "Phòng Kế hoạch - Tài chính",
  "Văn phòng Đảng và Đoàn thể",
  "Phòng Đối ngoại - Hợp tác quốc tế",
  "Phòng Quản lý đầu tư",
  "Phòng Quản trị Thiết bị",
  "Phòng Khoa học và Công nghệ",
  "Trung tâm CNTT & CSDL",
  "Thư viện",
  "Phòng Thanh tra Pháp chế",
  "Ban Quản lý ký túc xá",
  "Phòng Bảo vệ",
  "Trạm Y tế",
  "Tạp chí Khoa học Công nghệ Xây dựng",
  "Trung tâm Thí nghiệm và Kiểm định xây dựng",
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
