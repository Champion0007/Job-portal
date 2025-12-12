"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const withLoading = useCallback(async (fn) => {
    try {
      setLoading(true);
      const result = await fn();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}

export default LoadingContext;





