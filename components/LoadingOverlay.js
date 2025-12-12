"use client";
import { useLoading } from "./LoadingContext";

export default function LoadingOverlay() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="status"
      aria-label="Loading"
    >
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}





