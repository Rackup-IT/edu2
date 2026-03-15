import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import EmptyState from "../components/EmptyState";
import { getPostsData } from "@/lib/fetchers";

type BlogPostListItem = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  coverImage?: string;
};

export default async function BlogPage() {
  const allPosts = await getPostsData() as BlogPostListItem[];
  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <div className="relative z-50">
         <SiteHeader />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-12 lg:px-24 bg-neutral-50">
        <div className="max-w-[1400px] mx-auto text-center">
          <span className="text-brand-yellow font-bold text-sm tracking-wide uppercase mb-4 block">
            Our Blog
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight mb-6">
            Insights & <br />
            <span className="text-neutral-400">Perspectives.</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Thoughts on technology, design, and business from our team of experts.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          {allPosts.length === 0 ? (
            <EmptyState message="No blog posts available at the moment." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {allPosts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="group flex flex-col h-full">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 bg-neutral-100">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200"></div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-neutral-900">
                      {post.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-neutral-500 mb-3">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                    <span>5 min read</span>
                  </div>

                  <h3 className="text-2xl font-bold text-neutral-900 mb-3 leading-tight group-hover:text-brand-yellow transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-neutral-600 leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="inline-flex items-center gap-2 font-medium text-neutral-900 group-hover:text-brand-yellow transition-colors mt-auto">
                    Read Article
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
