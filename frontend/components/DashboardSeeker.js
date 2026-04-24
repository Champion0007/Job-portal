"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import Link from "next/link";
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

              {/* ✅ STATUS MESSAGE */}
              <div className="mt-4 text-sm font-medium flex items-center gap-2">
                {app.status === "hired" && (
                  <>
                    <CheckCircle className="text-green-600" size={18} />
                    <span className="text-green-700">
                      Congratulations! You are hired 🎉
                    </span>
                  </>
                )}

                {app.status === "rejected" && (
                  <>
                    <XCircle className="text-red-600" size={18} />
                    <span className="text-red-700">
                      Unfortunately, your application was rejected.
                    </span>
                  </>
                )}

                {["applied", "reviewed", "shortlisted", "interview"].includes(
                  app.status
                ) && (
                  <>
                    <Briefcase className="text-indigo-600" size={18} />
                    <span className="text-indigo-700">
                      Your application is in progress.
                    </span>
                  </>
                )}
              </div>

              {/* 🆕 INTERVIEW DETAILS FOR CANDIDATE */}
              {app.interview?.date && (
                <div className="mt-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-gray-800">
                  <div className="font-semibold text-indigo-700 mb-1">
                    Interview Scheduled
                  </div>
                  <div>
                    Date & Time: {new Date(app.interview.date).toLocaleString()}
                  </div>
                  {app.interview.mode && (
                    <div>Mode: {app.interview.mode.toUpperCase()}</div>
                  )}
                  {app.interview.location && (
                    <div>Location: {app.interview.location}</div>
                  )}
                  {app.interview.link && (
                    <div>
                      Link:{" "}
                      <a
                        href={app.interview.link}
                        target="_blank"
                        className="text-indigo-600 underline"
                        rel="noreferrer"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}
                  {app.interview.notes && (
                    <div>Note: {app.interview.notes}</div>
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
