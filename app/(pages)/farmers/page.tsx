"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import Spinner from "@/component/Spinner";
import Image from "next/image";

interface Farmer {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  role: string;
}

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/farmers/all");
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setFarmers(data.farmers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      return (
        farmer.fullName.toLowerCase().includes(search.toLowerCase()) ||
        farmer.email.toLowerCase().includes(search.toLowerCase()) ||
        (farmer.address || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [search, farmers]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium"><Spinner /></p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Farmers
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all registered farmers.
          </p>
        </div>

        <Link
          href="/farmers/add"
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
        >
          <Plus size={18} />
          Add Farmer
        </Link>

      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Total Farmers
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {farmers.length}
              </h2>

            </div>

            <div className="rounded-xl bg-green-100 p-3">
              <Users className="text-green-700" />
            </div>

          </div>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                With Phone
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {farmers.filter((f) => f.phone).length}
              </h2>

            </div>

            <div className="rounded-xl bg-blue-100 p-3">
              <Phone className="text-blue-700" />
            </div>

          </div>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                With Address
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {farmers.filter((f) => f.address).length}
              </h2>

            </div>

            <div className="rounded-xl bg-yellow-100 p-3">
              <MapPin className="text-yellow-700" />
            </div>

          </div>

        </div>

      </div>

      {/* Search */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="relative max-w-md">

          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search farmer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-4 outline-none focus:border-green-600"
          />

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr className="text-left">

              <th className="px-6 py-4">Farmer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th className="text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredFarmers.map((farmer) => (

              <tr
                key={farmer._id}
                className="border-t border-gray-300 hover:bg-gray-50"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-3">

                    {farmer.profileImage ? (

                      <Image
                        src={farmer.profileImage}
                        alt="farmer profile image"
                        width={50}
                        height={50}
                        className="h-12 w-12 rounded-full object-cover"
                      />

                    ) : (

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                        {farmer.fullName.charAt(0).toUpperCase()}
                      </div>

                    )}

                    <p className="font-semibold">
                      {farmer.fullName}
                    </p>

                  </div>

                </td>

                <td>

                  <div className="flex items-center gap-2">

                    <Mail size={16} />

                    {farmer.email}

                  </div>

                </td>

                <td>

                  <div className="flex items-center gap-2">

                    <Phone size={16} />

                    {farmer.phone || "-"}

                  </div>

                </td>

                <td>

                  <div className="flex items-center gap-2">

                    <MapPin size={16} />

                    {farmer.address || "-"}

                  </div>

                </td>

                <td>

                  <div className="flex justify-center gap-4 sm:mr-3">

                    <Link
                      href={`/farmers/${farmer._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </Link>

                    <Link
                      href={`/farmers/edit/${farmer._id}`}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <Pencil size={18} />
                    </Link>

                  </div>

                </td>

              </tr>

            ))}

            {filteredFarmers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-gray-500"
                >
                  No farmers found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}