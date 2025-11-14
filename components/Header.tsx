'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">
              VibeCode <span className="text-blue-600">Careers</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Trang chủ
            </Link>
            <Link
              href="/jobs"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Việc làm
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Về chúng tôi
            </Link>
            <Link
              href="/culture"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Văn hóa công ty
            </Link>
            <Link
              href="/talent-network"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Talent Network
            </Link>
            <Link
              href="/faq"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 font-medium transition">
              Đăng nhập
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
              Đăng ký
            </button>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700">
              <option value="vi">VI</option>
              <option value="en">EN</option>
            </select>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/jobs"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Việc làm
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Về chúng tôi
              </Link>
              <Link
                href="/culture"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Văn hóa công ty
              </Link>
              <Link
                href="/talent-network"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Talent Network
              </Link>
              <Link
                href="/faq"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button className="w-full text-left text-gray-700 hover:text-blue-600 font-medium">
                  Đăng nhập
                </button>
                <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  Đăng ký
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
