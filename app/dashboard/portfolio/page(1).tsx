"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

interface Portfolio {
  _id: string;
  title: string;
  client: string;
  category: string;
}

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      if (data.success) {
        setPortfolios(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch portfolios', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePortfolio = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchPortfolios();
      }
    } catch (error) {
      console.error('Failed to delete portfolio', error);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-900">Portfolio</h1>
            <Link href="/dashboard/portfolio/new" className="bg-brand-yellow text-neutral-900 px-6 py-3 rounded-full font-bold hover:bg-[--brand-yellow-hover] transition-colors inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Portfolio
            </Link>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-neutral-600">Title</th>
                    <th className="px-6 py-4 font-semibold text-neutral-600">Client</th>
                    <th className="px-6 py-4 font-semibold text-neutral-600">Category</th>
                    <th className="px-6 py-4 font-semibold text-neutral-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading...</td>
                    </tr>
                  ) : portfolios.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No portfolios found. Add one to get started.</td>
                    </tr>
                  ) : (
                    portfolios.map((portfolio) => (
                      <tr key={portfolio._id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-neutral-900">{portfolio.title}</td>
                        <td className="px-6 py-4 text-neutral-600">{portfolio.client}</td>
                        <td className="px-6 py-4 text-neutral-600">{portfolio.category}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <Link
                              href={`/dashboard/portfolio/${portfolio._id}`}
                              className="p-2 text-neutral-500 hover:text-brand-yellow transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => deletePortfolio(portfolio._id)}
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
