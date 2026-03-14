import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#8b5cf6", "#10B981", "#f43f5e"];

export default function EmployeeAnalytics() {
  const { token } = useAuth();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leaves/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setLeaves(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===== Monthly Leave Calculation ===== */
  const monthlyMap = {};

  leaves.forEach(l => {
    const year = new Date(l.start_date).getFullYear();
    if (year.toString() !== selectedYear) return;

    const month = new Date(l.start_date).toLocaleString("en-US", { month: "short" });
    const days = (new Date(l.end_date) - new Date(l.start_date)) / (1000 * 60 * 60 * 24) + 1;

    monthlyMap[month] = (monthlyMap[month] || 0) + days;
  });

  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = allMonths.map(m => ({
    month: m,
    days: monthlyMap[m] || 0
  }));

  /* ===== Leave Type Distribution ===== */
  const typeMap = {
    CL: 0,
    SL: 0,
    LOP: 0
  };

  leaves.forEach(l => {
    const year = new Date(l.start_date).getFullYear();
    if (year.toString() !== selectedYear) return;

    const days = (new Date(l.end_date) - new Date(l.start_date)) / (1000 * 60 * 60 * 24) + 1;
    typeMap[l.leave_type] += days;
  });

  const distributionData = [
    { name: "Casual Leave (CL)", value: typeMap.CL },
    { name: "Sick Leave (SL)", value: typeMap.SL },
    { name: "Loss of Pay (LOP)", value: typeMap.LOP }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="glass-panel p-8 bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-800 text-white relative overflow-hidden border-none shadow-2xl shadow-purple-500/20">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-blue-400/20 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">
              Analytics Overview
            </h1>
            <p className="mt-2 text-purple-100 max-w-xl text-lg font-medium">
              A comprehensive deep-dive into your historical leave consumption metrics.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-inner">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white font-bold text-lg py-2 px-6 focus:outline-none rounded-lg appearance-none cursor-pointer"
            >
              <option value="2024" className="text-slate-800">2024</option>
              <option value="2025" className="text-slate-800">2025</option>
              <option value="2026" className="text-slate-800">2026</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Chart (Area Chart) */}
        <div className="glass-panel p-8 animate-slide-up bg-white">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Leave Trend Curve</h3>
            </div>
            <div className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-md uppercase tracking-wide">
              {selectedYear}
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', fontWeight: 'bold' }}
                  cursor={{ stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="days"
                  stroke="#4f46e5"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorDays)"
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart (Pie Chart) */}
        <div className="glass-panel p-8 animate-slide-up bg-white" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
              <PieChartIcon size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Leave Distribution</h3>
          </div>

          <div className="h-[320px] w-full mt-4 flex items-center justify-center">
            {distributionData.every(d => d.value === 0) ? (
              <div className="text-center text-slate-400">
                <PieChartIcon size={64} className="mx-auto mb-4 opacity-20" />
                <p className="font-semibold text-lg">No leave data available for {selectedYear}</p>
                <p className="text-sm mt-1">Data will populate here once leave is consumed.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    labelLine={false}
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontWeight: 600, fontSize: '13px', color: '#475569' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}