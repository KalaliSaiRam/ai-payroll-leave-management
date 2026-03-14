import { Link } from "react-router-dom";
import { Users, IndianRupee, Activity, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Hero Section */}
      <div className="glass-panel p-10 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-800 text-white relative overflow-hidden border-none shadow-2xl shadow-purple-500/20">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-indigo-400/20 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
               <ShieldCheck size={32} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-sm">
                Admin Control Center
              </h1>
              <p className="text-purple-100/90 text-lg font-medium max-w-xl">
                Oversee corporate workforce metrics, payroll execution, and administration logic from a unified hub.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        {/* KPI: Workforce */}
        <div className="glass-panel p-6 bg-gradient-to-b from-white to-slate-50 border-t-4 border-t-indigo-500 hover:-translate-y-1 transition-transform cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md">+12%</span>
          </div>
          <h3 className="text-slate-500 font-semibold mb-1">Total Employees</h3>
          <div className="text-4xl font-black text-slate-800">45</div>
        </div>

        {/* KPI: Pending Payroll */}
        <div className="glass-panel p-6 bg-gradient-to-b from-white to-slate-50 border-t-4 border-t-pink-500 hover:-translate-y-1 transition-transform cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <IndianRupee size={24} />
            </div>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md">Pending</span>
          </div>
          <h3 className="text-slate-500 font-semibold mb-1">Payroll Status</h3>
          <div className="text-3xl font-black text-slate-800">Awaiting Run</div>
        </div>

        {/* KPI: System Health */}
        <div className="glass-panel p-6 bg-gradient-to-b from-white to-slate-50 border-t-4 border-t-teal-500 hover:-translate-y-1 transition-transform cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Activity size={24} />
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md">Optimal</span>
          </div>
          <h3 className="text-slate-500 font-semibold mb-1">System Health</h3>
          <div className="text-4xl font-black text-slate-800">100%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* Quick Link: Employees */}
        <Link to="/hr/employees" className="glass-panel p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group block relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-indigo-100/50 to-transparent"></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
             Workforce Management <ArrowRight className="text-indigo-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h2>
          <p className="text-slate-600 font-medium max-w-md">Add new employees to the platform. The system will automatically generate passwords for seamless onboarding.</p>
        </Link>
        
        {/* Quick Link: Payroll */}
        <Link to="/hr/payroll" className="glass-panel p-8 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 hover:shadow-xl hover:shadow-pink-500/10 transition-all group block relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-pink-100/50 to-transparent"></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
             Execute Payroll <ArrowRight className="text-pink-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h2>
          <p className="text-slate-600 font-medium max-w-md">Run monthly computations. Manage LOP deductions, base salaries, and release bulk slips to employees securely.</p>
        </Link>
      </div>
    </div>
  );
}
