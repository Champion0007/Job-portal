"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../components/AuthContext";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

/* SAFE LOCATION FORMATTER */
function formatLocation(location) {
  if (!location) return "Location not specified";
  return `${location.city || ""}${location.state ? ", " + location.state : ""}${
    location.country ? ", " + location.country : ""
  }`;
}

export default function JobDetailsPage() {
  const params = useParams();
  const { id } = params || {};
  const { user, token } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // FORM STATES
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [skills, setSkills] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);

  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");
  const [analysisPreview, setAnalysisPreview] = useState(null);

  /* Fetch Job */
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchJob = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        if (mounted) setJob(data);
      } catch (err) {
        console.error("Job fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchJob();
    return () => (mounted = false);
  }, [id]);

  /* APPLY HANDLER */
  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError("");
    setApplySuccess("");
    setAnalysisPreview(null);

    if (!user) {
      setApplyError("Please login to apply.");
      return;
    }

    if (user.role !== "seeker" && user.role !== "candidate") {
      setApplyError("Only job seekers can apply.");
      return;
    }

    if (!resume) {
      setApplyError("Please upload your resume (PDF).");
      return;
    }

    if (resume.type !== "application/pdf" || !resume.name.toLowerCase().endsWith(".pdf")) {
      setApplyError("Resume must be a PDF file.");
      return;
    }

    if (resume.size > 5 * 1024 * 1024) {
      setApplyError("Resume must be 5MB or smaller.");
      return;
    }

    try {
      setApplyLoading(true);

      const formData = new FormData();
      formData.append("jobId", id);
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append("experienceYears", experienceYears);
      formData.append("currentCompany", currentCompany);
      formData.append("currentRole", currentRole);
      formData.append("skills", skills);
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);

      const res = await fetch(`${API_BASE}/api/applications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to apply");
      }

      setApplySuccess("Application submitted successfully!");
      setAnalysisPreview(data.analysis || null);


      setFullName("");
      setEmail("");
      setPhone("");
      setCity("");
      setExperienceYears("");
      setCurrentCompany("");
      setCurrentRole("");
      setSkills("");
      setCoverLetter("");
      setResume(null);
    } catch (err) {
      console.error("Apply error:", err);
      setApplyError(err.message || "Something went wrong");
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto px-6 py-10 flex-grow animate-pulse">
          Loading job...
        </main>
        <Footer />
      </div>
    );

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto px-6 py-10 flex-grow">
          <h1 className="text-3xl font-bold text-red-600">Job not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white text-neutral-900 min-h-screen flex flex-col">
      <Navbar />


      <main className="container mx-auto px-6 py-10 flex-grow grid md:grid-cols-3 gap-8 items-start">

        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold mb-2 text-indigo-700">
            {job.title}
          </h1>

          <p className="text-lg font-semibold text-gray-700">
            {job.company?.name || job.company || "Company"}
          </p>

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
            <span className="px-3 py-1 bg-indigo-50 rounded-full">
              {formatLocation(job.location)}
            </span>
            <span className="px-3 py-1 bg-indigo-50 rounded-full">
              {job.jobType}
            </span>
          </div>

          {job.salary?.min && job.salary?.max && (
            <p className="mt-4 inline-block px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-full">
              Rs {job.salary.min} - Rs {job.salary.max}
            </p>
          )}

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
            <p className="text-neutral-700 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </section>

          {job.skills?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>


        <div className="bg-white p-8 rounded-2xl shadow-lg h-fit self-start">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">
            Apply for this job
          </h2>

          {applyError && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
              {applyError}
            </div>
          )}

          {applySuccess && (
            <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">
              {applySuccess}
            </div>
          )}

          {analysisPreview && (
            <div className="mb-4 bg-indigo-50 text-indigo-800 p-3 rounded text-sm space-y-2">
              {typeof analysisPreview.aiScore === "number" && (
                <div className="font-semibold">
                  AI match score: {analysisPreview.aiScore}/100
                </div>
              )}
              {analysisPreview.skills?.length > 0 && (
                <div>
                  <b>Detected skills:</b> {analysisPreview.skills.join(", ")}
                </div>
              )}
            </div>
          )}

          {!user ? (
            <p className="text-sm text-gray-600">
              Please login as a job seeker to apply.
            </p>
          ) : user.role === "employer" ? (
            <p className="text-sm text-gray-600">
              Employers cannot apply for jobs.
            </p>
          ) : (
            <form onSubmit={handleApply} className="space-y-3">
              <input
                className="input"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                className="input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="input"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                className="input"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <input
                className="input"
                type="number"
                placeholder="Experience (Years)"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
              <input
                className="input"
                placeholder="Current Company"
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
              />
              <input
                className="input"
                placeholder="Current Role"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
              />
              <input
                className="input"
                placeholder="Skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <textarea
                className="input h-28"
                placeholder="Cover Letter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />

              <input
                type="file"
                accept=".pdf"
                className="input"
                onChange={(e) => {
                  setApplyError("");
                  const file = e.target.files[0];
                  if (!file) {
                    setResume(null);
                    return;
                  }
                  if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
                    setResume(null);
                    setApplyError("Resume must be a PDF file.");
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    setResume(null);
                    setApplyError("Resume must be 5MB or smaller.");
                    return;
                  }
                  setResume(file);
                }}
                required
              />

              <button
                type="submit"
                disabled={applyLoading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
              >
                {applyLoading ? "Analyzing resume..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 10px 12px;
          border-radius: 10px;
          outline: none;
        }
        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
        }
      `}</style>
    </div>
  );
}
