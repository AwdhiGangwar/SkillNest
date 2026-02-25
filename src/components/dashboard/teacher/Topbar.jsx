import React from "react";
import { Bell, User, LogOut, Search } from "lucide-react";

const Topbar = ({ userName = "John Doe" }) => {
  return (
    <div className="h-11 flex items-center justify-between px-6" style={{ backgroundColor: 'transparent' }}>
      {/* Left: Search */}
      <div className="flex items-center gap-3 flex-1 max-w-sm">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search classes, students..."
          className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full py-1"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 pl-4">
          <div className="flex flex-col text-right">
            <p className="text-sm font-medium text-[#0D2232]">{userName}</p>
            <p className="text-xs text-gray-600">Instructor</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
