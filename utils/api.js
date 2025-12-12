"use client";
import { useLoading } from "../components/LoadingContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useApi() {
  const { withLoading } = useLoading();

  const fetchWithLoading = async (url, options = {}) => {
    return withLoading(async () => {
      const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }
      return data;
    });
  };

  return { fetchWithLoading };
}

export default API_BASE;





