"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Farmer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export default function EditFarmerPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Farmer>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchFarmer();
  }, []);

  const fetchFarmer = async () => {
    try {
      const res = await fetch(`/api/farmers/${params.id}`);
      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setFormData({
        fullName: data.farmer.fullName,
        email: data.farmer.email,
        phone: data.farmer.phone || "",
        address: data.farmer.address || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateFarmer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await fetch(`/api/farmers/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Farmer updated successfully.");

      router.push("/farmers");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl">

      <h1 className="mb-8 text-3xl font-bold">
        Edit Farmer
      </h1>

      <form
        onSubmit={updateFarmer}
        className="space-y-6 rounded-2xl bg-white p-8 shadow"
      >

        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            className="w-full rounded-xl border p-3"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({
                ...formData,
                fullName: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Email
          </label>

          <input
            className="w-full rounded-xl border p-3"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Phone
          </label>

          <input
            className="w-full rounded-xl border p-3"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Address
          </label>

          <textarea
            rows={4}
            className="w-full rounded-xl border p-3"
            value={formData.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: e.target.value,
              })
            }
          />
        </div>

        <button
          disabled={saving}
          className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Farmer"}
        </button>

      </form>

    </div>
  );
}