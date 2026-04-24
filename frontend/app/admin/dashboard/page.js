"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await api.get("/api/admin/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const cards = [
    { label: "Total Users", key: "usersCount", color: "from-indigo-500 to-indigo-700" },
    { label: "Total Jobs", key: "jobsCount", color: "from-emerald-500 to-emerald-700" },
    { label: "Total Applications", key: "applicationsCount", color: "from-sky-500 to-sky-700" },
    { label: "New Messages", key: "newMessagesCount", color: "from-pink-500 to-pink-700" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Dashboard Overview</h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-md"
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${card.color} mix-blend-soft-light`}
            />
            <div className="relative z-10 flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                {card.label}
              </div>
              <div className="text-2xl font-bold text-white">
                {loading || !stats ? (
                  <span className="text-slate-500">...</span>
                ) : (
                  stats[card.key] ?? 0
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

