import { useState, useEffect, useMemo } from "react";
import Head from "next/head";

const SAMPLE_DATA = [
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

const DEPTS = ["Phòng CNTT","Phòng Kế toán","Phòng Hành chính","Phòng Đào tạo","Phòng NCKH","Khoa CNTT","Phòng QTTB","Phòng KHTC","Phòng TTPC"];
const TYPES = ["Đi muộn","Về sớm","Quên chấm công","Vắng mặt","Thiếu ca"];
const STATUSES = ["Chờ xử lý","Đã xác nhận","Vi phạm"];

const TYPE_STYLE = {
  "Đi muộn":        { bg:"#FFF3CD", color:"#856404", border:"#FFEEBA" },
  "Về sớm":         { bg:"#D1ECF1", color:"#0C5460", border:"#BEE5EB" },
  "Quên chấm công": { bg:"#F8D7DA", color:"#721C24", border:"#F5C6CB" },
  "Vắng mặt":       { bg:"#F8D7DA", color:"#721C24", border:"#F5C6CB" },
  "Thiếu ca":       { bg:"#E2D9F3", color:"#432874", border:"#CBB8F0" },
};

const STATUS_STYLE = {
  "Chờ xử lý":  { bg:"#FFF3CD", color:"#856404" },
  "Đã xác nhận":{ bg:"#D4EDDA", color:"#155724" },
  "Vi phạm":    { bg:"#F8D7DA", color:"#721C24" },
};

function initials(name) {
  const p = name.trim().split(" ");
  return (p[0][0] + (p[p.length-1][0])).toUpperCase();
}

const AVATAR_COLORS = [
  ["#E8EAF6","#3949AB"],["#E8F5E9","#2E7D32"],["#FFF3E0","#E65100"],
  ["#FCE4EC","#880E4F"],["#E3F2FD","#1565C0"],["#F3E5F5","#6A1B9A"],
];
function avatarColor(id) {
  const n = parseInt(id.replace(/\D/g,"")) || 0;
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

const EMPTY_FORM = { id:"", name:"", dept:"", date:"", type:"", time:"", note:"", status:"Chờ xử lý" };

export default function Home() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const PAGE_SIZE = 8;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cham_cong_data");
      setRecords(saved ? JSON.parse(saved) : SAMPLE_DATA);
    } catch { setRecords(SAMPLE_DATA); }
  }, []);

  function save(data) {
    setRecords(data);
    try { localStorage.setItem("cham_cong_data", JSON.stringify(data)); } catch {}
  }

  function showToast(msg, type="success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = useMemo(() => {
    return records.filter(r => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) &&
          !r.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterDate && r.date !== filterDate) return false;
      if (filterDept && r.dept !== filterDept) return false;
      if (filterType && r.type !== filterType) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      return true;
    });
  }, [records, search, filterDate, filterDept, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // Stats
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = records.filter(r => r.date === today);
  const statByType = TYPES.map(t => ({ type: t, count: records.filter(r => r.type === t).length }));
  const statByDept = DEPTS.map(d => ({ dept: d, count: records.filter(r => r.dept === d).length })).filter(d => d.count > 0).sort((a,b)=>b.count-a.count);

  function validateForm() {
    const e = {};
    if (!form.id.trim()) e.id = "Vui lòng nhập mã nhân viên";
    if (!form.name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!form.dept) e.dept = "Vui lòng chọn phòng ban";
    if (!form.date) e.date = "Vui lòng chọn ngày";
    if (!form.type) e.type = "Vui lòng chọn loại lỗi";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function openAdd() {
    setEditRecord(null);
    setForm({ ...EMPTY_FORM, date: today });
    setErrors({});
    setShowModal(true);
  }

  function openEdit(r) {
    setEditRecord(r);
    setForm({ ...r });
    setErrors({});
    setShowModal(true);
  }

  function handleSubmit() {
    if (!validateForm()) return;
    if (editRecord) {
      const updated = records.map(r => r === editRecord ? { ...form } : r);
      save(updated);
      showToast("Đã cập nhật bản ghi thành công");
    } else {
      if (records.find(r => r.id === form.id && r.date === form.date)) {
        setErrors({ id: "Mã NV đã có lỗi trong ngày này" });
        return;
      }
      save([{ ...form }, ...records]);
      showToast("Đã thêm bản ghi thành công");
    }
    setShowModal(false);
    setPage(1);
  }

  function handleDelete(r) { setDeleteId(r); }
  function confirmDelete() {
    save(records.filter(r => r !== deleteId));
    setDeleteId(null);
    showToast("Đã xóa bản ghi", "error");
  }

  function exportCSV() {
    const header = ["Mã NV","Họ tên","Phòng ban","Ngày","Loại lỗi","Thời gian","Ghi chú","Trạng thái"];
    const rows = filtered.map(r => [r.id,r.name,r.dept,r.date,r.type,r.time,r.note,r.status]);
    const csv = [header,...rows].map(r=>r.map(c=>`"${c||""}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download="cham_cong_loi.csv"; a.click();
    showToast("Đã xuất file CSV");
  }

  const inp = { border:"1px solid #D1D5DB", borderRadius:6, padding:"8px 12px", fontSize:14, width:"100%", outline:"none", background:"#fff", color:"#111" };
  const inpErr = { ...inp, borderColor:"#EF4444" };

  return (
    <>
      <Head>
        <title>Quản lý Chấm Công Lỗi – HUCE</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight:"100vh", background:"#F0F4F8", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#1E3A5F 0%,#2E75B6 100%)", color:"#fff", padding:"0 24px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, background:"rgba(255,255,255,0.2)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📋</div>
              <div>
                <div style={{ fontWeight:700, fontSize:16, lineHeight:1.2 }}>Quản lý Chấm Công Lỗi</div>
                <div style={{ fontSize:11, opacity:.75 }}>Trường Đại học Xây dựng Hà Nội</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={openAdd} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", borderRadius:6, padding:"6px 14px", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{fontSize:16}}>＋</span> Thêm lỗi
              </button>
              <button onClick={exportCSV} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", borderRadius:6, padding:"6px 14px", fontSize:13, cursor:"pointer" }}>
                ⬇ Xuất CSV
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"0 24px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", gap:0 }}>
            {[["list","📋 Danh sách"],["stats","📊 Thống kê"]].map(([k,l]) => (
              <button key={k} onClick={()=>setActiveTab(k)} style={{ padding:"12px 20px", fontSize:14, fontWeight:activeTab===k?600:400, color:activeTab===k?"#2E75B6":"#6B7280", background:"none", border:"none", borderBottom:activeTab===k?"2px solid #2E75B6":"2px solid transparent", cursor:"pointer", fontFamily:"inherit" }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 24px" }}>

          {/* Stats Cards (always visible) */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12, marginBottom:20 }}>
            {[
              { label:"Tổng lỗi", value:records.length, icon:"📌", color:"#2E75B6", bg:"#EBF3FB" },
              { label:"Hôm nay", value:todayRecords.length, icon:"📅", color:"#E65100", bg:"#FFF3E0" },
              { label:"Chờ xử lý", value:records.filter(r=>r.status==="Chờ xử lý").length, icon:"⏳", color:"#856404", bg:"#FFF3CD" },
              { label:"Vi phạm", value:records.filter(r=>r.status==="Vi phạm").length, icon:"🚨", color:"#721C24", bg:"#F8D7DA" },
            ].map((s,i) => (
              <div key={i} style={{ background:"#fff", borderRadius:10, padding:"16px 18px", border:"1px solid #E5E7EB", display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:11, color:"#6B7280", marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontSize:26, fontWeight:700, color:s.color, lineHeight:1 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* LIST TAB */}
          {activeTab === "list" && (
            <>
              {/* Filters */}
              <div style={{ background:"#fff", borderRadius:10, padding:"14px 16px", border:"1px solid #E5E7EB", marginBottom:16, display:"flex", gap:10, flexWrap:"wrap" }}>
                <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="🔍  Tìm tên, mã nhân viên..." style={{ ...inp, flex:"1 1 180px" }} />
                <input type="date" value={filterDate} onChange={e=>{setFilterDate(e.target.value);setPage(1)}} style={{ ...inp, width:"auto", flex:"0 1 140px" }} />
                {[["filterDept",filterDept,setFilterDept,"Phòng ban",DEPTS],["filterType",filterType,setFilterType,"Loại lỗi",TYPES],["filterStatus",filterStatus,setFilterStatus,"Trạng thái",STATUSES]].map(([,val,set,ph,opts])=>(
                  <select key={ph} value={val} onChange={e=>{set(e.target.value);setPage(1)}} style={{ ...inp, width:"auto", flex:"0 1 150px", cursor:"pointer" }}>
                    <option value="">-- {ph} --</option>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                ))}
                {(search||filterDate||filterDept||filterType||filterStatus) && (
                  <button onClick={()=>{setSearch("");setFilterDate("");setFilterDept("");setFilterType("");setFilterStatus("");setPage(1)}} style={{ ...inp, width:"auto", background:"#F3F4F6", cursor:"pointer", color:"#374151", flex:"0 0 auto" }}>✕ Xóa lọc</button>
                )}
              </div>

              {/* Table */}
              <div style={{ background:"#fff", borderRadius:10, border:"1px solid #E5E7EB", overflow:"hidden" }}>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                    <thead>
                      <tr style={{ background:"#F8FAFC" }}>
                        {["#","Mã NV","Họ và tên","Phòng ban","Ngày","Loại lỗi","Giờ","Trạng thái",""].map((h,i)=>(
                          <th key={i} style={{ padding:"10px 14px", textAlign:i===0||i===8?"center":"left", fontSize:12, fontWeight:600, color:"#374151", borderBottom:"1px solid #E5E7EB", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.length === 0 ? (
                        <tr><td colSpan={9} style={{ textAlign:"center", padding:"40px", color:"#9CA3AF", fontSize:14 }}>Không có dữ liệu phù hợp</td></tr>
                      ) : pageData.map((r,i) => {
                        const [abg,afg] = avatarColor(r.id);
                        const ts = TYPE_STYLE[r.type] || {};
                        const ss = STATUS_STYLE[r.status] || {};
                        return (
                          <tr key={i} style={{ borderBottom:"1px solid #F3F4F6" }} onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                            <td style={{ padding:"10px 14px", textAlign:"center", fontSize:12, color:"#9CA3AF" }}>{(page-1)*PAGE_SIZE+i+1}</td>
                            <td style={{ padding:"10px 14px", fontFamily:"monospace", fontSize:12, color:"#6B7280" }}>{r.id}</td>
                            <td style={{ padding:"10px 14px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{ width:32, height:32, borderRadius:"50%", background:abg, color:afg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, flexShrink:0 }}>{initials(r.name)}</div>
                                <span style={{ fontSize:13, fontWeight:500, whiteSpace:"nowrap" }}>{r.name}</span>
                              </div>
                            </td>
                            <td style={{ padding:"10px 14px", fontSize:13, color:"#4B5563", whiteSpace:"nowrap" }}>{r.dept}</td>
                            <td style={{ padding:"10px 14px", fontSize:13, whiteSpace:"nowrap" }}>{r.date}</td>
                            <td style={{ padding:"10px 14px" }}>
                              <span style={{ background:ts.bg, color:ts.color, border:`1px solid ${ts.border}`, borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:500, whiteSpace:"nowrap" }}>{r.type}</span>
                            </td>
                            <td style={{ padding:"10px 14px", fontFamily:"monospace", fontSize:13, color:"#374151" }}>{r.time||"--:--"}</td>
                            <td style={{ padding:"10px 14px" }}>
                              <span style={{ background:ss.bg, color:ss.color, borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:500 }}>{r.status}</span>
                            </td>
                            <td style={{ padding:"10px 14px", textAlign:"center" }}>
                              <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                                <button onClick={()=>openEdit(r)} style={{ background:"#EBF3FB", border:"none", borderRadius:6, padding:"4px 10px", fontSize:12, color:"#1E3A5F", cursor:"pointer" }}>Sửa</button>
                                <button onClick={()=>handleDelete(r)} style={{ background:"#FEE2E2", border:"none", borderRadius:6, padding:"4px 10px", fontSize:12, color:"#991B1B", cursor:"pointer" }}>Xóa</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderTop:"1px solid #F3F4F6" }}>
                  <span style={{ fontSize:13, color:"#6B7280" }}>{filtered.length} bản ghi · trang {page}/{totalPages}</span>
                  <div style={{ display:"flex", gap:4 }}>
                    {[...Array(totalPages)].map((_,i)=>(
                      <button key={i} onClick={()=>setPage(i+1)} style={{ width:32, height:32, borderRadius:6, border:"1px solid", borderColor:page===i+1?"#2E75B6":"#D1D5DB", background:page===i+1?"#2E75B6":"#fff", color:page===i+1?"#fff":"#374151", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>{i+1}</button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STATS TAB */}
          {activeTab === "stats" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {/* By type */}
              <div style={{ background:"#fff", borderRadius:10, border:"1px solid #E5E7EB", padding:"20px" }}>
                <div style={{ fontWeight:600, fontSize:15, marginBottom:16, color:"#1F2937" }}>Phân loại lỗi</div>
                {statByType.map(({ type, count }) => {
                  const ts = TYPE_STYLE[type] || {};
                  const pct = records.length ? Math.round(count/records.length*100) : 0;
                  return (
                    <div key={type} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:13, background:ts.bg, color:ts.color, padding:"2px 10px", borderRadius:20, fontWeight:500 }}>{type}</span>
                        <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{count} <span style={{ color:"#9CA3AF", fontWeight:400 }}>({pct}%)</span></span>
                      </div>
                      <div style={{ height:8, background:"#F3F4F6", borderRadius:99 }}>
                        <div style={{ height:"100%", borderRadius:99, background:ts.color, width:`${pct}%`, transition:"width .4s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* By dept */}
              <div style={{ background:"#fff", borderRadius:10, border:"1px solid #E5E7EB", padding:"20px" }}>
                <div style={{ fontWeight:600, fontSize:15, marginBottom:16, color:"#1F2937" }}>Theo phòng ban</div>
                {statByDept.map(({ dept, count }) => {
                  const pct = records.length ? Math.round(count/records.length*100) : 0;
                  return (
                    <div key={dept} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:13, color:"#374151" }}>{dept}</span>
                        <span style={{ fontSize:13, fontWeight:600, color:"#2E75B6" }}>{count}</span>
                      </div>
                      <div style={{ height:8, background:"#F3F4F6", borderRadius:99 }}>
                        <div style={{ height:"100%", borderRadius:99, background:"#2E75B6", width:`${pct}%`, transition:"width .4s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* By status */}
              <div style={{ background:"#fff", borderRadius:10, border:"1px solid #E5E7EB", padding:"20px", gridColumn:"1/-1" }}>
                <div style={{ fontWeight:600, fontSize:15, marginBottom:16, color:"#1F2937" }}>Trạng thái xử lý</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                  {STATUSES.map(s => {
                    const ss = STATUS_STYLE[s] || {};
                    const count = records.filter(r=>r.status===s).length;
                    return (
                      <div key={s} style={{ background:ss.bg, borderRadius:10, padding:"18px", textAlign:"center" }}>
                        <div style={{ fontSize:28, fontWeight:700, color:ss.color }}>{count}</div>
                        <div style={{ fontSize:13, color:ss.color, marginTop:4 }}>{s}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
          <div style={{ background:"#fff", borderRadius:12, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #E5E7EB", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontWeight:700, fontSize:16, color:"#1F2937" }}>{editRecord ? "✏️ Sửa bản ghi" : "➕ Thêm lỗi chấm công"}</div>
              <button onClick={()=>setShowModal(false)} style={{ background:"#F3F4F6", border:"none", borderRadius:6, width:32, height:32, fontSize:18, cursor:"pointer", color:"#374151" }}>×</button>
            </div>
            <div style={{ padding:"20px 24px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
                  { key:"id", label:"Mã nhân viên *", ph:"VD: NV001", half:true },
                  { key:"name", label:"Họ và tên *", ph:"Nguyễn Văn A", half:true },
                ].map(({key,label,ph})=>(
                  <div key={key}>
                    <label style={{ fontSize:13, fontWeight:500, color:"#374151", display:"block", marginBottom:5 }}>{label}</label>
                    <input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph} style={errors[key]?inpErr:inp} />
                    {errors[key] && <div style={{ fontSize:11, color:"#EF4444", marginTop:3 }}>{errors[key]}</div>}
                  </div>
                ))}

                <div>
                  <label style={{ fontSize:13, fontWeight:500, color:"#374151", display:"block", marginBottom:5 }}>Phòng ban *</label>
                  <select value={form.dept} onChange={e=>setForm({...form,dept:e.target.value})} style={errors.dept?inpErr:inp}>
                    <option value="">-- Chọn phòng ban --</option>
                    {DEPTS.map(d=><option key={d}>{d}</option>)}
                  </select>
                  {errors.dept && <div style={{ fontSize:11, color:"#EF4444", marginTop:3 }}>{errors.dept}</div>}
                </div>

                <div>
                  <label style={{ fontSize:13, fontWeight:500, color:"#374151", display:"block", marginBottom:5 }}>Ngày *</label>
                  <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={errors.date?inpErr:inp} />
                  {errors.date && <div style={{ fontSize:11, color:"#EF4444", marginTop:3 }}>{errors.date}</div>}
                </div>

                <div>
                  <label style={{ fontSize:13, fontWeight:500, color:"#374151", display:"block", marginBottom:5 }}>Loại lỗi *</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={errors.type?inpErr:inp}>
                    <option value="">-- Chọn loại lỗi --</option>
                    {TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                  {errors.type && <div style={{ fontSize:11, color:"#EF4444", marginTop:3 }}>{errors.type}</div>}
                </div>

                <div>
                  <label style={{ fontSize:13, fontWeight:500, color:"#374151", display:"block", marginBottom:5 }}>Giờ chấm công</label>
                  <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} style={inp} />
                </div>

                <div>
                  <label style={{ fontSize:13, fontWeight:500, color:"#374151", display:"block", marginBottom:5 }}>Trạng thái</label>
                  <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={inp}>
                    {STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:13, fontWeight:500, color:"#374151", display:"block", marginBottom:5 }}>Ghi chú</label>
                  <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Nhập ghi chú..." style={inp} />
                </div>
              </div>
            </div>
            <div style={{ padding:"16px 24px", borderTop:"1px solid #E5E7EB", display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={()=>setShowModal(false)} style={{ padding:"8px 20px", border:"1px solid #D1D5DB", borderRadius:7, background:"#fff", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Hủy</button>
              <button onClick={handleSubmit} style={{ padding:"8px 24px", border:"none", borderRadius:7, background:"linear-gradient(135deg,#1E3A5F,#2E75B6)", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                {editRecord ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", borderRadius:12, padding:"28px", maxWidth:380, width:"90%", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:32, textAlign:"center", marginBottom:12 }}>🗑️</div>
            <div style={{ fontWeight:700, fontSize:16, textAlign:"center", marginBottom:8 }}>Xác nhận xóa</div>
            <div style={{ fontSize:13, color:"#6B7280", textAlign:"center", marginBottom:20 }}>
              Bạn có chắc muốn xóa bản ghi của <strong>{deleteId.name}</strong> ngày {deleteId.date}?
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setDeleteId(null)} style={{ flex:1, padding:"9px", border:"1px solid #D1D5DB", borderRadius:7, background:"#fff", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Hủy</button>
              <button onClick={confirmDelete} style={{ flex:1, padding:"9px", border:"none", borderRadius:7, background:"#DC2626", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, background:toast.type==="error"?"#DC2626":"#059669", color:"#fff", borderRadius:8, padding:"12px 20px", fontSize:14, fontWeight:500, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", zIndex:2000, animation:"fadeIn .3s" }}>
          {toast.type==="error"?"🗑️":"✅"} {toast.msg}
        </div>
      )}

      <style>{`*{box-sizing:border-box}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}select option{color:#111}`}</style>
    </>
  );
}
