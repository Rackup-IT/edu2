import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function TermsPage() {
  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <div className="relative z-50">
        <SiteHeader />
      </div>

      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-8">
            Terms of Service
          </h1>
          <p className="text-neutral-500 mb-12">
            Last updated: January 1, 2024
          </p>

          <div className="prose prose-lg prose-neutral max-w-none text-neutral-600 leading-relaxed">
            <p>
              These Terms of Service constitute a legally binding agreement made
              between you, whether personally or on behalf of an entity (“you”)
              and Forte Harbor Solution (“we,” “us” or “our”), concerning your
              access to and use of the website.
            </p>

            <h3>1. Agreement to Terms</h3>
            <p>
              By accessing the Site, you agree that you have read, understood,
              and agreed to be bound by all of these Terms of Service. If you do
              not agree with all of these Terms of Service, then you are
              expressly prohibited from using the Site and you must discontinue
              use immediately.
            </p>

            <h3>2. Intellectual Property Rights</h3>
            <p>
              Unless otherwise indicated, the Site is our proprietary property
              and all source code, databases, functionality, software, website
              designs, audio, video, text, photographs, and graphics on the Site
              (collectively, the “Content”) and the trademarks, service marks,
              and logos contained therein (the “Marks”) are owned or controlled
              by us or licensed to us.
            </p>

            <h3>3. User Representations</h3>
            <p>By using the Site, you represent and warrant that:</p>
            <ul>
              <li>
                All registration information you submit will be true, accurate,
                current, and complete.
              </li>
              <li>
                You have the legal capacity and you agree to comply with these
                Terms of Service.
              </li>
              <li>
                You will not access the Site through automated or non-human
                means, whether through a bot, script or otherwise.
              </li>
            </ul>

            <h3>Contact Us</h3>
            <p>
              If you have questions or comments about this Terms of Service,
              please contact us at:
              <br />
              <strong>education@forteharbor.com</strong>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
