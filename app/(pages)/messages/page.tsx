"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Search,
  Mail,
  Phone,
  User,
  MessageCircle,
} from "lucide-react";

interface Message {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
  farmer: {
    _id: string;
    fullName: string;
  };
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const filtered = messages.filter((item) =>
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.farmer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search)
    );

    setFilteredMessages(filtered);
  }, [search, messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages/all");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessages(data.messages);
      setFilteredMessages(data.messages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-500 mt-2">
            Messages sent by buyers to farmers.
          </p>
        </div>

        <div className="rounded-xl bg-green-100 px-5 py-3">
          <p className="text-sm text-gray-500">Total Messages</p>
          <h2 className="text-2xl font-bold">
            {messages.length}
          </h2>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search customer or farmer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-4 outline-none focus:border-green-600"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr className="text-left">

              <th className="px-6 py-4">Customer</th>
              <th>Farmer</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-center">Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredMessages.map((message) => (

              <tr
                key={message._id}
                className="border-t border-gray-300 hover:bg-gray-50"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                      <User size={18} />
                    </div>

                    <div>

                      <p className="font-semibold">
                        {message.fullName}
                      </p>

                      {message.email && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={14} />
                          {message.email}
                        </p>
                      )}

                    </div>

                  </div>

                </td>

                <td>

                  <div className="font-medium">
                    {message.farmer.fullName}
                  </div>

                </td>

                <td>

                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {message.phone}
                  </div>

                </td>

                <td>

                  {message.status === "read" ? (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      Read
                    </span>

                  ) : (

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                      Unread
                    </span>

                  )}

                </td>

                <td>
                  {new Date(message.createdAt).toLocaleDateString()}
                </td>

                <td>

                  <div className="flex justify-center">

                    <Link
                      href={`/messages/${message._id}`}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye size={18} />
                    </Link>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {filteredMessages.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <MessageCircle className="mx-auto mb-4 h-10 w-10 text-gray-300" />
            No messages found.
          </div>
        )}

      </div>

    </div>
  );
}