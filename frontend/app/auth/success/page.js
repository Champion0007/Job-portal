"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { ShieldCheck } from "lucide-react";

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const hashToken =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.hash.replace(/^#/, "")).get("token")
        : null;
    const token = hashToken || searchParams.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    loginWithToken(token).then(() => {
      router.replace("/dashboard");
    });
  }, [loginWithToken, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center gap-4 animate-fadeIn">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          <ShieldCheck className="w-8 h-8 text-indigo-600" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          Signing you in
        </h2>

        <p className="text-sm text-gray-500 text-center">
          Securely verifying your account<br />
          Please wait a moment...
        </p>
      </div>
    </div>
  );
}
