"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setStatus("loading");
      setMessage("");

      const res = await fetch(`${API_BASE}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      setStatus("success");
      setMessage("🎉 You’re subscribed successfully!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong");
    }
  };

  return (
    <footer className="bg-gray-100 text-gray-700 py-12 mt-14 animate-fade-in">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 sm:px-8 md:grid-cols-3">

        {/* BRAND */}
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-indigo-700">
            JobPortal
          </h4>
          <p className="text-sm text-neutral-600">
            Connecting talent with opportunity. Find jobs, grow careers.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h5 className="font-semibold mb-2">Explore</h5>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li><a href="/jobs" className="hover:text-indigo-600 transition">Jobs</a></li>
            <li><a href="/companies" className="hover:text-indigo-600 transition">Companies</a></li>
            <li><a href="/about" className="hover:text-indigo-600 transition">About</a></li>
          </ul>
        </div>

        {/* SUBSCRIBE */}
        <div>
          <h5 className="font-semibold mb-1">Subscribe</h5>
          <p className="text-sm text-neutral-600 mb-3">
            Get job alerts and career tips in your inbox.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="px-5 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {/* STATUS MESSAGE */}
          {message && (
            <p
              className={`mt-3 text-sm animate-fade-in ${
                status === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mx-auto mt-10 max-w-6xl border-t px-6 pt-6 text-center text-sm text-neutral-600">
        &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>
    </footer>
  );
}
