"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import Link from "next/link";
import { Calendar, Video } from "lucide-react";

import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ STATUS COLOR + TEXT
function statusBadge(status) {
  const map = {
    applied: "bg-gray-100 text-gray-700",
    reviewed: "bg-blue-100 text-blue-700",
    shortlisted: "bg-purple-100 text-purple-700",
    interview: "bg-yellow-100 text-yellow-700",
    hired: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

// ✅ PROGRESS CALCULATION
function progressPercent(status) {
  const steps = ["applied", "reviewed", "shortlisted", "interview", "hired"];
  const index = steps.indexOf(status);
  return index === -1 ? 10 : ((index + 1) / steps.length) * 100;
}

export default function DashboardSeeker() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ✅ ✅ MISSING FUNCTION FIX (ADDED NOW)
  const respondInterview = async (appId, response) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/applications/${appId}/interview-response`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ response }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed");

      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId
            ? { ...app, interviewResponse: response }
            : app
        )
      );

      alert(`Interview ${response}`);
    } catch (err) {
      alert("Server error");
    }
  };

  // ✅ FETCH CANDIDATE APPLICATIONS
  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/applications/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("My Applications Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMyApplications();
  }, [token]);

  if (loading) return <div className="p-6">Loading your applications...</div>;

  return (
    <div className="space-y-8">
      {/* ✅ HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-2">
        <UserCheck className="text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          My Job Applications
        </h2>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          You have not applied to any job yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border"
            >
              {/* ✅ JOB HEADER */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600">
                    {app.job?.title || "Job"}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    {app.job?.location?.city || "Location"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full capitalize ${statusBadge(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>

              {/* ✅ PROGRESS BAR */}
              <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500"
                  style={{
                    width: `${progressPercent(app.status)}%`,
                  }}
                />
              </div>

              {/* ✅ META INFO */}
              <div className="text-sm text-gray-500 space-y-1">
                <p className="flex items-center gap-1">
                  <Clock size={14} />
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* 🆕 INTERVIEW DETAILS + ACCEPT / REJECT */}
              {app.interview?.date && (
                <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4 shadow">
                  <h3 className="text-indigo-700 font-semibold flex items-center gap-2 mb-2">
                    <Calendar size={18} /> Interview Scheduled
                  </h3>

                  <p className="text-sm text-gray-700">
                    <b>Date:</b>{" "}
                    {new Date(app.interview.date).toLocaleString()}
                  </p>

                  {app.interview.link && (
                    <a
                      href={app.interview.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-indigo-600 underline text-sm"
                    >
                      <Video size={16} /> Join Interview
                    </a>
                  )}

                  {!app.interviewResponse && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() =>
                          respondInterview(app._id, "accepted")
                        }
                        className="px-4 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"
                      >
                        ✅ Accept
                      </button>

                      <button
                        onClick={() =>
                          respondInterview(app._id, "rejected")
                        }
                        className="px-4 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}

                  {app.interviewResponse && (
                    <div className="mt-3 text-sm font-semibold">
                      Status:
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          app.interviewResponse === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.interviewResponse.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ JOB LINK */}
              <div className="mt-5">
                <Link
                  href={`/job/${app.job?._id}`}
                  className="inline-block text-sm text-indigo-600 hover:underline"
                >
                  View Job Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
