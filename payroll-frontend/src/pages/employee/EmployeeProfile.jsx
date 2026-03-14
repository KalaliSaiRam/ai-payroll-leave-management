import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Briefcase, Calendar, Save, X, Edit2 } from "lucide-react";

export default function EmployeeProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", department: "" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/employee/profile",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setProfile(res.data);
        setFormData({
          name: res.data.name,
          department: res.data.department
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/employee/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "U";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="glass-panel p-10 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white relative overflow-hidden border-none shadow-2xl shadow-indigo-500/20">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-blue-400/20 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center md:flex-row md:justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold backdrop-blur-md shadow-inner border border-white/30 text-white select-none relative z-10 transition-transform duration-300 group-hover:scale-105">
                {initials}
              </div>
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 drop-shadow-sm">
                {profile.name}
              </h1>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 text-indigo-100 font-medium">
                <Briefcase size={16} />
                {profile.department}
              </div>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/20 hover:bg-white text-white hover:text-indigo-700 border border-white/30 hover:border-white px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-black/10 self-center"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="glass-panel p-8 md:p-10 animate-slide-up">
        <h2 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4 flex items-center gap-2">
          <User size={22} className="text-blue-500" />
          Personal Details
        </h2>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Name */}
          <div className="space-y-2 group">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User size={14} /> Full Name
            </p>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-indigo-200 rounded-xl px-4 py-3 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
              />
            ) : (
              <p className="text-lg font-bold text-slate-800 bg-slate-50/50 px-4 py-3 rounded-xl border border-transparent group-hover:border-slate-100 transition-colors">{profile.name}</p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-2 group">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={14} /> Department
            </p>
            {isEditing ? (
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-indigo-200 rounded-xl px-4 py-3 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
              />
            ) : (
              <p className="text-lg font-bold text-slate-800 bg-slate-50/50 px-4 py-3 rounded-xl border border-transparent group-hover:border-slate-100 transition-colors">{profile.department}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2 group">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Mail size={14} /> Email Address
            </p>
            <p className="text-lg font-bold text-slate-800 bg-slate-50/50 px-4 py-3 rounded-xl border border-transparent group-hover:border-slate-100 transition-colors">{profile.email}</p>
          </div>

          {/* DOJ */}
          <div className="space-y-2 group">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} /> Date of Joining
            </p>
            <p className="text-lg font-bold text-slate-800 bg-slate-50/50 px-4 py-3 rounded-xl border border-transparent group-hover:border-slate-100 transition-colors">
              {new Date(profile.doj).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-4 mt-10 pt-6 border-t border-slate-100 animate-slide-up">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Save size={18} /> Save Changes</>
              )}
            </button>

            <button
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="bg-white text-slate-600 px-8 py-3.5 rounded-xl font-bold border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center gap-2"
            >
              <X size={18} /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}