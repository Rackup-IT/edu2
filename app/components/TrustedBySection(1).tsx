import React from "react";
import Image from "next/image";
import dbConnect from "../../lib/db";
import TrustedLogo from "../../models/TrustedLogo";

type TrustedLogoItem = {
  _id?: string;
  name: string;
  logo: string;
};

const isSvgUrl = (url: string) => {
  const value = url.trim().toLowerCase();
  return value.endsWith(".svg") || value.startsWith("data:image/svg+xml");
};

async function getTrustedLogos(): Promise<TrustedLogoItem[]> {
  try {
    await dbConnect();
    const logos = await TrustedLogo.find({ isActive: true }).sort({
      position: 1,
      createdAt: 1,
    });
    return JSON.parse(JSON.stringify(logos)) as TrustedLogoItem[];
  } catch {
    return [];
  }
}

export default async function TrustedBySection() {
  const logos = await getTrustedLogos();

  if (!logos || logos.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 border-b border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <p className="text-center text-[20px] font-semibold text-neutral-500 uppercase tracking-wider mb-8">
          Trusted by innovative companies worldwide
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
          {logos.map((client, index) => (
            <div
              key={client._id || index}
              className="relative w-32 h-18 transition-all duration-300 hover:opacity-100 cursor-pointer"
            >
              <Image
                src={client.logo}
                alt={`${client.name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                unoptimized={isSvgUrl(client.logo)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
