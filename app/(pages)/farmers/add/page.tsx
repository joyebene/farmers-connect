"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/component/Input";

export default function AddFarmerPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      const response = await fetch("/api/farmers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Farmer added successfully.");

      router.push("/farmers");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
      <h1 className="mb-8 text-3xl font-bold">
        Add Farmer
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <Input
            required
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="h-12 w-full rounded-xl border px-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Email
          </label>

          <Input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="h-12 w-full rounded-xl border px-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Password
          </label>

          <Input
            required
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="h-12 w-full rounded-xl border px-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Phone
          </label>

          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="h-12 w-full rounded-xl border px-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Address
          </label>

          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="h-12 w-full rounded-xl border px-4"
          />
        </div>

        <button
          disabled={loading}
          className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
        >
          {loading ? "Creating..." : "Create Farmer"}
        </button>
      </form>
    </div>
  );
}