export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 mt-10 animate-fade-in">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 sm:px-8 md:grid-cols-3">
        <div>
          <h4 className="font-bold text-lg">JobPortal</h4>
          <p className="text-sm text-neutral-600 mt-2">Connecting talent with opportunity. Find jobs, grow careers.</p>
        </div>

        <div>
          <h5 className="font-semibold">Explore</h5>
          <ul className="mt-2 text-sm text-neutral-600 space-y-1">
            <li><a href="/jobs" className="hover:text-neutral-800">Jobs</a></li>
            <li><a href="/companies" className="hover:text-neutral-800">Companies</a></li>
            <li><a href="/about" className="hover:text-neutral-800">About</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold">Subscribe</h5>
          <p className="text-sm text-neutral-600 mt-2">Get job alerts and career tips in your inbox.</p>
          <form className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input aria-label="email" type="email" placeholder="you@example.com" className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            <button className="px-4 py-2 rounded bg-indigo-600 text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t px-6 pt-6 text-center text-sm text-neutral-600 sm:px-8">
        &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>
    </footer>
  );
}
