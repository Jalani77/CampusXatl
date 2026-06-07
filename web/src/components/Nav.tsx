"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Icon */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#1A7A6E" }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              {/* C arc */}
              <path
                d="M7 2.5C4.5 2.5 2.5 4.5 2.5 7.5C2.5 10.5 4.5 12.5 7 12.5"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
              {/* X */}
              <path d="M8.5 4L12 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M12 4L8.5 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight text-[15px]">
            Campus<span style={{ color: "#1A7A6E" }}>XATL</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/browse"
            className="px-3.5 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/sell"
            className="px-3.5 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Sell
          </Link>
          <Link
            href="/about"
            className="px-3.5 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/browse"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/sell"
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: "#1A7A6E" }}
          >
            Get the app
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 pb-4 pt-2 flex flex-col gap-1">
          <Link
            href="/browse"
            className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setOpen(false)}
          >
            Browse
          </Link>
          <Link
            href="/sell"
            className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setOpen(false)}
          >
            Sell
          </Link>
          <Link
            href="/about"
            className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/browse"
              className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/sell"
              className="px-3 py-2.5 text-sm font-medium text-white rounded-lg text-center transition-colors"
              style={{ backgroundColor: "#1A7A6E" }}
              onClick={() => setOpen(false)}
            >
              Get the app
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
