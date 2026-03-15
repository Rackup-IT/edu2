import React from "react";
import Image from "next/image";
import dbConnect from "../../lib/db";
import Service from "../../models/Service";

type ServiceItem = {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
};

const isSvgUrl = (url: string) => {
  const value = url.trim().toLowerCase();
  return value.endsWith(".svg") || value.startsWith("data:image/svg+xml");
};

async function getServices(): Promise<ServiceItem[]> {
  try {
    await dbConnect();
    const services = await Service.find({}).sort({ createdAt: 1 });
    return JSON.parse(JSON.stringify(services)) as ServiceItem[];
  } catch {
    return [];
  }
}

export default async function ServicesSection() {
  const services = await getServices();

  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="bg-white py-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="mb-16 text-center md:text-left">
          <span className="text-sm font-bold uppercase tracking-wider text-black/60 mb-2 block">
            Our Expertise
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black max-w-2xl">
            Your Future Without Borders
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index: number) => (
            <div
              key={service._id || index}
              className="group p-5 border border-neutral-200 hover:border-black/20 transition-all duration-300 hover:shadow-lg bg-neutral-50/50 hover:bg-white"
            >
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-lg bg-brand-yellow/20 text-black group-hover:bg-brand-yellow group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                {service.icon ? (
                  <Image
                    src={service.icon}
                    alt={service.title}
                    fill
                    className="object-contain p-2"
                    unoptimized={isSvgUrl(service.icon)}
                  />
                ) : (
                  <div className="w-6 h-6 bg-neutral-300 rounded-full"></div>
                )}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                {service.title}
              </h3>
              <p className="text-black/70 leading-relaxed whitespace-pre-line wrap-break-words">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
