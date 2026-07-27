"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/component/Input';
import Button from '@/component/Button';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'admin',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('role', data.user.role);
        router.push('/dashboard');
      } else {
        const data = await res.json();
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <section className="bg-green-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">
          Sow the Seeds of Your New Account
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Create an account to start your journey with us.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Full Name
            </label>
            <Input
              type="text"
              id="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              placeholder="you@yourfarm.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                className="mb-3"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                className="mb-3"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Phone Number
              </label>
              <Input
                type="tel"
                id="phone"
                placeholder="123-456-7890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="address"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Address
              </label>
              <Input
                type="text"
                id="address"
                placeholder="123 Farm Rd, Countryside"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" className="w-full">Get Growing</Button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 hover:text-green-800">
            Log in here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;