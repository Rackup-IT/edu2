"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { uploadImageToFreeImageHost } from '@/lib/upload';

export default function NewTestimonialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    role: '',
    content: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    setUploading(true);
    try {
      const url = await uploadImageToFreeImageHost(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Ensure BLOB_READ_WRITE_TOKEN is set in .env.local');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/dashboard/testimonials');
      } else {
        alert('Failed to save testimonial');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white min-h-screen flex flex-col">
      <section className="pb-20">
        <div className="max-w-[800px] mx-auto">
          <Link href="/dashboard/testimonials" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Testimonials
          </Link>

          <h1 className="text-3xl font-bold text-neutral-900 mb-8">Add New Testimonial</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Author Name</label>
                <input name="author" value={formData.author} onChange={handleChange} required className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Role (e.g. CEO, TechStart)</label>
                <input name="role" value={formData.role} onChange={handleChange} required className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Content</label>
              <textarea name="content" value={formData.content} onChange={handleChange} required rows={4} className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-neutral-700 block">Author Image</label>
              <div className="space-y-2 mb-4 p-4 border border-neutral-100 rounded-xl bg-neutral-50">
                  <div className="flex gap-2">
                    <input
                      placeholder="Image URL or Upload File"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({...prev, image: e.target.value}))}
                      className="flex-1 p-3 border border-neutral-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="cursor-pointer bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors inline-flex items-center gap-2">
                       <Upload className="w-4 h-4" />
                       {uploading ? 'Uploading...' : 'Upload Image'}
                       <input
                         type="file"
                         className="hidden"
                         accept="image/*"
                         onChange={handleFileUpload}
                         disabled={uploading}
                       />
                     </label>
                  </div>
                  {formData.image && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-neutral-200 mt-2">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-yellow hover:text-neutral-900 transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Publish Testimonial'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
