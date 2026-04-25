"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("jp_token");
    const u = localStorage.getItem("jp_user");

    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
  }, []);

  const saveSession = useCallback((t, u) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("jp_token", t);
    localStorage.setItem("jp_user", JSON.stringify(u));
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jp_token");
    localStorage.removeItem("jp_user");
  }, []);

  const loginWithToken = useCallback(async (t) => {
    try {
      localStorage.setItem("jp_token", t);
      setToken(t);

      const res = await fetch(`${API_BASE}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${t}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const userData = await res.json();
      setUser(userData);
      localStorage.setItem("jp_user", JSON.stringify(userData));
    } catch (err) {
      console.error("OAuth login failed:", err);
      clearSession();
    }
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: saveSession,
        loginWithToken,
        logout: clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
