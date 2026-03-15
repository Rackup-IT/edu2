import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/fetchers";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <div className="relative z-50">
        <SiteHeader forceSticky={true} />
      </div>

      <article className="pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-yellow mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6 flex-wrap">
            <span className="flex items-center gap-1 bg-neutral-100 px-3 py-1 rounded-full text-neutral-700 font-medium">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {post.author}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-8">
            {post.title}
          </h1>
        </div>

        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 mb-16">
          <div className="relative aspect-2/1 w-full rounded-3xl overflow-hidden bg-neutral-100">
            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            )}
          </div>
        </div>

        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <div
            className="prose prose-lg prose-neutral max-w-none text-neutral-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
