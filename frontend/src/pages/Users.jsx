import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getAllUsers, blockUser } from "../../services/api";
import { Badge, CardSkeleton, EmptyState } from "../../components/ui";
import toast from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  // Fetch users on component mount
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Failed to load user directory");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle blocking user with confirmation
  const handleBlock = async (id) => {
    const confirmBlock = window.confirm(
      "Are you sure you want to block this user? Their access to the platform will be revoked immediately."
    );
    if (!confirmBlock) return;

    setProcessingId(id);
    try {
      await blockUser(id);
      toast.success("User has been blocked successfully");
      // Refresh the list to reflect status changes
      await fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to block user");
    } finally {
      setProcessingId(null);
    }
  };

  // Filtering logic for Search and Role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" || user.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  // Helper to determine role badge colors
  const getRoleStyles = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "teacher": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "student": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <main className="flex-1">
        <Layout
          title="User Management"
          subtitle="Manage platform users, roles, and access controls"
        >
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input-field w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select
                className="input-field w-full cursor-pointer"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="glass-card overflow-hidden border border-surface-border">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : filteredUsers.length === 0 ? (
              <EmptyState
                icon="👥"
                title="No users found"
                description={searchTerm || roleFilter !== 'all' ? "Try adjusting your filters" : "The user directory is currently empty"}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-hover/50 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Name & Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-surface-hover/30 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-5">
                          <Badge className={`uppercase tracking-widest text-[10px] ${getRoleStyles(user.role)}`}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse-slow ${user.blocked ? 'bg-slate-500' : 'bg-emerald-500'}`} />
                            <span className={`text-xs font-medium ${user.blocked ? 'text-slate-400' : 'text-emerald-400'}`}>
                              {user.blocked ? 'Blocked' : 'Active'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {user.role?.toLowerCase() === 'admin' ? (
                            <span className="text-xs text-slate-600 italic">Protected</span>
                          ) : (
                            <button
                              onClick={() => handleBlock(user.id)}
                              disabled={user.blocked || processingId === user.id}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                user.blocked
                                  ? "border-surface-border text-slate-600 cursor-not-allowed bg-transparent"
                                  : "border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white"
                              }`}
                            >
                              {processingId === user.id ? (
                                <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin mx-auto" />
                              ) : user.blocked ? (
                                "Blocked"
                              ) : (
                                "Block"
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Layout>
      </main>
    </div>
  );
}