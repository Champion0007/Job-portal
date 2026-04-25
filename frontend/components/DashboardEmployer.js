"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import Link from "next/link";
import {
  Briefcase,
  Users,
  MapPin,
  Eye,
  Download,
  Calendar,
  Video,
} from "lucide-react"; // 🆕 Calendar, Video

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export default function DashboardEmployer() {
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicants, setSelectedApplicants] = useState(null);
  const [activeJobId, setActiveJobId] = useState(null);

  // 🆕 INTERVIEW FORM STATE
  const [interviewForm, setInterviewForm] = useState({
    appId: null,
    date: "",
    mode: "online",
    location: "",
    link: "",
    notes: "",
  });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/employer`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Employer Jobs Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const viewApplicants = async (jobId) => {
    try {
      setActiveJobId(jobId);
      const res = await fetch(`${API_BASE}/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setSelectedApplicants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Applicants Fetch Error:", err);
      setSelectedApplicants([]);
    }
  };

  // ✅ pehle se wala function – SHORTLIST/REJECT etc.
  const updateStatus = async (appId, status) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/applications/${appId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      setSelectedApplicants((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error("Update Status Error:", err);
      alert("Server error while updating status");
    }
  };

  // 🆕 OPEN INTERVIEW FORM FOR A SPECIFIC APPLICANT
  const openInterviewForm = (app) => {
    setInterviewForm({
      appId: app._id,
      date: app.interview?.date
        ? new Date(app.interview.date).toISOString().slice(0, 16)
        : "",
      mode: app.interview?.mode || "online",
      location: app.interview?.location || "",
      link: app.interview?.link || "",
      notes: app.interview?.notes || "",
    });
  };

  // 🆕 CLOSE FORM
  const cancelInterviewForm = () => {
    setInterviewForm({
      appId: null,
      date: "",
      mode: "online",
      location: "",
      link: "",
      notes: "",
    });
  };

  // 🆕 SUBMIT INTERVIEW SCHEDULE
  const scheduleInterview = async (e) => {
    e.preventDefault();
    if (!interviewForm.appId) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/applications/${interviewForm.appId}/interview`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: interviewForm.date,
            mode: interviewForm.mode,
            location: interviewForm.location,
            link: interviewForm.link,
            notes: interviewForm.notes,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to schedule interview");
        return;
      }

      // UI update: status + interview details
      setSelectedApplicants((prev) =>
        prev.map((app) =>
          app._id === interviewForm.appId
            ? { ...app, status: "interview", interview: data.application.interview }
            : app
        )
      );

      cancelInterviewForm();
      alert("Interview scheduled successfully");
    } catch (err) {
      console.error("Schedule Interview Error:", err);
      alert("Server error while scheduling interview");
    }
  };

  if (!user) {
    return <div className="p-6">Please login to view your dashboard.</div>;
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user.name || user.email}
          </h2>
          <p className="text-sm text-gray-500">Role: Employer</p>
        </div>

        <Link href="/employer/post-job">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            <Briefcase size={18} />
            Post a Job
          </button>
        </Link>
      </div>

      {/* JOB POSTS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
          <Briefcase size={20} /> Your Job Posts
        </h3>

        {loading ? (
          <div>Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-gray-500">No job posts yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-xl p-5 hover:shadow-lg transition bg-gradient-to-br from-white to-gray-50"
              >
                <h4 className="text-lg font-semibold text-indigo-600">
                  {job.title}
                </h4>

                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {job.location?.city || "Location not specified"}
                </p>

                <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  Status: {job.status}
                </span>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => viewApplicants(job._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition"
                  >
                    <Users size={16} /> View Applicants
                  </button>

                  <Link href={`/job/${job._id}`}>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition">
                      <Eye size={16} /> View Job
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* APPLICANTS PANEL */}
      {activeJobId && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users size={20} /> Applicants
          </h3>

          {selectedApplicants?.length === 0 ? (
            <div className="text-gray-500">No applicants yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {selectedApplicants?.map((app) => (
                <div
                  key={app._id}
                  className="border rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {app.fullName || "Unknown"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Applied: {new Date(app.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                      {app.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 grid grid-cols-2 gap-2">
                    <p><b>Email:</b> {app.email}</p>
                    <p><b>Phone:</b> {app.phone}</p>
                    <p><b>City:</b> {app.city}</p>
                    <p><b>Exp:</b> {app.experienceYears} yrs</p>
                    <p><b>Company:</b> {app.currentCompany || "N/A"}</p>
                    <p><b>Role:</b> {app.currentRole || "N/A"}</p>
                  </div>

                  {app.skills?.length > 0 && (
                    <div className="mt-2 text-sm">
                      <b>Skills:</b> {app.skills.join(", ")}
                    </div>
                  )}

                  {app.coverLetter && (
                    <div className="mt-2 text-sm">
                      <b>Cover Letter:</b> {app.coverLetter}
                    </div>
                  )}

                  {app.interview?.date && (
                    <div className="mt-2 text-sm bg-indigo-50 border border-indigo-100 rounded p-2 flex gap-2 items-start">
                      <Calendar size={16} className="text-indigo-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-indigo-700">
                          Interview Scheduled
                        </div>
                        <div className="text-xs text-gray-700">
                          {new Date(app.interview.date).toLocaleString()}
                          {app.interview.mode &&
                            ` • ${app.interview.mode.toUpperCase()}`}
                        </div>
                        {app.interview.location && (
                          <div className="text-xs text-gray-600">
                            Location: {app.interview.location}
                          </div>
                        )}
                        {app.interview.link && (
                          <a
                            href={app.interview.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-600 underline flex items-center gap-1 mt-1"
                          >
                            <Video size={14} /> Join Call
                          </a>
                        )}
                        {app.interview.notes && (
                          <div className="text-xs text-gray-600 mt-1">
                            Note: {app.interview.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {app.resumeUrl && (
                    <a
                      href={`${API_BASE}${app.resumeUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition"
                    >
                      <Download size={16} />
                      Download Resume
                    </a>
                  )}

                  {/* STATUS BUTTONS */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => updateStatus(app._id, "shortlisted")}
                      className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      Shortlist
                    </button>

                    {/* 🆕 INTERVIEW BUTTON – opens form */}
                    <button
                      onClick={() => openInterviewForm(app)}
                      className="px-3 py-1 text-xs rounded bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-1"
                    >
                      <Calendar size={14} /> Schedule Interview
                    </button>

                    <button
                      onClick={() => updateStatus(app._id, "hired")}
                      className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      Hire
                    </button>

                    <button
                      onClick={() => updateStatus(app._id, "rejected")}
                      className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </div>

                  {/* 🆕 INLINE INTERVIEW FORM (ONLY FOR SELECTED APPLICANT) */}
                  {interviewForm.appId === app._id && (
                    <form
                      onSubmit={scheduleInterview}
                      className="mt-4 p-3 border rounded bg-white space-y-2 text-xs"
                    >
                      <div className="font-semibold text-gray-800 mb-1">
                        Schedule Interview
                      </div>

                      <div>
                        <label className="block mb-1">Date & Time</label>
                        <input
                          type="datetime-local"
                          className="w-full border rounded px-2 py-1"
                          value={interviewForm.date}
                          onChange={(e) =>
                            setInterviewForm((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-1">Mode</label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={interviewForm.mode}
                          onChange={(e) =>
                            setInterviewForm((prev) => ({
                              ...prev,
                              mode: e.target.value,
                            }))
                          }
                        >
                          <option value="online">Online</option>
                          <option value="in-person">In-person</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1">
                          Location (for in-person)
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={interviewForm.location}
                          onChange={(e) =>
                            setInterviewForm((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Office address"
                        />
                      </div>

                      <div>
                        <label className="block mb-1">
                          Meeting Link (for online)
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={interviewForm.link}
                          onChange={(e) =>
                            setInterviewForm((prev) => ({
                              ...prev,
                              link: e.target.value,
                            }))
                          }
                          placeholder="Google Meet / Zoom link"
                        />
                      </div>

                      <div>
                        <label className="block mb-1">Notes</label>
                        <textarea
                          className="w-full border rounded px-2 py-1"
                          rows={2}
                          value={interviewForm.notes}
                          onChange={(e) =>
                            setInterviewForm((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          placeholder="Anything important for candidate"
                        />
                      </div>

                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          type="button"
                          onClick={cancelInterviewForm}
                          className="px-3 py-1 rounded border text-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 rounded bg-indigo-600 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
