"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import Input from '@/component/Input';
import Spinner from '@/component/Spinner';

// Define the types for better type-checking
interface Farmer {
  _id: string;
  fullName: string;
  location?: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  farmer: Farmer;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const response = await apiClient.get("/products/all");

        if (response.data.success) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (err: any) {
        console.log("Using dummy products...", err);
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const results = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto md:px-6 py-8">
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search by product, description, or location..."
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 md:w-1/2 md:ml-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <Link href={`/buyers-view/products/${product._id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.images[0] || '/imgs/default-product.png'} // Fallback image
                      alt={product.title}
                      fill
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{product.title}</h3>
                    <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-2">{product.location}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Sold by: <span className="font-medium text-gray-700">{product.farmer.fullName}</span></p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;