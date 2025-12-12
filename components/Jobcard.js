"use client";
import Link from "next/link";
import LoadingLink from "./LoadingLink";

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

export default function Jobcard({ job }) {
  if (!job) return null;

  const title = job.title || job.posting?.title || "Untitled";
  const companyName =
    job.company?.name || job.company || job.posting?.company || "";

  // ✅ ✅ FIXED LOCATION (NO OBJECT WILL EVER RENDER)
  const location = job.location
    ? `${job.location.city || ""}${
        job.location.state ? ", " + job.location.state : ""
      }${job.location.country ? ", " + job.location.country : ""}`.trim()
    : "Remote";

  const rawType = job.jobType || job.type || "Full-Time";
  const type = String(rawType).toLowerCase();

  const logo = job.company?.logo || job.logo || job.companyLogo || null;

  // ✅ ✅ SAFE SALARY STRING
  const salary =
    job.salary?.min && job.salary?.max
      ? `₹${job.salary.min} - ₹${job.salary.max}`
      : typeof job.salary === "string"
      ? job.salary
      : "Salary not disclosed";

  const posted = timeAgo(job.createdAt || job.postedAt || job.created_at);

  const isRemote =
    location.toLowerCase().includes("remote") || job.remote === true;

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-lg animate-pop">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
        {logo ? (
          <img
            src={logo}
            alt={`${companyName} logo`}
            className="h-12 w-12 rounded-md border object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-indigo-50 font-semibold text-indigo-700">
            {initials(companyName) || "C"}
          </div>
        )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="flex items-center truncate text-lg font-semibold text-indigo-800">
                <LoadingLink
                  href={`/job/${job._id || job.id}`}
                  className="block hover:underline"
                >
                  {title}
                </LoadingLink>

                {(job.featured || job.isFeatured) && (
                  <span className="ml-2 inline-flex items-center rounded border border-yellow-200 bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                    Featured
                  </span>
                )}

                {(job.urgent || job.isUrgent) && (
                  <span className="ml-2 inline-flex items-center rounded border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                    Urgent
                  </span>
                )}
              </h3>

              <div className="mt-1 truncate text-sm text-gray-700">{companyName}</div>
            </div>

            <div className="ml-2 flex-shrink-0 text-right">
              <div className="text-sm font-medium text-gray-800">{salary}</div>
              <div className="text-xs text-gray-400">{posted}</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <span className="truncate">{location || "Location not specified"}</span>
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="capitalize">{type}</span>
            </span>

            {isRemote && (
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-700 bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white">
                Remote
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end md:ml-auto">
        <LoadingLink
          href={`/job/${job._id || job.id}`}
          className="inline-flex w-full items-center justify-center rounded bg-indigo-600 px-3 py-2 text-sm text-white transition hover:bg-indigo-700 sm:w-auto"
        >
          Apply
        </LoadingLink>
      </div>
    </article>
  );
}
