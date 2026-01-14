import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { X } from "lucide-react";
import ManagerHeader from "../../components/admin/ManagerHeader.jsx";
import ManagerSidebar from "../../components/admin/ManagerSidebar.jsx";
import ManagerFooter from "../../components/admin/ManagerFooter.jsx";
import InfoTable from "../../components/admin/InfoTable.jsx";
import { Calendar } from "antd";
import dayjs from "dayjs";
import api from "../../lib/axiosAdmin.js";
import { formatVND } from "../../lib/money.js";

const RevenueReport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showDailyDetail, setShowDailyDetail] = useState(false);

  // State dữ liệu biểu đồ
  const [weeklyData, setWeeklyData] = useState([]);
  
  const [todayStats, setTodayStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingPopup, setLoadingPopup] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const [popupStats, setPopupStats] = useState([]);
  const [popupTopProducts, setPopupTopProducts] = useState([]);

  const currentWeekRef = useRef(
    dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD")
  );

  const isToday = selectedDate.isSame(dayjs(), "day");

  // ... (Giữ nguyên hàm fetchPopupRevenueData) ...
  const fetchPopupRevenueData = async (date) => {
    try {
      setLoadingPopup(true);
      const res = await api.get("/manager/revenue", {
        params: { date: date.format("YYYY-MM-DD") },
      });
      setPopupStats([
        { label: "Total revenue", value: formatVND(res.data.total_revenue) },
        { label: "No. of Orders", value: res.data.total_orders },
        { label: "Total sold items", value: res.data.total_items },
        {
          label: "Average / Order",
          value: formatVND(res.data.total_orders != 0 ? res.data.total_revenue / res.data.total_orders : 0),
        },
      ]);
      setPopupTopProducts(
        res.data.top.map((item, index) => ({
          label: `${index + 1}. ${item.name}`,
          value: item.sold_quantity,
        }))
      );
    } catch (err) { console.error(err); } finally { setLoadingPopup(false); }
  };

  // ... (Giữ nguyên hàm fetchTodayRevenue) ...
  const fetchTodayRevenue = async () => {
    try {
      setLoadingMain(true);
      const today = dayjs();
      const res = await api.get("/manager/revenue", {
        params: { date: today.format("YYYY-MM-DD") },
      });
      setTodayStats([
        { label: "Total revenue", value: formatVND(res.data.total_revenue) },
        { label: "No. of Orders", value: res.data.total_orders },
        { label: "Total sold items", value: res.data.total_items },
        {
          label: "Average / Order",
          value: formatVND(res.data.total_orders != 0 ? res.data.total_revenue / res.data.total_orders : 0),
        },
      ]);
      setTopProducts(
        res.data.top.map((item, index) => ({
          label: `${index + 1}. ${item.name}`,
          value: item.sold_quantity,
        }))
      );
      setLastUpdatedAt(dayjs());
    } catch (err) { console.error(err); } finally { setLoadingMain(false); }
  };

  /* ===================== WEEKLY (UPDATED) ===================== */
  const fetchWeeklyRevenue = async () => {
    const today = dayjs();
    // Logic lấy thứ 2 đầu tuần (nếu chủ nhật thì lùi về thứ 2 tuần trước hoặc giữ nguyên logic của bạn)
    const day = today.day(); 
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const startOfWeek = today.add(diffToMonday, "day").format("YYYY-MM-DD");
    // Lấy đến chủ nhật cuối tuần để vẽ full biểu đồ
    const endOfWeek = today.add(diffToMonday + 6, "day").format("YYYY-MM-DD");

    try {
        const res = await api.get("/manager/revenue/weekly", {
          params: { 
            startOfWeek: startOfWeek,
            date: endOfWeek // Truyền ngày kết thúc là cuối tuần để lấy full data
          },
        });
        
        console.log("Weekly Data:", res.data);

        setWeeklyData(
          res.data.map((d) => ({
            day: dayjs(d.day).format("ddd"), // Mon, Tue...
            revenue: Number(d.revenue),      // Doanh thu (Trục trái)
            orders: Number(d.orders),        // Đơn hàng (Trục phải)
            items: Number(d.items)           // Sản phẩm (Trục phải)
          }))
        );
    } catch (error) {
        console.error("Failed to fetch weekly data", error);
    }
  };

  useEffect(() => {
    fetchTodayRevenue();
    fetchWeeklyRevenue();
    const interval = setInterval(() => {
        fetchTodayRevenue();
        fetchWeeklyRevenue(); // Refresh cả biểu đồ tuần
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDateSelect = (date) => {
    if (!date) return;
    if (!date.isSame(dayjs(), "day")) {
      setSelectedDate(date);
      setShowDailyDetail(true);
      fetchPopupRevenueData(date);
    } else {
      setShowDailyDetail(false);
    }
  };

  // Custom Tooltip để hiển thị đẹp hơn
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-bold text-gray-700 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.name === 'Revenue' 
                ? formatVND(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ManagerHeader onMenuClick={() => setSidebarOpen(true)} />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Revenue Report</h1>
        <div className="h-1 bg-primary w-full max-w-md mb-8" />

        <div className="flex gap-8 flex-wrap">
          <div className="flex-1 min-w-[500px]"> {/* Tăng min-width để biểu đồ rộng hơn */}
            
            {/* ... (Phần Today's Revenue giữ nguyên) ... */}
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-2xl font-semibold text-primary">Today's revenue</h2>
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                {dayjs().format("MM/DD/YYYY")}
              </span>
            </div>
            {lastUpdatedAt && <p className="text-xs text-muted-foreground mb-4">Updated at {lastUpdatedAt.format("HH:mm")}</p>}
            
            {loadingMain ? <p>Loading...</p> : (
               <div className="space-y-4 mb-8">
                 <InfoTable title="Main Information" variant="red" data={todayStats} />
               </div>
            )}

            <div className="h-px bg-primary mb-8" />

            {/* --- BIỂU ĐỒ MỚI 3 ĐƯỜNG --- */}
            <h2 className="text-2xl font-semibold text-primary mb-4">Weekly Statistics</h2>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="day" tick={{fill: '#666'}} />
                  
                  {/* Trục Y Trái: Doanh thu */}
                  <YAxis 
                    yAxisId="left"
                    tickFormatter={(val) => `${val / 1000000}M`} 
                    stroke="#d32f2f"
                    label={{ value: 'Revenue (VND)', angle: -90, position: 'insideLeft', fill: '#d32f2f' }}
                  />
                  
                  {/* Trục Y Phải: Số lượng */}
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#1976d2"
                    label={{ value: 'Count', angle: 90, position: 'insideRight', fill: '#1976d2' }}
                  />

                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36}/>

                  {/* Đường 1: Revenue (Màu Đỏ) */}
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue"
                    stroke="#d32f2f" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                  {/* Đường 2: Orders (Màu Xanh Dương) */}
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    name="Total Orders"
                    stroke="#1976d2" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />

                  {/* Đường 3: Items (Màu Xanh Lá) */}
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="items" 
                    name="Items Sold"
                    stroke="#388e3c" 
                    strokeWidth={2}
                    strokeDasharray="5 5" // Nét đứt để phân biệt
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ... (Phần Calendar bên phải giữ nguyên) ... */}
          <div className="w-80">
            <h3 className="text-sm font-medium mb-2">Calendar History</h3>
            <div className="bg-card border rounded-lg p-2">
              <Calendar fullscreen={false} value={selectedDate} onSelect={handleDateSelect} />
            </div>
          </div>
        </div>
      </main>

      <ManagerFooter />
      
      {/* ... (Phần Popup Daily Detail giữ nguyên) ... */}
      {showDailyDetail && !isToday && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-[#d32f2f] text-white px-6 py-4 flex items-center justify-between">
              <span className="text-xl font-bold">Report: {selectedDate.format('DD/MM/YYYY')}</span>
              <button onClick={() => setShowDailyDetail(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            {loadingPopup ? <p className="text-center p-8">Loading...</p> : (
              <div className="p-6 space-y-6">
                <InfoTable title="Overview" variant="red" data={popupStats} />
                <InfoTable title="Top Products" variant="blue" data={popupTopProducts} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReport;