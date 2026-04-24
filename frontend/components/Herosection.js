"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const quickFilters = [
  { label: "Remote", value: "remote" },
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
];

function buildJobsUrl({ query, location, jobType }) {
  const params = new URLSearchParams();
  const trimmedQuery = query.trim();
  const trimmedLocation = location.trim();

  if (trimmedQuery) params.set("q", trimmedQuery);
  if (trimmedLocation) params.set("location", trimmedLocation);
  if (jobType) params.set("jobType", jobType);

  const search = params.toString();
  return search ? `/jobs?${search}` : "/jobs";
}

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(buildJobsUrl({ query, location }));
  };

  const handleQuickFilter = (jobType) => {
    router.push(buildJobsUrl({ query, location, jobType }));
  };

  return (
    <section className="animate-fade-up bg-gradient-to-b from-white to-indigo-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 px-5 py-14 lg:flex-row lg:px-12 lg:py-16">
        <div className="w-full max-w-2xl text-center lg:w-1/2 lg:text-left">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            Find the perfect job
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            Search jobs from top companies - tailored recommendations, easy
            applications, and career tools.
          </p>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center"
          >
            <input
              aria-label="keyword"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title or keyword"
              className="col-span-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              aria-label="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (city or remote)"
              className="col-span-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="col-span-1 flex">
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-700 px-4 py-3 text-white transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            {quickFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleQuickFilter(filter.value)}
                className="rounded-full border border-gray-100 bg-white px-3 py-1 text-sm text-gray-800 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full justify-center lg:w-1/2">
          <img
            src="/searching-for-job-online-illustration-svg-download-png-3738450.webp"
            alt="Job search"
            className="w-full max-w-lg object-contain drop-shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}
