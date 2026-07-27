"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import Spinner from "@/component/Spinner";
import Link from "next/link";
import Image from "next/image";
import Button from "@/component/Button";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  category: string;
  location: string;
}

export default function FarmerProductsPage() {
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [farmerName, setFarmerName] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(
        `/farmers/${params.id}/products`
      );

      if (response.data.success) {
        setProducts(response.data.products);

        if (response.data.products.length > 0) {
          setFarmerName(
            response.data.products[0].farmer.fullName
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
  <div className="container mx-auto py-10">

    <h1 className="mb-8 text-4xl font-bold">
      {farmerName}&apos;s Products
    </h1>

    {products.length === 0 ? (
      <div className="text-center py-20">

        No products available.

      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {products.map((product) => (
          <div
            key={product._id}
            className="rounded-xl border bg-white overflow-hidden shadow-sm"
          >
            <Image
              src={
                product.images[0] ||
                "/imgs/default-product.png"
              }
              alt={product.title}
              width={400}
              height={300}
              className="h-56 w-full object-cover"
            />

            <div className="p-5">

              <h3 className="font-bold text-lg">
                {product.title}
              </h3>

              <p className="text-green-600 font-semibold mt-2">
                ${product.price}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                {product.location}
              </p>

              <Link
                href={`buyers-view/products/${product._id}`}
              >
                <Button className="w-full mt-4">
                  View Product
                </Button>
              </Link>

            </div>
          </div>
        ))}

      </div>
    )}
  </div>
);
}