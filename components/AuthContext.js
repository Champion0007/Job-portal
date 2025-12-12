"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("jp_token");
    const u = localStorage.getItem("jp_user");
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
  }, []);

  const saveSession = (t, u) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("jp_token", t);
    localStorage.setItem("jp_user", JSON.stringify(u));
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jp_token");
    localStorage.removeItem("jp_user");
  };

  const value = {
    user,
    token,
    login: (t, u) => saveSession(t, u),
    logout: () => clearSession(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
