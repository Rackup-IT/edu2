import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EmptyState from "../components/EmptyState";
import { getServicesData } from "@/lib/fetchers";

const isSvgUrl = (url: string) => {
  const value = url.trim().toLowerCase();
  return value.endsWith('.svg') || value.startsWith('data:image/svg+xml');
};

type ServiceItem = {
  _id: string;
  title: string;
  description: string;
  icon?: string;
};

export default async function ServicesPage() {
  const services = await getServicesData() as ServiceItem[];

  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <div className="relative z-50">
         <SiteHeader />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-brand-yellow font-bold text-sm tracking-wide uppercase mb-4 block">
            Our Expertise
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 leading-[0.9] tracking-tight mb-8">
            Comprehensive <br />
            <span className="text-neutral-400">digital solutions.</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
            From concept to code, we provide end-to-end software development and design services to help your business grow.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-32">
        <div className="max-w-[1400px] mx-auto">
          {services.length === 0 ? (
            <EmptyState message="No services listed yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service._id} className="group p-8 md:p-10 border border-neutral-100 rounded-3xl bg-neutral-50 hover:bg-neutral-900 hover:text-white transition-all duration-300">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 text-neutral-900 group-hover:bg-brand-yellow transition-colors relative overflow-hidden">
                    {service.icon ? (
                      <Image src={service.icon} alt={service.title} fill className="object-contain p-2" unoptimized={isSvgUrl(service.icon)} />
                    ) : (
                      <div className="w-7 h-7 bg-neutral-300 rounded-full" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-neutral-600 group-hover:text-neutral-400 leading-relaxed mb-8 whitespace-pre-line break-words">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 lg:px-24 pb-32">
        <div className="max-w-[1400px] mx-auto bg-brand-yellow rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-8 tracking-tight">
              Ready to scale your business?
            </h2>
            <p className="text-xl text-neutral-800 mb-12 max-w-2xl mx-auto leading-relaxed">
              Let&apos;s collaborate to build software that drives real results. Schedule a free consultation today.
            </p>
            <Link href="/consultation" className="bg-neutral-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-neutral-900 transition-colors inline-flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
