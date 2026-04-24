"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminSubscribersPage() {
  const { token, user } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ wait until auth is loaded
  useEffect(() => {
    if (!token || !user) return;

    if (user.role !== "admin") {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/admin/subscribers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or failed to fetch subscribers");
        }
        return res.json();
      })
      .then(setSubscribers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, user]);

  // ✅ auth still loading
  if (!user) {
    return <div className="p-6">Checking permissions…</div>;
  }

  if (loading) {
    return <div className="p-6">Loading subscribers…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📧 Subscribers</h1>

      {subscribers.length === 0 ? (
        <p>No subscribers yet.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">
                    {new Date(s.createdAt).toLocaleString()}
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
