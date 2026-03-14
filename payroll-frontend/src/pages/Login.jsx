import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, role } = res.data;

      login(token, role);

      // Role-based redirect
      if (role === "EMPLOYEE") navigate("/employee");
      else if (role === "MANAGER") navigate("/manager");
      else if (role === "HR") navigate("/hr");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 overflow-hidden px-4">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-fade-in pointer-events-none"></div>
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-[120px] animate-fade-in pointer-events-none" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-purple-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-fade-in pointer-events-none" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="glass-panel w-full max-w-md p-8 sm:p-10 relative z-10 animate-slide-up shadow-2xl shadow-blue-900/10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/40 mx-auto mb-6 transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-black text-3xl">P</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
            Welcome to Payroll<span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-slate-500 font-medium">Please sign in to your workspace</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-fade-in">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Work Email</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/70 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
            </div>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/70 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-3.5 font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
          <p className="text-sm text-slate-500">
            For demo purposes, you can use: <br/>
            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 mt-2 inline-block">emp1@payroll.com / password123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
