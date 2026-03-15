"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadImageToFreeImageHost } from "@/lib/upload";
import toast from "react-hot-toast";

interface SettingsData {
  logoUrl: string;
  companyName: string;
  footerText: string;
}

export default function SettingsDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<SettingsData>({
    logoUrl: "",
    companyName: "Forte Harbor Solution",
    footerText: "Leading Education Consultancy Service",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        if (data._id) {
          setFormData({
            logoUrl: data.logoUrl || "",
            companyName: data.companyName || "Forte Harbor Solution",
            footerText:
              data.footerText || "Leading Education Consultancy Service",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
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
    const toastId = toast.loading("Uploading logo...");

    try {
      const url = await uploadImageToFreeImageHost(file);

      setFormData((prev) => ({ ...prev, logoUrl: url }));
      toast.success("Logo uploaded successfully", { id: toastId });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo", { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Saving settings...");

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Settings updated successfully!", { id: toastId });
      } else {
        toast.error("Failed to update settings", { id: toastId });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings", { id: toastId });
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
          <h1 className="text-3xl font-bold text-neutral-900">
            Global Settings
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage logo, company name, and footer details
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-xl border border-neutral-200 shadow-sm"
      >
        {/* Logo Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Branding</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Company Logo
              </label>
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-neutral-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors h-[150px] relative ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-500 mb-2" />
                  </div>
                )}

                {formData.logoUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.logoUrl}
                      alt="Logo Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center text-neutral-500">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">Upload Logo (SVG/PNG)</span>
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Footer Slogan / Text
                </label>
                <textarea
                  name="footerText"
                  value={formData.footerText}
                  onChange={handleChange}
                  rows={3}
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
            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
