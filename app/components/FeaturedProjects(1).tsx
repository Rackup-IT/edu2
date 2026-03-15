import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import dbConnect from "../../lib/db";
import Portfolio from "../../models/Portfolio";

type FeaturedProject = {
  _id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  images?: string[];
};

async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    await dbConnect();
    // Ideally filter by isFeatured: true, but fallback to latest 3
    const projects = await Portfolio.find({}).sort({ createdAt: -1 }).limit(3);
    return JSON.parse(JSON.stringify(projects)) as FeaturedProject[];
  } catch (error) {
    return [];
  }
}

export default async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  if (projects.length === 0) return null;

  return (
    <section id="featured-projects" className="bg-neutral-50 py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-sm font-bold uppercase tracking-wider text-black/60 mb-2 block">
            Selected Work
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
            Featured Projects
          </h2>
        </div>

        {/* Projects List */}
        <div className="flex flex-col gap-20 md:gap-32">
          {projects.map((project, index: number) => (
            <div
              key={project._id}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-20`}
            >
              {/* Image Side */}
              <Link href={`/portfolio/${project._id}`} className="w-full lg:w-1/2 relative group block">
                 {/* Decorative background offset */}
                 <div className="absolute inset-0 bg-brand-yellow/20 rounded-2xl transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />

                 <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-neutral-200 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                  {project.images && project.images[0] ? (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                       fill
                       className="object-cover transition-transform duration-700 group-hover:scale-105"
                       unoptimized // Using external placeholder
                     />
                   ) : (
                     <div className="w-full h-full bg-neutral-200" />
                   )}

                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <ArrowUpRight className="w-6 h-6 text-black" />
                      </div>
                   </div>
                 </div>
              </Link>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 relative">
                {/* Large Background Number */}
                <span className="absolute -top-20 -left-10 text-[10rem] font-bold text-black/5 leading-none select-none -z-10 hidden md:block">
                  {(index + 1).toString().padStart(2, '0')}
                </span>

                <div className="relative z-10">
                  <span className="text-brand-yellow font-bold text-sm tracking-wide uppercase mb-3 block">
                    {project.category}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-black mb-6">
                    {project.title}
                  </h3>
                  <p className="text-lg text-black/70 leading-relaxed mb-8 max-w-xl">
                    {project.description}
                  </p>

                  {/* Tags - Portfolio schema doesn't have explicit tags array, but maybe category is enough? Or add it.
                      User request didn't specify Tags for Portfolio, but Products has it.
                      I'll skip tags here or mock them from category.
                  */}
                  <div className="flex flex-wrap gap-3 mb-8">
                      <span
                        className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm font-medium text-black/80"
                      >
                        {project.category}
                      </span>
                      <span
                        className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm font-medium text-black/80"
                      >
                        {project.year}
                      </span>
                  </div>

                  <Link href={`/portfolio/${project._id}`} className="inline-flex items-center gap-2 text-black font-semibold text-lg hover:text-brand-yellow transition-colors group">
                    View Case Study
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
