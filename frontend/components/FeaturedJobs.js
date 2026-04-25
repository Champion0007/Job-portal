"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadFeaturedJobs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs?perPage=3`, {
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load jobs");
        }

        if (mounted) {
          setJobs(Array.isArray(data) ? data : []);
        }
      } catch {
        if (mounted) {
          setError("Featured jobs are unavailable right now.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFeaturedJobs();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="mb-20 px-4">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
          <p className="text-gray-500 text-sm mt-1">
            Fresh approved roles from employers on the platform.
          </p>
        </div>

        <Link
          href="/jobs"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          Browse all jobs
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 px-4 py-4 text-red-600 text-sm">
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg bg-gray-50 px-4 py-4 text-gray-500 text-sm">
          No featured jobs available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link
              key={job._id}
              href={`/job/${job._id}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                  {job.company?.name?.[0] || "C"}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {job.company?.name || "Company not specified"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.salary?.min && (
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                    Rs {job.salary.min} - Rs {job.salary.max}
                  </span>
                )}

                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {job.location?.city || "Remote"}
                </span>

                <span className="bg-indigo-100 text-indigo-600 text-xs px-3 py-1 rounded-full">
                  {job.jobType || "Full-time"}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {job.createdAt ? "Recently posted" : "New"}
                </span>

                <span className="text-sm font-medium text-indigo-600 group-hover:underline">
                  Apply
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
