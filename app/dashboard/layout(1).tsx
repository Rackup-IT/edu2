"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Globe, Layers, Package, MessageSquareQuote, FileText, BadgeCheck, Mail, LogOut } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import toast from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        toast.success("Logged out successfully");
    } catch (error) {
        toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-white font-sans">
      <Toaster position="top-right" />
      {/* Sidebar (Right on Desktop, Top on Mobile) */}
      <aside className="w-full md:w-72 bg-neutral-50 md:border-l border-b md:border-b-0 border-neutral-200 p-6 flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="mb-6 md:mb-8 flex justify-between md:block items-center">
           <div>
             <h2 className="text-xl font-bold text-neutral-900">Dashboard</h2>
             <p className="text-sm text-neutral-500">Manage your site</p>
           </div>
           {/* Mobile Menu Toggle could go here if needed, but keeping it simple */}
        </div>

        <nav className="space-y-2">
           <Link
             href="/dashboard/hero"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/hero')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <LayoutDashboard className="w-5 h-5" />
             Hero Section
           </Link>

           <Link
             href="/dashboard/theme"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/theme')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <LayoutDashboard className="w-5 h-5" />
             Theme Settings
           </Link>

           <Link
             href="/dashboard/settings"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/settings')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <LayoutDashboard className="w-5 h-5" />
             Global Settings
           </Link>

           <Link
             href="/dashboard/about"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/about')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <LayoutDashboard className="w-5 h-5" />
             About Page
           </Link>

           <Link
             href="/dashboard/portfolio"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/portfolio')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <LayoutDashboard className="w-5 h-5" />
             Portfolio
           </Link>

           <Link
             href="/dashboard/services"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/services')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <Layers className="w-5 h-5" />
             Services
           </Link>

           <Link
             href="/dashboard/products"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/products')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <Package className="w-5 h-5" />
             Products
           </Link>

           <Link
             href="/dashboard/testimonials"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/testimonials')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <MessageSquareQuote className="w-5 h-5" />
             Testimonials
           </Link>

           <Link
             href="/dashboard/blog"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/blog')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <FileText className="w-5 h-5" />
             Blog
           </Link>

           <Link
             href="/dashboard/trusted-logos"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/trusted-logos')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <BadgeCheck className="w-5 h-5" />
             Trusted Logos
           </Link>

           <Link
             href="/dashboard/subscribers"
             className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
               pathname.includes('/dashboard/subscribers')
                 ? 'bg-brand-yellow text-neutral-900'
                 : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
             }`}
           >
             <Mail className="w-5 h-5" />
             Subscribers
           </Link>

           <Link
             href="/"
             className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-neutral-600 hover:bg-neutral-100 hover:text-black transition-colors"
           >
             <Globe className="w-5 h-5" />
             View Live Site
           </Link>

           <button
             onClick={handleLogout}
             className="flex w-full items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
           >
             <LogOut className="w-5 h-5" />
             Logout
           </button>
        </nav>

        <div className="mt-6 md:mt-auto pt-6 border-t border-neutral-200 hidden md:block">
           <div className="flex items-center gap-3 text-neutral-500">
              <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-600">
                A
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900">Admin</div>
                <div className="text-xs">admin@rackup.it</div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content (Left on Desktop, Bottom on Mobile) */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
}
