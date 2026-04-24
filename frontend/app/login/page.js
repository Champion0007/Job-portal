"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../components/AuthContext";
import { useLoading } from "../../components/LoadingContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { withLoading } = useLoading();

  // ✅ BLOCKED USER MESSAGE
  useEffect(() => {
    const blocked = searchParams.get("error");
    if (blocked === "blocked") {
      setError(
        "🚫 Your account has been blocked by the admin. Please contact support.",
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await withLoading(async () => {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        auth.login(data.token, data.user);
        router.push("/dashboard");
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeIn">
          {/* LEFT */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome Back
            </h2>
            <p className="text-gray-600 mb-6">
              Login to continue exploring job opportunities
            </p>

            {/* ERROR */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="text-right text-sm">
                <a
                  href="/forgot-password"
                  className="text-indigo-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:scale-[1.02] active:scale-95 transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* SOCIAL LOGIN */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href="http://localhost:5000/api/auth/google"
                  className="flex items-center justify-center gap-2 border text-black rounded-lg py-2 hover:bg-gray-50 hover:scale-[1.02] transition"
                >
                  <FcGoogle size={20} />
                  Google
                </a>

                <a
                  href="http://localhost:5000/api/auth/github"
                  className="flex items-center justify-center gap-2 bg-gray-900 text-white rounded-lg py-2 hover:bg-black hover:scale-[1.02] transition"
                >
                  <FaGithub size={18} />
                  GitHub
                </a>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-600">
              Don’t have an account?{" "}
              <a href="/register" className="text-indigo-600 font-medium">
                Create one
              </a>
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 p-8">
            <img
              src="/login-img.webp"
              alt="Jobs"
              className="w-full h-full object-contain animate-float"
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* TAILWIND ANIMATIONS */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.4s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </div>
  );
}
