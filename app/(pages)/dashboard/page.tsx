"use client";

import Link from "next/link";
import {
  Package,
  Clock,
  Plus,
  Eye,
  MessageCircle,
  MessageCircleCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminDashboard } from "@/component/AdminDashboard";
import { FarmerDashoard } from "@/component/FarmerDashoard";
import Spinner from "@/component/Spinner";

export default function DashboardPage() {

  const [role, setRole] = useState<string | null>(null);

useEffect(() => {
  const userRole = localStorage.getItem("role");
  setRole(userRole);
}, []);


if (!role) {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}

if (role === "admin") {
  return <AdminDashboard />;
}

return <FarmerDashoard />;
}