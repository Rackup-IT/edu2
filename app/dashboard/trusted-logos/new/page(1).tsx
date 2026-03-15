"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { uploadImageToFreeImageHost } from '@/lib/upload';
import Image from 'next/image';

export default function NewTrustedLogoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    position: '',
    isActive: true,
  });

  const isSvgUrl = (url: string) => {
    const value = url.trim().toLowerCase();
    return value.endsWith('.svg') || value.startsWith('data:image/svg+xml');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    setUploading(true);
    try {
      const url = await uploadImageToFreeImageHost(file);
      setFormData((prev) => ({ ...prev, logo: url }));
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
      const payload: Record<string, unknown> = {
        name: formData.name,
        logo: formData.logo,
        isActive: formData.isActive,
      };
      if (formData.position.trim() !== '') payload.position = Number(formData.position);

      const res = await fetch('/api/trusted-logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/dashboard/trusted-logos');
      } else {
        alert('Failed to save logo');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving logo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white min-h-screen flex flex-col">
      <section className="pb-20">
        <div className="max-w-[800px] mx-auto">
          <Link href="/dashboard/trusted-logos" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Trusted Logos
          </Link>

          <h1 className="text-3xl font-bold text-neutral-900 mb-8">Add New Logo</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Company Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Position</label>
                <input name="position" type="number" value={formData.position} onChange={handleChange} placeholder="Auto" className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 text-brand-yellow rounded focus:ring-brand-yellow border-neutral-300"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-neutral-700">
                  Active (Show on site)
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-neutral-700 block">Logo</label>
              <div className="space-y-2 mb-4 p-4 border border-neutral-100 rounded-xl bg-neutral-50">
                <div className="flex gap-2">
                  <input
                    placeholder="Logo URL or Upload File"
                    value={formData.logo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
                    className="flex-1 p-3 border border-neutral-300 rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                    <input type="file" className="hidden" accept="image/*,image/svg+xml" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
                {formData.logo && (
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-white mt-2 border border-neutral-200 flex items-center justify-center">
                    <Image src={formData.logo} alt="Preview" fill className="object-contain p-2" sizes="128px" unoptimized={isSvgUrl(formData.logo)} />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-yellow hover:text-neutral-900 transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Publish Logo'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
