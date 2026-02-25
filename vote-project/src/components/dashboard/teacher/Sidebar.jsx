import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/teacher" },
    { icon: Calendar, label: "Calendar", path: "/dashboard/teacher/calendar" },
    { icon: Users, label: "Students", path: "/dashboard/teacher/students" },
    { icon: DollarSign, label: "My Earnings", path: "/dashboard/teacher/my-earnings" },
    { icon: Settings, label: "Settings", path: "/dashboard/teacher/settings" },
  ];

  return (
    <aside
      style={{ backgroundColor: "#0D2232" }}
      className={`h-screen ${isExpanded ? "w-60" : "w-20"} text-white transition-all duration-300 flex flex-col py-6 px-4`}
    >
      {/* Top: Logo + collapse */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(195.32deg, #67A3F4 13.75%, #4798E9 95.03%)",
            }}
          />
          {isExpanded && (
            <div>
              <div className="text-white font-semibold" style={{ fontSize: 16, lineHeight: "22px" }}>
                Skill Nest
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:opacity-90"
          aria-label="Toggle sidebar"
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-3">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? "bg-[#144778] text-white"
                  : "text-[#C2C8CC] hover:bg-[#0F3B53] hover:text-white"
              }`
            }
          >
            <item.icon size={20} className={"flex-shrink-0"} />
            {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        {isExpanded ? (
          <div className="flex flex-col gap-3 text-sm">
            <button className="text-[#BDBDBD] text-xs text-left underline">Privacy and Terms</button>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <LogoutButton compact />
          </div>
        )}
      </div>
    </aside>
  );
};

const LogoutButton = ({ compact }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // placeholder logout action
    navigate("/", { replace: true });
  };

  if (compact) {
    return (
      <button onClick={handleLogout} className="p-2 rounded hover:opacity-90 text-[#C2C8CC]">
        <LogOut size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-transparent text-white hover:bg-[#0F3B53]"
    >
      <LogOut size={16} />
      <span className="text-sm">Logout</span>
    </button>
  );
};

export default Sidebar;
