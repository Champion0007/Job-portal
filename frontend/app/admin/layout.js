"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getToken, clearToken } from "@/lib/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/register";

  useEffect(() => {
    // Do not protect login/register themselves
    if (isAuthPage) return;

    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router, isAuthPage]);

  // On auth pages, render children without admin shell
  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    clearToken();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">
            JobPortal <span className="text-indigo-400">Admin</span>
          </h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 px-3 py-2 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100"
        >
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 bg-slate-950/80 backdrop-blur">
          <div className="text-sm text-slate-400 hidden md:block">
            Admin Panel
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="font-semibold">Admin</div>
              <div className="text-slate-400">admin@jobportal</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 animate-fadeIn">{children}</main>
      </div>
    </div>
  );
}

