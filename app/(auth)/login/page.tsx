"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/component/Button';
import Input from '@/component/Input';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
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
    <section className="bg-yellow-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-yellow-800 mb-4 text-center">
          Welcome Back!
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Log in to continue your journey with us.
        </p>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-6">
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
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 w-full"
            >
              Log In
            </Button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs mt-6">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-yellow-600 hover:text-yellow-800"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;