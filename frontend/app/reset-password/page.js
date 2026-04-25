'use client'
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get('token') || '';
  const emailParam = search.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [status, setStatus] = useState(null);
  const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

  useEffect(()=>{ setEmail(emailParam); }, [emailParam]);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setStatus({ ok:false, message:'Password must be at least 6 characters' });
    if (password !== confirmPw) return setStatus({ ok:false, message:'Passwords do not match' });
    setStatus({ loading: true });
    try {
      const res = await fetch(`${API}/api/auth/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ ok:true, message: data.message || 'Password reset successful' });
        setTimeout(()=>router.push('/login'), 1400);
      } else {
        setStatus({ ok:false, message: data.error || data.message || 'Failed to reset password' });
      }
    } catch (err) {
      setStatus({ ok:false, message: 'Server error' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-semibold text-indigo-800">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-600">Set a new password for your account.</p>

          <form onSubmit={submit} className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} required type="email" className="mt-2 w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500" />

            <label className="block text-sm font-medium text-gray-700 mt-4">New password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} required type="password" className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />

            <label className="block text-sm font-medium text-gray-700 mt-4">Confirm password</label>
            <input value={confirmPw} onChange={(e)=>setConfirmPw(e.target.value)} required type="password" className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />

            <div className="mt-6">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition" type="submit">
                {status?.loading ? 'Resetting...' : 'Reset password'}
              </button>
            </div>

            {status && !status.loading && (
              <p className={`mt-4 text-sm ${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.message}</p>
            )}
          </form>

          <p className="mt-4 text-sm text-gray-500">If the link is expired, request a new one at <a href="/forgot-password" className="text-indigo-600 hover:underline">Forgot Password</a>.</p>
        </div>
      </div>
    </main>
  );
}
