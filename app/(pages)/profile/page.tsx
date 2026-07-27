"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUserCircle, FaBoxOpen, FaSignOutAlt, FaCog, FaShieldAlt } from 'react-icons/fa';
import apiClient from '@/lib/apiClient';
import Button from '@/component/Button';
import Spinner from '@/component/Spinner';
import Input from '@/component/Input';
import Link from 'next/link';

interface User {
    _id: string;
    fullName: string;
    email: string;
    role: 'farmer' | 'customer';
    address?: string;
}

interface Product {
    _id: string;
    title: string;
    price: number;
    images: string[];
}

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                // Fetch user profile
                const userResponse = await apiClient.get('/auth/me');
                if (userResponse.data.success) {
                    setUser(userResponse.data.user);

                    // If user is a farmer, fetch their products
                    if (userResponse.data.user.role === 'farmer') {
                        const productsResponse = await apiClient.get('/products/my-products');
                        if (productsResponse.data.success) {
                            setProducts(productsResponse.data.products);
                        } else {
                            throw new Error(productsResponse.data.message || 'Failed to fetch products');
                        }
                    }
                } else {
                    throw new Error(userResponse.data.message || 'Failed to fetch profile');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
                // If unauthorized, redirect to login
                if (err.response?.status === 401) {
                    router.push('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
    };

    // Modal open handlers
    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    // API call handlers
    const handleUpdateProduct = async (updatedProduct: Product) => {
        try {
            const response = await apiClient.put(`/products/${updatedProduct._id}`, updatedProduct);
            if (response.data.success) {
                setProducts(products.map(p => p._id === updatedProduct._id ? response.data.product : p));
                setIsEditModalOpen(false);
                alert('Product updated successfully!');
            } else {
                throw new Error(response.data.message || 'Failed to update product');
            }
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        try {
            const response = await apiClient.delete(`/products/${selectedProduct._id}`);
            if (response.data.success) {
                setProducts(products.filter(p => p._id !== selectedProduct._id));
                setIsDeleteModalOpen(false);
                alert('Product deleted successfully!');
            } else {
                throw new Error(response.data.message || 'Failed to delete product');
            }
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    if (isLoading) {
        return <Spinner fullScreen />;
    }
    
    if (error && !user) {
        return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    }
    
    if (!user) {
        return <div className="text-center py-20">User not found. You may need to log in.</div>;
    }

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto py-8 md:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Profile Card */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <FaUserCircle className="text-gray-300 w-full h-full" />
                                </div>
                                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                                <p className="text-gray-500 capitalize">{user.role}</p>
                                <p className="text-sm text-gray-600 mt-2">{user.email}</p>
                                <p className="text-sm text-gray-600">{user.address}</p>
                                
                                <div className="mt-6 space-y-2">
                                    <Button className="w-full flex items-center justify-center gap-2">
                                        <FaCog /> Edit Profile
                                    </Button>
                                    <Button  className="w-full flex items-center justify-center gap-2">
                                        <FaShieldAlt /> Change Password
                                    </Button>
                                    <Button onClick={handleLogout} className="w-full flex items-center justify-center gap-2">
                                        <FaSignOutAlt /> Logout
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Dynamic Content */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                {user.role === 'farmer' ? (
                                    <FarmerDashboard products={products} onEdit={openEditModal} onDelete={openDeleteModal} />
                                ) : (
                                    <CustomerDashboard />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isEditModalOpen && selectedProduct && (
                <EditModal 
                    product={selectedProduct} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={handleUpdateProduct} 
                />
            )}
            {isDeleteModalOpen && selectedProduct && (
                <DeleteConfirmationModal 
                    productName={selectedProduct.title}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteProduct}
                />
            )}
        </>
    );
};

const FarmerDashboard = ({ products, onEdit, onDelete }: { products: Product[], onEdit: (product: Product) => void, onDelete: (product: Product) => void }) => (
    <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><FaBoxOpen /> My Products</h3>
        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                    <Link href={`/products/${product._id}`} key={product._id} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative h-40 bg-gray-200">
                            <Image src={product.images[0] || '/imgs/default-product.png'} alt={product.title} layout="fill" objectFit="cover" />
                        </div>
                        <div className="p-4">
                            <h4 className="font-semibold truncate">{product.title}</h4>
                            <p className="text-green-600">${product.price.toFixed(2)}</p>
                            <div className="mt-3 flex justify-between text-xs">
                                <button onClick={() => onEdit(product)} className="text-blue-500 hover:underline">Edit</button>
                                <button onClick={() => onDelete(product)} className="text-red-500 hover:underline">Delete</button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-500 py-8">You haven&apos;t posted any products yet.</p>
        )}
    </div>
);

const CustomerDashboard = () => (
    <div>
        <h3 className="text-2xl font-bold mb-6">My Order History</h3>
        <p className="text-center text-gray-500 py-8">You have no past orders.</p>
        {/* Order history items would be mapped here */}
    </div>
);

// Edit Modal Component
const EditModal = ({ product, onClose, onSave }: { product: Product, onClose: () => void, onSave: (product: Product) => void }) => {
    const [formData, setFormData] = useState(product);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <Input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <Input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea aria-label='description' name="description" value={(formData as any).description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button"  onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ productName, onClose, onConfirm }: { productName: string, onClose: () => void, onConfirm: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete <strong>{productName}</strong>&apos;? This action cannot be undone.</p>
            <div className="flex justify-end gap-4 mt-6">
                <Button type="button" onClick={onClose}>Cancel</Button>
                <Button type="button" onClick={onConfirm}>Delete</Button>
            </div>
        </div>
    </div>
);

export default ProfilePage;