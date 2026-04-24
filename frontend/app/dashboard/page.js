"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import DashboardSeeker from "../../components/DashboardSeeker";
import DashboardEmployer from "../../components/DashboardEmployer";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function DashboardPage() {
  const auth = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // wait for auth to initialize from localStorage
    setReady(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />
      <main className="container mx-auto px-6 py-10 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        {!ready ? (
          <div>Loading...</div>
        ) : !auth?.user ? (
          <div>Please login to view your dashboard.</div>
        ) : auth.user.role === 'employer' ? (
          <DashboardEmployer />
        ) : (
          <DashboardSeeker />
        )}
      </main>
      <Footer />
    </div>
  );
}
