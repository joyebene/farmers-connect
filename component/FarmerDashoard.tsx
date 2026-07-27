import React from 'react'
import { Clock, Eye, MessageCircle, MessageCircleCheck, Package, Plus } from "lucide-react";
import Link from "next/link";

export const FarmerDashoard = () => {
      const stats = [
    {
      title: "Products",
      value: 12,
      icon: Package,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Messages",
      value: 38,
      icon: MessageCircleCheck,
      color: "bg-blue-100 text-blue-700",
    },

    {
      title: "Pending",
      value: 6,
      icon: Clock,
      color: "bg-red-100 text-red-700",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      price: "$18",
      stock: 120,
    },
    {
      id: 2,
      name: "Organic Carrots",
      price: "$12",
      stock: 85,
    },
    {
      id: 3,
      name: "Sweet Corn",
      price: "$10",
      stock: 200,
    },
  ];


  return (
      <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Farmer Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back! Here&apos;s an overview of your farm.
          </p>
        </div>


        <Link
          href="/post-product"
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700 w-fit"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.color}`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tables */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Products */}

        <div className="rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-300 p-5 flex justify-between">
            <h2 className="font-semibold">
              Recent Products
            </h2>

            <Link
              href="/dashboard/products"
              className="text-green-600 text-sm"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-300">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <h3 className="font-medium">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>

                <span className="font-bold text-green-700">
                  {product.price}
                </span>
              </div>
            ))}
          </div>
        </div>


      {/* Quick Actions */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/dashboard/products/create"
            className="rounded-xl border border-gray-300 p-5 hover:bg-green-50"
          >
            <Package className="text-green-600 mb-3" />

            <h3 className="font-semibold">
              Add Product
            </h3>

            <p className="text-sm text-gray-500">
              List a new farm product.
            </p>
          </Link>

          <Link
            href="/dashboard/messages"
            className="rounded-xl border border-gray-300 p-5 hover:bg-green-50 transition-colors"
          >
            <MessageCircle className="text-green-600 mb-3" />

            <h3 className="font-semibold">
              Messages
            </h3>

            <p className="text-sm text-gray-500">
              Check and reply to customer messages.
            </p>
          </Link>

          <Link
            href="/buyers-view/products"
            className="rounded-xl border border-gray-300 p-5 hover:bg-green-50"
          >
            <Eye className="text-green-600 mb-3" />

            <h3 className="font-semibold">
              View Marketplace
            </h3>

            <p className="text-sm text-gray-500">
              See your products as buyers do.
            </p>
          </Link>
        </div>
      </div>
    </div>
    </div>
  )
}
