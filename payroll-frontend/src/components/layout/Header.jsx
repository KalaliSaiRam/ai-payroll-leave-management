import { useAuth } from "../../context/AuthContext";
import { Bell, Search, User as UserIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Header({ collapsed }) {
  const { role, user } = useAuth();
  const location = useLocation();
  
  // Format page title based on path
  const getPageTitle = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    if (segments.length === 1) return "Overview";
    return segments[1].charAt(0).toUpperCase() + segments[1].slice(1).replace('-', ' ');
  };

  return (
    <header className="glass-panel mx-4 sm:mx-8 mt-4 px-6 py-4 flex flex-col sm:flex-row justify-between items-center z-10 transition-all duration-300">
      <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block mr-4">
          {getPageTitle()}
        </h1>
        <div className="relative w-full sm:w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white/60 border border-slate-200/60 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
        <button className="p-2 rounded-xl text-slate-500 hover:bg-white/60 hover:text-blue-600 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-white/40 transition-all border border-transparent hover:border-slate-200/50 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:shadow transition-all">
            <UserIcon size={20} className="text-blue-600" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none mb-1">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500 capitalize leading-none font-medium">
              {role ? role.toLowerCase() : "Workspace"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}