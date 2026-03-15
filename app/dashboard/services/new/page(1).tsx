"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { uploadImageToFreeImageHost } from '@/lib/upload';
import Image from 'next/image';

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });

  const isSvgUrl = (url: string) => {
    const value = url.trim().toLowerCase();
    return value.endsWith('.svg') || value.startsWith('data:image/svg+xml');
  };

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
      setFormData(prev => ({ ...prev, icon: url }));
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
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/dashboard/services');
      } else {
        alert('Failed to save service');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white min-h-screen flex flex-col">
      <section className="pb-20">
        <div className="max-w-[800px] mx-auto">
          <Link href="/dashboard/services" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          <h1 className="text-3xl font-bold text-neutral-900 mb-8">Add New Service</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Service Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-neutral-700 block">Icon</label>
              <div className="space-y-2 mb-4 p-4 border border-neutral-100 rounded-xl bg-neutral-50">
                  <div className="flex gap-2">
                    <input
                      placeholder="Icon URL or Upload File"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({...prev, icon: e.target.value}))}
                      className="flex-1 p-3 border border-neutral-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="cursor-pointer bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors inline-flex items-center gap-2">
                       <Upload className="w-4 h-4" />
                       {uploading ? 'Uploading...' : 'Upload Icon'}
                       <input
                         type="file"
                         className="hidden"
                         accept="image/*,image/svg+xml"
                         onChange={handleFileUpload}
                         disabled={uploading}
                       />
                     </label>
                  </div>
                  {formData.icon && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-200 mt-2">
                       <Image src={formData.icon} alt="Preview" fill className="object-contain p-2" sizes="64px" unoptimized={isSvgUrl(formData.icon)} />
                    </div>
                  )}
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-yellow hover:text-neutral-900 transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Publish Service'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
