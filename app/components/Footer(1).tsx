"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

interface FooterProps {
  logoUrl?: string;
  companyName?: string;
  footerText?: string;
}

export default function Footer({
  logoUrl,
  companyName,
  footerText,
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isValidEmail = useMemo(() => {
    const value = email.trim();
    if (value.length === 0) return false;
    if (value.length > 254) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, [email]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail || submitting) return;

    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        const message =
          typeof data?.error === "string" ? data.error : "Failed to subscribe";
        setResult({ type: "error", message });
        return;
      }

      setEmail("");
      setResult({
        type: "success",
        message: data?.alreadySubscribed
          ? "You’re already subscribed."
          : "Subscribed successfully.",
      });
    } catch {
      setResult({ type: "error", message: "Failed to subscribe" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-neutral-900 text-white pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-24 mb-20">
          <div className="lg:col-span-4">
            <Logo light url={logoUrl} companyName={companyName} />
            <p className="mt-8 text-neutral-400 leading-relaxed max-w-sm">
              {footerText ||
                "Empowering businesses with innovative digital solutions. We build software that matters."}
            </p>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-lg font-medium mb-8">Company</h4>
            <ul className="space-y-4 text-neutral-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/consultation"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  Our Team
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-lg font-medium mb-8">Services</h4>
            <ul className="space-y-4 text-neutral-400">
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  University Admissions
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Visa Consultancy
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Scholarship Support
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Career Counseling
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-lg font-medium mb-8">
              Subscribe to our newsletter
            </h4>
            <form
              className="flex flex-col sm:flex-row gap-4"
              onSubmit={onSubmit}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="bg-neutral-800 border border-neutral-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-brand-yellow flex-1"
              />
              <button
                type="submit"
                disabled={!isValidEmail || submitting}
                className="bg-brand-yellow text-neutral-900 px-8 py-4 font-medium rounded-lg hover:bg-(--brand-yellow-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Subscribe
              </button>
            </form>
            {result ? (
              <div
                className={`mt-4 text-sm ${
                  result.type === "success"
                    ? "text-brand-yellow"
                    : "text-red-300"
                }`}
              >
                {result.message}
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-500 text-sm">
          <p className="flex-1 text-center md:text-left">
            © {new Date().getFullYear()}{" "}
            {companyName || "Forte Harbor Solution"}. All rights reserved.
          </p>

          <div className="flex-1 text-center">
            <a 
              href="https://www.rackupit.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Developed by Rackup IT solution
            </a>
          </div>

          <div className="flex gap-8 flex-1 justify-center md:justify-end">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
