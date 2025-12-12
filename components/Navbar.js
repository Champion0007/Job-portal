"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthContext";
import LoadingLink from "./LoadingLink";
import { useLoading } from "./LoadingContext";

export default function Navbar() {
  const auth = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
    { href: "/companies", label: "Companies" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur animate-fade-in"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="text-2xl font-bold text-indigo-800">
          <LoadingLink href="/">JobPortal</LoadingLink>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        <ul className="hidden items-center gap-6 font-medium md:flex">
          {navLinks.map((item) => (
            <li key={item.href}>
              <LoadingLink
                href={item.href}
                className="rounded text-gray-800 transition hover:text-indigo-700 hover:underline hover:underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
              >
                {item.label}
              </LoadingLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {!auth?.user ? (
            <>
              <LoadingLink href="/login">
                <button className="rounded-lg border border-indigo-700 px-4 py-2 text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 cursor-pointer">
                  Login
                </button>
              </LoadingLink>
              <LoadingLink href="/register">
                <button className="rounded-lg bg-indigo-700 px-4 py-2 text-white transition hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 cursor-pointer">
                  Register
                </button>
              </LoadingLink>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-800 sm:inline">{auth.user.name || auth.user.email}</span>
              <LoadingLink href="/dashboard">
                <button className="rounded px-3 py-1 text-sm text-gray-800 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 cursor-pointer">
                  Dashboard
                </button>
              </LoadingLink>
              <button
                className="rounded px-3 py-1 text-sm text-red-700 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-100 cursor-pointer"
                onClick={() => {
                  startLoading();
                  auth.logout();
                  setTimeout(() => stopLoading(), 300);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        className={`md:hidden overflow-hidden border-t border-gray-100 bg-white transition-[max-height,opacity] duration-200 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 px-4 py-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3">
            {navLinks.map((item) => (
              <LoadingLink
                key={item.href}
                href={item.href}
                className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 transition hover:border-indigo-100 hover:bg-indigo-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </LoadingLink>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {!auth?.user ? (
              <>
                <LoadingLink href="/login" onClick={() => setOpen(false)}>
                  <button className="w-full rounded-lg border border-indigo-700 px-4 py-2 text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200">
                    Login
                  </button>
                </LoadingLink>
                <LoadingLink href="/register" onClick={() => setOpen(false)}>
                  <button className="w-full rounded-lg bg-indigo-700 px-4 py-2 text-white transition hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">
                    Register
                  </button>
                </LoadingLink>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-800">
                  {auth.user.name || auth.user.email}
                </div>
                <LoadingLink href="/dashboard" onClick={() => setOpen(false)}>
                  <button className="w-full rounded bg-gray-100 px-3 py-2 text-gray-800 transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100">
                    Dashboard
                  </button>
                </LoadingLink>
                <button
                  className="w-full rounded bg-red-50 px-3 py-2 text-red-700 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-100"
                  onClick={() => {
                    startLoading();
                    auth.logout();
                    setOpen(false);
                    setTimeout(() => stopLoading(), 300);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
