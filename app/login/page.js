"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";
import { useLoading } from "../../components/LoadingContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        auth.login(data.token, data.user);
        router.push('/dashboard');
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider) => {
    // placeholder: integrate OAuth with NextAuth or backend later
    alert(`Social login with ${provider} (demo)`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-6">Sign in to continue to your JobPortal account and discover new opportunities.</p>

            {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-700">Forgot your password?</a>
                </div>
              </div>
              <div>
                <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-md hover:from-blue-700 hover:to-indigo-700 cursor-pointer">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={() => handleSocial('Google')} className="inline-flex justify-center items-center px-4 py-2 border rounded-md bg-white hover:bg-gray-50 cursor-pointer">
                  <img src="/globe.svg" alt="G" className="h-5 w-5 mr-2" /> Google
                </button>
                <button onClick={() => handleSocial('Phone')} className="inline-flex justify-center items-center px-4 py-2 border rounded-md bg-white hover:bg-gray-50 cursor-pointer">
                  <img src="/next.svg" alt="P" className="h-5 w-5 mr-2" /> Phone
                </button>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-600">Don’t have an account? <a href="/register" className="text-blue-600 font-medium">Create one</a></p>
          </div>

          <div className="hidden md:block bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
            <img src="/login-img.webp" alt="Jobs" className="w-full h-full object-contain" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
