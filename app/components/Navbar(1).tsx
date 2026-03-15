"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

interface NavbarProps {
  transparent?: boolean;
  logoUrl?: string;
  companyName?: string;
}

export default function Navbar({
  transparent = false,
  logoUrl,
  companyName,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`w-full transition-colors duration-300 ${transparent ? "bg-transparent" : "bg-white/95 backdrop-blur-md shadow-sm"}`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-4">
        <div className="flex justify-between items-center">
          {/* Logo on Left */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <Logo url={logoUrl} companyName={companyName} />
            </Link>
          </div>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center justify-center gap-8">
            <Link
              href="/services"
              className="text-neutral-600 font-medium hover:text-black transition-colors"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="text-neutral-600 font-medium hover:text-black transition-colors"
            >
              Our Team
            </Link>
            <Link
              href="/blog"
              className="text-neutral-600 font-medium hover:text-black transition-colors"
            >
              Blog
            </Link>
          </div>

          {/* Right Section (CTA & Mobile Menu) */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden md:block">
              <Link
                href="/consultation"
                className="bg-neutral-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-neutral-800 transition-colors"
              >
                Book a Quote
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-neutral-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 absolute left-0 right-0 top-full shadow-lg p-6 flex flex-col gap-4 z-50">
          <Link
            href="/services"
            className="text-neutral-600 font-medium text-lg py-2 border-b border-neutral-50 hover:text-black"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/about"
            className="text-neutral-600 font-medium text-lg py-2 border-b border-neutral-50 hover:text-black"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Our Team
          </Link>
          <Link
            href="/blog"
            className="text-neutral-600 font-medium text-lg py-2 border-b border-neutral-50 hover:text-black"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/consultation"
            className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-neutral-800 transition-colors mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
