
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Star,
  Package,
  Search,
} from "lucide-react";

import Button from "@/component/Button"
import Loader from "@/component/Spinner";

interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  rating: number;
  totalSales: number;
  products: number;
  joinDate: string;
  description?: string;
  verified: boolean;
}

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const fetchFarmers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch("/api/farmers/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log(data.farmers);
      


      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch farmers");
      }

      const farmers: Farmer[] = data.farmers.map((farmer: any) => ({
        id: farmer._id,
        fullName: farmer.fullName,
        email: farmer.email,
        phone: farmer.phone,
        location: farmer.address,
        avatar: farmer.avatar || "/images/default-avatar.png",
        joinDate: farmer.createdAt,
        description: farmer.description || "",
        verified: farmer.verified || false,
      }));
      

      setFarmers(farmers);
      setFilteredFarmers(farmers);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);
  // Filter farmers based on search and location
  useEffect(() => {
    let result = farmers;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (farmer) =>
          farmer.fullName.toLowerCase().includes(term) ||
          farmer.location.toLowerCase().includes(term) ||
          farmer.description?.toLowerCase().includes(term)
      );
    }

    if (locationFilter !== "all") {
      result = result.filter((farmer) => farmer.location === locationFilter);
    }

    setFilteredFarmers(result);
  }, [searchTerm, locationFilter, farmers]);

  // Get unique locations for filter
  const locations = Array.from(new Set(farmers.map((f) => f.location)));

const renderStars = () => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-600">
        5.0
      </span>
    </div>
  );
};

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-3">
            Meet Our Farmers
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect directly with local farmers who grow the freshest produce for your table.
            Browse their products, learn about their farms, and support sustainable agriculture.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center rounded-xl border border-gray-200 bg-white px-3 focus-within:border-green-500">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search farmers by name, location, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full bg-transparent px-2 text-sm outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-green-500"
            >
              <option value="all">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="mb-4 text-sm text-gray-500">
          {filteredFarmers.length} farmer{filteredFarmers.length !== 1 ? "s" : ""} found
        </p>

        {/* Farmers Grid */}
        {filteredFarmers.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <Search className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No Farmers Found
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFarmers.map((farmer) => (
              <Link
                key={farmer.id}
                href={`/buyers-view/farmers/products/${farmer.id}`}
                className="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-xl"
              >
                {/* Avatar */}
                <div className="relative mx-auto h-24 w-24">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-green-100 to-green-200 text-4xl font-bold text-green-700">
                    {farmer.fullName.charAt(0)}
                  </div>
                  {farmer.verified && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Farmer Info */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {farmer.fullName}
                  </h3>
                  <div className="mt-1 flex items-center justify-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    {farmer.location}
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                    {renderStars()}
                  </div>
                </div>

                {/* View Products Button */}
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    View Products
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}