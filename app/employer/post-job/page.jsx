"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PostJobPage() {
  const { token, user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    state: "",
    country: "India",
    minSalary: "",
    maxSalary: "",
    jobType: "Full-Time",
    experienceLevel: "Fresher",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded shadow text-center">
          <p>Please login as employer to post a job.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          minSalary: form.minSalary ? Number(form.minSalary) : undefined,
          maxSalary: form.maxSalary ? Number(form.maxSalary) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create job");
      }

      setSuccess("✅ Job posted successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border p-8">
          {/* ✅ Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-indigo-600">
              Post a New Job
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Create a professional job listing to attract the best candidates.
            </p>
          </div>

          {/* ✅ Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* ✅ Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Job Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Frontend Developer"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Job Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Write detailed job role, responsibilities, and requirements..."
                className="w-full rounded-lg border px-4 py-2 h-32 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2"
              >
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Remote</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2"
              >
                <option>Fresher</option>
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
              </select>
            </div>

            {/* Min Salary */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Min Salary
              </label>
              <input
                type="number"
                name="minSalary"
                value={form.minSalary}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            {/* Max Salary */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Salary
              </label>
              <input
                type="number"
                name="maxSalary"
                value={form.maxSalary}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
