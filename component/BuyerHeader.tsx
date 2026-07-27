"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

export default function BuyersHeader() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Products",
      href: "/buyers-view/products",
    },
    {
      name: "Farmers",
      href: "/buyers-view/farmers",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white text-xl">
            🌾
          </div>

          <div>
            <h2 className="text-xl font-bold text-green-700">
              FarmFresh
            </h2>

            <p className="text-xs text-slate-500">
              Fresh From Farm
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-slate-700 transition hover:text-green-600"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Search */}

        <div className="hidden xl:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              placeholder="Search products..."
              className="h-11 w-72 rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <Link
            href="/buyers-view/cart"
            className="relative rounded-full border p-3 hover:bg-slate-100"
          >
            <ShoppingCart className="h-5 w-5" />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              0
            </span>
          </Link>

          <Link
            href="/login"
            className="hidden rounded-full bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700 md:block"
          >
            Login
          </Link>

          {/* Mobile */}

          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 lg:hidden"
          >
            {open ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}

      {open && (
        <div className="border-t bg-white lg:hidden">

          <div className="space-y-2 p-5">

            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                placeholder="Search..."
                className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 outline-none"
              />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-green-50 hover:text-green-700"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/login"
              className="mt-3 flex items-center justify-center rounded-lg bg-green-600 py-3 font-medium text-white"
            >
              <User className="mr-2 h-4 w-4" />
              Login
            </Link>

          </div>

        </div>
      )}
    </header>
  );
}