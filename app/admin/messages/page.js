"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    const loadMessages = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/messages");
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [router]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/admin/messages/${id}/status`, { status });
      const res = await api.get("/api/admin/messages");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/api/admin/messages/${id}`);
      const res = await api.get("/api/admin/messages");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Contact Messages</h2>
      {loading ? (
        <div className="text-slate-400 text-sm">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="text-slate-500 text-sm">No messages found.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-slate-100">
                    {msg.name}{" "}
                    <span className="text-xs text-slate-400">({msg.email})</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    msg.status === "new"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : msg.status === "read"
                      ? "bg-slate-700 text-slate-200"
                      : "bg-indigo-500/20 text-indigo-300"
                  }`}
                >
                  {msg.status}
                </span>
              </div>
              <p className="text-sm text-slate-200 whitespace-pre-wrap">
                {msg.message}
              </p>
              <div className="flex gap-2 mt-2">
                {msg.status !== "read" && (
                  <button
                    onClick={() => updateStatus(msg._id, "read")}
                    className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
                  >
                    Mark as Read
                  </button>
                )}
                {msg.status !== "replied" && (
                  <button
                    onClick={() => updateStatus(msg._id, "replied")}
                    className="text-xs px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500"
                  >
                    Mark as Replied
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(msg._id)}
                  className="ml-auto text-xs px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

