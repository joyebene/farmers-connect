"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Star,
  Package,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  MessageCircle,
} from "lucide-react";

import Button from "@/component/Button";
import Loader from "@/component/Spinner"

export default function FarmerDetailPage() {
  const params = useParams();
  const [farmer, setFarmer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showMessageModal, setShowMessageModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(false);


  const handleSendMessage = async () => {
    try {
      setSending(true);

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmerId: farmer.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Message sent successfully!");

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        message: "",
      });

      setShowMessageModal(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSending(false);
    }
  };


  useEffect(() => {
    fetchFarmerDetails();
  }, [params.id]);


  const fetchFarmerDetails = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/farmers/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      const farmer = data.farmer;

      setFarmer({
        id: farmer._id,
        fullName: farmer.fullName,
        email: farmer.email,
        phone: farmer.phone,
        location: farmer.address,
        rating: farmer.rating || 0,
        totalSales: farmer.totalSales || 0,
        products: farmer.products?.length || 0,
        joinDate: farmer.createdAt,
        description:
          farmer.description ||
          "This farmer has not added a profile description yet.",
        verified: farmer.verified || false,
        profileImage: farmer.profileImage,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Farmer Not Found</h2>
        <Link href="/farmers" className="mt-4 inline-block text-green-600 hover:underline">
          Back to Farmers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/farmers"
          className="mb-6 inline-flex items-center text-green-600 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Farmers
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {/* Farmer Header */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative h-32 w-32">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-green-100 to-green-200 text-5xl font-bold text-green-700">
                {farmer.fullName
                  ?.split(" ")
                  .map((name: string) => name[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              {farmer.verified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1.5">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                {farmer.fullName}
              </h1>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-gray-500 md:justify-start">
                <span className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {farmer.location}
                </span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  Joined {new Date(farmer.joinDate).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(farmer.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {farmer.rating} ({farmer.totalSales} sales)
                </span>
              </div>
            </div>
          </div>

          {/* Farmer Description */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">About</h2>
            <p className="mt-2 text-gray-600">{farmer.description}</p>
          </div>

          {/* Contact Info */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-5 w-5 text-green-600" />
                {farmer.phone}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-5 w-5 text-green-600" />
                {farmer.email}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
            <Link href={`/farmers/${farmer.id}/products`}>
              <Button>
                <Package className="mr-2 h-4 w-4" />
                View All Products
              </Button>
            </Link>
            <Button variant="outline" onClick={() => setShowMessageModal(true)}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </div>
        </div>
      </div>

      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-2xl font-bold">
              Contact Farmer
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Fill in your details and the farmer will contact you.
            </p>

            <div className="mt-6 space-y-4">

              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3"
              />

              <input
                type="email"
                placeholder="Email (Optional)"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3"
              />

              <textarea
                rows={5}
                placeholder="Write your message..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3"
              />

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <Button
                variant="outline"
                onClick={() => setShowMessageModal(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Message"}
              </Button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}