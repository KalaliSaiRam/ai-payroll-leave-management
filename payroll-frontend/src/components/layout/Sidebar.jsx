import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { navigationConfig } from "../../config/navigation";
import { 
  Menu, LogOut, LayoutDashboard, Calendar, FileText, 
  User, BarChart2, Users, Receipt
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { role, logout } = useAuth();
  const links = navigationConfig[role] || [];

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'dashboard':
      case 'overview': return <LayoutDashboard size={20} />;
      case 'analytics': return <BarChart2 size={20} />;
      case 'leaves':
      case 'leave requests':
      case 'apply leave': return <Calendar size={20} />;
      case 'payslips':
      case 'payroll': return <Receipt size={20} />;
      case 'profile': return <User size={20} />;
      case 'employees':
      case 'team members': return <Users size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <aside
      className={`relative z-20 flex flex-col transition-all duration-300 glass border-r-0 rounded-tr-3xl rounded-br-3xl my-4 ml-4 shrink-0 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-8">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Payroll<span className="text-blue-600">Pro</span>
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-all ${collapsed ? 'mx-auto' : ''}`}
        >
          <Menu size={22} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-4 mt-4 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"}`}>
                  {getIcon(link.name)}
                </div>
                {!collapsed && <span>{link.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}