import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Users, UserPlus, Mail, Briefcase, Plus, X, Search, CheckCircle2, AlertCircle } from "lucide-react";

export default function Employees() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "Engineering",
    designation: "Software Engineer",
    base_salary: 50000
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employee/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/employee/create",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: res.data.message, type: "success" });
      fetchEmployees();
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage({ text: "", type: "" });
        setFormData({
          name: "", email: "", department: "Engineering", designation: "Software Engineer", base_salary: 50000
        });
      }, 2000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to create employee.",
        type: "error"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full relative">
      {/* Hero Header */}
      <div className="glass-panel p-8 bg-gradient-to-br from-indigo-700 via-blue-800 to-cyan-900 text-white relative overflow-hidden border-none shadow-xl shadow-blue-500/20 shrink-0 rounded-3xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-teal-400/20 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
              <Users size={32} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 drop-shadow-sm">
                Employee Directory
              </h1>
              <p className="text-blue-100/90 text-lg font-medium">
                Manage your organization's workforce and onboard new personnel.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <UserPlus size={20} />
            Add Employee
          </button>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden flex flex-col animate-slide-up flex-1">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-16 flex items-center justify-center">
                 <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : employees.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center">
              <Users size={48} className="mb-4 opacity-20" />
              <p className="font-medium text-slate-500 text-lg">No employees found in directory</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase text-xs tracking-wider border-b border-slate-200 backdrop-blur-sm sticky top-0 z-10">
                <tr>
                  <th className="px-8 py-5">Employee</th>
                  <th className="px-6 py-5">Role Identity</th>
                  <th className="px-6 py-5">Base Compensation</th>
                  <th className="px-6 py-5">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-base">{emp.name}</span>
                          <span className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {emp.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                         <div className="bg-slate-100 p-2 rounded-lg"><Briefcase size={16} className="text-slate-500" /></div>
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{emp.designation}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{emp.department}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-sm border border-emerald-200 shadow-sm">
                          ₹{emp.base_salary?.toLocaleString()}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-slate-600 font-medium">
                      {new Date(emp.doj).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-panel w-full max-w-2xl bg-white p-8 relative z-10 animate-slide-up shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-2 rounded-full hover:bg-slate-200"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <UserPlus className="text-indigo-600" /> Onboard New Employee
            </h2>
            <p className="text-slate-500 mb-6">Create a new account. The system will automate a default password for the user.</p>

            {message.text && (
              <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                {message.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleAddEmployee} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Department</label>
                  <select name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium cursor-pointer appearance-none">
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Designation</label>
                  <input required type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium" />
                </div>
                <div className="md:col-span-2 shadow-inner bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Base Salary (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input required type="number" name="base_salary" value={formData.base_salary} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/30 transition-all font-bold" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={submitLoading} className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70 flex items-center gap-2">
                  {submitLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Plus size={18} /> Add Employee</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
