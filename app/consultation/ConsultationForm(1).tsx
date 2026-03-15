"use client";

import { useState } from "react";
import { ArrowRight, Mail, MapPin, Phone, Loader2 } from "lucide-react";

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    requirements: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(
          "Your message has been sent successfully. We'll be in touch shortly!",
        );
        setFormData({ name: "", email: "", subject: "", requirements: "" });
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        "Failed to send message. Please check your connection and try again.",
      );
    }
  };

  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Area */}
        <div className="mb-20 md:mb-32">
          <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-bold text-neutral-900 leading-[0.9] tracking-tight mb-8">
            Let&apos;s build <br />
            <span className="text-neutral-300">the future.</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl leading-relaxed">
            Have a project in mind? We&apos;d love to hear about it. Fill out
            the form and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Contact Info (Left Side) */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-6 border-b border-neutral-200 pb-4">
                Contact Details
              </h3>
              <div className="flex flex-col gap-6">
                <a
                  href="mailto:education@forteharbor.com"
                  className="group flex items-center gap-4 text-lg text-neutral-600 hover:text-black transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-brand-yellow transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  education@forteharbor.com
                </a>
                <div className="flex items-center gap-4 text-lg text-neutral-600">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  +1 (470) 338-5022
                </div>
                <div className="flex items-start gap-4 text-lg text-neutral-600">
                  <div className="min-w-10 min-h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  KIZILIRMAK NEIGHBORHOOD . DUMLUPINAR STREET NEXTLEVEL NO: 3
                  DOOR 11 ÇANKAYA/ ANKARA
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-6 border-b border-neutral-200 pb-4">
                Socials
              </h3>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Instagram", "Dribbble"].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-neutral-500 hover:text-brand-yellow transition-colors text-lg font-medium"
                    >
                      {social}
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Form (Right Side) */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-neutral-200 py-4 text-xl text-neutral-900 focus:outline-none focus:border-brand-yellow transition-colors placeholder-transparent"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 top-4 text-neutral-400 text-xl transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-neutral-500 peer-not-placeholder-shown:-top-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-neutral-500 cursor-text"
                  >
                    Your Name
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-neutral-200 py-4 text-xl text-neutral-900 focus:outline-none focus:border-brand-yellow transition-colors placeholder-transparent"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 top-4 text-neutral-400 text-xl transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-neutral-500 peer-not-placeholder-shown:-top-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-neutral-500 cursor-text"
                  >
                    Email Address
                  </label>
                </div>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-neutral-200 py-4 text-xl text-neutral-900 focus:outline-none focus:border-brand-yellow transition-colors placeholder-transparent"
                />
                <label
                  htmlFor="subject"
                  className="absolute left-0 top-4 text-neutral-400 text-xl transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-neutral-500 peer-not-placeholder-shown:-top-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-neutral-500 cursor-text"
                >
                  Subject
                </label>
              </div>

              <div className="relative group">
                <textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-neutral-200 py-4 text-xl text-neutral-900 focus:outline-none focus:border-brand-yellow transition-colors placeholder-transparent resize-none"
                ></textarea>
                <label
                  htmlFor="requirements"
                  className="absolute left-0 top-4 text-neutral-400 text-xl transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-neutral-500 peer-not-placeholder-shown:-top-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-neutral-500 cursor-text"
                >
                  Project Requirements
                </label>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group bg-neutral-900 text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-brand-yellow hover:text-neutral-900 transition-all duration-300 inline-flex items-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      Sending...
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {message && (
                  <p
                    className={`mt-4 text-lg ${status === "error" ? "text-red-600" : "text-green-600"}`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
