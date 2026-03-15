import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { getPortfolioById } from "@/lib/fetchers";

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
  size: "normal" | "large" | "tall";
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = (await getPortfolioById(id)) as IPortfolio | null;

  if (!project) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <Link
          href="/portfolio"
          className="text-brand-yellow mt-4 hover:underline"
        >
          Back to Portfolio
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <div className="relative z-50">
        <SiteHeader forceSticky={true} />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            <div className="flex-1">
              <span className="text-brand-yellow font-bold text-sm tracking-wide uppercase mb-4 block">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight mb-8">
                {project.title}
              </h1>
            </div>

            <div className="w-full lg:w-1/3 flex flex-col gap-8 pt-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Client
                  </h3>
                  <p className="text-lg font-medium text-neutral-900">
                    {project.client}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Year
                  </h3>
                  <p className="text-lg font-medium text-neutral-900">
                    {project.year}
                  </p>
                </div>
              </div>
              <p className="text-neutral-600 leading-relaxed text-lg">
                {project.description}
              </p>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-black font-semibold hover:text-brand-yellow transition-colors"
                >
                  Visit Live Site
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Visual */}
      <section className="px-6 md:px-12 lg:px-24 mb-24 md:mb-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-neutral-100">
            <Image
              src={project.images[0]}
              alt="Main project visual"
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        </div>
      </section>

      {/* Challenge & Solution Grid */}
      <section className="px-6 md:px-12 lg:px-24 mb-24 md:mb-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                The Challenge
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                {project.challenge}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                Our Solution
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results / Stats */}
      <section className="px-6 md:px-12 lg:px-24 mb-24 md:mb-32">
        <div className="max-w-[1400px] mx-auto bg-neutral-900 rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {project.results?.map((stat, i: number) => (
              <div key={i}>
                <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-400 font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Remaining Gallery */}
      <section className="px-6 md:px-12 lg:px-24 mb-24 md:mb-32">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-8 md:gap-12">
          {project.images?.slice(1).map((img: string, i: number) => (
            <div
              key={i}
              className="relative w-full aspect-16/10 md:aspect-21/9 rounded-2xl overflow-hidden bg-neutral-100"
            >
              <Image
                src={img}
                alt={`Project detail ${i + 2}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      </section>

      {/* Next Project Nav - Removed for dynamic content for simplicity or would need logic to find next ID */}
      <section className="bg-neutral-50 py-24 md:py-32 border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <Link
            href="/portfolio"
            className="group inline-flex flex-col items-center"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-4 group-hover:text-brand-yellow transition-colors duration-300">
              View All Projects
            </h2>
            <div className="w-16 h-16 rounded-full border border-neutral-300 flex items-center justify-center group-hover:bg-brand-yellow group-hover:border-brand-yellow transition-all duration-300">
              <ArrowRight className="w-6 h-6 text-neutral-900" />
            </div>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
