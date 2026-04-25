"use client";
import Link from "next/link";

function initials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatLocation(location) {
  if (!location) return "Remote";
  if (typeof location === "string") return location;
  return [location.city, location.state, location.country].filter(Boolean).join(", ") || "Remote";
}

export default function Jobcard({ job }) {
  if (!job) return null;

  const title = job.title || job.posting?.title || "Untitled";
  const companyName =
    job.company?.name || job.company || job.posting?.company || "";
  const location = formatLocation(job.location);
  const rawType = job.jobType || job.type || "Full-Time";
  const type = String(rawType).toLowerCase();
  const logo = job.company?.logo || job.logo || job.companyLogo || null;
  const salary =
    job.salary?.min && job.salary?.max
      ? `Rs ${job.salary.min} - Rs ${job.salary.max}`
      : typeof job.salary === "string"
        ? job.salary
        : "Salary not disclosed";
  const posted = timeAgo(job.createdAt || job.postedAt || job.created_at);
  const isRemote =
    location.toLowerCase().includes("remote") || job.remote === true;

  return (
    <article className="group bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center gap-4">
        {logo ? (
          <img
            src={logo}
            alt="logo"
            className="h-12 w-12 rounded-lg object-cover border"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
            {initials(companyName) || "C"}
          </div>
        )}

        <div className="flex-1">
          <Link
            href={`/job/${job._id || job.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition"
          >
            {title}
          </Link>

          <p className="text-sm text-gray-500">{companyName || "Company"}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          {location}
        </span>

        <span className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-600 capitalize">
          {type}
        </span>

        {isRemote && (
          <span className="bg-purple-100 px-3 py-1 rounded-full text-purple-600">
            Remote
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-green-600">{salary}</span>
        <span className="text-gray-400">{posted}</span>
      </div>

      <div className="mt-5">
        <Link
          href={`/job/${job._id || job.id}`}
          className="block w-full text-center bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Apply Now
        </Link>
      </div>
    </article>
  );
}
