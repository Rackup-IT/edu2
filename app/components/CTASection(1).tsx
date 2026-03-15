import Link from "next/link";

export default function CTASection() {
  return (
    <section
      id="contact"
      className="py-20 md:py-32 bg-white border-t border-neutral-100"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="bg-neutral-900 rounded-4xl p-10 md:p-20 text-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow opacity-10 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow opacity-10 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-8">
              Ready to scale your career with the right strategy?
            </h2>
            <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
              Let&apos;s discuss and see how we can help you achieve your goals.
            </p>
            <Link
              href="/consultation"
              className="bg-brand-yellow text-neutral-900 px-10 py-5 text-lg font-medium hover:bg-(--brand-yellow-hover) transition-colors rounded-full cursor-pointer inline-block"
            >
              Book a Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
