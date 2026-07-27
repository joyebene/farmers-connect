"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/component/Input';
import Button from '@/component/Button';
import apiClient from '@/lib/apiClient';

const PostProductPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    location: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole !== 'farmer') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please select at least one image for your product.');
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Upload images to Cloudinary
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const cloudinaryFormData = new FormData();
          cloudinaryFormData.append('file', image);
          cloudinaryFormData.append(
            'upload_preset',
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
          );

          const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`,
            {
              method: 'POST',
              body: cloudinaryFormData,
            }
          );
          const cloudinaryData = await cloudinaryRes.json();
          if (!cloudinaryData.secure_url) {
            throw new Error('One or more image uploads failed.');
          }
          return cloudinaryData.secure_url;
        })
      );

      // 2. Submit product to your backend API
      const productData = {
        ...formData,
        images: imageUrls,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      };

      await apiClient.post('/products/create', productData);

      alert('Product created successfully!');
      router.push('/products');
    } catch (error) {
      console.error('Failed to create product', error);
      alert('Failed to create product. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Create a New Product</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Product Title
          </label>
          <Input
            type="text"
            id="title"
            placeholder="e.g., Organic Tomatoes"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
            placeholder="Describe your product..."
            value={formData.description}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
              Price
            </label>
            <Input
              type="number"
              id="price"
              placeholder="e.g., 4.99"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
              Quantity
            </label>
            <Input
              type="number"
              id="quantity"
              placeholder="e.g., 100"
              value={formData.quantity}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <Input
              type="text"
              id="category"
              placeholder="e.g., Vegetables"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
              Location (Optional)
            </label>
            <Input
              type="text"
              id="location"
              placeholder="Defaults to your address"
              value={formData.location}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="images" className="block text-gray-700 text-sm font-bold mb-2">
            Product Images
          </label>
          <Input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}  className="bg-yellow-600 hover:bg-yellow-700">
          {isSubmitting ? 'Creating Product...' : 'Create Product'}
        </Button>
      </form>
    </div>
  );
};

export default PostProductPage;