"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import apiClient from '@/lib/apiClient';

const Sidebar = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      router.push('/login');
    }
  };

  const links =
    role === "admin"
      ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/farmers", label: "Farmers" },
        { href: "/products", label: "Products" },
        { href: "/messages", label: "Messages" },
        { href: "/profile", label: "Profile" },
      ]
      : [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/my-products", label: "My Products" },
        {href: '/post-product', label: 'Post Product' },
        { href: "/message", label: "Messages" },
        { href: "/profile", label: "Profile" },
      ];

      console.log(role);
      

  return (
    <aside
      className={`bg-gray-800 z-50 text-white w-64 p-6 fixed h-full transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">FarmFresh</h2>
        <button onClick={toggle} className="lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.href} className="mb-4">
              <Link
                href={link.href}
                onClick={toggle}
                className={`block p-2 rounded ${pathname === link.href ? 'bg-gray-900' : ''
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute w-full bottom-0 pr-15 p-4 pl-0">
        <button
          onClick={handleLogout}
          className="w-full mb-4 lg:mb-6 bg-red-800 text-left block p-2 md:px-4 rounded text-white hover:bg-gray-900 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;