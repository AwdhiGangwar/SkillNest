import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getAllUsers, blockUser, unblockUser } from "../services/api";
import { Badge } from "../components/ui";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch {
      toast.error("Failed to load user directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleBlock = async (user) => {
    const status = user.status || "ACTIVE";
    const isBlocking = status !== "BLOCKED";
    const confirmMessage = isBlocking
      ? `Are you sure you want to block ${user.name}? Access will be revoked immediately.`
      : `Are you sure you want to unblock ${user.name}?`;

    if (!window.confirm(confirmMessage)) return;

    setProcessingId(user.id);
    try {
      if (isBlocking) {
        await blockUser(user.id);
        toast.success("User has been blocked");
      } else {
        await unblockUser(user.id);
        toast.success("User access restored");
      }
      
      // ✅ Fix: Update local state directly for immediate UI feedback
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: isBlocking ? "BLOCKED" : "ACTIVE" } : u
        )
      );
    } catch (err) {
      toast.error(err.message || `Failed to ${isBlocking ? 'block' : 'unblock'} user`);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Users Directory" subtitle={`${filteredUsers.length} total users registered`}>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="max-w-md">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input-field pl-11 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-card overflow-hidden border border-surface-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-hover/50 text-xs uppercase text-slate-400 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Account Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {loading ? (
                  <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">Loading directory...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">No users found matching your criteria.</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-hover/30 transition-all group">
                      <td className="px-6 py-5">
                        <div className="font-semibold text-white group-hover:text-brand-400 transition-colors">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="brand" className="text-[10px]">{user.role}</Badge>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant={(user.status || "ACTIVE") === "BLOCKED" ? "danger" : "success"}>
                          {(user.status || "ACTIVE") === "BLOCKED" ? "Blocked" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleBlock(user)}
                            disabled={processingId === user.id}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-50 ${((user.status || "ACTIVE") === "BLOCKED")
                              ? "text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10"
                              : "text-red-400 border-red-500/20 hover:bg-red-500/10"
                              }`}
                          >
                            {processingId === user.id ? "Processing..." : ((user.status || "ACTIVE") === "BLOCKED")
                              ? "Unblock Account"
                              : "Block Account"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}