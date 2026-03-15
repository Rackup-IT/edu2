"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadImageToFreeImageHost } from "@/lib/upload";
import toast from "react-hot-toast";

interface HeroData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  imageUrl: string;
  backgroundColor: string;
}

export default function HeroDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<HeroData>({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    imageUrl: "",
    backgroundColor: "#f6d36b",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch("/api/hero");
      if (response.ok) {
        const data = await response.json();
        // If data exists (not empty object), set it
        if (data._id) {
          setFormData({
            title: data.title || "",
            subtitle: data.subtitle || "",
            buttonText: data.buttonText || "",
            buttonLink: data.buttonLink || "",
            secondaryButtonText: data.secondaryButtonText || "",
            secondaryButtonLink: data.secondaryButtonLink || "",
            imageUrl: data.imageUrl || "",
            backgroundColor: data.backgroundColor || "#f6d36b",
          });
        } else {
          // Fallback default values matching current hardcoded site if DB is empty
          setFormData({
            title: "Empowering Your \n Digital Vision",
            subtitle: "Leading Education Consultancy Service",
            buttonText: "Book a Quote",
            buttonLink: "/consultation",
            secondaryButtonText: "Portfolio",
            secondaryButtonLink: "/portfolio",
            imageUrl: "/hero-illustration-v2.png",
            backgroundColor: "#f6d36b",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
      toast.error("Failed to load hero settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const url = await uploadImageToFreeImageHost(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Image uploaded successfully", { id: toastId });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      setUploading(false);
      // Reset input to allow same file selection again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Saving changes...");

    try {
      const response = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Hero section updated successfully!", { id: toastId });
      } else {
        toast.error("Failed to update hero section", { id: toastId });
      }
    } catch (error) {
      console.error("Error saving hero data:", error);
      toast.error("Error saving hero data", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-neutral-500 flex justify-center items-center">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Hero Section</h1>
          <p className="text-neutral-500 mt-1">
            Manage the main landing section content
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-xl border border-neutral-200 shadow-sm"
      >
        {/* Visual Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Visuals</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Background Color (Hex)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="backgroundColor"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                  className="h-10 w-10 p-0 border-0 rounded cursor-pointer"
                />
                <input
                  type="text"
                  name="backgroundColor"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Illustration Image
              </label>
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-neutral-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors h-[200px] relative ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {uploading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-500 mb-2" />
                    <span className="text-sm font-medium text-neutral-500">
                      Uploading...
                    </span>
                  </div>
                ) : null}

                {formData.imageUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.imageUrl}
                      alt="Hero Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center text-neutral-500">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Text Content</h3>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Title
            </label>
            <textarea
              name="title"
              value={formData.title}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-mono text-sm"
              placeholder="Use \n for line breaks"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Tip: Use <code>\n</code> or <code>&lt;br /&gt;</code> for line
              breaks
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Actions</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 uppercase">
                Primary Button
              </h4>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Link
                </label>
                <input
                  type="text"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 uppercase">
                Secondary Button
              </h4>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Text
                </label>
                <input
                  type="text"
                  name="secondaryButtonText"
                  value={formData.secondaryButtonText}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Link
                </label>
                <input
                  type="text"
                  name="secondaryButtonLink"
                  value={formData.secondaryButtonLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
