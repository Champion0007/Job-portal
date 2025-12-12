"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";
import { useLoading } from "../../components/LoadingContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("seeker");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { withLoading } = useLoading();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await withLoading(async () => {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        auth.login(data.token, data.user);
        router.push('/dashboard');
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
            <p className="text-gray-600 mb-6">Sign up to apply for jobs, save listings and connect with employers.</p>

            {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} required className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select value={role} onChange={(e)=>setRole(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-md">
                  <option value="seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
              <div>
                <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-md hover:from-indigo-700 hover:to-blue-700 cursor-pointer">
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-gray-600">Already have an account? <a href="/login" className="text-indigo-600 font-medium">Sign in</a></p>
          </div>

          <div className="hidden md:block bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
            <img src="/create-acc-register.webp" alt="Create account" className="w-full h-full object-contain" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
