"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ThemeData {
  primaryColor: string;
  primaryHoverColor: string;
  secondaryColor: string;
  backgroundColor: string;
  foregroundColor: string;
}

export default function ThemeDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ThemeData>({
    primaryColor: "#f6d36b",
    primaryHoverColor: "#eac45a",
    secondaryColor: "#000000",
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
  });

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await fetch("/api/theme");
      if (response.ok) {
        const data = await response.json();
        if (data._id) {
          setFormData({
            primaryColor: data.primaryColor || "#f6d36b",
            primaryHoverColor: data.primaryHoverColor || "#eac45a",
            secondaryColor: data.secondaryColor || "#000000",
            backgroundColor: data.backgroundColor || "#ffffff",
            foregroundColor: data.foregroundColor || "#000000",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching theme:", error);
      toast.error("Failed to load theme settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Updating theme...");

    try {
      const response = await fetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Theme updated successfully! Refreshing...", { id: toastId });
        // Refresh the page to see changes (since the layout needs to re-fetch)
        setTimeout(() => {
            window.location.reload();
        }, 1500);
      } else {
        toast.error("Failed to update theme", { id: toastId });
      }
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Error saving theme", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-neutral-500 flex justify-center items-center"><Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Theme Settings</h1>
          <p className="text-neutral-500 mt-1">Customize the global look and feel of your application</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Primary Color (Brand)</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleChange}
                        className="h-12 w-12 p-1 border border-neutral-200 rounded-lg cursor-pointer"
                    />
                    <input
                        type="text"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-mono uppercase"
                    />
                </div>
                <p className="text-xs text-neutral-500">Used for buttons, highlights, and the hero section background.</p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Primary Hover Color</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        name="primaryHoverColor"
                        value={formData.primaryHoverColor}
                        onChange={handleChange}
                        className="h-12 w-12 p-1 border border-neutral-200 rounded-lg cursor-pointer"
                    />
                    <input
                        type="text"
                        name="primaryHoverColor"
                        value={formData.primaryHoverColor}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-mono uppercase"
                    />
                </div>
                <p className="text-xs text-neutral-500">Hover state color for primary buttons.</p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Background Color</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        name="backgroundColor"
                        value={formData.backgroundColor}
                        onChange={handleChange}
                        className="h-12 w-12 p-1 border border-neutral-200 rounded-lg cursor-pointer"
                    />
                    <input
                        type="text"
                        name="backgroundColor"
                        value={formData.backgroundColor}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-mono uppercase"
                    />
                </div>
                 <p className="text-xs text-neutral-500">The main background color of the site.</p>
            </div>

             <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Foreground Color (Text)</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        name="foregroundColor"
                        value={formData.foregroundColor}
                        onChange={handleChange}
                        className="h-12 w-12 p-1 border border-neutral-200 rounded-lg cursor-pointer"
                    />
                    <input
                        type="text"
                        name="foregroundColor"
                        value={formData.foregroundColor}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-mono uppercase"
                    />
                </div>
                 <p className="text-xs text-neutral-500">The main text color.</p>
            </div>

             <div className="space-y-2 opacity-50 pointer-events-none">
                <label className="block text-sm font-medium text-neutral-700">Secondary Color (Optional)</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleChange}
                        className="h-12 w-12 p-1 border border-neutral-200 rounded-lg cursor-pointer"
                    />
                    <input
                        type="text"
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-mono uppercase"
                    />
                </div>
                 <p className="text-xs text-neutral-500">Currently unused, reserved for future expansion.</p>
            </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-100">
            <button
                type="submit"
                disabled={saving}
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
