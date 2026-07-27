"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Spinner from "@/component/Spinner";

interface Farmer {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  role: string;
  createdAt: string;
}

export default function ViewFarmerPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [farmer, setFarmer] = useState<Farmer | null>(null);

  useEffect(() => {
    fetchFarmer();
  }, []);

 


  const fetchFarmer = async () => {
    try {
      const res = await fetch(`/api/farmers/${id}`);
      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        router.push("/dashboard/farmers");
        return;
      }

      setFarmer(data.farmer);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!farmer) return null;

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Farmer Details
          </h1>

          <p className="text-gray-500 mt-2">
            View farmer information.
          </p>
        </div>

        <Link
          href="/farmers"
          className="flex items-center gap-2 rounded-xl border px-5 py-3 hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

      </div>

      <div className="rounded-2xl bg-white shadow p-8">

        <div className="flex flex-col items-center">

          {farmer.profileImage ? (
            <Image
              src={farmer.profileImage}
              width={50}
              height={50}
              alt={farmer.fullName}
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-100 text-5xl font-bold text-green-700">
              {farmer.fullName.charAt(0)}
            </div>
          )}

          <h2 className="mt-5 text-2xl font-bold">
            {farmer.fullName}
          </h2>

          <span className="mt-2 rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
            Farmer
          </span>

        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="flex items-center gap-3">
            <Mail className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{farmer.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{farmer.phone || "-"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p>{farmer.address || "-"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="capitalize">{farmer.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p>
                {new Date(farmer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p>{farmer._id}</p>
            </div>
          </div>

        </div>

        <div className="mt-10 flex gap-4">

          <Link
            href={`/farmers/edit/${farmer._id}`}
            className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
          >
            Edit Farmer
          </Link>

          <Link
            href="/farmers"
            className="rounded-xl border px-6 py-3 hover:bg-gray-100"
          >
            Back to Farmers
          </Link>

        </div>

      </div>

    </div>
  );
}