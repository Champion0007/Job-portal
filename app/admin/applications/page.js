"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    const loadApps = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/applications");
        setApps(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, [router]);

  const updateInterviewResponse = async (id, response) => {
    try {
      await api.patch(`/api/admin/applications/${id}/interview-response`, {
        interviewResponse: response,
      });
      const res = await api.get("/api/admin/applications");
      setApps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Applications</h2>
      {loading ? (
        <div className="text-slate-400 text-sm">Loading...</div>
      ) : apps.length === 0 ? (
        <div className="text-slate-500 text-sm">No applications found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full text-sm text-slate-200">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-3 py-2 text-left">Job</th>
                <th className="px-3 py-2 text-left">Candidate</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Interview Response</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {apps.map((app) => (
                <tr key={app._id}>
                  <td className="px-3 py-2">{app.job?.title || "-"}</td>
                  <td className="px-3 py-2">
                    {app.candidate?.name || app.fullName}
                    <span className="block text-xs text-slate-400">
                      {app.candidate?.email || app.email}
                    </span>
                  </td>
                  <td className="px-3 py-2">{app.status}</td>
                  <td className="px-3 py-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200">
                      {app.interviewResponse || "pending"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      onClick={() => updateInterviewResponse(app._id, "accepted")}
                      className="text-xs px-3 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500"
                    >
                      Mark Accepted
                    </button>
                    <button
                      onClick={() => updateInterviewResponse(app._id, "rejected")}
                      className="text-xs px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-500"
                    >
                      Mark Rejected
                    </button>
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

