"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { uploadImageToFreeImageHost } from '@/lib/upload';

export default function NewPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    liveUrl: '',
    category: '',
    year: new Date().getFullYear().toString(),
    description: '',
    challenge: '',
    solution: '',
    images: [''], // Start with one image field
    results: [{ label: '', value: '' }], // Start with one result
    size: 'normal',
    isFeatured: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, field: 'images', value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    setUploading(true);
    try {
      const url = await uploadImageToFreeImageHost(file);

      handleArrayChange(index, 'images', url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Ensure BLOB_READ_WRITE_TOKEN is set in .env.local');
    } finally {
      setUploading(false);
    }
  };

  const addArrayItem = (field: 'images') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleResultChange = (index: number, key: 'label' | 'value', value: string) => {
    const newResults = [...formData.results];
    newResults[index][key] = value;
    setFormData(prev => ({ ...prev, results: newResults }));
  };

  const addResult = () => {
    setFormData(prev => ({ ...prev, results: [...prev.results, { label: '', value: '' }] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty images/results
      const payload = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        results: formData.results.filter(r => r.label && r.value)
      };

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to save portfolio');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white min-h-screen flex flex-col">
      <section className="pb-20">
        <div className="max-w-[800px] mx-auto">
          <Link href="/dashboard/portfolio" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>

          <h1 className="text-3xl font-bold text-neutral-900 mb-8">Add New Portfolio</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Project Title</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Client Name</label>
                <input name="client" value={formData.client} onChange={handleChange} required className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Category</label>
                <input name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Year</label>
                <input name="year" value={formData.year} onChange={handleChange} className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Live Site URL</label>
                <input name="liveUrl" placeholder="https://example.com" value={formData.liveUrl} onChange={handleChange} className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                 <input
                   type="checkbox"
                   id="isFeatured"
                   name="isFeatured"
                   checked={formData.isFeatured}
                   onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                   className="w-5 h-5 text-brand-yellow rounded focus:ring-brand-yellow border-neutral-300"
                 />
                 <label htmlFor="isFeatured" className="text-sm font-medium text-neutral-700">Featured Project (Show on Home Page)</label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">The Challenge</label>
              <textarea name="challenge" value={formData.challenge} onChange={handleChange} required rows={4} className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">The Solution</label>
              <textarea name="solution" value={formData.solution} onChange={handleChange} required rows={4} className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none" />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-neutral-700 block">Key Results (Stats)</label>
              {formData.results.map((res, idx) => (
                <div key={idx} className="flex gap-4">
                  <input placeholder="Label (e.g. Sales Increase)" value={res.label} onChange={(e) => handleResultChange(idx, 'label', e.target.value)} className="w-1/2 p-3 border border-neutral-300 rounded-lg" />
                  <input placeholder="Value (e.g. +50%)" value={res.value} onChange={(e) => handleResultChange(idx, 'value', e.target.value)} className="w-1/2 p-3 border border-neutral-300 rounded-lg" />
                </div>
              ))}
              <button type="button" onClick={addResult} className="text-sm text-brand-yellow font-bold hover:underline">+ Add Result</button>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-neutral-700 block">Images</label>
              {formData.images.map((img, idx) => (
                <div key={idx} className="space-y-2 mb-4 p-4 border border-neutral-100 rounded-xl bg-neutral-50">
                  <div className="flex gap-2">
                    <input
                      placeholder="Image URL or Upload File"
                      value={img}
                      onChange={(e) => handleArrayChange(idx, 'images', e.target.value)}
                      className="flex-1 p-3 border border-neutral-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="cursor-pointer bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors inline-flex items-center gap-2">
                       <Upload className="w-4 h-4" />
                       {uploading ? 'Uploading...' : 'Upload File'}
                       <input
                         type="file"
                         className="hidden"
                         accept="image/*,video/*"
                         onChange={(e) => handleFileUpload(e, idx)}
                         disabled={uploading}
                       />
                     </label>
                     <span className="text-xs text-neutral-500">Supported: Images, Videos</span>
                  </div>
                  {img && (
                    <div className="relative aspect-video w-32 rounded-lg overflow-hidden bg-neutral-200 mt-2">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('images')} className="text-sm text-brand-yellow font-bold hover:underline">+ Add Another Image</button>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Card Size</label>
                <select name="size" value={formData.size} onChange={handleChange} className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none">
                  <option value="normal">Normal</option>
                  <option value="large">Large (Wide)</option>
                  <option value="tall">Tall</option>
                </select>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-yellow hover:text-neutral-900 transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Publish Portfolio'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
