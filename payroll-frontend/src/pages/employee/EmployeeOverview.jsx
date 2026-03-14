import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, FileText, IndianRupee, Clock,
  ArrowRight, ShieldCheck, Activity, User
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function EmployeeOverview() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(token) fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [profileRes, balanceRes, payrollRes] = await Promise.all([
        axios.get("http://localhost:5000/api/employee/profile", config).catch(() => ({ data: user })),
        axios.get("http://localhost:5000/api/leaves/balance", config).catch(() => ({ data: { balance: { CL: 0, SL: 0 } } })),
        axios.get("http://localhost:5000/api/payroll/payslips", config).catch(() => ({ data: [] }))
      ]);

      setProfile(profileRes.data);
      setBalance(balanceRes.data?.balance || { CL: 0, SL: 0 });
      setPayslips(payrollRes.data || []);
    } catch (err) {
      console.log("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  // Format chart data (reverse to show chronological order)
  const chartData = [...payslips].reverse().map(p => ({
    name: `${p.month}/${p.year.toString().slice(-2)}`,
    salary: p.net_salary
  }));

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Section */}
      <div className="glass-panel p-8 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 text-white relative overflow-hidden border-none shadow-xl shadow-blue-500/20">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -bottom-20 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-blue-100 font-medium mb-1 tracking-wide text-sm uppercase">{currentDate}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back, {profile?.name || user?.name || 'Employee'}
            </h1>
            <p className="mt-3 text-blue-100 max-w-xl text-lg opacity-90">
              Here's an overview of your payroll and leave balances. You have {balance?.CL ?? 0} Casual Leaves remaining.
            </p>
          </div>
          <button 
            onClick={() => navigate("/employee/apply-leave")}
            className="bg-white text-blue-600 px-6 py-3.5 rounded-xl font-semibold shadow-lg hover:bg-blue-50 hover:scale-105 transition-all w-fit flex items-center gap-2 group"
          >
            <Calendar size={18} className="text-blue-500 group-hover:rotate-12 transition-transform" /> Apply Leave
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Casual Leaves (CL)</p>
              <h3 className="text-4xl font-black text-slate-800">{balance?.CL ?? 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center shadow-inner">
              <Activity size={24} />
            </div>
          </div>
          <div className="mt-5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((balance?.CL ?? 0) * 10, 100)}%` }}></div>
          </div>
        </div>

        <div className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Sick Leaves (SL)</p>
              <h3 className="text-4xl font-black text-slate-800">{balance?.SL ?? 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 flex items-center justify-center shadow-inner">
              <ShieldCheck size={24} />
            </div>
          </div>
          <div className="mt-5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((balance?.SL ?? 0) * 10, 100)}%` }}></div>
          </div>
        </div>

        <div className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Loss of Pay (LOP)</p>
              <h3 className="text-4xl font-black text-slate-800 text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">Unlimited</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600 flex items-center justify-center shadow-inner">
              <Clock size={24} />
            </div>
          </div>
          <p className="mt-5 text-xs font-bold text-purple-700 bg-purple-100/50 inline-block px-3 py-1.5 rounded-lg border border-purple-200">
            Subject to manager approval
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Salary Trend Chart */}
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Salary Trend</h3>
              <p className="text-sm text-slate-500 mt-1">Net salary history across recent months</p>
            </div>
            <button onClick={() => navigate("/employee/payslips")} className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center gap-1">
              View all <ArrowRight size={14} />
            </button>
          </div>
          
          {payslips.length > 0 ? (
            <div className="flex-1 w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                    formatter={(value) => [`₹ ${value.toLocaleString()}`, 'Net Salary']}
                  />
                  <Area type="monotone" dataKey="salary" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSalary)" activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-slate-200 border-dashed m-2">
              <IndianRupee size={56} className="mb-4 text-slate-300" />
              <p className="font-medium text-slate-500">No payroll data available yet</p>
              <p className="text-sm mt-1">Your salary history will appear here</p>
            </div>
          )}
        </div>

        {/* Quick Actions & Recent Payslip */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Latest Payslip</h3>
            {payslips.length > 0 ? (
              <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
                <IndianRupee size={28} className="text-blue-500 mb-4 relative z-10" />
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1 relative z-10">{payslips[0].month} {payslips[0].year}</p>
                <h4 className="text-3xl font-black text-slate-800 mb-4 relative z-10">₹ {payslips[0].net_salary.toLocaleString()}</h4>
                <div className="flex justify-between items-center pt-5 border-t border-slate-100 relative z-10">
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">LOP: {payslips[0].lop_days} days</span>
                  <button onClick={() => navigate("/employee/payslips")} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:text-blue-700 group/btn">
                    Details <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 border-dashed p-8 rounded-2xl text-center">
                <p className="text-slate-500 font-medium">No recent payslips</p>
              </div>
            )}
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <button onClick={() => navigate("/employee/profile")} className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow transition-all text-left group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <User size={20} />
                  </div>
                  <span className="font-semibold text-slate-700">My Profile</span>
                </div>
                <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
              <button onClick={() => navigate("/employee/leaves")} className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow transition-all text-left group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <FileText size={20} />
                  </div>
                  <span className="font-semibold text-slate-700">Leave History</span>
                </div>
                <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}