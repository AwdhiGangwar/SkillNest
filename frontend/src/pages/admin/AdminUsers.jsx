import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CardSkeleton, Badge } from "../../components/ui";
import toast from "react-hot-toast";
import {
  getCategorizedUsers,
  getAllStudents,
  getAllTeachers,
  getAllBlockedUsers,
  blockUser,
  unblockUser,
  getStudentsByStatus,
  getTeachersByStatus,
} from "../../services/api";

export default function AdminUsers() {
  const [categorized, setCategorized] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [catRes, studRes, techRes, blockRes] = await Promise.all([
        getCategorizedUsers(),
        getAllStudents(),
        getAllTeachers(),
        getAllBlockedUsers(),
      ]);

      setCategorized(catRes.data);
      setStudents(studRes.data || []);
      setTeachers(techRes.data || []);
      setBlockedUsers(blockRes.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users data");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await blockUser(userId);
      toast.success("User blocked successfully");
      fetchAllData();
    } catch (err) {
      toast.error("Failed to block user");
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await unblockUser(userId);
      toast.success("User unblocked successfully");
      fetchAllData();
    } catch (err) {
      toast.error("Failed to unblock user");
    }
  };

  const renderUserTable = (users, showBlockActions = true) => {
    if (!users || users.length === 0) {
      return (
        <div className="text-center py-12 text-slate-400">
          <p>No users found</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm">
                Name
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm">
                Email
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm">
                Role
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm">
                Status
              </th>
              {showBlockActions && (
                <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-surface-border hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-6 text-slate-200">{user.name}</td>
                <td className="py-4 px-6 text-slate-300 text-sm">{user.email}</td>
                <td className="py-4 px-6">
                  <Badge
                    variant={user.role === "teacher" ? "primary" : "secondary"}
                    text={user.role || "user"}
                  />
                </td>
                <td className="py-4 px-6">
                  <Badge
                    variant={user.status === "active" ? "success" : "danger"}
                    text={user.status || "active"}
                  />
                </td>
                {showBlockActions && (
                  <td className="py-4 px-6">
                    {user.status === "blocked" ? (
                      <button
                        onClick={() => handleUnblockUser(user.id)}
                        className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockUser(user.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                      >
                        Block
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStats = () => {
    if (!categorized) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="glass-card p-6 rounded-xl border border-surface-border">
          <p className="text-slate-400 text-sm mb-2">Total Students</p>
          <h3 className="text-3xl font-bold text-blue-400">
            {categorized.totalStudents}
          </h3>
          <p className="text-slate-500 text-xs mt-2">Active & Blocked</p>
        </div>

        <div className="glass-card p-6 rounded-xl border border-surface-border">
          <p className="text-slate-400 text-sm mb-2">Total Teachers</p>
          <h3 className="text-3xl font-bold text-purple-400">
            {categorized.totalTeachers}
          </h3>
          <p className="text-slate-500 text-xs mt-2">Active & Blocked</p>
        </div>

        <div className="glass-card p-6 rounded-xl border border-surface-border">
          <p className="text-slate-400 text-sm mb-2">Blocked Users</p>
          <h3 className="text-3xl font-bold text-red-400">
            {categorized.totalBlocked}
          </h3>
          <p className="text-slate-500 text-xs mt-2">Suspended accounts</p>
        </div>

        <div className="glass-card p-6 rounded-xl border border-surface-border">
          <p className="text-slate-400 text-sm mb-2">Active Users</p>
          <h3 className="text-3xl font-bold text-emerald-400">
            {categorized.totalActive}
          </h3>
          <p className="text-slate-500 text-xs mt-2">All roles</p>
        </div>
      </div>
    );
  };

  return (
    <Layout
      title="User Management"
      subtitle="Manage and categorize all users on the platform"
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <CardSkeleton key={i} />
            ))}
        </div>
      ) : (
        <div className="space-y-6">
          {renderStats()}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-surface-border">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "text-brand-400 border-b-2 border-brand-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "students"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Students ({categorized?.totalStudents || 0})
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "teachers"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Teachers ({categorized?.totalTeachers || 0})
            </button>
            <button
              onClick={() => setActiveTab("blocked")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "blocked"
                  ? "text-red-400 border-b-2 border-red-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Blocked ({categorized?.totalBlocked || 0})
            </button>
          </div>

          {/* Content Sections */}
          <div className="glass-card p-6 rounded-xl border border-surface-border">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    👥 Recent Students
                  </h3>
                  {renderUserTable(students.slice(0, 5))}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    👨‍🏫 Recent Teachers
                  </h3>
                  {renderUserTable(teachers.slice(0, 5))}
                </div>
              </div>
            )}

            {activeTab === "students" && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  All Students
                </h3>
                {renderUserTable(students)}
              </div>
            )}

            {activeTab === "teachers" && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  All Teachers
                </h3>
                {renderUserTable(teachers)}
              </div>
            )}

            {activeTab === "blocked" && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Blocked Users
                </h3>
                {renderUserTable(blockedUsers, false)}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
