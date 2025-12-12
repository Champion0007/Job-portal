"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed');
      setStatus('sent');
      setName(''); setEmail(''); setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />
      <main className="container mx-auto px-6 py-12 flex-grow">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="order-2 lg:order-1">
            <div className="bg-white border rounded-xl p-8 shadow-lg">
              <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-2">Let's talk</h1>
              <p className="text-gray-700 mb-6">Questions, feedback, or partnership inquiries — we’d love to hear from you. Fill the form and our team will get back within one business day.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full name</label>
                    <input value={name} onChange={(e)=>setName(e.target.value)} required className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea value={message} onChange={(e)=>setMessage(e.target.value)} rows={6} required className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200" />
                </div>

                <div className="flex items-center gap-4">
                  <button type="submit" className="inline-flex items-center gap-3 bg-indigo-700 text-white px-5 py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"> 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l9-7 9 7v7a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-7z" /></svg>
                    <span>Send Message</span>
                  </button>
                  <div className="text-sm text-neutral-600">
                    {status === 'sending' && <div>Sending...</div>}
                    {status === 'sent' && <div className="text-green-600">Message sent (demo).</div>}
                    {status === 'error' && <div className="text-red-600">Error sending message.</div>}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <aside className="order-1 lg:order-2">
            <div className="bg-gradient-to-b from-indigo-50 to-white border rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-800 mb-3">Contact information</h3>
              <p className="text-sm text-gray-700">Email: <a className="text-indigo-700 hover:underline" href="mailto:support@jobportal.example">support@jobportal.example</a></p>
              <p className="text-sm text-gray-700 mt-2">Phone: <span className="font-medium text-gray-800">+1 (555) 123-4567</span></p>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800">Office</h4>
                <p className="text-sm text-gray-700">123 Market Street, San Francisco, CA</p>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800">Follow us</h4>
                <div className="flex gap-3 mt-3">
                  <a href="#" className="p-2 rounded-full bg-white border hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"><img src="/vercel.svg" alt="twitter" className="w-5 h-5" /></a>
                  <a href="#" className="p-2 rounded-full bg-white border hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"><img src="/next.svg" alt="linkedin" className="w-5 h-5" /></a>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <h5 className="font-semibold text-gray-800">Support hours</h5>
                <p className="text-sm text-gray-700">Mon — Fri, 9am — 6pm PST</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
