// ============================================================
// BUYERS FOOTER
// ============================================================

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function BuyersFooter() {
  return (
    <footer className="bg-green-900 text-white mt-20">
      {/* Top Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              🌾 FarmFresh
            </h2>

            <p className="text-green-100 leading-7">
              FarmFresh connects buyers directly with trusted local farmers,
              making it easier to purchase fresh agricultural products while
              supporting local farming communities.
            </p>

            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-green-700 flex items-center justify-center hover:bg-green-600 transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="h-10 w-10 rounded-full bg-green-700 flex items-center justify-center hover:bg-green-600 transition"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="h-10 w-10 rounded-full bg-green-700 flex items-center justify-center hover:bg-green-600 transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="h-10 w-10 rounded-full bg-green-700 flex items-center justify-center hover:bg-green-600 transition"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-green-100">
              <li>
                <Link
                  href="/"
                  className="hover:text-yellow-400 transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/buyers-view/products"
                  className="hover:text-yellow-400 transition"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  href="/buyers-view/farmers"
                  className="hover:text-yellow-400 transition"
                >
                  Farmers
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="hover:text-yellow-400 transition"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="hover:text-yellow-400 transition"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Customer Support
            </h3>

            <ul className="space-y-3 text-green-100">
              <li>
                <Link
                  href="#"
                  className="hover:text-yellow-400 transition"
                >
                  Help Center
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="hover:text-yellow-400 transition"
                >
                  Frequently Asked Questions
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="hover:text-yellow-400 transition"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="hover:text-yellow-400 transition"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="hover:text-yellow-400 transition"
                >
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Contact Us
            </h3>

            <div className="space-y-4 text-green-100">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-yellow-400 mt-1 shrink-0" />
                <span>
                  Lagos, Nigeria
                </span>
              </div>

              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-yellow-400 mt-1 shrink-0" />
                <span>
                  +234 800 123 4567
                </span>
              </div>

              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-yellow-400 mt-1 shrink-0" />
                <span>
                  support@farmfresh.com
                </span>
              </div>

              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-yellow-400 mt-1 shrink-0" />
                <span>
                  Monday - Saturday
                  <br />
                  8:00 AM - 6:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-green-800">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-green-200">
          <p>
            © {new Date().getFullYear()} FarmFresh. All Rights Reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="#"
              className="hover:text-yellow-400"
            >
              Privacy
            </Link>

            <Link
              href="#"
              className="hover:text-yellow-400"
            >
              Terms
            </Link>

            <Link
              href="#"
              className="hover:text-yellow-400"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}