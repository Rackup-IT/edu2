import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { getPortfoliosData } from "@/lib/fetchers";

interface IPortfolio {
  _id: string;
  title: string;
  category: string;
  client: string;
  liveUrl?: string;
  year: string;
  description: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  images: string[];
  size: 'normal' | 'large' | 'tall';
}

export default async function PortfolioPage() {
  const projects = await getPortfoliosData() as IPortfolio[];

  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <div className="relative z-50">
         <SiteHeader />
      </div>

      {/* Header Section */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="max-w-3xl">
              <span className="text-brand-yellow font-bold text-sm tracking-wide uppercase mb-4 block">
                Selected Work
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 leading-[0.9] tracking-tight mb-8">
                Crafting digital <br/>
                <span className="text-neutral-400">masterpieces.</span>
              </h1>
              <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
                We partner with visionary brands to build transformative digital experiences.
                Here is a selection of our finest work.
              </p>
            </div>

            <div className="hidden md:block">
              <div className="w-32 h-32 rounded-full border border-neutral-200 flex items-center justify-center animate-spin-slow">
                 <svg viewBox="0 0 100 100" className="w-24 h-24 text-neutral-300 fill-current">
                    <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent"/>
                    <text>
                      <textPath href="#curve" className="text-[14px] uppercase tracking-widest font-medium">
                        • Scroll to explore • Portfolio
                      </textPath>
                    </text>
                 </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[400px]">
            {projects.map((project) => (
              <Link
                href={`/portfolio/${project._id}`}
                key={project._id}
                className={`group relative rounded-3xl overflow-hidden bg-neutral-100 block ${
                  project.size === 'large' ? 'md:col-span-2' :
                  project.size === 'tall' ? 'lg:row-span-2' : ''
                }`}
              >
                <Image
                  src={project.images?.[0] || 'https://placehold.co/800x600?text=No+Image'}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
                  <div className="flex justify-between items-start translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium text-neutral-900">
                      {project.category}
                    </span>
                    <div className="bg-brand-yellow rounded-full p-3 text-neutral-900 transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                    <h3 className="text-3xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-white/80 leading-relaxed max-w-lg">
                      {project.description}
                    </p>
                  </div>
                </div>

              </Link>
            ))}
          </div>

          <div className="mt-20 text-center">
             <Link
               href="/contact"
               className="inline-flex items-center gap-3 text-lg font-medium border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-colors"
             >
               Start a project with us
               <ArrowUpRight className="w-5 h-5" />
             </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
