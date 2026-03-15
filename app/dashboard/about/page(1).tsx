"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Plus, Trash2, Loader2 } from "lucide-react";
import { uploadImageToFreeImageHost } from "@/lib/upload";
import toast from "react-hot-toast";

interface Stat {
  value: string;
  label: string;
}

interface Value {
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

interface AboutData {
  title: string;
  titleHighlight: string;
  description: string;
  heroImageUrl: string;
  stats: Stat[];
  values: Value[];
  team: TeamMember[];
}

// Union type for the items that can be added
type AboutItem = Stat | Value | TeamMember;

export default function AboutDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  // Track uploading state for each team member by index
  const [uploadingTeamMember, setUploadingTeamMember] = useState<number | null>(
    null,
  );

  const [formData, setFormData] = useState<AboutData>({
    title: "",
    titleHighlight: "",
    description: "",
    heroImageUrl: "",
    stats: [],
    values: [],
    team: [],
  });

  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const teamImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/about");
      if (response.ok) {
        const data = await response.json();
        if (data._id) {
          setFormData({
            title: data.title || "",
            titleHighlight: data.titleHighlight || "",
            description: data.description || "",
            heroImageUrl: data.heroImageUrl || "",
            stats: data.stats || [],
            values: data.values || [],
            team: data.team || [],
          });
        } else {
          // Defaults if empty
          setFormData({
            title: "We build software",
            titleHighlight: "that matters.",
            description:
              "Forte Harbor Solution is a global software agency dedicated to helping businesses transform their digital presence.",
            heroImageUrl:
              "https://placehold.co/1000x1000/neutral-900/ffffff?text=Our+Office",
            stats: [
              { value: "100+", label: "Projects Delivered" },
              { value: "50+", label: "Expert Developers" },
            ],
            values: [
              {
                title: "Innovation First",
                description:
                  "We constantly explore new technologies to provide cutting-edge solutions.",
              },
            ],
            team: [],
          });
        }
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      toast.error("Failed to load about page settings");
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

  // Helper for array updates
  const updateItem = (
    section: keyof Pick<AboutData, "stats" | "values" | "team">,
    index: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => {
      // Create a shallow copy of the array
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newArray = [...(prev[section] as any[])];
      // Update the specific item
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const addItem = (
    section: keyof Pick<AboutData, "stats" | "values" | "team">,
    initialItem: AboutItem,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] as AboutItem[]), initialItem],
    }));
  };

  const removeItem = (
    section: keyof Pick<AboutData, "stats" | "values" | "team">,
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: (prev[section] as AboutItem[]).filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isTeam: boolean,
    index?: number,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (isTeam && typeof index === "number") {
      setUploadingTeamMember(index);
    } else {
      setUploadingHero(true);
    }

    const toastId = toast.loading("Uploading image...");

    try {
      const url = await uploadImageToFreeImageHost(file);

      if (isTeam && typeof index === "number") {
        updateItem("team", index, "imageUrl", url);
      } else {
        setFormData((prev) => ({ ...prev, heroImageUrl: url }));
      }
      toast.success("Image uploaded", { id: toastId });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      if (isTeam && typeof index === "number") {
        setUploadingTeamMember(null);
        if (teamImageInputRefs.current[index])
          teamImageInputRefs.current[index]!.value = "";
      } else {
        setUploadingHero(false);
        if (heroImageInputRef.current) heroImageInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Saving changes...");

    try {
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("About page updated successfully!", { id: toastId });
      } else {
        toast.error("Failed to update", { id: toastId });
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving data", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-neutral-500 flex justify-center items-center">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading settings...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">About Page</h1>
          <p className="text-neutral-500 mt-1">
            Manage content for the About Us page
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Hero Section */}
        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Hero Section</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Main Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Highlight Text (Gray)
              </label>
              <input
                type="text"
                name="titleHighlight"
                value={formData.titleHighlight}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Hero Image
            </label>
            <div
              onClick={() =>
                !uploadingHero && heroImageInputRef.current?.click()
              }
              className={`border-2 border-dashed border-neutral-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 h-[200px] relative ${uploadingHero ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {uploadingHero && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-10">
                  <Loader2 className="w-8 h-8 animate-spin text-neutral-500 mb-2" />
                </div>
              )}
              {formData.heroImageUrl ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.heroImageUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="text-center text-neutral-500">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">Upload Hero Image</span>
                </div>
              )}
            </div>
            <input
              ref={heroImageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, false)}
              className="hidden"
              disabled={uploadingHero}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">Stats</h3>
            <button
              type="button"
              onClick={() => addItem("stats", { value: "", label: "" })}
              className="text-sm bg-neutral-100 px-3 py-1 rounded-md hover:bg-neutral-200 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </div>
          <div className="space-y-4">
            {formData.stats.map((stat, index) => (
              <div key={index} className="flex gap-4 items-start">
                <input
                  type="text"
                  placeholder="Value (e.g. 100+)"
                  value={stat.value}
                  onChange={(e) =>
                    updateItem("stats", index, "value", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Projects)"
                  value={stat.label}
                  onChange={(e) =>
                    updateItem("stats", index, "label", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeItem("stats", index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">Core Values</h3>
            <button
              type="button"
              onClick={() => addItem("values", { title: "", description: "" })}
              className="text-sm bg-neutral-100 px-3 py-1 rounded-md hover:bg-neutral-200 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Value
            </button>
          </div>
          <div className="space-y-6">
            {formData.values.map((val, index) => (
              <div
                key={index}
                className="flex gap-4 items-start border p-4 rounded-lg bg-neutral-50/50"
              >
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    placeholder="Value Title"
                    value={val.title}
                    onChange={(e) =>
                      updateItem("values", index, "title", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    placeholder="Description"
                    rows={2}
                    value={val.description}
                    onChange={(e) =>
                      updateItem("values", index, "description", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem("values", index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">Team Members</h3>
            <button
              type="button"
              onClick={() =>
                addItem("team", { name: "", role: "", imageUrl: "" })
              }
              className="text-sm bg-neutral-100 px-3 py-1 rounded-md hover:bg-neutral-200 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.team.map((member, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg bg-neutral-50/50 space-y-3"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm text-neutral-500">
                    Member #{index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeItem("team", index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div
                  onClick={() =>
                    uploadingTeamMember !== index &&
                    teamImageInputRefs.current[index]?.click()
                  }
                  className={`relative w-full aspect-3/4 bg-neutral-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 flex items-center justify-center border-2 border-dashed border-neutral-200 ${uploadingTeamMember === index ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {uploadingTeamMember === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                      <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                    </div>
                  )}

                  {member.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-neutral-400 flex flex-col items-center">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-xs">Photo</span>
                    </div>
                  )}
                </div>
                <input
                  ref={(el) => {
                    teamImageInputRefs.current[index] = el;
                  }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true, index)}
                  className="hidden"
                  disabled={uploadingTeamMember === index}
                />

                <input
                  type="text"
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) =>
                    updateItem("team", index, "name", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={member.role}
                  onChange={(e) =>
                    updateItem("team", index, "role", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || uploadingHero || uploadingTeamMember !== null}
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
