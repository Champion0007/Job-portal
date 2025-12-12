"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Jobcard from "../../components/Jobcard";
import { useLoading } from "../../components/LoadingContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { withLoading } = useLoading();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [profile, setProfile] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState({ 'full-time': false, 'part-time': false, remote: false, contract: false });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Customer Support'];
  const profiles = ['Intern', 'Junior', 'Mid', 'Senior', 'Lead'];

  useEffect(() => {
    let mounted = true;
    const initialFetch = async () => {
      setLoading(true);
      try {
        await withLoading(async () => {
          const q = new URLSearchParams();
          if (query) q.set('q', query);
          if (location) q.set('location', location);
          const res = await fetch(`${API_BASE}/api/jobs?${q.toString()}`);
          const data = await res.json();
          if (mounted) setJobs(data || []);
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initialFetch();
    return () => (mounted = false);
  }, [query, location, withLoading]);

  // client-side filtering for category/profile/jobType when data is available
  const filteredJobs = jobs.filter((job) => {
    if (category) {
      const jobCat = (job.category || job.skills || []).join ? job.category : job.category || '';
      // if job.category is string or array of skills
      if (Array.isArray(job.category) && !job.category.includes(category)) return false;
      if (typeof job.category === 'string' && !job.category.toLowerCase().includes(category.toLowerCase())) return false;
      if (!job.category && job.skills && Array.isArray(job.skills) && !job.skills.includes(category)) return false;
    }
    if (profile) {
      // infer profile from experience or title
      const title = (job.title || '').toLowerCase();
      if (profile === 'Intern' && !title.includes('intern')) return false;
      if (profile === 'Junior' && !(title.includes('junior') || title.includes('jr'))) return false;
      if (profile === 'Senior' && !title.includes('senior') && !title.includes('lead')) return false;
      // allow Mid/Lead as broad matches
    }
    // jobType filters
    const activeTypes = Object.keys(jobTypeFilter).filter((k) => jobTypeFilter[k]);
    if (activeTypes.length > 0) {
      const jt = (job.jobType || job.type || '').toLowerCase();
      if (!activeTypes.includes(jt)) return false;
      // for remote filter, allow 'remote' string in location
      if (jobTypeFilter.remote && !(jt === 'remote' || (job.location && String(job.location).toLowerCase().includes('remote')))) return false;
    }
    return true;
  });

  // explicit fetch used by the "Search" button so user controls when to query
  const fetchJobs = async () => {
    setLoading(true);
    try {
      await withLoading(async () => {
        const q = new URLSearchParams();
        if (query) q.set('q', query);
        if (location) q.set('location', location);
        const res = await fetch(`${API_BASE}/api/jobs?${q.toString()}`);
        const data = await res.json();
        setJobs(data || []);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-neutral-900 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 flex-grow">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
          <div className="flex flex-col gap-3 lg:hidden">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition hover:border-indigo-100 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
              aria-expanded={filtersOpen}
              aria-controls="job-filters"
            >
              Filters
              <span className="text-xs text-gray-500">{filtersOpen ? "Hide" : "Show"}</span>
            </button>
          </div>

          <aside
            id="job-filters"
            className={`lg:w-80 ${filtersOpen ? "block" : "hidden"} lg:block`}
          >
            <div className="sticky top-24 rounded border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className="font-semibold mb-3  text-gray-800">Search</h3>
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Keyword (e.g. Frontend Engineer)" className="w-full border border-gray-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              <input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Location (city or remote)" className="w-full border border-gray-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              <div className="flex flex-col gap-2 sm:flex-row">
                <button onClick={fetchJobs} className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 rounded shadow hover:bg-indigo-700 transition cursor-pointer">Search Jobs</button>
                <button onClick={() => { setQuery(''); setLocation(''); setCategory(''); setProfile(''); setJobTypeFilter({ 'full-time': false, 'part-time': false, remote: false, contract: false }); setTimeout(()=>fetchJobs(), 50); }} className="flex-none bg-white border border-gray-200 text-sm py-2 px-3 rounded hover:bg-gray-50 cursor-pointer">Reset</button>
              </div>

              <h3 className="font-semibold mt-4 mb-2">Category</h3>
              <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full border border-gray-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer">
                <option value="">All categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <h3 className="font-semibold mt-4 mb-2">Profile</h3>
              <select value={profile} onChange={(e)=>setProfile(e.target.value)} className="w-full border border-gray-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer">
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
                <button onClick={() => { setQuery(''); setLocation(''); setCategory(''); setProfile(''); setJobTypeFilter({ 'full-time': false, 'part-time': false, remote: false, contract: false }); setTimeout(()=>fetchJobs(), 50); }} className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 py-2 rounded cursor-pointer">Clear & Refresh</button>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <h1 className="text-3xl font-bold">Job Listings</h1>
              <div className="text-sm text-neutral-600">{filteredJobs.length} results</div>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
