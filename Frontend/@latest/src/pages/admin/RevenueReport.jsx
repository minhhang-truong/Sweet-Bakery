import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
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
import { toISODate } from "@/lib/formDate.js";

const RevenueReport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showDailyDetail, setShowDailyDetail] = useState(false);

  const [weeklyData, setWeeklyData] = useState([]);
  const [todayStats, setTodayStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingPopup, setLoadingPopup] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const [popupStats, setPopupStats] = useState([]);
  const [popupTopProducts, setPopupTopProducts] = useState([]);

  // ⭐ NEW: lưu tuần hiện tại
  const currentWeekRef = useRef(
    dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD")
  );

  const isToday = selectedDate.isSame(dayjs(), "day");

  /* ===================== POPUP (DAILY – STATIC) ===================== */
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
          value: formatVND(
            res.data.total_orders != 0
              ? res.data.total_revenue / res.data.total_orders
              : 0
          ),
        },
      ]);

      setPopupTopProducts(
        res.data.top.map((item, index) => ({
          label: `${index + 1}. ${item.name}`,
          value: item.sold_quantity,
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPopup(false);
    }
  };

  /* ===================== TODAY (REALTIME) ===================== */
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
          value: formatVND(
            res.data.total_orders != 0
              ? res.data.total_revenue / res.data.total_orders
              : 0
          ),
        },
      ]);

      setTopProducts(
        res.data.top.map((item, index) => ({
          label: `${index + 1}. ${item.name}`,
          value: item.sold_quantity,
        }))
      );

      setLastUpdatedAt(dayjs());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMain(false);
    }
  };

  /* ===================== WEEKLY (SEMI-STATIC) ===================== */
  const fetchWeeklyRevenue = async () => {
    const today = dayjs();
    const startOfWeek = today
          .startOf("week")
          .add(1, "day")
          .format("YYYY-MM-DD");

    const res = await api.get("/manager/revenue/weekly", {
      params: { 
        startOfWeek: startOfWeek,
        date: today.format("YYYY-MM-DD") },
    });
    console.log(res.data);
    setWeeklyData(
      res.data.map((d) => ({
        day: dayjs(d.day).format("ddd"),
        value: Number(d.revenue)  / 1_000_000,
      }))
    );

    currentWeekRef.current = res.data.week_start;
  };

  /* ===================== INIT ===================== */
  useEffect(() => {
    fetchTodayRevenue();
    fetchWeeklyRevenue();

    const interval = setInterval(async () => {
      const now = dayjs();

      // refresh today
      await fetchTodayRevenue();

      // ⭐ detect week change
      const newWeek = now.startOf("week").add(1, "day").format("YYYY-MM-DD");
      if (newWeek !== currentWeekRef.current) {
        fetchWeeklyRevenue();
      }
    }, 30 * 60 * 1000); // 30 phút

    return () => clearInterval(interval);
  }, []);

  /* ===================== CALENDAR ===================== */
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

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ManagerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <ManagerHeader onMenuClick={() => setSidebarOpen(true)} />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Revenue Report
        </h1>
        <div className="h-1 bg-primary w-full max-w-md mb-8" />

        <div className="flex gap-8 flex-wrap">
          <div className="flex-1 min-w-[400px]">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-2xl font-semibold text-primary">
                Today's revenue
              </h2>
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                {dayjs().format("MM/DD/YYYY")}
              </span>
            </div>

            {lastUpdatedAt && (
              <p className="text-xs text-muted-foreground mb-4">
                Updated at {lastUpdatedAt.format("HH:mm")}
              </p>
            )}

            {loadingMain ? (
              <p className="text-center text-muted-foreground">
                Loading data...
              </p>
            ) : (
              <div className="space-y-4 mb-8">
                <InfoTable
                  title="Main Information"
                  variant="red"
                  data={todayStats}
                />
                <InfoTable
                  title="Top 5 best-selling products"
                  variant="blue"
                  data={topProducts}
                />
              </div>
            )}

            <div className="h-px bg-primary mb-8" />

            <h2 className="text-2xl font-semibold text-primary mb-2">
              Weekly Report
            </h2>

            <div className="bg-card border rounded-lg p-4">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis
                    domain={[0, (dataMax) => Math.ceil(dataMax)]}
                    allowDecimals
                    tickCount={10}
                    tickFormatter={(v) => `${v}M`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="w-80">
            <h3 className="text-sm font-medium mb-2">Calendar</h3>
            <div className="bg-card border rounded-lg p-2">
              <Calendar
                fullscreen={false}
                value={selectedDate}
                onSelect={handleDateSelect}
              />
            </div>
          </div>
        </div>
      </main>

      <ManagerFooter />

      {showDailyDetail && !isToday && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
              <span className="text-xl font-bold">Revenue Report</span>
              <button
                onClick={() => setShowDailyDetail(false)}
                className="text-primary-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingPopup ? (
              <p className="text-center">Loading...</p>
            ) : (
              <div className="p-6 space-y-4">
                <InfoTable
                  title="Main Information"
                  variant="red"
                  data={popupStats}
                />
                <InfoTable
                  title="Top 5 best-selling products"
                  variant="blue"
                  data={popupTopProducts}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReport;