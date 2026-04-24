"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [router]);

  const getStatusAction = (status) => {
    if (status === "pending") {
      return {
        label: "Approve",
        nextStatus: "approved",
        className: "bg-emerald-600/80 hover:bg-emerald-500",
      };
    }

    if (status === "closed") {
      return {
        label: "Unblock",
        nextStatus: "approved",
        className: "bg-sky-600/80 hover:bg-sky-500",
      };
    }

    return {
      label: "Block",
      nextStatus: "closed",
      className: "bg-slate-800 hover:bg-slate-700",
    };
  };

  const toggleJobStatus = async (job) => {
    const action = getStatusAction(job.status);
    setUpdatingId(job._id);
    setError(null);
    try {
      const response = await api.patch(`/api/admin/jobs/${job._id}/block`);

      setJobs((prevJobs) => {
        const updatedJobs = prevJobs.map((existingJob) =>
          existingJob._id === job._id
            ? { ...existingJob, status: response.data.status || action.nextStatus }
            : existingJob
        );
        return updatedJobs;
      });

      const res = await api.get("/api/admin/jobs");
      setJobs(res.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update job status";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteJob = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/api/admin/jobs/${id}`);
      const res = await api.get("/api/admin/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Jobs</h2>
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-slate-400 text-sm">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-slate-500 text-sm">No jobs found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full text-sm text-slate-200">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Company</th>
                <th className="px-3 py-2 text-left">Employer</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="px-3 py-2">{job.title}</td>
                  <td className="px-3 py-2">{job.company?.name || "-"}</td>
                  <td className="px-3 py-2">
                    {job.employer?.name || "—"}
                    <span className="block text-xs text-slate-400">
                      {job.employer?.email}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200">
                      {job.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleJobStatus(job);
                      }}
                      disabled={updatingId === job._id}
                      className={`text-xs px-3 py-1 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${getStatusAction(job.status).className}`}
                    >
                      {updatingId === job._id ? "Processing..." : getStatusAction(job.status).label}
                    </button>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="text-xs px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-500"
                    >
                      Delete
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


