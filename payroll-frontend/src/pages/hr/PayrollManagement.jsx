import { useState, useEffect } from "react";
import api from "../../api/api";
import { PlayCircle, IndianRupee, FileCheck, AlertCircle } from "lucide-react";

const PayrollManagement = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayrollHistory = async () => {
    try {
      const res = await api.get("/payroll/all");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch payroll history", err);
    }
  };

  useEffect(() => {
    fetchPayrollHistory();
  }, []);

  const runPayroll = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await api.post("/payroll/run", {
        month: Number(month),
        year: Number(year),
      });

      setMessage({ type: "success", text: res.data.message });
      fetchPayrollHistory();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Payroll failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 bg-gradient-to-br from-emerald-600/90 to-teal-700/90 text-white relative overflow-hidden border-none shadow-xl shadow-emerald-500/20">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Payroll Management
          </h1>
          <p className="text-emerald-100 max-w-2xl text-lg opacity-90">
            Execute the monthly payroll cycle and review historical payroll records for all employees across the organization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Run Payroll Form */}
        <div className="glass-panel p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <PlayCircle size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Execute Payroll</h2>
          </div>

          {message && (
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium border ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {message.type === 'success' ? <FileCheck size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
              <p>{message.text}</p>
            </div>
          )}

          <form onSubmit={runPayroll} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Target Month</label>
              <select 
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-700"
                required
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en-US', { month: 'long' })}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Target Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-700"
                required
                min="2020"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-xl py-3.5 font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Execute Run <PlayCircle size={18} /></>
              )}
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="glass-panel p-0 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <IndianRupee size={20} className="text-emerald-500" /> Payroll History
            </h2>
            <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-lg">
              {history.length} Records
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Base Salary</th>
                  <th className="px-6 py-4">LOP Info</th>
                  <th className="px-6 py-4">Deduction</th>
                  <th className="px-6 py-4 text-right">Net Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {history.length > 0 ? history.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">EMP-{p.employee_id}</td>
                    <td className="px-6 py-4 font-medium">{new Date(0, p.month - 1).toLocaleString('en-US', { month: 'short' })} {p.year}</td>
                    <td className="px-6 py-4">₹{p.base_salary?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {p.lop_days > 0 ? (
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-bold">{p.lop_days} Days</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-red-600 font-medium">₹{p.lop_deduction?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{p.net_salary?.toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <FileCheck size={32} className="mx-auto mb-3 opacity-20" />
                      No payroll history records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;
