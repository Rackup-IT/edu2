"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

interface Testimonial {
  _id: string;
  author: string;
  role: string;
  content: string;
}

export default function TestimonialsDashboardPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Failed to delete testimonial', error);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-900">Testimonials</h1>
            <Link href="/dashboard/testimonials/new" className="bg-brand-yellow text-neutral-900 px-6 py-3 rounded-full font-bold hover:bg-[--brand-yellow-hover] transition-colors inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Testimonial
            </Link>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-neutral-600">Author</th>
                    <th className="px-6 py-4 font-semibold text-neutral-600">Role</th>
                    <th className="px-6 py-4 font-semibold text-neutral-600">Content</th>
                    <th className="px-6 py-4 font-semibold text-neutral-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading...</td>
                    </tr>
                  ) : testimonials.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No testimonials found. Add one to get started.</td>
                    </tr>
                  ) : (
                    testimonials.map((t) => (
                      <tr key={t._id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-neutral-900">{t.author}</td>
                        <td className="px-6 py-4 text-neutral-600">{t.role}</td>
                        <td className="px-6 py-4 text-neutral-600 max-w-xs truncate">{t.content}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <Link
                              href={`/dashboard/testimonials/${t._id}`}
                              className="p-2 text-neutral-500 hover:text-brand-yellow transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => deleteTestimonial(t._id)}
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
