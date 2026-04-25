"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    const loadSubscribers = async () => {
      try {
        const meRes = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await meRes.json();
        if (!meRes.ok || user.role !== "admin") {
          throw new Error("Access denied. Admins only.");
        }

        const res = await fetch(`${API_BASE}/api/admin/subscribers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error("Unauthorized or failed to fetch subscribers");
        }

        setSubscribers(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSubscribers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading subscribers...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subscribers</h1>

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
