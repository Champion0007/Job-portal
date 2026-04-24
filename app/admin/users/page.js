"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockingId, setBlockingId] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    const loadUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [router]);

  const toggleBlock = async (id) => {
    setBlockingId(id);
    setError(null);
    try {
      console.log("Blocking user with ID:", id);
      const response = await api.patch(`/api/admin/users/${id}/block`);
      console.log("Block response:", response);
      console.log("Updated user data:", response.data);
      
      // Update the specific user in the state immediately for instant UI feedback
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => 
          user._id === id 
            ? { ...user, isBlocked: response.data.isBlocked !== undefined ? response.data.isBlocked : !user.isBlocked }
            : user
        );
        console.log("Updated users state:", updatedUsers);
        return updatedUsers;
      });
      
      // Refresh the full list to ensure consistency with backend
      const res = await api.get("/api/admin/users");
      console.log("Fresh users data:", res.data);
      setUsers(res.data);
      console.log("Users refreshed successfully");
    } catch (err) {
      console.error("Block error details:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      
      const errorMessage = err.response?.data?.message || err.message || "Failed to update user status";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setBlockingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Users</h2>
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-slate-400 text-sm">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-slate-500 text-sm">No users found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full text-sm text-slate-200">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-3 py-2">{user.name || "-"}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2 capitalize">{user.role}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.isBlocked
                          ? "bg-red-500/20 text-red-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {user.role !== "admin" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleBlock(user._id);
                        }}
                        disabled={blockingId === user._id}
                        className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {blockingId === user._id ? "Processing..." : user.isBlocked ? "Unblock" : "Block"}
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
  );
}


