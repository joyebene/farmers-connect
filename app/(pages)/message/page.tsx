"use client";

import { useEffect, useState } from "react";

interface Message {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setMessages(data.messages);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Messages</h1>

      {messages.map((msg) => (
        <div
          key={msg._id}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <div className="flex justify-between">
            <h2 className="font-semibold">{msg.fullName}</h2>

            <span
              className={`rounded-full px-3 py-1 text-xs ${
                msg.status === "unread"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {msg.status}
            </span>
          </div>

          <p className="mt-2 text-gray-600 line-clamp-2">
            {msg.message}
          </p>

          <button className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white">
            View Message
          </button>
        </div>
      ))}
    </div>
  );
}