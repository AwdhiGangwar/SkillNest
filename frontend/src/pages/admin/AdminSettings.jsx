import React, { useState } from "react";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";
import { changePassword } from "../../services/api";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: "SkillNest",
    maintenanceMode: false,
    maxCoursePrice: 500,
    platformFee: 15,
    supportEmail: "support@skillnest.com",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Platform settings saved successfully!");
  };

  // Change password state
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwd({ ...pwd, [name]: value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwd.currentPassword || !pwd.newPassword || !pwd.confirmPassword) return toast.error("Fill all password fields");
    if (pwd.newPassword !== pwd.confirmPassword) return toast.error("New passwords do not match");
    try {
      await changePassword({ oldPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      toast.success("Password changed successfully");
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    }
  };

  return (
    <Layout title="Platform Settings" subtitle="Manage system-wide configuration">
      <div className="max-w-2xl">
        <div className="glass-card p-8 rounded-xl border border-surface-border">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Platform Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Platform Name</label>
              <input
                type="text"
                name="platformName"
                value={settings.platformName}
                onChange={handleChange}
                className="input-field w-full"
              />
              <p className="text-xs text-slate-500 mt-1">The name displayed across the platform</p>
            </div>

            {/* Support Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="input-field w-full"
              />
              <p className="text-xs text-slate-500 mt-1">Email for user support inquiries</p>
            </div>

            {/* Max Course Price */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Max Course Price ($)</label>
              <input
                type="number"
                name="maxCoursePrice"
                value={settings.maxCoursePrice}
                onChange={handleChange}
                className="input-field w-full"
              />
              <p className="text-xs text-slate-500 mt-1">Maximum price allowed per course</p>
            </div>

            {/* Platform Fee */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Platform Fee (%)</label>
              <input
                type="number"
                name="platformFee"
                value={settings.platformFee}
                onChange={handleChange}
                min="0"
                max="50"
                className="input-field w-full"
              />
              <p className="text-xs text-slate-500 mt-1">Percentage fee taken from course sales</p>
            </div>

            {/* Maintenance Mode */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-surface-hover border border-surface-border">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                id="maintenance"
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="maintenance" className="flex-1 cursor-pointer">
                <div className="text-sm font-medium text-slate-300">Maintenance Mode</div>
                <p className="text-xs text-slate-500">Disable platform access for all users during maintenance</p>
              </label>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="btn-primary w-full py-3 mt-8"
            >
              Save Settings
            </button>
          </form>

          {/* Change Password */}
          <div className="mt-8">
            <h3 className="text-lg font-display font-bold text-white mb-3">Change Admin Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={pwd.currentPassword}
                  onChange={handlePwdChange}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={pwd.newPassword}
                  onChange={handlePwdChange}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={pwd.confirmPassword}
                  onChange={handlePwdChange}
                  className="input-field w-full"
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" })} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Change Password</button>
              </div>
            </form>
          </div>

          {/* Info Section */}
          <div className="mt-8 pt-8 border-t border-surface-border">
            <h3 className="text-lg font-display font-bold text-white mb-4">System Information</h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-slate-400 mb-1">Platform Version</p>
                <p className="text-white font-semibold">1.0.0</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Last Updated</p>
                <p className="text-white font-semibold">April 9, 2026</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Active Users</p>
                <p className="text-white font-semibold">1,234</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Uptime</p>
                <p className="text-emerald-400 font-semibold">99.95%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
