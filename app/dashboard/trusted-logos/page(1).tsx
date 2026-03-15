"use client";

import { useEffect, useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TrustedLogo {
  _id: string;
  name: string;
  logo: string;
  position?: number;
  isActive?: boolean;
}

const isSvgUrl = (url: string) => {
  const value = url.trim().toLowerCase();
  return value.endsWith('.svg') || value.startsWith('data:image/svg+xml');
};

export default function TrustedLogosDashboardPage() {
  const [logos, setLogos] = useState<TrustedLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const res = await fetch('/api/trusted-logos');
      const data = await res.json();
      if (data.success) setLogos(data.data);
    } catch (error) {
      console.error('Failed to fetch trusted logos', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLogo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this logo?')) return;

    try {
      const res = await fetch(`/api/trusted-logos/${id}`, { method: 'DELETE' });
      if (res.ok) fetchLogos();
    } catch (error) {
      console.error('Failed to delete logo', error);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900">Trusted Logos</h1>
          <Link
            href="/dashboard/trusted-logos/new"
            className="bg-brand-yellow text-neutral-900 px-6 py-3 rounded-full font-bold hover:bg-[--brand-yellow-hover] transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Logo
          </Link>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-neutral-600">Logo</th>
                  <th className="px-6 py-4 font-semibold text-neutral-600">Name</th>
                  <th className="px-6 py-4 font-semibold text-neutral-600">Position</th>
                  <th className="px-6 py-4 font-semibold text-neutral-600">Active</th>
                  <th className="px-6 py-4 font-semibold text-neutral-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                      Loading...
                    </td>
                  </tr>
                ) : logos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                      No logos found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  logos.map((logo) => (
                    <tr key={logo._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="relative w-20 h-12 rounded-lg bg-neutral-100 overflow-hidden flex items-center justify-center">
                          <Image src={logo.logo} alt={`${logo.name} logo`} fill className="object-contain p-1" sizes="80px" unoptimized={isSvgUrl(logo.logo)} />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-neutral-900">{logo.name}</td>
                      <td className="px-6 py-4 text-neutral-600">{logo.position ?? '-'}</td>
                      <td className="px-6 py-4 text-neutral-600">{logo.isActive === false ? 'No' : 'Yes'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <Link
                            href={`/dashboard/trusted-logos/${logo._id}`}
                            className="p-2 text-neutral-500 hover:text-brand-yellow transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deleteLogo(logo._id)}
                            className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
