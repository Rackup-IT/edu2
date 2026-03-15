import Image from "next/image";
import dbConnect from "../../lib/db";
import Testimonial from "../../models/Testimonial";

type TestimonialItem = {
  _id: string;
  content: string;
  image: string;
  author: string;
  role: string;
};

async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(testimonials)) as TestimonialItem[];
  } catch (error) {
    return [];
  }
}

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="mb-16 md:mb-24 max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 mb-6">
            Trusted by innovative companies
          </h2>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl">
            Don&apos;t just take our word for it. Here&apos;s what our clients have to say about working with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col justify-between"
            >
              <div>
                <div className="mb-6">
                  {/* Star rating simulation */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-brand-yellow fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-lg text-neutral-800 leading-relaxed mb-8">
                  &quot;{testimonial.content}&quot;
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <div className="font-medium text-neutral-900">{testimonial.author}</div>
                  <div className="text-sm text-neutral-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
