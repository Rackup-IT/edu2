import Image from "next/image";
import Link from "next/link";
import dbConnect from "../../lib/db";
import Post from "../../models/Post";

type BlogPostCard = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  coverImage?: string;
};

async function getLatestPosts(): Promise<BlogPostCard[]> {
  await dbConnect();
  try {
    const posts = await Post.find({}).sort({ date: -1 }).limit(3);
    return JSON.parse(JSON.stringify(posts)) as BlogPostCard[];
  } catch (error) {
    return [];
  }
}

export default async function BlogSection() {
  const posts = await getLatestPosts();

  if (posts.length === 0) return null;
  return (
    <section id="blog" className="py-20 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 mb-6">
              Latest insights & news
            </h2>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Stay updated with the latest trends in technology, design, and business growth.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-lg font-medium border-b border-black pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-colors"
          >
            View all articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts.map((post) => (
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

              <h3 className="text-2xl font-semibold text-neutral-900 mb-3 leading-tight group-hover:text-[--brand-yellow] transition-colors">
                {post.title}
              </h3>

              <p className="text-neutral-600 leading-relaxed mb-6 line-clamp-3 flex-grow">
                {post.excerpt}
              </p>

              <div className="inline-flex items-center gap-2 font-medium text-neutral-900 group-hover:text-[--brand-yellow] transition-colors mt-auto">
                Read Article
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-lg font-medium border-b border-black pb-1 hover:text-neutral-600 transition-colors"
          >
            View all articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
