"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import apiClient from '@/lib/apiClient';
import { useCart } from '@/context/CartContext';
import Button from '@/component/Button';
import Spinner from '@/component/Spinner';

interface Farmer {
    _id: string;
    fullName: string;
    location?: string;
    email: string;
}

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    images: string[];
    location: string;
    farmer: Farmer;
}

const ProductDetailPage = () => {
    const params = useParams();
    const { id } = params;
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    setIsLoading(true);
                    const response = await apiClient.get(`/products/${id}`);
                    if (response.data.success) {
                        setProduct(response.data.product);
                        if (response.data.product.images.length > 0) {
                            setSelectedImage(response.data.product.images[0]);
                        }
                    } else {
                        throw new Error(response.data.message || 'Failed to fetch product');
                    }
                } catch (err: any) {
                    setError(err.message || 'An unexpected error occurred');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchProduct();
        }
    }, [id]);

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    }

    if (!product) {
        return <div className="text-center py-20">Product not found.</div>;
    }

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: product._id,
                name: product.title,
                price: product.price,
                image: product.images[0] || '/imgs/default-product.png',
            });
            alert(`${product.title} has been sent to your farmer!`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Image Gallery */}
                <div>
                    <div className="relative h-96 w-full mb-4 rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={selectedImage || '/imgs/default-product.png'}
                            alt={product.title}
                            layout="fill"
                            objectFit="cover"
                            className="transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="flex space-x-2">
                        {product.images.map((image, index) => (
                            <div
                                key={index}
                                className={`relative h-20 w-20 rounded-md cursor-pointer overflow-hidden border-2 ${selectedImage === image ? 'border-green-500' : 'border-transparent'}`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <Image
                                    src={image}
                                    alt={`${product.title} thumbnail ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
                    <p className="text-2xl font-semibold text-green-600 mb-4">${product.price.toFixed(2)}</p>
                    
                    <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div><span className="font-semibold">Category:</span> {product.category}</div>
                        <div><span className="font-semibold">Available Quantity:</span> {product.quantity}</div>
                        <div><span className="font-semibold">Location:</span> {product.location}</div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-400">
                         <h3 className="font-semibold text-lg mb-3">About the Farmer</h3>
                         <div className="flex items-center">
                            {/* You can add a farmer profile picture here later */}
                            <div>
                                <p className="font-bold">{product.farmer.fullName}</p>
                                <p className="text-gray-600 text-sm">{product.farmer.location}</p>
                            </div>
                         </div>
                    </div>
                    
                    <div className="mt-6">
                        <Button onClick={handleAddToCart} className="w-full">Message Farmer</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;