import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function PrivacyPage() {
  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <div className="relative z-50">
        <SiteHeader />
      </div>

      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-8">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 mb-12">
            Last updated: January 1, 2024
          </p>

          <div className="prose prose-lg prose-neutral max-w-none text-neutral-600 leading-relaxed">
            <p>
              At Forte Harbor Solution, we take your privacy seriously. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website.
            </p>

            <h3>Information We Collect</h3>
            <p>
              We may collect information about you in a variety of ways. The
              information we may collect on the Site includes:
            </p>
            <ul>
              <li>
                <strong>Personal Data:</strong> Personally identifiable
                information, such as your name, shipping address, email address,
                and telephone number.
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers
                automatically collect when you access the Site, such as your IP
                address, your browser type, your operating system, your access
                times, and the pages you have viewed directly before and after
                accessing the Site.
              </li>
            </ul>

            <h3>Use of Your Information</h3>
            <p>
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. Specifically,
              we may use information collected about you via the Site to:
            </p>
            <ul>
              <li>Create and manage your account.</li>
              <li>
                Compile anonymous statistical data and analysis for use
                internally or with third parties.
              </li>
              <li>Email you regarding your account or order.</li>
              <li>
                Fulfill and manage purchases, orders, payments, and other
                transactions related to the Site.
              </li>
            </ul>

            <h3>Contact Us</h3>
            <p>
              If you have questions or comments about this Privacy Policy,
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
