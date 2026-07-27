"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Phone,
  Mail,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Message {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  message: string;
  createdAt: string;
}

export default function MessageDetailsPage() {
  const { id } = useParams();

  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessage();
  }, []);

  const fetchMessage = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!message) {
    return <p>Message not found.</p>;
  }

  const whatsappLink = `https://wa.me/${message.phone.replace(/\D/g, "")}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <Link
        href="/messages"
        className="inline-flex items-center gap-2 text-green-600"
      >
        <ArrowLeft size={18} />
        Back to Messages
      </Link>

      <div className="rounded-2xl bg-white p-8 shadow">

        <h1 className="text-3xl font-bold">
          {message.fullName}
        </h1>

        <p className="text-gray-500 mt-1">
          {new Date(message.createdAt).toLocaleString()}
        </p>

        <div className="mt-8 space-y-4">

          <div>
            <p className="font-semibold">
              Phone Number
            </p>

            <p>{message.phone}</p>
          </div>

          {message.email && (
            <div>
              <p className="font-semibold">
                Email
              </p>

              <p>{message.email}</p>
            </div>
          )}

          <div>
            <p className="font-semibold mb-2">
              Message
            </p>

            <div className="rounded-xl bg-gray-100 p-5 whitespace-pre-wrap">
              {message.message}
            </div>
          </div>

        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <a
            href={`tel:${message.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <Phone size={20} />
            Call Customer
          </a>

          <a
            href={whatsappLink}
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700"
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>

          {message.email && (
            <a
              href={`mailto:${message.email}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-white hover:bg-black"
            >
              <Mail size={20} />
              Send Email
            </a>
          )}

        </div>

      </div>

    </div>
  );
}