import { Clock, Eye, MessageCircle, MessageCircleCheck, Package } from "lucide-react";
import Link from "next/link";

export function AdminDashboard() {
  const stats = [
    {
      title: "Farmers",
      value: 24,
      icon: Package,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Products",
      value: 138,
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Messages",
      value: 15,
      icon: MessageCircleCheck,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Pending Products",
      value: 8,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage farmers, products and the marketplace.
          </p>
        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.color}`}
                >
                  <Icon />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold mb-6">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-4">

          <Link
            href="/farmers"
            className="rounded-xl border border-gray-300 p-5 hover:bg-green-50"
          >
            <Package className="text-green-600 mb-3" />

            <h3 className="font-semibold">
              Manage Farmers
            </h3>

            <p className="text-sm text-gray-500">
              View, edit and delete farmers.
            </p>

          </Link>

          <Link
            href="/products"
            className="rounded-xl border border-gray-300 p-5 hover:bg-green-50"
          >
            <Package className="text-green-600 mb-3" />

            <h3 className="font-semibold">
              Products
            </h3>

            <p className="text-sm text-gray-500">
              Manage all products.
            </p>

          </Link>

          <Link
            href="/messages"
            className="rounded-xl border border-gray-300 p-5 hover:bg-green-50"
          >
            <MessageCircle className="text-green-600 mb-3" />

            <h3 className="font-semibold">
              Messages
            </h3>

            <p className="text-sm text-gray-500">
              View conversations.
            </p>

          </Link>

          <Link
            href="/buyers-view/products"
            className="rounded-xl border border-gray-300 p-5 hover:bg-green-50"
          >
            <Eye className="text-green-600 mb-3" />

            <h3 className="font-semibold">
              Marketplace
            </h3>

            <p className="text-sm text-gray-500">
              View public marketplace.
            </p>

          </Link>

        </div>

      </div>

    </div>
  );
}