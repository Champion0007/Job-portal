"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Jobcard from "../../components/Jobcard";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function normalizeJobType(value) {
  return String(value || "").trim().toLowerCase();
}

function createJobTypeFilter(activeType = "") {
  return {
    "full-time": activeType === "full-time",
    "part-time": activeType === "part-time",
    remote: activeType === "remote",
    contract: activeType === "contract",
  };
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState("");
  const [profile, setProfile] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState(
    createJobTypeFilter(normalizeJobType(searchParams.get("jobType")))
  );

  const categories = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Customer Support'];
  const profiles = ['Fresher', 'Junior', 'Mid', 'Senior'];

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setLocation(searchParams.get("location") || "");
    setJobTypeFilter(
      createJobTypeFilter(normalizeJobType(searchParams.get("jobType")))
    );
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    const initialFetch = async () => {
      setLoading(true);
      try {
        const q = new URLSearchParams();
        if (query) q.set('q', query);
        if (location) q.set('location', location);
        const url = `${API_BASE}/api/jobs${q.toString() ? `?${q.toString()}` : ""}`;
        const res = await fetch(url);
        const data = await res.json().catch(() => []);
        console.log("Fetched jobs:", data);
        if (mounted) {
          setJobs(Array.isArray(data) ? data : []);
          // Log if any jobs are missing titles
          if (data && Array.isArray(data)) {
            data.forEach((job, index) => {
              if (!job.title) {
                console.warn(`Job at index ${index} is missing title:`, job);
              }
            });
          }
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initialFetch();
    return () => (mounted = false);
  }, [query, location]);

  // client-side filtering for category/profile/jobType when data is available
  const filteredJobs = jobs.filter((job) => {
    if (category) {
      const skills = Array.isArray(job.skills) ? job.skills : [];
      if (!skills.some((skill) => skill.toLowerCase().includes(category.toLowerCase()))) return false;
    }
    if (profile) {
      if ((job.experienceLevel || '').toLowerCase() !== profile.toLowerCase()) return false;
    }
    // jobType filters
    const activeTypes = Object.keys(jobTypeFilter).filter((k) => jobTypeFilter[k]);
    if (activeTypes.length > 0) {
      const jt = (job.jobType || job.type || '').toLowerCase();
      const locationText =
        typeof job.location === "string"
          ? job.location
          : [job.location?.city, job.location?.state, job.location?.country].filter(Boolean).join(" ");
      const remoteMatch = jt === 'remote' || locationText.toLowerCase().includes('remote');
      if (jobTypeFilter.remote && remoteMatch) return true;
      if (!activeTypes.includes(jt)) return false;
    }
    return true;
  });

  // explicit fetch used by the "Search" button so user controls when to query
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (query) q.set('q', query);
      if (location) q.set('location', location);
      const url = `${API_BASE}/api/jobs${q.toString() ? `?${q.toString()}` : ""}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => []);
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-neutral-900 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-6 py-10 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80">
            <div className="p-4 bg-white rounded shadow sticky top-6">
              <h3 className="font-semibold mb-3 text-gray-800">Search</h3>
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Keyword (e.g. Frontend Engineer)" className="w-full border border-gray-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              <input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Location (city or remote)" className="w-full border border-gray-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              <div className="flex gap-2 mt-2">
                <button onClick={fetchJobs} className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 rounded shadow hover:bg-indigo-700 transition">Search Jobs</button>
                <button onClick={() => { setQuery(''); setLocation(''); setCategory(''); setProfile(''); setJobTypeFilter(createJobTypeFilter()); setTimeout(()=>fetchJobs(), 50); }} className="flex-none bg-white border border-gray-200 text-sm py-2 px-3 rounded hover:bg-gray-50">Reset</button>
              </div>

              <h3 className="font-semibold mt-4 mb-2">Category</h3>
              <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full border border-gray-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                <option value="">All categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <h3 className="font-semibold mt-4 mb-2">Profile</h3>
              <select value={profile} onChange={(e)=>setProfile(e.target.value)} className="w-full border border-gray-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                <option value="">Any</option>
                {profiles.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>

              <h3 className="font-semibold mt-4 mb-2">Job Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(jobTypeFilter).map((k) => (
                  <label key={k} className="inline-flex items-center gap-2 text-sm bg-gray-50 border border-gray-100 rounded px-2 py-1">
                    <input type="checkbox" checked={jobTypeFilter[k]} onChange={() => setJobTypeFilter((s)=>({ ...s, [k]: !s[k] }))} className="h-4 w-4 text-indigo-600 rounded" />
                    <span className="capitalize text-gray-700">{k.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <button onClick={() => { setQuery(''); setLocation(''); setCategory(''); setProfile(''); setJobTypeFilter(createJobTypeFilter()); setTimeout(()=>fetchJobs(), 50); }} className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 py-2 rounded">Clear & Refresh</button>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Job Listings</h1>
              <div className="text-sm text-neutral-600">{filteredJobs.length} results</div>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredJobs.length === 0 && <div className="p-6 bg-white rounded shadow">No jobs match your filters.</div>}
                {filteredJobs.map((job) => (
                  <div key={job._id || job.id} className="p-4 bg-white rounded shadow hover:shadow-lg transition">
                    <Jobcard job={job} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
