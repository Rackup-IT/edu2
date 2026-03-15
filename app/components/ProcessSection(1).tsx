const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We start by understanding your goals, expertise and specific requirements to create a solid roadmap.",
  },
  {
    number: "02",
    title: "Roadmap",
    description:
      "Our experts craft realistic and achievable pathway that align with your goals and targeted destination.",
  },
  {
    number: "03",
    title: "Launchpad",
    description:
      "We provide tailored, strategic guidance using proven methods, ensuring clear direction and lasting academic success.",
  },
  {
    number: "04",
    title: "Support",
    description:
      "After securing your destination, we help you to grow. We continue to support and iterate to ensure long-term success.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-20 md:py-32 bg-neutral-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="mb-16 md:mb-24 max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 mb-6">
            Guiding You to Global Success
          </h2>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl">
            Our proven process ensures transparency, efficiency, and exceptional
            results for everyone we undertake.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative group">
              <div className="text-[5rem] md:text-[6rem] lg:text-[7rem] font-bold text-neutral-200 leading-none mb-4 group-hover:text-brand-yellow transition-colors duration-300">
                {step.number}
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
