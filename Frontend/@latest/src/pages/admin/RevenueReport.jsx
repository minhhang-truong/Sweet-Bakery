import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { X } from "lucide-react";
import ManagerHeader from "../../components/admin/ManagerHeader.jsx";
import ManagerSidebar from "../../components/admin/ManagerSidebar.jsx";
import ManagerFooter from "../../components/admin/ManagerFooter.jsx";
import InfoTable from "../../components/admin/InfoTable.jsx";
// import { Calendar } from "../../components/admin/calendar.jsx";
import { Calendar } from "antd";
import dayjs from "dayjs";

const weeklyData = [
  { day: 0, value: 80 },
  { day: 1, value: 60 },
  { day: 2, value: 90 },
  { day: 3, value: 45 },
  { day: 4, value: 70 },
  { day: 5, value: 55 },
  { day: 6, value: 10 },
];

const RevenueReport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showDailyDetail, setShowDailyDetail] = useState(false);

  const todayStats = [
    { label: "Total revenue", value: "120,000,000 đ" },
    { label: "No. of Orders", value: "10000" },
    { label: "Total No. of sold items", value: "10000" },
    { label: "Average revenue / Order", value: "120,000 đ" },
  ];

  const topProducts = [
    { label: "1. Tiramisu", value: "10000" },
    { label: "2. Mousse Chocolate", value: "9800" },
    { label: "3. Cheese cake", value: "560" },
    { label: "4. Cake 1", value: "130" },
    { label: "5. Cake 2", value: "115" },
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      setShowDailyDetail(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ManagerHeader onMenuClick={() => setSidebarOpen(true)} />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Revenue Report</h1>
        <div className="h-1 bg-primary w-full max-w-md mb-8" />

        <div className="flex gap-8 flex-wrap">
          {/* Left Column - Today's Report */}
          <div className="flex-1 min-w-[400px]">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-semibold text-primary">Today's revenue report</h2>
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                12/10/2025
              </span>
            </div>

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

            <div className="h-px bg-primary mb-8" />

            {/* Weekly Report */}
            <h2 className="text-2xl font-semibold text-primary mb-2">This week report</h2>
            <p className="text-sm text-muted-foreground mb-4">(Today: 12/10/2025)</p>

            <div className="flex gap-8 flex-wrap">
              {/* Chart */}
              <div className="flex-1 min-w-[300px]">
                <div className="bg-card border border-border rounded-lg p-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-center text-sm font-medium text-primary mt-2">
                    Weekly Revenue Trend Line Chart
                  </p>
                </div>
              </div>

              {/* Overview Table */}
              <div className="w-80">
                <InfoTable
                  title="Overview"
                  variant="red"
                  data={todayStats}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Calendar */}
          <div className="w-80">
            <h3 className="text-sm font-medium mb-2">Calendar</h3>
            <p className="text-xs text-muted-foreground mb-2">Pick a date 📅</p>
            <div className="bg-card border border-border rounded-lg p-2">
              <Calendar
                fullscreen={false}
                value={selectedDate}
                onSelect={handleDateSelect}/>
            </div>
          </div>
        </div>
      </main>

      <ManagerFooter />

      {/* Daily Detail Popup Modal */}
      {showDailyDetail && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Popup Header */}
            <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">Revenue Report</span>
                <span className="bg-card text-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {selectedDate?.format("DD/MM/YYYY")}
                </span>
              </div>
              <button
                onClick={() => setShowDailyDetail(false)}
                className="text-primary-foreground hover:opacity-70 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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

            {/* Popup Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <button
                onClick={() => setShowDailyDetail(false)}
                className="btn-cancel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReport;
