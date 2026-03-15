import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Download } from "lucide-react";
import EmptyState from "../components/EmptyState";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { getProductsData } from "@/lib/fetchers";

type ProductItem = {
  _id: string;
  name: string;
  icon: string;
  type: string;
  description: string;
  tags?: string[];
  link: string;
  actionType?: 'download' | 'link';
};

export default async function ProductsPage() {
  const products = await getProductsData() as ProductItem[];
  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      {/* Reusing the sticky header logic by importing it - usually Header needs to be in layout, but following existing pattern */}
      <div className="relative z-50">
         <SiteHeader />
      </div>

      {/* Page Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-neutral-50 px-6 md:px-12 lg:px-24 border-b border-neutral-100">
        <div className="max-w-[1400px] mx-auto text-center md:text-left">
          <span className="text-brand-yellow font-bold text-sm tracking-wide uppercase mb-3 block">
            Our Products
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Tools tailored for your success
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
            Explore our suite of powerful SaaS tools and applications designed to streamline your workflow and boost productivity.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-24 flex-grow">
        <div className="max-w-[1400px] mx-auto">
          {products.length === 0 ? (
            <EmptyState message="No products have been added yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-white rounded-2xl border border-neutral-100 p-8 hover:border-brand-yellow/50 transition-colors duration-300 shadow-sm hover:shadow-lg flex flex-col"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100">
                      <Image
                        src={product.icon}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="bg-neutral-100 text-neutral-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {product.type}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-brand-yellow transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-neutral-600 leading-relaxed mb-6 flex-grow">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {product.tags && product.tags.map((tag: string) => (
                      <span key={tag} className="text-xs text-neutral-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={product.link}
                    className="w-full bg-neutral-900 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-brand-yellow hover:text-neutral-900 transition-colors duration-300 group-hover:shadow-md"
                  >
                    {product.actionType === 'download' ? (
                      <>
                        Download
                        <Download className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Visit Website
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
