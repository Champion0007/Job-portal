"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true });
    try {
      const res = await fetch(`${API}/api/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus({
        ok: res.ok,
        message:
          data.message || "Reset link sent to your registered email address.",
      });
    } catch {
      setStatus({ ok: false, message: "Failed to send. Try again later." });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* LEFT */}
            <div className="p-8 md:w-1/2">
              <h1 className="text-2xl font-semibold text-indigo-800">
                Forgot your password?
              </h1>

              <p className="mt-3 text-sm text-gray-600">
                Enter your account email and we&apos;ll send a link to reset
                your password.
              </p>

              <form onSubmit={submit} className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                  >
                    {status?.loading ? "Sending..." : "Send reset link"}
                  </button>
                </div>

                {status && !status.loading && (
                  <p
                    className={`mt-4 text-sm ${
                      status.ok ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
              </form>
            </div>

            {/* RIGHT */}
            <div className="bg-indigo-50 p-8 md:w-1/2 flex flex-col justify-center">
              <h3 className="text-indigo-700 font-medium">Need help?</h3>

              <p className="mt-3 text-sm text-gray-600">
                If you Don&apos;t receive the email within a few minutes, check
                your spam folder or contact support.
              </p>

              <div className="mt-6">
                <a
                  className="text-sm text-indigo-600 hover:underline"
                  href="/contact"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remembered your password?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
