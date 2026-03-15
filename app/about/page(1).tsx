import { CheckCircle2 } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { getAboutData as fetchAboutData } from "@/lib/fetchers";

type AboutStat = { value: string; label: string };
type AboutValue = { title: string; description: string };
type AboutTeamMember = {
  name: string;
  role: string;
  image?: string;
  imageUrl?: string;
};

type AboutData = {
  title: string;
  titleHighlight: string;
  description: string;
  heroImageUrl: string;
  stats: AboutStat[];
  values: AboutValue[];
  team: AboutTeamMember[];
};

export default async function AboutPage() {
  const about = await fetchAboutData();

  const data: AboutData = about
    ? {
        title: about.title,
        titleHighlight: about.titleHighlight,
        description: about.description,
        heroImageUrl: about.heroImageUrl,
        stats: (about.stats ?? []) as AboutStat[],
        values: (about.values ?? []) as AboutValue[],
        team: (about.team ?? []) as AboutTeamMember[],
      }
    : {
        title: "We build software",
        titleHighlight: "that matters.",
        description:
          "Forte Harbor Solution is a global software agency dedicated to helping businesses transform their digital presence. Founded in 2020, we have delivered over 100+ successful projects for startups and enterprise clients alike.",
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
          {
            title: "Client-Centric",
            description:
              "Your success is our success. We build long-term partnerships based on trust.",
          },
          {
            title: "Transparency",
            description:
              "No hidden costs or surprises. We believe in open and honest communication.",
          },
          {
            title: "Quality Driven",
            description:
              "We never compromise on code quality, performance, or security.",
          },
        ],
        team: [
          {
            name: "Alex Morgan",
            role: "CEO & Founder",
            image: "https://placehold.co/400x500/f6d36b/ffffff?text=Alex",
          },
          {
            name: "Sarah Chen",
            role: "CTO",
            image: "https://placehold.co/400x500/262626/ffffff?text=Sarah",
          },
          {
            name: "David Kim",
            role: "Lead Designer",
            image: "https://placehold.co/400x500/e5e5e5/262626?text=David",
          },
          {
            name: "Emily Davis",
            role: "Product Manager",
            image: "https://placehold.co/400x500/333333/ffffff?text=Emily",
          },
        ],
      };

  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <div className="relative z-50">
        <SiteHeader />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span className="text-brand-yellow font-bold text-sm tracking-wide uppercase mb-4 block">
              About Us
            </span>
            <h1 className="text-[64px] font-bold text-neutral-900 leading-[0.9] tracking-tight mb-8">
              {data.title} <br />
              <span className="text-neutral-400">{data.titleHighlight}</span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed mb-12">
              {data.description}
            </p>
            <div className="grid grid-cols-2 gap-8">
              {data.stats.map((stat: AboutStat, index: number) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-neutral-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-neutral-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square w-full rounded-[3rem] overflow-hidden bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.heroImageUrl}
              alt="Our Office"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-neutral-50 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-neutral-600">
              The principles that guide our work and culture.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.values.map((value: AboutValue, index: number) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-neutral-100"
              >
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-full flex items-center justify-center text-brand-yellow mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Meet the Team
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              The creative minds and technical experts behind our success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.team.map((member: AboutTeamMember, index: number) => (
              <div key={index} className="group text-center">
                <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden mb-6 bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.imageUrl || member.image} // Handle potential schema key mismatch in default data fallback
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">
                  {member.name}
                </h3>
                <p className="text-brand-yellow font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
