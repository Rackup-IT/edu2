import Link from "next/link";
import TrustedBySection from "./components/TrustedBySection";
import ServicesSection from "./components/ServicesSection";
import FeaturedProjects from "./components/FeaturedProjects";
import TestimonialsSection from "./components/TestimonialsSection";
import ProcessSection from "./components/ProcessSection";
import BlogSection from "./components/BlogSection";
import CTASection from "./components/CTASection";
import Navbar from "./components/Navbar";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { getHeroData, getSettingsData } from "@/lib/fetchers";

export default async function Home() {
  const hero = await getHeroData();
  const settings = await getSettingsData();

  // Normalize data to match expected structure or use defaults
  const heroData = hero
    ? {
        title: hero.title,
        subtitle: hero.subtitle,
        buttonText: hero.buttonText,
        buttonLink: hero.buttonLink,
        secondaryButtonText: hero.secondaryButtonText,
        secondaryButtonLink: hero.secondaryButtonLink,
        imageUrl: hero.imageUrl,
        backgroundColor: hero.backgroundColor,
      }
    : {
        title: "Empowering Your \n Digital Vision",
        subtitle: "Leading Education Consultancy Service",
        buttonText: "Book a Quote",
        buttonLink: "/consultation",
        secondaryButtonText: "Portfolio",
        secondaryButtonLink: "/portfolio",
        imageUrl: "/hero-illustration-v2.png",
        backgroundColor: "#f6d36b",
      };

  const settingsData = {
    logoUrl: settings?.logoUrl || "",
    companyName: settings?.companyName || "Forte Harbor Solution",
  };

  return (
    <main className="w-full">
      <SiteHeader />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen w-full flex items-center justify-center py-6 md:py-12 lg:py-24 overflow-hidden"
        style={{ backgroundColor: heroData.backgroundColor }}
      >
        <div className="absolute top-0 left-0 right-0 z-10">
          <Navbar
            transparent
            logoUrl={settingsData.logoUrl}
            companyName={settingsData.companyName}
          />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 w-full grid grid-cols-1 min-[1200px]:grid-cols-2 gap-12 min-[1200px]:gap-20 items-center">
          {/* Left: Illustration */}
          <div className="hidden min-[1200px]:flex relative w-full aspect-4/3 min-[1200px]:aspect-square items-center justify-center min-[1200px]:justify-start">
            <div className="relative w-full h-full max-w-[600px] flex items-center justify-center min-[1200px]:justify-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroData.imageUrl}
                alt="Hero Illustration"
                className="w-full h-full object-contain object-center min-[1200px]:object-left"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col gap-8 min-[1200px]:gap-10 items-start min-[1200px]:pl-10">
            {/* Headings */}
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl md:text-6xl lg:text-[4rem] font-bold leading-[1.1] tracking-tight text-black whitespace-pre-line">
                {heroData.title.replace(/\\n/g, "\n")}
              </h1>
              <p className="text-xl md:text-2xl lg:text-[1.75rem] font-normal leading-snug text-black/90 max-w-xl">
                {heroData.subtitle}
              </p>
            </div>

            {/* Buttons & CTA */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href={heroData.buttonLink}
                  className="bg-black text-white px-10 py-4 text-lg font-medium hover:bg-neutral-800 transition-colors cursor-pointer inline-flex items-center justify-center rounded-[20px]"
                >
                  {heroData.buttonText}
                </Link>
                <Link
                  href={heroData.secondaryButtonLink}
                  className="bg-transparent border border-black px-10 py-4 text-lg font-medium hover:bg-black/5 transition-colors cursor-pointer inline-flex items-center justify-center rounded-[20px]"
                >
                  {heroData.secondaryButtonText}
                </Link>
              </div>
              <span className="text-sm font-medium ml-1 mt-2 text-black">
                its free!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <TrustedBySection />

      {/* Services Section */}
      <ServicesSection />

      {/* Featured Projects Section */}
      <FeaturedProjects />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Process Section */}
      <ProcessSection />

      {/* Blog Section */}
      <BlogSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}
